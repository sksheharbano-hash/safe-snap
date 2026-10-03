"""
src/recognition.py
------------------
MODULE 3: Face Recognition / Owner Identification

Uses InsightFace (buffalo_l) to extract 512-d ArcFace embeddings.
Compares embeddings using cosine similarity.

Design notes:
- FaceRecognizer  → wraps InsightFace; produces normalized embeddings.
- OwnerRecognizer → stores owner embeddings; classifies test faces.
"""
from __future__ import annotations

import cv2
import numpy as np

from src.config import (
    DEFAULT_RECOGNITION_THRESHOLD,
    INSIGHTFACE_MODEL_NAME,
    MAX_OWNER_REFERENCES,
)
from src.logger import get_logger

logger = get_logger("recognition")


# ---------------------------------------------------------------------------
# InsightFace lazy import helper
# ---------------------------------------------------------------------------

def _load_insightface_app(model_name: str = INSIGHTFACE_MODEL_NAME):
    """
    Load InsightFace FaceAnalysis app.
    InsightFace downloads the model (~200 MB) automatically on first use to
    ~/.insightface/models/<model_name>/. No manual download needed.
    """
    logger.info(
        "Initializing InsightFace FaceAnalysis (model='%s', providers=['CPUExecutionProvider'])...",
        model_name,
    )
    try:
        import insightface
        from insightface.app import FaceAnalysis
    except ImportError as exc:
        logger.exception("InsightFace or ONNXRuntime is not installed: %s", exc)
        raise ImportError(
            "InsightFace is not installed. Run:\n"
            "  pip install insightface onnxruntime"
        ) from exc

    try:
        app = FaceAnalysis(name=model_name, providers=["CPUExecutionProvider"])
        # ctx_id=-1 → CPU; det_size controls the detection resolution
        app.prepare(ctx_id=-1, det_size=(640, 640))
        logger.info("InsightFace FaceAnalysis successfully initialized and prepared on CPU.")
        return app
    except Exception as exc:
        logger.exception("Failed to prepare InsightFace FaceAnalysis model '%s': %s", model_name, exc)
        raise


# ---------------------------------------------------------------------------
# FaceRecognizer
# ---------------------------------------------------------------------------

