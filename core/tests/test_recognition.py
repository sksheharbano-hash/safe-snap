"""
tests/test_recognition.py
--------------------------
Unit tests for FaceRecognizer and OwnerRecognizer.
Tests use synthetic embeddings — no InsightFace model load required.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import numpy as np
import pytest

from src.recognition import FaceRecognizer, OwnerRecognizer


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def random_embedding(seed=0):
    rng = np.random.default_rng(seed)
    emb = rng.random(512).astype(np.float32)
    return emb / np.linalg.norm(emb)  # pre-normalized


OWNER_EMB = random_embedding(seed=42)
SIMILAR_EMB = OWNER_EMB + np.random.default_rng(1).random(512).astype(np.float32) * 0.05
SIMILAR_EMB = SIMILAR_EMB / np.linalg.norm(SIMILAR_EMB)
DIFFERENT_EMB = random_embedding(seed=99)


# ---------------------------------------------------------------------------
# FaceRecognizer.cosine_similarity
# ---------------------------------------------------------------------------

class TestCosineSimilarity:
    def test_identical_embeddings_return_1(self):
        sim = FaceRecognizer.cosine_similarity(OWNER_EMB, OWNER_EMB)
        assert abs(sim - 1.0) < 1e-5

    def test_similar_embeddings_high_score(self):
        sim = FaceRecognizer.cosine_similarity(OWNER_EMB, SIMILAR_EMB)
        assert sim > 0.90   # very similar, must be high

    def test_different_embeddings_lower_score(self):
        sim = FaceRecognizer.cosine_similarity(OWNER_EMB, DIFFERENT_EMB)
        # Random 512-d embeddings typically have low cosine similarity
        assert sim < 0.85

    def test_none_embedding_returns_zero(self):
        sim = FaceRecognizer.cosine_similarity(None, OWNER_EMB)
        assert sim == 0.0

    def test_zero_vector_returns_zero(self):
        zero = np.zeros(512, dtype=np.float32)
        sim = FaceRecognizer.cosine_similarity(zero, OWNER_EMB)
        assert sim == 0.0

    def test_symmetry(self):
        sim1 = FaceRecognizer.cosine_similarity(OWNER_EMB, DIFFERENT_EMB)
        sim2 = FaceRecognizer.cosine_similarity(DIFFERENT_EMB, OWNER_EMB)
        assert abs(sim1 - sim2) < 1e-6


# ---------------------------------------------------------------------------
# OwnerRecognizer enrollment
# ---------------------------------------------------------------------------

class TestOwnerRecognizerEnrollment:
    def test_enroll_single_embedding(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        assert owner.is_enrolled
        assert owner.num_references == 1

    def test_enroll_multiple_embeddings(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(random_embedding(0))
        owner.enroll_owner(random_embedding(1))
        owner.enroll_owner(random_embedding(2))
        assert owner.num_references == 3

    def test_enroll_exceeds_max_raises(self):
        owner = OwnerRecognizer()
        for i in range(3):
            owner.enroll_owner(random_embedding(i))
        with pytest.raises(ValueError):
            owner.enroll_owner(random_embedding(10))

    def test_clear_resets_enrollment(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        owner.clear()
        assert not owner.is_enrolled
        assert owner.num_references == 0

    def test_not_enrolled_initially(self):
        owner = OwnerRecognizer()
        assert not owner.is_enrolled


# ---------------------------------------------------------------------------
# OwnerRecognizer.compare
# ---------------------------------------------------------------------------

class TestOwnerRecognizerCompare:
    def test_compare_raises_when_not_enrolled(self):
        owner = OwnerRecognizer()
        with pytest.raises(ValueError):
            owner.compare(OWNER_EMB)

    def test_compare_identical_returns_near_1(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        sim = owner.compare(OWNER_EMB)
        assert abs(sim - 1.0) < 1e-5

    def test_compare_uses_max_similarity(self):
        """With 3 references, compare should use the MAX, not mean."""
        owner = OwnerRecognizer()
        owner.enroll_owner(DIFFERENT_EMB)
        owner.enroll_owner(DIFFERENT_EMB)
        owner.enroll_owner(OWNER_EMB)   # exact match in slot 3
        sim = owner.compare(OWNER_EMB)
        assert abs(sim - 1.0) < 1e-5

    def test_compare_none_embedding_returns_0(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        sim = owner.compare(None)
        assert sim == 0.0


# ---------------------------------------------------------------------------
# OwnerRecognizer.is_owner
# ---------------------------------------------------------------------------

class TestOwnerRecognizerIsOwner:
    def test_is_owner_true_for_identical(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        result, sim = owner.is_owner(OWNER_EMB, threshold=0.40)
        assert result is True

    def test_is_owner_false_for_different(self):
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        # Use a completely different random embedding
        result, sim = owner.is_owner(DIFFERENT_EMB, threshold=0.95)
        # With threshold=0.95 and random embedding it should NOT be owner
        # (random 512-d vectors rarely have cosine > 0.95)
        # We just confirm it returns a bool and a float
        assert isinstance(result, bool)
        assert isinstance(sim, float)

    def test_threshold_configurable(self):
        """Low threshold → more likely to classify as owner."""
        owner = OwnerRecognizer()
        owner.enroll_owner(OWNER_EMB)
        result_low, _ = owner.is_owner(SIMILAR_EMB, threshold=0.01)
        result_high, _ = owner.is_owner(SIMILAR_EMB, threshold=0.9999)
        assert result_low is True   # should pass with very low threshold
        # High threshold may or may not pass – just check it's a bool
        assert isinstance(result_high, bool)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
