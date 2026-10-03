"""
tests/test_pipeline.py
----------------------
Unit tests for the processing pipeline.

Uses mock detector/recognizer to avoid requiring model weights.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import numpy as np
import pytest
from unittest.mock import MagicMock, patch

from src.pipeline import process_image
from src.recognition import OwnerRecognizer


# ---------------------------------------------------------------------------
# Helper factories
# ---------------------------------------------------------------------------

def make_mock_detector(faces: list[dict]):
    """Return a mock FaceDetector whose detect_faces returns *faces*."""
    det = MagicMock()
    det.detect_faces.return_value = faces
    return det


def make_mock_recognizer(embedding):
    """Return a mock FaceRecognizer whose get_embedding always returns *embedding*."""
    rec = MagicMock()
    rec.get_embedding.return_value = embedding
    return rec


def random_embedding(seed=0):
    rng = np.random.default_rng(seed)
    emb = rng.random(512).astype(np.float32)
    return emb / np.linalg.norm(emb)


def blank_image(h=200, w=300):
    return np.zeros((h, w, 3), dtype=np.uint8)


OWNER_EMB = random_embedding(42)
OTHER_EMB = random_embedding(99)


# ---------------------------------------------------------------------------
# Case 1: No faces detected
# ---------------------------------------------------------------------------

class TestPipelineNoFaces:
    def test_returns_empty_results(self):
        detector = make_mock_detector([])
        recognizer = make_mock_recognizer(None)
        owner_rec = OwnerRecognizer()

        img = blank_image()
        processed, results, timings = process_image(
            img, detector, recognizer, owner_rec,
            threshold=0.40, anonymization_method="blur",
        )
        assert results == []
        assert processed is not None

    def test_image_shape_preserved(self):
        detector = make_mock_detector([])
        recognizer = make_mock_recognizer(None)
        owner_rec = OwnerRecognizer()

        img = blank_image(300, 400)
        processed, _, _ = process_image(img, detector, recognizer, owner_rec)
        assert processed.shape == img.shape


# ---------------------------------------------------------------------------
# Case 2: Owner only
# ---------------------------------------------------------------------------

class TestPipelineOwnerOnly:
    def test_single_owner_preserved(self):
        face_box = [10, 10, 60, 60]
        detector = make_mock_detector([{"box": face_box, "confidence": 0.95}])
        recognizer = make_mock_recognizer(OWNER_EMB)

        owner_rec = OwnerRecognizer()
        owner_rec.enroll_owner(OWNER_EMB)  # identical → sim = 1.0

        img = blank_image()
        original = img.copy()

        processed, results, timings = process_image(
            img, detector, recognizer, owner_rec,
            threshold=0.40, anonymization_method="mask",
        )

        assert len(results) == 1
        assert results[0]["is_owner"] is True
        assert results[0]["label"] == "OWNER"

        # Owner region must be unchanged in the processed image
        x1, y1, x2, y2 = face_box
        np.testing.assert_array_equal(
            processed[y1:y2, x1:x2], original[y1:y2, x1:x2]
        )


# ---------------------------------------------------------------------------
# Case 3: Owner + Non-owner
# ---------------------------------------------------------------------------

class TestPipelineMixed:
    def test_owner_preserved_non_owner_anonymized(self):
        owner_box = [10, 10, 70, 70]
        other_box = [120, 10, 180, 70]
        detections = [
            {"box": owner_box, "confidence": 0.95},
            {"box": other_box, "confidence": 0.88},
        ]

        # Alternate embeddings: first call returns OWNER_EMB, second OTHER_EMB
        recognizer = MagicMock()
        recognizer.get_embedding.side_effect = [OWNER_EMB, OTHER_EMB]

        detector = make_mock_detector(detections)

        owner_rec = OwnerRecognizer()
        owner_rec.enroll_owner(OWNER_EMB)

        # Fill image with white so mask (black) is detectable
        img = np.full((200, 300, 3), 255, dtype=np.uint8)
        original = img.copy()

        processed, results, _ = process_image(
            img, detector, recognizer, owner_rec,
            threshold=0.99,  # Very high threshold: only identical embeddings pass
            anonymization_method="mask",
            anonymization_settings={"mask_color": (0, 0, 0)},
        )

        assert len(results) == 2

        owner_res = next(r for r in results if r["is_owner"])
        non_owner_res = next(r for r in results if not r["is_owner"])

        assert owner_res["label"] == "OWNER"
        assert non_owner_res["label"] == "NON-OWNER"

        # Owner region unchanged
        ox1, oy1, ox2, oy2 = owner_box
        np.testing.assert_array_equal(
            processed[oy1:oy2, ox1:ox2], original[oy1:oy2, ox1:ox2]
        )

        # Non-owner region masked (all zeros)
        nx1, ny1, nx2, ny2 = other_box
        assert np.all(processed[ny1:ny2, nx1:nx2] == 0)


# ---------------------------------------------------------------------------
# Case 4: Non-owner only (no owner enrolled)
# ---------------------------------------------------------------------------

class TestPipelineNoOwnerEnrolled:
    def test_all_faces_classified_non_owner(self):
        faces = [
            {"box": [10, 10, 60, 60], "confidence": 0.90},
            {"box": [80, 10, 140, 60], "confidence": 0.85},
        ]
        detector = make_mock_detector(faces)
        recognizer = make_mock_recognizer(OTHER_EMB)

        owner_rec = OwnerRecognizer()   # No enrollment

        img = blank_image()
        _, results, _ = process_image(
            img, detector, recognizer, owner_rec,
            threshold=0.40,
        )

        assert all(not r["is_owner"] for r in results)
        assert all(r["label"] == "NON-OWNER" for r in results)


# ---------------------------------------------------------------------------
# Case 5: Embedding extraction fails
# ---------------------------------------------------------------------------

class TestPipelineEmbeddingFailure:
    def test_none_embedding_treated_as_non_owner(self):
        faces = [{"box": [5, 5, 30, 30], "confidence": 0.80}]
        detector = make_mock_detector(faces)
        recognizer = make_mock_recognizer(None)  # always fails

        owner_rec = OwnerRecognizer()
        owner_rec.enroll_owner(OWNER_EMB)

        img = blank_image()
        _, results, _ = process_image(img, detector, recognizer, owner_rec)

        assert len(results) == 1
        assert results[0]["is_owner"] is False
        assert results[0]["similarity"] == 0.0


# ---------------------------------------------------------------------------
# Timings
# ---------------------------------------------------------------------------

class TestPipelineTimings:
    def test_timings_keys_present(self):
        detector = make_mock_detector([])
        recognizer = make_mock_recognizer(None)
        owner_rec = OwnerRecognizer()

        _, _, timings = process_image(blank_image(), detector, recognizer, owner_rec)
        assert "detection_ms" in timings
        assert "recognition_ms" in timings
        assert "anonymization_ms" in timings
        assert "total_ms" in timings

    def test_total_ms_is_positive(self):
        detector = make_mock_detector([{"box": [10, 10, 60, 60], "confidence": 0.9}])
        recognizer = make_mock_recognizer(OWNER_EMB)
        owner_rec = OwnerRecognizer()

        _, _, timings = process_image(blank_image(), detector, recognizer, owner_rec)
        assert timings["total_ms"] > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
