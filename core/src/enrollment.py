"""
src/enrollment.py
-----------------
MODULE 2: Owner Enrollment

Orchestrates the enrollment flow:
    Upload reference image
        → Detect exactly one face
        → Extract embedding via InsightFace
        → Normalize
        → Store in OwnerRecognizer
"""
from __future__ import annotations

import numpy as np

from src.detector import FaceDetector
from src.recognition import FaceRecognizer, OwnerRecognizer
from src.utils import crop_face
from src.logger import get_logger

logger = get_logger("enrollment")


class EnrollmentResult:
    """Structured result returned by enroll_image."""

    def __init__(
        self,
        success: bool,
        message: str,
        embedding: np.ndarray | None = None,
    ) -> None:
        self.success = success
        self.message = message
        self.embedding = embedding


def enroll_image(
    image: np.ndarray,
    detector: FaceDetector,
    recognizer: FaceRecognizer,
    owner_recognizer: OwnerRecognizer,
    confidence_threshold: float = 0.45,
) -> EnrollmentResult:
    """
    Enroll one reference image of the owner.

    Steps
    -----
    1. Detect faces in the image.
    2. Ensure exactly one face is present.
    3. Crop the face.
    4. Extract the embedding.
    5. Store in owner_recognizer.

    Returns
    -------
    EnrollmentResult with .success and .message.
    """
    if image is None or not isinstance(image, np.ndarray) or image.size == 0:
        logger.error("[Enrollment] Invalid input image: image is None or empty.")
        return EnrollmentResult(False, "❌ Invalid image provided.")

    h, w = image.shape[:2]
    logger.info("=" * 50)
    logger.info("[Enrollment Start] Processing owner reference photo (%dx%d px)...", w, h)
    logger.info("  - Parameters: confidence_threshold=%.2f, current references=%d", confidence_threshold, owner_recognizer.num_references)

    # Step 1 – Detect faces
    logger.info("  ▶ [Enrollment Step 1/5] Detecting faces using YOLO...")
    try:
        detections = detector.detect_faces(image, confidence_threshold)
        logger.info("  └─ Detected %d face(s).", len(detections))
    except Exception as exc:
        logger.exception("  └─ CRITICAL: Face detection error during enrollment: %s", exc)
        return EnrollmentResult(False, f"Face detection error: {exc}")

    # Step 2 – Validate exactly one face
    logger.info("  ▶ [Enrollment Step 2/5] Validating face count (requirement: exactly 1 face)...")
    if len(detections) == 0:
        logger.warning("  └─ FAILED: 0 faces detected in reference photo.")
        return EnrollmentResult(
            False,
            "❌ No face detected. Please upload a clear, well-lit image "
            "containing only the owner's face.",
        )

    if len(detections) > 1:
        logger.warning("  └─ FAILED: %d faces detected in reference photo.", len(detections))
        return EnrollmentResult(
            False,
            f"❌ Multiple faces detected ({len(detections)}). "
            "Please upload an image containing only the owner's face.",
        )

    # Step 3 – Crop the single detected face
    box = detections[0]["box"]
    logger.info("  ▶ [Enrollment Step 3/5] Cropping single detected face at box %s...", box)
    face_crop = crop_face(image, box)
    if face_crop is None:
        logger.warning("  └─ FAILED: Crop resulted in empty or invalid region.")
        return EnrollmentResult(
            False,
            "❌ Could not crop face region. Please try a different image.",
        )
    logger.info("  └─ Cropped face region shape: %s", face_crop.shape)

    # Step 4 – Extract embedding
    logger.info("  ▶ [Enrollment Step 4/5] Extracting ArcFace embedding via InsightFace...")
    try:
        embedding = recognizer.get_embedding(face_crop)
    except Exception as exc:
        logger.exception("  └─ CRITICAL: Embedding extraction error: %s", exc)
        return EnrollmentResult(False, f"Embedding extraction error: {exc}")

    if embedding is None:
        logger.warning("  └─ FAILED: recognizer.get_embedding returned None.")
        return EnrollmentResult(
            False,
            "❌ Could not extract a face embedding from this image. "
            "Please try a clearer, front-facing image.",
        )
    logger.info("  └─ Embedding extracted successfully (norm=%.4f).", float(np.linalg.norm(embedding)))

    # Step 5 – Store embedding
    logger.info("  ▶ [Enrollment Step 5/5] Storing embedding in OwnerRecognizer...")
    try:
        owner_recognizer.enroll_owner(embedding)
    except ValueError as exc:
        logger.error("  └─ FAILED: %s", exc)
        return EnrollmentResult(False, str(exc))

    ref_num = owner_recognizer.num_references
    logger.info("  └─ SUCCESS: Reference #%d enrolled successfully.", ref_num)
    logger.info("[Enrollment Complete] Owner references count: %d", ref_num)
    logger.info("=" * 50)

    return EnrollmentResult(
        True,
        f"✅ Owner face enrolled successfully (reference {ref_num}/{3}).",
        embedding=embedding,
    )
