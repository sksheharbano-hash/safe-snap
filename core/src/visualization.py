"""
src/visualization.py
--------------------
Draw bounding boxes and labels on the image for display purposes.

Owner   → green box
Non-owner → red box
"""
from __future__ import annotations

import numpy as np
import cv2


# Colours (BGR)
OWNER_COLOR = (0, 220, 80)       # Vivid green
NON_OWNER_COLOR = (0, 60, 220)   # Red-ish blue → appears red in BGR display
LABEL_BG_ALPHA = 0.65
FONT = cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE = 0.55
FONT_THICKNESS = 1
BOX_THICKNESS = 2


def draw_face_results(
    image: np.ndarray,
    face_results: list[dict],
) -> np.ndarray:
    """
    Draw bounding boxes and OWNER / NON-OWNER labels on a copy of the image.

    Parameters
    ----------
    image        : BGR image (original or processed)
    face_results : list of face dicts from pipeline.process_image

    Returns
    -------
    Annotated BGR image.
    """
    annotated = image.copy()

    for face in face_results:
        box = face["box"]
        is_owner = face.get("is_owner", False)
        label_text = face.get("label", "NON-OWNER")
        similarity = face.get("similarity", 0.0)

        x1, y1, x2, y2 = box
        color = OWNER_COLOR if is_owner else NON_OWNER_COLOR

        # Draw bounding box
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, BOX_THICKNESS)

        # Build label string
        display_label = f"{label_text}  {similarity:.2f}"

        # Calculate label background
        (tw, th), baseline = cv2.getTextSize(
            display_label, FONT, FONT_SCALE, FONT_THICKNESS
        )
        label_y = max(y1 - 6, th + 4)
        bg_x1 = x1
        bg_y1 = label_y - th - 4
        bg_x2 = x1 + tw + 6
        bg_y2 = label_y + baseline

        # Filled background rectangle (semi-transparent look via overlay)
        overlay = annotated.copy()
        cv2.rectangle(overlay, (bg_x1, bg_y1), (bg_x2, bg_y2), color, -1)
        cv2.addWeighted(overlay, LABEL_BG_ALPHA, annotated, 1 - LABEL_BG_ALPHA, 0, annotated)

        # Text
        cv2.putText(
            annotated,
            display_label,
            (x1 + 3, label_y),
            FONT,
            FONT_SCALE,
            (255, 255, 255),
            FONT_THICKNESS,
            cv2.LINE_AA,
        )

    return annotated
