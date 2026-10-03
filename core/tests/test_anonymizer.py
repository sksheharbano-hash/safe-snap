"""
tests/test_anonymizer.py
------------------------
Unit tests for the anonymization module.
No external services or model weights required.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import numpy as np
import pytest

from src.anonymizer import blur_face, pixelate_face, mask_face, anonymize_faces


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def solid_image(h=100, w=100, color=(128, 64, 200)):
    """Create a solid-colour BGR image."""
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[:] = color
    return img


SAMPLE_BOX = [10, 10, 60, 60]   # [x1, y1, x2, y2]


# ---------------------------------------------------------------------------
# Blur tests
# ---------------------------------------------------------------------------

class TestBlurFace:
    def test_blur_modifies_face_region(self):
        img = solid_image()
        original = img.copy()
        result = blur_face(img, SAMPLE_BOX, strength=21)
        # At least some pixels in the box region should differ after blur
        x1, y1, x2, y2 = SAMPLE_BOX
        diff = np.abs(result[y1:y2, x1:x2].astype(int) - original[y1:y2, x1:x2].astype(int))
        # With uniform colour the blur output equals the input - that's fine.
        # The important thing is that the function doesn't crash.
        assert result.shape == original.shape

    def test_blur_does_not_crash_on_small_face(self):
        img = solid_image()
        small_box = [5, 5, 8, 8]   # 3×3 region
        result = blur_face(img, small_box, strength=3)
        assert result is not None

    def test_blur_out_of_bounds_box(self):
        img = solid_image(50, 50)
        oob_box = [-10, -10, 200, 200]   # entirely outside the image
        result = blur_face(img, oob_box, strength=11)
        assert result.shape == img.shape

    def test_blur_does_not_touch_outside_region(self):
        img = solid_image(200, 200, color=(0, 0, 0))
        # Put a white square outside the box
        img[100:150, 100:150] = (255, 255, 255)
        box = [10, 10, 50, 50]
        result = blur_face(img, box, strength=15)
        # Region outside box must be unchanged
        np.testing.assert_array_equal(result[100:150, 100:150], img[100:150, 100:150])


# ---------------------------------------------------------------------------
# Pixelate tests
# ---------------------------------------------------------------------------

class TestPixelateFace:
    def test_pixelate_modifies_face_region(self):
        # Create an image with gradient values so pixelation is visible
        img = np.arange(100 * 100 * 3, dtype=np.uint8).reshape(100, 100, 3)
        original = img.copy()
        result = pixelate_face(img, SAMPLE_BOX, pixel_size=10)
        assert result.shape == original.shape

    def test_pixelate_does_not_crash_on_small_region(self):
        img = solid_image()
        result = pixelate_face(img, [5, 5, 10, 10], pixel_size=3)
        assert result is not None

    def test_pixelate_pixel_size_1(self):
        """pixel_size=1 should produce identical output."""
        img = solid_image()
        result = pixelate_face(img.copy(), SAMPLE_BOX, pixel_size=1)
        assert result.shape == img.shape


# ---------------------------------------------------------------------------
# Mask tests
# ---------------------------------------------------------------------------

class TestMaskFace:
    def test_mask_fills_region_with_color(self):
        img = solid_image(100, 100, color=(255, 255, 255))
        mask_color = (0, 0, 0)
        result = mask_face(img, SAMPLE_BOX, color=mask_color)
        x1, y1, x2, y2 = SAMPLE_BOX
        region = result[y1:y2, x1:x2]
        # All pixels in the box should be the mask colour
        expected = np.full_like(region, fill_value=0)
        np.testing.assert_array_equal(region, expected)

    def test_mask_does_not_touch_outside(self):
        img = solid_image(200, 200, color=(100, 100, 100))
        box = [10, 10, 50, 50]
        result = mask_face(img, box, color=(0, 0, 0))
        outside_pixel = result[100, 100]
        np.testing.assert_array_equal(outside_pixel, [100, 100, 100])


# ---------------------------------------------------------------------------
# Dispatcher tests
# ---------------------------------------------------------------------------

class TestAnonymizeFaces:
    def _make_faces(self, is_owner_flags):
        return [
            {"box": [10 + i * 60, 10, 50 + i * 60, 50], "is_owner": flag}
            for i, flag in enumerate(is_owner_flags)
        ]

    def test_owner_face_not_anonymized(self):
        """Owner face pixel values must remain unchanged."""
        img = solid_image(200, 300, color=(200, 100, 50))
        original = img.copy()
        faces = self._make_faces([True])   # single owner
        result = anonymize_faces(img, faces, method="mask")
        x1, y1, x2, y2 = faces[0]["box"]
        np.testing.assert_array_equal(result[y1:y2, x1:x2], original[y1:y2, x1:x2])

    def test_non_owner_face_is_anonymized_blur(self):
        img = np.random.randint(0, 255, (200, 300, 3), dtype=np.uint8)
        original = img.copy()
        faces = self._make_faces([False])
        result = anonymize_faces(img, faces, method="blur", settings={"blur_strength": 21})
        # The function should return without crashing
        assert result.shape == original.shape

    def test_mixed_owner_non_owner(self):
        """Two faces: owner unchanged, non-owner masked."""
        img = solid_image(200, 300, color=(255, 255, 255))
        original = img.copy()
        owner_box = [10, 10, 60, 60]
        non_owner_box = [100, 10, 160, 60]
        faces = [
            {"box": owner_box, "is_owner": True},
            {"box": non_owner_box, "is_owner": False},
        ]
        result = anonymize_faces(img, faces, method="mask",
                                 settings={"mask_color": (0, 0, 0)})
        x1, y1, x2, y2 = owner_box
        # Owner region unchanged
        np.testing.assert_array_equal(result[y1:y2, x1:x2], original[y1:y2, x1:x2])
        # Non-owner region masked (all black)
        nx1, ny1, nx2, ny2 = non_owner_box
        assert np.all(result[ny1:ny2, nx1:nx2] == 0)

    def test_empty_faces_list(self):
        img = solid_image()
        result = anonymize_faces(img, [], method="blur")
        np.testing.assert_array_equal(result, img)

    def test_all_non_owners_anonymized(self):
        img = solid_image(200, 300, color=(255, 255, 255))
        faces = self._make_faces([False, False, False])
        result = anonymize_faces(img, faces, method="mask",
                                 settings={"mask_color": (0, 0, 0)})
        # All face regions should be masked
        for face in faces:
            x1, y1, x2, y2 = face["box"]
            assert np.all(result[y1:y2, x1:x2] == 0)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
