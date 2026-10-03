# SafeSnap — Models Directory

This directory is where face detection model weights should be placed.

## Required: YOLO Face Detection Model

SafeSnap uses a YOLOv8-compatible face detection model (`model.pt`).

> **By default, `model.pt` is expected in the project root** (same directory as `app.py`).

### How to obtain a face detection model

You have two options:

---

#### Option 1 (Recommended): Use the included `model.pt`

If you cloned this repository and `model.pt` already exists in the project root, **no action is needed**.

---

#### Option 2: Download `yolov8n-face.pt`

A community-trained YOLOv8n face model is available from the `akanametov/yolo-face` repository:

```bash
# Download from HuggingFace or GitHub releases
# Place the file as model.pt in the project root:
#   SafeSnap/model.pt
```

Direct download link (community model):
- https://github.com/akanametov/yolo-face/releases

After downloading, rename it to `model.pt` and place it in the **project root** (not this `models/` folder).

---

## InsightFace Models (Automatic Download)

SafeSnap uses **InsightFace `buffalo_l`** for face recognition (ArcFace embeddings).

These models are **automatically downloaded on first run** by InsightFace to:
```
~/.insightface/models/buffalo_l/
```

**No manual download required.**

First run may take ~1–2 minutes to download (~300 MB) depending on your internet speed.

---

## Summary

| Model | Source | Location | Size |
|-------|--------|----------|------|
| `model.pt` (YOLO face) | Project root | `SafeSnap/model.pt` | ~6 MB |
| `buffalo_l` (InsightFace) | Auto-downloaded | `~/.insightface/models/buffalo_l/` | ~300 MB |

---

## Troubleshooting

**"Face detection model not found"**
→ Make sure `model.pt` exists in the project root directory.

**"No module named insightface"**
→ Run: `pip install insightface onnxruntime`

**InsightFace download fails (no internet)**
→ Download `buffalo_l` manually from https://github.com/deepinsight/insightface and place it in `~/.insightface/models/buffalo_l/`.
