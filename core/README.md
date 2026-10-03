# 🔒 SafeSnap

**Owner-Aware Privacy-Preserving Image Sharing**

> A local, on-device system that detects faces in a photo, identifies the enrolled owner, preserves their face, and automatically anonymizes every other face — before the image is shared.

---

## 📌 Project Overview

SafeSnap is a college major project prototype that demonstrates a **privacy-first, owner-aware** face anonymization pipeline entirely on your local machine. No cloud APIs or external AI services are used.

**Core idea:**

```
Group Photo (Owner + Others)
          ↓
SafeSnap (local)
          ↓
Owner → preserved  |  Everyone else → blurred / pixelated / masked
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Owner Enrollment** | Upload 1–3 reference photos of the owner |
| **Face Detection** | YOLOv8-face model detects all faces locally |
| **Face Recognition** | InsightFace ArcFace embeddings + cosine similarity |
| **Owner-Aware** | Only the enrolled owner is preserved; everyone else is anonymized |
| **3 Anonymization Methods** | Blur, Pixelate, Mask |
| **Side-by-side display** | Original vs processed image shown together |
| **Download** | Export `safesnap_anonymized.png` directly from the browser |
| **Performance metrics** | Detection / Recognition / Anonymization timing displayed |
| **Configurable threshold** | Adjust similarity cutoff from the UI sidebar |
| **Fully local** | Zero external API calls — runs on your own CPU |

---

## 🏗️ Architecture

```
                  ┌─────────────────────────────────────┐
                  │           app.py (Streamlit UI)      │
                  └───────────────┬─────────────────────┘
                                  │
           ┌──────────────────────▼──────────────────────┐
           │              src/pipeline.py                  │
           │  (orchestrates detection → recognition → anon) │
           └──────┬──────────────┬────────────────┬───────┘
                  │              │                │
         ┌────────▼──────┐ ┌────▼──────┐ ┌──────▼────────┐
         │ src/detector  │ │src/recogni│ │src/anonymizer  │
         │ (YOLOv8-face) │ │tion.py    │ │(blur/pix/mask) │
         │               │ │InsightFace│ │                │
         └───────────────┘ └───────────┘ └────────────────┘
```

### Modules

| File | Responsibility |
|------|---------------|
| `src/config.py` | All configurable constants |
| `src/utils.py` | Image conversion, bounding-box helpers |
| `src/detector.py` | **MODULE 1** – YOLO face detection |
| `src/enrollment.py` | **MODULE 2** – Owner enrollment flow |
| `src/recognition.py` | **MODULE 3** – ArcFace embeddings + cosine similarity |
| `src/anonymizer.py` | **MODULE 4** – Blur / Pixelate / Mask |
| `src/pipeline.py` | **MODULE 5** – End-to-end processing pipeline |
| `src/visualization.py` | Bounding-box drawing with OWNER/NON-OWNER labels |
| `src/evaluation.py` | **MODULE 6** – Timing and performance metrics |
| `app.py` | **Streamlit UI** |

---

## 📁 Folder Structure

```
SafeSnap/
├── app.py                  # Streamlit application entry point
├── model.pt                # YOLOv8-face weights (in project root)
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── .gitignore
│
├── src/
│   ├── __init__.py
│   ├── config.py           # Configurable constants
│   ├── utils.py            # Image helpers
│   ├── detector.py         # Face detection (YOLO)
│   ├── enrollment.py       # Owner enrollment
│   ├── recognition.py      # Face embeddings + owner matching
│   ├── anonymizer.py       # Blur / Pixelate / Mask
│   ├── pipeline.py         # Main processing pipeline
│   ├── visualization.py    # Bounding box drawing
│   └── evaluation.py       # Timing / CPU / RAM metrics
│
├── tests/
│   ├── test_anonymizer.py  # Anonymization unit tests
│   ├── test_recognition.py # Recognition unit tests
│   └── test_pipeline.py    # Pipeline integration tests
│
├── models/
│   └── README.md           # Model download instructions
│
├── sample_images/
│   └── README.md           # Sample image guidance
│
└── outputs/
    └── .gitkeep
```

---

## ⚙️ Requirements

- Python 3.10 – 3.14
- Windows 10/11 (also works on Linux/macOS)
- At least 4 GB RAM recommended
- Internet connection for the first run (InsightFace downloads `buffalo_l` automatically, ~300 MB)

---

## 🚀 Installation

### Step 1 – Open the project folder in VS Code or a terminal

```bash
cd path\to\SafeSnap
```

### Step 2 – Create a virtual environment

```bash
python -m venv .venv
```

### Step 3 – Activate the virtual environment

**Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
.venv\Scripts\activate.bat
```

### Step 4 – Install dependencies

```bash
pip install -r requirements.txt
```

### Step 5 – Set up the face detection model

`model.pt` must exist in the **project root** (`SafeSnap/model.pt`).

If it already exists (cloned from the repo), skip this step.

If not, see [`models/README.md`](models/README.md) for download instructions.

InsightFace (face recognition) downloads its models **automatically** on the first run.

### Step 6 – Run SafeSnap

```bash
streamlit run app.py
```

### Step 7 – Open the app

Streamlit will display a URL like:

```
Local URL: http://localhost:8501
```

Open that URL in your browser.

---

## 🎯 How to Use

### Enrolling the Owner

