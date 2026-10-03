"""
src/config.py
-------------
Central configuration for SafeSnap.
All tunable constants live here – never scatter magic numbers in business logic.
"""

# ---------------------------------------------------------------------------
# Face Detection
# ---------------------------------------------------------------------------
# Minimum confidence for a YOLO detection to be considered a valid face.
DEFAULT_DETECTION_CONFIDENCE: float = 0.45

# ---------------------------------------------------------------------------
# Owner Recognition
# ---------------------------------------------------------------------------
# Cosine-similarity threshold for classifying a face as the owner.
# NOTE: This is a *practical starting point*, not a scientifically validated
# universal threshold.  Adjust based on lighting, camera quality, and your
# specific reference images.  Exposed through the Streamlit UI slider.
DEFAULT_RECOGNITION_THRESHOLD: float = 0.40

# ---------------------------------------------------------------------------
# Anonymization defaults
# ---------------------------------------------------------------------------
DEFAULT_BLUR_STRENGTH: int = 51       # Gaussian kernel size (must be odd)
DEFAULT_PIXEL_SIZE: int = 15          # Pixel block size for pixelation
DEFAULT_MASK_COLOR: tuple = (30, 30, 30)   # BGR: near-black rectangle

# ---------------------------------------------------------------------------
# Model paths  (relative to project root)
# ---------------------------------------------------------------------------
# model.pt is a YOLOv8-face-compatible weight file.
# Expected location: <project_root>/model.pt
# You can also use any yolov8n-face.pt placed in models/
YOLO_MODEL_PATH: str = "model.pt"

# InsightFace downloads its buffalo_l model automatically on first run into:
#   ~/.insightface/models/buffalo_l/
# No manual download required.
INSIGHTFACE_MODEL_NAME: str = "buffalo_l"

# ---------------------------------------------------------------------------
# Misc
# ---------------------------------------------------------------------------
MAX_OWNER_REFERENCES: int = 3
MIN_FACE_SIZE: int = 20   # pixels – smaller detections are ignored
