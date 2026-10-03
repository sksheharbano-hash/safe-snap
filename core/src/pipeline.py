"""
src/pipeline.py
---------------
MODULE 5 (core): Complete Processing Pipeline

Orchestrates:
    1. Face Detection        (detector)
    2. Face Embedding        (recognizer)
    3. Owner Classification  (owner_recognizer)
    4. Anonymization         (anonymizer)

Returns both the processed image and per-face result metadata.
Includes comprehensive stage-by-stage logging of inputs, outputs, and errors.
"""
from __future__ import annotations

import time
import numpy as np

from src.detector import FaceDetector
from src.recognition import FaceRecognizer, OwnerRecognizer
from src.anonymizer import anonymize_faces
from src.utils import crop_face
from src.config import DEFAULT_RECOGNITION_THRESHOLD
from src.logger import get_logger

logger = get_logger("pipeline")


def process_image(
    image: np.ndarray,
    detector: FaceDetector,
    recognizer: FaceRecognizer,
    owner_recognizer: OwnerRecognizer,
    threshold: float = DEFAULT_RECOGNITION_THRESHOLD,
    anonymization_method: str = "blur",
    anonymization_settings: dict | None = None,
    detection_confidence: float = 0.45,
) -> tuple[np.ndarray, list[dict], dict]:
    """
    Main SafeSnap processing pipeline.

    Parameters
    ----------
    image                   : BGR image (numpy array)
    detector                : FaceDetector instance
    recognizer              : FaceRecognizer instance (for embeddings)
    owner_recognizer        : OwnerRecognizer instance (enrolled owner)
    threshold               : Cosine-similarity threshold for owner matching
    anonymization_method    : "blur" | "pixelate" | "mask"
    anonymization_settings  : dict of method-specific settings
    detection_confidence    : Min confidence for YOLO detections

    Returns
    -------
    processed_image : np.ndarray  (BGR)
    face_results    : list[dict]  (one dict per detected face)
    timings         : dict        (detection_ms, recognition_ms, anon_ms, total_ms)
    """
    if anonymization_settings is None:
        anonymization_settings = {}

    timings: dict[str, float] = {}
    total_start = time.perf_counter()

    # ------------------------------------------------------------------
    # Pipeline Initialization & Input Verification
    # ------------------------------------------------------------------
    if image is None or not isinstance(image, np.ndarray) or image.size == 0:
        logger.error("[Pipeline Error] Invalid input image provided: image is None or empty.")
        timings["detection_ms"] = 0.0
        timings["recognition_ms"] = 0.0
        timings["anonymization_ms"] = 0.0
        timings["total_ms"] = 0.0
        return np.zeros((0, 0, 3), dtype=np.uint8) if image is None else image, [], timings

    img_h, img_w = image.shape[:2]
    channels = image.shape[2] if image.ndim > 2 else 1
    logger.info("=" * 60)
    logger.info("[Pipeline Start] New image processing request received.")
    logger.info(
        "  - Input image: %dx%d px (%d channels, dtype=%s)",
        img_w,
        img_h,
        channels,
        image.dtype,
    )
    logger.info(
        "  - Parameters: detection_confidence=%.2f, recognition_threshold=%.2f, method='%s', settings=%s",
        detection_confidence,
        threshold,
        anonymization_method,
        anonymization_settings,
    )
    logger.info(
        "  - Owner status: %s (%d reference embedding(s) enrolled)",
        "Enrolled" if owner_recognizer.is_enrolled else "NOT enrolled",
        owner_recognizer.num_references,
    )

    # ------------------------------------------------------------------
    # STAGE 1: Face Detection
    # ------------------------------------------------------------------
    logger.info("-" * 60)
    logger.info(
        "[Stage 1/4: Face Detection] Running YOLO face detector (Input: %dx%d image, conf_thresh=%.2f)...",
        img_w,
        img_h,
        detection_confidence,
    )
    t0 = time.perf_counter()
    try:
        detections = detector.detect_faces(image, confidence_threshold=detection_confidence)
    except Exception as exc:
        logger.exception("[Stage 1/4: Face Detection] CRITICAL: detector.detect_faces raised an exception: %s", exc)
        detections = []
    timings["detection_ms"] = (time.perf_counter() - t0) * 1000

    logger.info(
        "[Stage 1/4: Face Detection] Output: Detected %d face(s) in %.2f ms",
        len(detections),
        timings["detection_ms"],
    )

    for idx, det in enumerate(detections):
        box = det["box"]
        bw = box[2] - box[0]
        bh = box[3] - box[1]
        logger.info(
            "  └─ Face #%d: Box=[x1=%d, y1=%d, x2=%d, y2=%d] (Size: %dx%d px), Confidence=%.4f",
            idx + 1,
            box[0],
            box[1],
            box[2],
            box[3],
            bw,
            bh,
            det["confidence"],
        )

    # No faces found → return original with empty results
    if not detections:
        logger.warning(
            "[Stage 1/4: Face Detection] No faces met detection threshold (%.2f). Skipping recognition and anonymization.",
            detection_confidence,
        )
        timings["recognition_ms"] = 0.0
        timings["anonymization_ms"] = 0.0
        timings["total_ms"] = (time.perf_counter() - total_start) * 1000
        logger.info("[Pipeline Finished] Early exit: 0 faces found. Total time: %.2f ms", timings["total_ms"])
        logger.info("=" * 60)
        return image.copy(), [], timings

    # ------------------------------------------------------------------
    # STAGE 2 & 3: Embedding Extraction + Owner Classification per face
    # ------------------------------------------------------------------
    logger.info("-" * 60)
    logger.info(
        "[Stage 2/4: Embedding & Stage 3/4: Classification] Processing %d face crop(s)...",
        len(detections),
    )
    t0 = time.perf_counter()
    face_results: list[dict] = []

    for idx, detection in enumerate(detections):
        box = detection["box"]
        det_conf = detection["confidence"]
        face_id = idx + 1

        logger.info(
            "  ▶ Processing Face #%d (Box: %s, Detection Confidence: %.4f):",
            face_id,
            box,
            det_conf,
        )

        # STAGE 2: Crop face for embedding extraction
        face_crop = crop_face(image, box)
        embedding = None

        if face_crop is None:
            logger.warning(
                "    [Stage 2: Embedding] Face #%d: Cropping failed for box %s on image shape %s.",
                face_id,
                box,
                image.shape[:2],
            )
        else:
            crop_h, crop_w = face_crop.shape[:2]
            logger.info(
                "    [Stage 2: Embedding] Face #%d: Cropped face region: %dx%d px (channels=%d, dtype=%s). Extracting ArcFace embedding...",
                face_id,
                crop_w,
                crop_h,
                face_crop.shape[2] if face_crop.ndim > 2 else 1,
                face_crop.dtype,
            )
            try:
                embedding = recognizer.get_embedding(face_crop)
                if embedding is not None:
                    emb_norm = float(np.linalg.norm(embedding))
                    logger.info(
                        "    [Stage 2: Embedding] Face #%d: Successfully extracted ArcFace embedding (shape=%s, norm=%.4f).",
                        face_id,
                        embedding.shape,
                        emb_norm,
                    )
                else:
                    logger.warning(
                        "    [Stage 2: Embedding] Face #%d: Recognizer returned None. InsightFace could not detect or embed face in crop %dx%d.",
                        face_id,
                        crop_w,
                        crop_h,
                    )
            except Exception as exc:
                logger.exception(
                    "    [Stage 2: Embedding] Face #%d: CRITICAL error during get_embedding: %s",
                    face_id,
                    exc,
                )
                embedding = None

        # STAGE 3: Owner classification
        if not owner_recognizer.is_enrolled:
            is_own = False
            similarity = 0.0
            logger.info(
                "    [Stage 3: Classification] Face #%d: No owner enrolled -> Defaulting to NON-OWNER (similarity=0.0000).",
                face_id,
            )
        elif embedding is None:
            is_own = False
            similarity = 0.0
            logger.warning(
                "    [Stage 3: Classification] Face #%d: Missing embedding -> Fallback default to NON-OWNER (similarity=0.0000).",
                face_id,
            )
        else:
            try:
                # Log detailed similarities across enrolled references
                if hasattr(owner_recognizer, "_owner_embeddings") and owner_recognizer._owner_embeddings:
                    ref_sims = [
                        round(FaceRecognizer.cosine_similarity(ref, embedding), 4)
                        for ref in owner_recognizer._owner_embeddings
                    ]
                    logger.info(
                        "    [Stage 3: Classification] Face #%d: Similarities against %d reference(s): %s",
                        face_id,
                        len(ref_sims),
                        ref_sims,
                    )

                is_own, similarity = owner_recognizer.is_owner(embedding, threshold)
                logger.info(
                    "    [Stage 3: Classification] Face #%d: Best Similarity=%.4f vs Threshold=%.4f -> Decision: %s",
                    face_id,
                    similarity,
                    threshold,
                    "OWNER (Protected)" if is_own else "NON-OWNER (To be anonymized)",
                )
            except Exception as exc:
                logger.exception(
                    "    [Stage 3: Classification] Face #%d: CRITICAL error during owner comparison: %s",
                    face_id,
                    exc,
                )
                is_own = False
                similarity = 0.0

        label = "OWNER" if is_own else "NON-OWNER"

        face_results.append(
            {
                "face_id": face_id,
                "box": box,
                "detection_confidence": round(det_conf, 4),
                "similarity": round(similarity, 4),
                "is_owner": is_own,
                "label": label,
            }
        )

    timings["recognition_ms"] = (time.perf_counter() - t0) * 1000
    logger.info(
        "[Stage 2 & 3] Completed in %.2f ms. Summary: %d face(s) evaluated.",
        timings["recognition_ms"],
        len(face_results),
    )

    # ------------------------------------------------------------------
    # STAGE 4: Anonymize NON-OWNER faces
    # ------------------------------------------------------------------
    logger.info("-" * 60)
    owner_count = sum(1 for f in face_results if f["is_owner"])
    non_owner_count = len(face_results) - owner_count

    logger.info(
        "[Stage 4/4: Anonymization] Starting anonymization (Method='%s', Settings=%s)",
        anonymization_method,
        anonymization_settings,
    )
    logger.info(
        "  - Target faces: %d NON-OWNER (to anonymize), %d OWNER (to preserve unchanged)",
        non_owner_count,
        owner_count,
    )

    for f in face_results:
        if f["is_owner"]:
            logger.info("  └─ Face #%d [OWNER]: Preserved untouched at box %s", f["face_id"], f["box"])
        else:
            logger.info(
                "  └─ Face #%d [NON-OWNER]: Anonymizing at box %s using '%s'",
                f["face_id"],
                f["box"],
                anonymization_method,
            )

    t0 = time.perf_counter()
    try:
        processed_image = anonymize_faces(
            image,
            face_results,
            method=anonymization_method,
            settings=anonymization_settings,
        )
    except Exception as exc:
        logger.exception(
            "[Stage 4/4: Anonymization] CRITICAL: anonymize_faces failed with exception: %s",
            exc,
        )
        processed_image = image.copy()

    timings["anonymization_ms"] = (time.perf_counter() - t0) * 1000
    timings["total_ms"] = (time.perf_counter() - total_start) * 1000

    logger.info(
        "[Stage 4/4: Anonymization] Completed in %.2f ms. Output image shape: %s",
        timings["anonymization_ms"],
        processed_image.shape if processed_image is not None else "None",
    )
    logger.info("-" * 60)
    logger.info(
        "[Pipeline Finished] Total Time: %.2f ms (Detection: %.2f ms | Recognition: %.2f ms | Anonymization: %.2f ms)",
        timings["total_ms"],
        timings["detection_ms"],
        timings["recognition_ms"],
        timings["anonymization_ms"],
    )
    logger.info(
        "[Pipeline Finished] Faces Processed: %d | Owners Preserved: %d | Non-Owners Anonymized: %d",
        len(face_results),
        owner_count,
        non_owner_count,
    )
    logger.info("=" * 60)

    return processed_image, face_results, timings
