# 🔒 SafeSnap

**Owner-Aware, Privacy-Preserving Image Sharing**

SafeSnap is a local, on-device AI system that detects faces in photos, identifies the enrolled owner, preserves their face, and automatically anonymizes (blurs, pixelates, or masks) everyone else before sharing.

No cloud APIs. 100% private and runs completely on your machine.

---

## 🚀 Quickstart: Self-Hosting in 3 Steps

Follow these simple steps to run SafeSnap on your computer or server.

### Prerequisites

- **Python 3.10 – 3.12** installed on your system
- **Git**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/sksheharbano-hash/safe-snap.git
cd safe-snap/core
```

---

### Step 2: Create a Virtual Environment & Install Dependencies

#### On Windows:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### On Linux / macOS:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

*(Optional note for Linux servers: if you encounter OpenCV errors, install system libraries with `sudo apt install -y libgl1-mesa-glx libglib2.0-0`)*

---

### Step 3: Run the App

```bash
streamlit run app.py
```

Open your browser and navigate to:
```
http://localhost:8501
```

> 💡 **First run note**: The required face detection weights (`model.pt`) are included in the repository. InsightFace will automatically download the ArcFace recognition model (`buffalo_l`, ~300 MB) on your very first run.

---

## 🎯 How to Use

1. **Enroll Owner**: Upload 1–3 clear photos of yourself in the *Owner Enrollment* section and click **Enroll Owner**.
2. **Process Photo**: Upload any group picture in the *Upload Image to Process* section.
3. **Choose Anonymization**: Select Blur, Pixelate, or Mask.
4. **Export**: Click **Process Image** and download your privacy-safe photo!

---

## 🌐 (Optional) Run the Web Showcase / Landing Page

If you also want to run the front-facing landing page:

```bash
cd ../safe-snap-web
npm install
npm run dev
```

The web showcase will run at `http://localhost:5173`.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
