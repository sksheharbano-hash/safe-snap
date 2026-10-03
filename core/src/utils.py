"""
src/utils.py
------------
Shared utility helpers used across multiple modules.
"""
from __future__ import annotations

import io
import numpy as np
import cv2
from PIL import Image


# ---------------------------------------------------------------------------
# Image conversion helpers
# ---------------------------------------------------------------------------

def pil_to_bgr(pil_image: Image.Image) -> np.ndarray:
    """Convert a PIL/Pillow Image (RGB) to an OpenCV BGR ndarray."""
    rgb = np.array(pil_image.convert("RGB"))
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)


def bgr_to_pil(bgr_image: np.ndarray) -> Image.Image:
    """Convert an OpenCV BGR ndarray to a PIL Image (RGB)."""
    rgb = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)


def bgr_to_rgb(bgr_image: np.ndarray) -> np.ndarray:
    """Flip channels: BGR → RGB (for Streamlit display)."""
    return cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)


def image_to_bytes(image: np.ndarray, fmt: str = "PNG") -> bytes:
    """
    Encode an OpenCV BGR image to in-memory bytes (PNG by default).
    Returns raw bytes suitable for st.download_button.
    """
    pil_img = bgr_to_pil(image)
    buf = io.BytesIO()
    pil_img.save(buf, format=fmt)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Bounding-box helpers
# ---------------------------------------------------------------------------

def clamp_box(box: list[int], img_h: int, img_w: int) -> list[int]:
    """
    Clamp a bounding box [x1, y1, x2, y2] so it stays inside the image.
    Returns the clamped box, or None if the box is degenerate after clamping.
    """
    x1, y1, x2, y2 = box
    x1 = max(0, min(x1, img_w - 1))
    y1 = max(0, min(y1, img_h - 1))
    x2 = max(0, min(x2, img_w - 1))
    y2 = max(0, min(y2, img_h - 1))
    if x2 <= x1 or y2 <= y1:
        return None
    return [x1, y1, x2, y2]


def box_area(box: list[int]) -> int:
    """Return the pixel area of a bounding box [x1,y1,x2,y2]."""
    x1, y1, x2, y2 = box
    return max(0, x2 - x1) * max(0, y2 - y1)


def crop_face(image: np.ndarray, box: list[int], pad_ratio: float = 0.20) -> np.ndarray | None:
    """
    Crop the face region from image using the bounding box.
    Supports optional pad_ratio (default 20%) to provide context for landmark
    localization and ArcFace embedding extraction without clipping the face.
    Returns None if the crop would be empty.
    """
    h, w = image.shape[:2]
    x1, y1, x2, y2 = box
    if pad_ratio > 0.0:
        bw = x2 - x1
        bh = y2 - y1
        pad_x = int(bw * pad_ratio)
        pad_y = int(bh * pad_ratio)
        box = [x1 - pad_x, y1 - pad_y, x2 + pad_x, y2 + pad_y]

    clamped = clamp_box(box, h, w)
    if clamped is None:
        return None
    cx1, cy1, cx2, cy2 = clamped
    crop = image[cy1:cy2, cx1:cx2]
    if crop.size == 0:
        return None
    return crop


# ---------------------------------------------------------------------------
# Misc
# ---------------------------------------------------------------------------

def ensure_odd(value: int) -> int:
    """Make sure an integer is odd (required for Gaussian kernel sizes)."""
    return value if value % 2 == 1 else value + 1