class FaceRecognizer:
    """
    Wraps InsightFace to extract face embeddings from cropped face images.

    Usage
    -----
    recognizer = FaceRecognizer()
    embedding  = recognizer.get_embedding(face_bgr_image)
    """

    def __init__(self) -> None:
        self._app = None

    def _ensure_loaded(self) -> None:
        if self._app is None:
            self._app = _load_insightface_app()

    # ------------------------------------------------------------------
    # Embedding extraction
    # ------------------------------------------------------------------

    def get_embedding(self, face_image: np.ndarray) -> np.ndarray | None:
        """
        Extract a normalized 512-d ArcFace embedding from a face image.

        Parameters
        ----------
        face_image : np.ndarray
            BGR image of the face crop (or full image – InsightFace will detect
            the face internally).

        Returns
        -------
        np.ndarray of shape (512,) or None if no face was detected by
        InsightFace.
        """
        self._ensure_loaded()

        if face_image is None or not isinstance(face_image, np.ndarray) or face_image.size == 0:
            logger.warning("get_embedding called with None or empty face_image.")
            return None

        h, w = face_image.shape[:2]
        logger.debug("get_embedding called for face crop of size %dx%d (dtype=%s)", w, h, face_image.dtype)

        # InsightFace expects at least ~112×112 for reliable results.
        # Upscale tiny crops so the model can operate.
        if h < 112 or w < 112:
            scale = max(112 / h, 112 / w)
            new_w = max(int(w * scale), 112)
            new_h = max(int(h * scale), 112)
            logger.debug(
                "Face crop (%dx%d px) is below 112x112 minimum; resizing to %dx%d px.",
                w,
                h,
                new_w,
                new_h,
            )
            face_image = cv2.resize(face_image, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

        try:
            faces = self._app.get(face_image)
        except Exception as exc:
            logger.exception("InsightFace app.get() raised an unexpected exception: %s", exc)
            return None

        if not faces:
            # Fallback: add 25% reflective border in case the crop was too tight for SCRFD
            logger.debug(
                "InsightFace found 0 faces in initial crop (%dx%d px). Retrying with reflective margin padding...",
                w,
                h,
            )
            h_c, w_c = face_image.shape[:2]
            pad_y = max(16, int(h_c * 0.25))
            pad_x = max(16, int(w_c * 0.25))
            padded_crop = cv2.copyMakeBorder(face_image, pad_y, pad_y, pad_x, pad_x, cv2.BORDER_REFLECT)
            try:
                faces = self._app.get(padded_crop)
                if faces:
                    logger.info("InsightFace detected face after adding reflective margin padding.")
            except Exception as exc:
                logger.exception("InsightFace app.get() retry with reflective padding failed: %s", exc)
                return None

        if not faces:
            logger.warning(
                "InsightFace SCRFD detector found 0 faces within crop (%dx%d px). Cannot extract embedding.",
                w,
                h,
            )
            return None

        # Use the face with the highest detection score
        best = max(faces, key=lambda f: f.det_score)
        logger.debug(
            "InsightFace detected %d face(s) in crop. Best face det_score=%.4f",
            len(faces),
            best.det_score,
        )

        embedding = best.embedding
        if embedding is None:
            logger.warning("InsightFace detected face candidate, but .embedding is None.")
            return None

        normed = self._normalize(embedding)
        logger.debug("Embedding successfully extracted and normalized (shape=%s, norm=%.4f)", normed.shape, float(np.linalg.norm(normed)))
        return normed

    # ------------------------------------------------------------------
    # Similarity
    # ------------------------------------------------------------------

    @staticmethod
    def cosine_similarity(emb1: np.ndarray, emb2: np.ndarray) -> float:
        """
        Compute cosine similarity between two normalized embeddings.

        Returns a value in [-1, 1]; higher means more similar.
        Pre-normalized vectors make this equivalent to dot product.
        """
        if emb1 is None or emb2 is None:
            return 0.0
        n1 = np.linalg.norm(emb1)
        n2 = np.linalg.norm(emb2)
        if n1 == 0 or n2 == 0:
            return 0.0
        return float(np.dot(emb1 / n1, emb2 / n2))

    # ------------------------------------------------------------------
    # Private
    # ------------------------------------------------------------------

    @staticmethod
    def _normalize(embedding: np.ndarray) -> np.ndarray:
        norm = np.linalg.norm(embedding)
        if norm == 0:
            return embedding
        return embedding / norm


# ---------------------------------------------------------------------------
# OwnerRecognizer
# ---------------------------------------------------------------------------

class OwnerRecognizer:
    """
    Stores enrolled owner embeddings and classifies test face embeddings.

    Supports 1–3 reference embeddings; always uses the *maximum* similarity
    across all enrolled references (best-match strategy).
    """

    def __init__(self) -> None:
        self._owner_embeddings: list[np.ndarray] = []
        self._recognizer = FaceRecognizer()

    # ------------------------------------------------------------------
    # Enrollment
    # ------------------------------------------------------------------

    def enroll_owner(self, embedding: np.ndarray) -> None:
        """
        Add a normalized owner embedding to the reference set.

        Raises ValueError if more than MAX_OWNER_REFERENCES are added.
        """
        if len(self._owner_embeddings) >= MAX_OWNER_REFERENCES:
            logger.error(
                "Enrollment limit reached: already enrolled %d/%d references.",
                len(self._owner_embeddings),
                MAX_OWNER_REFERENCES,
            )
            raise ValueError(
                f"Maximum {MAX_OWNER_REFERENCES} owner references already enrolled."
            )
        self._owner_embeddings.append(embedding)
        logger.info(
            "Owner reference embedding enrolled (Total: %d/%d references stored).",
            len(self._owner_embeddings),
            MAX_OWNER_REFERENCES,
        )

    def clear(self) -> None:
        """Remove all enrolled owner embeddings (reset enrollment)."""
        count = len(self._owner_embeddings)
        self._owner_embeddings = []
        logger.info("OwnerRecognizer cleared %d enrolled reference(s).", count)

    @property
    def is_enrolled(self) -> bool:
        return len(self._owner_embeddings) > 0

    @property
    def num_references(self) -> int:
        return len(self._owner_embeddings)

    # ------------------------------------------------------------------
    # Recognition
    # ------------------------------------------------------------------

    def compare(self, test_embedding: np.ndarray) -> float:
        """
        Return the highest cosine similarity between *test_embedding* and any
        enrolled owner embedding.

        Returns 0.0 if no owner is enrolled or the embedding is None.
        """
        if not self._owner_embeddings:
            logger.error("OwnerRecognizer.compare called with no enrolled owner references.")
            raise ValueError(
                "No owner enrolled. Please enroll the owner first."
            )
        if test_embedding is None:
            logger.warning("OwnerRecognizer.compare called with test_embedding=None.")
            return 0.0

        similarities = [
            FaceRecognizer.cosine_similarity(ref, test_embedding)
            for ref in self._owner_embeddings
        ]
        best_sim = max(similarities)
        logger.debug(
            "Compared test embedding against %d owner reference(s): %s -> Best similarity=%.4f",
            len(self._owner_embeddings),
            [round(s, 4) for s in similarities],
            best_sim,
        )
        return best_sim

    def is_owner(
        self,
        test_embedding: np.ndarray,
        threshold: float = DEFAULT_RECOGNITION_THRESHOLD,
    ) -> tuple[bool, float]:
        """
        Classify a test embedding as OWNER or NON-OWNER.

        Parameters
        ----------
        test_embedding : np.ndarray
        threshold      : float
            Cosine-similarity threshold (configurable; not a universal truth).

        Returns
        -------
        (is_owner: bool, similarity: float)
        """
        similarity = self.compare(test_embedding)
        is_own = similarity >= threshold
        logger.debug(
            "is_owner classification: similarity=%.4f vs threshold=%.4f -> %s",
            similarity,
            threshold,
            "OWNER" if is_own else "NON-OWNER",
        )
        return is_own, similarity

    def get_recognizer(self) -> FaceRecognizer:
        """Expose the underlying FaceRecognizer for enrollment use."""
        return self._recognizer
