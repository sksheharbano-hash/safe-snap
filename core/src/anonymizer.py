"""
src/anonymizer.py
-----------------
MODULE 4: Face Anonymization

Implements three anonymization methods:
    1. Blur      – Gaussian blur over the face region
    2. Pixelate  – Down-scale then up-scale with nearest-neighbour
    3. Mask      – Solid filled rectangle

Only NON-OWNER faces are anonymized.
OWNER faces are left completely unchanged.
"""
from __future__ import annotations

import cv2
import numpy as np

from src.config import DEFAULT_BLUR_STRENGTH, DEFAULT_PIXEL_SIZE, DEFAULT_MASK_COLOR
from src.utils import clamp_box, ensure_odd
from src.logger import get_logger

logger = get_logger("anonymizer")


# ---------------------------------------------------------------------------
# Individual anonymization functions
# ---------------------------------------------------------------------------

def blur_face(
    image: np.ndarray,
    box: list[int],
    strength: int = DEFAULT_BLUR_STRENGTH,
) -> np.ndarray:
    """
    Apply Gaussian blur to the face region defined by *box*.

    Parameters
    ----------
    image    : BGR image (modified in-place and returned)
    box      : [x1, y1, x2, y2]
    strength : Gaussian kernel size (will be forced odd and >= 3)

    Returns
    -------
    The image with the face region blurred.
    """
    h, w = image.shape[:2]
    clamped = clamp_box(box, h, w)
    if clamped is None:
        logger.warning("blur_face: box %s is invalid or degenerate within image (%dx%d px). Skipping.", box, w, h)
        return image

    x1, y1, x2, y2 = clamped
    face_region = image[y1:y2, x1:x2]

    if face_region.size == 0:
        logger.warning("blur_face: face region is empty at [%d, %d, %d, %d]. Skipping.", x1, y1, x2, y2)
        return image

    # Kernel size must be odd and at least 3
    k = max(3, ensure_odd(strength))
    logger.debug("Applying Gaussian blur to region [%d, %d, %d, %d] with kernel size (%d, %d)", x1, y1, x2, y2, k, k)

    blurred = cv2.GaussianBlur(face_region, (k, k), 0)
    image[y1:y2, x1:x2] = blurred
    return image


def pixelate_face(
    image: np.ndarray,
    box: list[int],
    pixel_size: int = DEFAULT_PIXEL_SIZE,
) -> np.ndarray:
    """
    Pixelate the face region by down-scaling then up-scaling.

    Parameters
    ----------
    image      : BGR image
    box        : [x1, y1, x2, y2]
    pixel_size : Size of each pixel block (larger = coarser)

    Returns
    -------
    The image with the face region pixelated.
    """
    h, w = image.shape[:2]
    clamped = clamp_box(box, h, w)
    if clamped is None:
        logger.warning("pixelate_face: box %s is invalid or degenerate within image (%dx%d px). Skipping.", box, w, h)
        return image

    x1, y1, x2, y2 = clamped
    face_region = image[y1:y2, x1:x2].copy()

    fh, fw = face_region.shape[:2]
    if fh == 0 or fw == 0:
        logger.warning("pixelate_face: face region is empty at [%d, %d, %d, %d]. Skipping.", x1, y1, x2, y2)
        return image

    # Clamp pixel_size so we always have at least 1×1 tiny image
    ps = max(1, pixel_size)
    small_w = max(1, fw // ps)
    small_h = max(1, fh // ps)
    logger.debug(
        "Pixelating region [%d, %d, %d, %d] (%dx%d px) with block size %d (downsampled to %dx%d px)",
        x1,
        y1,
        x2,
        y2,
        fw,
        fh,
        ps,
        small_w,
        small_h,
    )

    # Shrink
    small = cv2.resize(face_region, (small_w, small_h), interpolation=cv2.INTER_LINEAR)
    # Blow back up – nearest neighbour gives the blocky pixel look
    pixelated = cv2.resize(small, (fw, fh), interpolation=cv2.INTER_NEAREST)

    image[y1:y2, x1:x2] = pixelated
    return image


def mask_face(
    image: np.ndarray,
    box: list[int],
    color: tuple = DEFAULT_MASK_COLOR,
) -> np.ndarray:
    """
    Cover the face region with a solid-colour rectangle.

    Parameters
    ----------
    image : BGR image
    box   : [x1, y1, x2, y2]
    color : BGR fill colour (default near-black)

    Returns
    -------
    The image with the face region masked.
    """
    h, w = image.shape[:2]
    clamped = clamp_box(box, h, w)
    if clamped is None:
        logger.warning("mask_face: box %s is invalid or degenerate within image (%dx%d px). Skipping.", box, w, h)
        return image

    x1, y1, x2, y2 = clamped
    logger.debug("Masking region [%d, %d, %d, %d] with solid BGR color %s", x1, y1, x2, y2, color)
    cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness=-1)
    return image


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

def anonymize_faces(
    image: np.ndarray,
    faces: list[dict],
    method: str = "blur",
    settings: dict | None = None,
) -> np.ndarray:
    """
    Anonymize all NON-OWNER faces in the image.

    Parameters
    ----------
    image   : BGR image (will be modified)
    faces   : list of face result dicts from pipeline.process_image
              Each dict must have:
                  "box"      : [x1,y1,x2,y2]
                  "is_owner" : bool
    method  : "blur" | "pixelate" | "mask"
    settings: optional dict with keys
                  "blur_strength" (int)
                  "pixel_size"    (int)
                  "mask_color"    (tuple BGR)

    Returns
    -------
    The processed image.
    """
    if settings is None:
        settings = {}

    result = image.copy()
    non_owner_count = sum(1 for f in faces if not f.get("is_owner", False))
    logger.debug(
        "anonymize_faces called: method='%s', total_faces=%d, non_owners_to_anonymize=%d, settings=%s",
        method,
        len(faces),
        non_owner_count,
        settings,
    )

    for face in faces:
        if face.get("is_owner", False):
            continue  # ← OWNER: leave completely untouched

        box = face["box"]

        if method == "blur":
            strength = settings.get("blur_strength", DEFAULT_BLUR_STRENGTH)
            result = blur_face(result, box, strength=strength)

        elif method == "pixelate":
            ps = settings.get("pixel_size", DEFAULT_PIXEL_SIZE)
            result = pixelate_face(result, box, pixel_size=ps)

        elif method == "mask":
            color = settings.get("mask_color", DEFAULT_MASK_COLOR)
            result = mask_face(result, box, color=color)

        else:
            logger.warning("Unrecognized anonymization method '%s'. Falling back to 'blur'.", method)
            result = blur_face(result, box)

    return result
