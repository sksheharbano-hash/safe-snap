"""
src/detector.py
---------------
MODULE 1: Face Detection

Uses YOLOv8-face (model.pt in project root) to detect faces in an image.
InsightFace is NOT used for detection – it is used only for embeddings in
recognition.py. This keeps the two responsibilities cleanly separated.

Architecture decision:
    Option B from the spec – dedicated face detector (YOLO) for bounding boxes,
    InsightFace only for embeddings. This gives the clearest module separation
    and is easier to explain during a viva.
"""
from __future__ import annotations

import os
import numpy as np
from ultralytics import YOLO

from src.config import (
    DEFAULT_DETECTION_CONFIDENCE,
    MIN_FACE_SIZE,
    YOLO_MODEL_PATH,
)
from src.utils import clamp_box
from src.logger import get_logger

logger = get_logger("detector")


class FaceDetector:
    """
    Wraps a YOLO face model for face detection.

    Parameters
    ----------
    model_path : str
        Path to the YOLO face weights file (e.g., "model.pt").
    """

    def __init__(self, model_path: str = YOLO_MODEL_PATH) -> None:
        self.model_path = model_path
        self._model: YOLO | None = None
        self._load_model()

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _load_model(self) -> None:
        """Load the YOLO model from disk. Raises FileNotFoundError if missing."""
        logger.info("Loading YOLO face detection model from '%s'...", self.model_path)
        if not os.path.exists(self.model_path):
            logger.error("Face detection model not found at '%s'", self.model_path)
            raise FileNotFoundError(
                f"Face detection model not found at '{self.model_path}'.\n"
                "Please place the YOLO face weights file (e.g., model.pt) in "
                "the project root.\n"
                "See models/README.md for download instructions."
            )
        try:
            self._model = YOLO(self.model_path)
            logger.info("YOLO face detection model loaded successfully.")
        except Exception as exc:
            logger.exception("Failed to load YOLO model from '%s': %s", self.model_path, exc)
            raise

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect_faces(
        self,
        image: np.ndarray,
        confidence_threshold: float = DEFAULT_DETECTION_CONFIDENCE,
    ) -> list[dict]:
        """
        Detect all faces in an image.

        Parameters
        ----------
        image : np.ndarray
            BGR image (as returned by cv2.imread or converted from PIL).
        confidence_threshold : float
            Minimum detection confidence to keep a face.

        Returns
        -------
        list of dict, each containing:
            {
                "box":        [x1, y1, x2, y2],   # clamped integer coords
                "confidence": float               # detection confidence
            }
        """
        if self._model is None:
            logger.error("detect_faces called but model is not loaded.")
            raise RuntimeError("Detection model is not loaded.")

        if image is None or not isinstance(image, np.ndarray) or image.size == 0:
            logger.warning("detect_faces called with empty or invalid image.")
            return []

        h, w = image.shape[:2]
        logger.debug(
            "Running YOLO detection on image (%dx%d px), conf_threshold=%.2f",
            w,
            h,
            confidence_threshold,
        )

        try:
            results = self._model.predict(
                source=image,
                conf=confidence_threshold,
                save=False,
                verbose=False,
            )
        except Exception as exc:
            logger.exception("YOLO predict failed with exception: %s", exc)
            raise

        detections: list[dict] = []
        if not results or len(results) == 0 or results[0].boxes is None:
            logger.debug("YOLO returned no bounding boxes.")
            return detections

        boxes = results[0].boxes
        logger.debug("YOLO returned %d candidate box(es) before size filtering", len(boxes))

        for box in boxes:
            conf = float(box.conf[0])
            coords = box.xyxy[0].tolist()
            x1, y1, x2, y2 = [int(v) for v in coords]

            # Clamp to image boundaries
            clamped = clamp_box([x1, y1, x2, y2], h, w)
            if clamped is None:
                logger.debug("Box [%d, %d, %d, %d] became degenerate after clamping, skipped.", x1, y1, x2, y2)
                continue

            cx1, cy1, cx2, cy2 = clamped
            face_w = cx2 - cx1
            face_h = cy2 - cy1

            # Skip faces that are too small to be meaningful
            if face_w < MIN_FACE_SIZE or face_h < MIN_FACE_SIZE:
                logger.debug(
                    "Box [%d, %d, %d, %d] (size %dx%d) smaller than MIN_FACE_SIZE=%d, skipped.",
                    cx1,
                    cy1,
                    cx2,
                    cy2,
                    face_w,
                    face_h,
                    MIN_FACE_SIZE,
                )
                continue

            detections.append({"box": clamped, "confidence": conf})

        logger.debug("detect_faces returning %d valid detections", len(detections))
        return detections

    def is_loaded(self) -> bool:
        """Return True if the model has been loaded successfully."""
        return self._model is not None