1. In the **Owner Enrollment** section, upload 1–3 clear, front-facing photos of the owner.
   - Each image must contain **exactly one face**.
   - More reference images improve recognition under different poses/lighting.
2. Click **"Enroll Owner"**.
3. You should see: `✅ Owner enrolled successfully`.

### Processing an Image

1. In the **Upload Image to Process** section, upload a group photo (JPG/PNG).
2. Adjust the **Recognition Threshold** slider in the sidebar if needed.
3. Choose your **Anonymization Method**: Blur / Pixelate / Mask.
4. Click **"Process Image"**.
5. View the **Detection & Recognition Results** table and the **Original vs Processed** comparison.
6. Click **Download** to save `safesnap_anonymized.png`.

---

## 🧠 How Recognition Works

1. **Face Detection**: YOLO detects all faces and returns bounding boxes.
2. **Embedding Extraction**: Each face crop is passed through InsightFace's ArcFace model, producing a 512-dimensional embedding vector.
3. **Normalization**: Embeddings are L2-normalized.
4. **Cosine Similarity**: For each detected face, cosine similarity is computed against all enrolled owner embeddings.
5. **Best-match strategy**: The *maximum* similarity across all enrolled references is used.
6. **Threshold decision**:
   - `similarity ≥ threshold` → **OWNER** (face preserved)
   - `similarity < threshold` → **NON-OWNER** (face anonymized)

> **Important**: The threshold is a *configurable parameter*, not a universal scientific constant.  Adjust it in the sidebar based on your images.

### With multiple reference images

```
Owner Embeddings: E1, E2, E3
Test Embedding:   T

sim1 = cosine(E1, T)
sim2 = cosine(E2, T)
sim3 = cosine(E3, T)

max_similarity = max(sim1, sim2, sim3)

if max_similarity >= threshold → OWNER
else                           → NON-OWNER
```

---

## 🎭 How Anonymization Works

Only **NON-OWNER** faces are anonymized. The owner's face is never touched.

| Method | Description |
|--------|-------------|
| **Blur** | Gaussian blur applied to the face region (configurable kernel size) |
| **Pixelate** | Face region down-scaled then up-scaled with nearest-neighbour interpolation |
| **Mask** | Solid dark rectangle drawn over the face bounding box |

---

## 🔧 Configuration

Edit [`src/config.py`](src/config.py) to change defaults:

| Constant | Default | Description |
|----------|---------|-------------|
| `DEFAULT_RECOGNITION_THRESHOLD` | `0.40` | Cosine similarity cutoff for owner classification |
| `DEFAULT_DETECTION_CONFIDENCE` | `0.45` | Min YOLO confidence to keep a detection |
| `DEFAULT_BLUR_STRENGTH` | `51` | Gaussian kernel size for blur |
| `DEFAULT_PIXEL_SIZE` | `15` | Pixel block size for pixelation |
| `YOLO_MODEL_PATH` | `"model.pt"` | Path to YOLO face weights |
| `INSIGHTFACE_MODEL_NAME` | `"buffalo_l"` | InsightFace model name |

All values are also adjustable live in the Streamlit sidebar.

---

## 🧪 Testing

Run all tests:

```bash
python -m pytest tests/ -v
```

Run individual test files:

```bash
python -m pytest tests/test_anonymizer.py -v
python -m pytest tests/test_recognition.py -v
python -m pytest tests/test_pipeline.py -v
```

Tests do **not** require internet access or model downloads.
Pipeline tests use mock detectors and recognizers.

---

## 📊 Evaluation

After processing an image, SafeSnap displays:

- **Detection Time** (ms) – how long YOLO took
- **Recognition Time** (ms) – embedding + comparison time
- **Anonymization Time** (ms) – blurring/masking time
- **Total Time** (ms) – end-to-end pipeline

---

## ⚠️ Limitations

1. **Threshold sensitivity**: The recognition threshold may need manual tuning per use case. There is no universal threshold value.
2. **Pose variation**: Side profiles or extreme angles may produce lower similarity scores.
3. **Lighting**: Strong lighting differences between reference and target images may reduce similarity.
4. **Small faces**: Faces that are very small in the image (< 20×20 px) are skipped.
5. **CPU-only**: Designed for CPU inference (no GPU required, but GPU would be faster).
6. **No persistent storage**: Enrollment is session-based; re-enroll after restarting the app.

---

## 🔮 Future Improvements

- [ ] Persistent owner enrollment across sessions (encrypted local database)
- [ ] GPU acceleration with ONNX GPU providers
- [ ] Video/webcam processing support
- [ ] Multiple owner profiles
- [ ] Face alignment pre-processing for better recognition
- [ ] Confidence-based uncertain zone with manual review option
- [ ] REST API for integration with other apps

---

## 🛡️ Privacy Statement

SafeSnap is designed with privacy as the core principle:

- ✅ All processing is done locally on your machine
- ✅ No images are sent to external servers or cloud APIs
- ✅ No embeddings are logged or stored permanently
- ✅ Processed images are only saved when you explicitly download them

---

## 📚 Technology Stack

| Component | Library |
|-----------|---------|
| Web UI | Streamlit |
| Face Detection | Ultralytics YOLOv8-face |
| Face Recognition | InsightFace (ArcFace / buffalo_l) |
| Inference Runtime | ONNX Runtime |
| Image Processing | OpenCV, Pillow |
| Performance Metrics | psutil |

---

*SafeSnap — College Major Project | Built locally, privately.*
