# 🔒 SafeSnap

**Owner-Aware, Privacy-Preserving Image Sharing (100% Local & Self-Hosted)**

[![Python 3.10+](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit%201.35+-FF4B4B.svg)](https://streamlit.io/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB.svg)](https://react.dev/)
[![YOLOv8](https://img.shields.io/badge/Detection-YOLOv8--face-00FFFF.svg)](https://github.com/ultralytics/ultralytics)
[![InsightFace](https://img.shields.io/badge/Embeddings-InsightFace%20ArcFace-green.svg)](https://github.com/deepinsight/insightface)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **SafeSnap** is a local-first, privacy-preserving face anonymization system. When sharing group photos, SafeSnap detects all faces, recognizes the enrolled owner, preserves their face, and automatically anonymizes (blurs, pixelates, or masks) everyone else — entirely on your hardware with **zero external cloud API calls**.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Repository Structure](#-repository-structure)
- [Prerequisites & System Requirements](#-prerequisites--system-requirements)
- [Quickstart: Local Self-Hosting](#-quickstart-local-self-hosting)
  - [1. Clone Repository](#1-clone-the-repository)
  - [2. Backend Setup (Core AI & Streamlit Studio)](#2-backend-setup-core-ai--streamlit-studio)
  - [3. Frontend Setup (Web Landing & Showcase Portal)](#3-frontend-setup-web-landing--showcase-portal)
- [Production Self-Hosting Guide](#-production-self-hosting-guide)
  - [Running as System Services (systemd)](#option-a-running-as-system-services-systemd-on-linux)
  - [Nginx Reverse Proxy & SSL Setup](#nginx-reverse-proxy-configuration)
  - [Containerized Hosting (Docker)](#option-b-docker-self-hosting)
- [AI Models & Storage](#-ai-models--storage)
- [Configuration & Tuning](#-configuration--tuning)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## 📌 Overview & Architecture

SafeSnap solves the dilemma of sharing personal memories without infringing on others' privacy:

```
                  ┌──────────────────────────────────────────────┐
                  │                 Group Photo                  │
                  │            (Owner + Other People)            │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │        YOLOv8 Face Detection         │
                      │         (Locates all faces)          │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    ArcFace (InsightFace buffalo_l)   │
                      │       512-D Embedding Extraction     │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │   Cosine Similarity vs Owner Vector  │
                      └──────────────┬────────────────┬──────┘
                                     │                │
                      [≥ Threshold]  │                │ [< Threshold]
                                     ▼                ▼
                             ┌───────────────┐ ┌───────────────┐
                             │  Owner Face   │ │ Non-Owners    │
                             │  (Preserved)  │ │ (Anonymized)  │
                             └───────┬───────┘ └───────┬───────┘
                                     │                 │
                                     └────────┬────────┘
                                              ▼
                             ┌─────────────────────────────────┐
                             │       Privacy-Safe Photo        │
                             │ (Blur / Pixelate / Mask applied)│
                             └─────────────────────────────────┘
```

---

## 📁 Repository Structure

```
SafeSnap/
├── core/                       # AI Processing Engine & Streamlit Studio
│   ├── app.py                  # Streamlit application UI
│   ├── model.pt                # YOLOv8-face detection weights
│   ├── requirements.txt        # Python backend dependencies
│   ├── src/                    # Pipeline modules
│   │   ├── config.py           # Thresholds, model paths, defaults
│   │   ├── detector.py         # YOLO face detection
│   │   ├── enrollment.py       # Owner reference embeddings
│   │   ├── recognition.py      # ArcFace feature matching
│   │   ├── anonymizer.py       # Blur, pixelate, and mask routines
│   │   ├── pipeline.py         # End-to-end image orchestration
│   │   ├── visualization.py    # Bounding boxes and labels
│   │   └── evaluation.py       # Latency and memory benchmarks
│   ├── tests/                  # Unit and integration test suite
│   └── models/                 # Model download documentation
│
├── safe-snap-web/              # Web Landing Page & Showcase UI
│   ├── index.html              # Vite entrypoint
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── src/                    # React 19 + TypeScript components
│
└── README.md                   # Self-hosting and project guide
```

---

## ⚙️ Prerequisites & System Requirements

### Hardware Requirements
- **CPU**: Modern multi-core x86_64 / ARM64 processor (Intel Core i3/i5/i7/i9, AMD Ryzen, Apple Silicon, or VPS equivalent).
- **RAM**: Minimum 4 GB RAM (8 GB recommended for optimal multi-face batch processing).
- **Disk Space**: ~1.5 GB free disk space (repository, dependencies, and model weights).
- **GPU (Optional)**: CUDA-compatible NVIDIA GPU if you wish to run ONNX Runtime / PyTorch with GPU acceleration. CPU inference works out of the box.

### Software Requirements
- **Python**: `3.10`, `3.11`, or `3.12`
- **Node.js**: `18.x` or higher (with `npm`)
- **Git**
- **C/C++ Build Tools**: Required by `insightface` and `onnxruntime` during wheel verification.
  - **Debian / Ubuntu**: `sudo apt install -y build-essential python3-dev libgl1-mesa-glx libglib2.0-0`
  - **CentOS / RHEL / Fedora**: `sudo dnf install -y gcc gcc-c++ python3-devel mesa-libGL glib2`
  - **macOS**: `xcode-select --install`
  - **Windows**: [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

---

## 🚀 Quickstart: Local Self-Hosting

### 1. Clone the Repository

```bash
git clone https://github.com/sksheharbano-hash/safe-snap.git
cd safe-snap
```

---

### 2. Backend Setup (Core AI & Streamlit Studio)

The core app handles enrollment, face detection, ArcFace embedding extraction, and anonymization.

#### On Linux / macOS:
```bash
cd core

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Launch SafeSnap Studio
streamlit run app.py
```

#### On Windows (PowerShell):
```powershell
cd core

# Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Launch SafeSnap Studio
streamlit run app.py
```

> **Note on First Run**: InsightFace will automatically download the ArcFace `buffalo_l` model (~300 MB) to `~/.insightface/models/buffalo_l/`. This only happens once.

Streamlit will launch locally at:
```
http://localhost:8501
```

---

### 3. Frontend Setup (Web Landing & Showcase Portal)

In a separate terminal window:

```bash
cd safe-snap-web

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

The web showcase will be available at:
```
http://localhost:5173
```

Clicking **"Launch Studio"** or **"Open SafeSnap App"** inside the web portal connects directly to your self-hosted instance at `http://localhost:8501`.

---

## 🌐 Production Self-Hosting Guide

For deploying SafeSnap on a dedicated Linux VPS (Ubuntu/Debian) accessible via domain or internal network.

### Option A: Running as System Services (systemd on Linux)

#### 1. Setup SafeSnap Core as a systemd service

Create a service file `/etc/systemd/system/safesnap-core.service`:

```ini
[Unit]
Description=SafeSnap Core AI Engine & Streamlit
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/safe-snap/core
Environment="PATH=/var/www/safe-snap/core/.venv/bin"
ExecStart=/var/www/safe-snap/core/.venv/bin/streamlit run app.py \
    --server.port=8501 \
    --server.address=127.0.0.1 \
    --server.headless=true \
    --server.enableCORS=false \
    --server.enableXsrfProtection=false \
    --browser.gatherUsageStats=false

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable safesnap-core
sudo systemctl start safesnap-core
sudo systemctl status safesnap-core
```

#### 2. Build the Web Frontend for Production

```bash
cd /var/www/safe-snap/safe-snap-web
npm install
npm run build
```
This generates the optimized static build in `/var/www/safe-snap/safe-snap-web/dist`.

---

### Nginx Reverse Proxy Configuration

Install Nginx:
```bash
sudo apt update && sudo apt install -y nginx
```

Create `/etc/nginx/sites-available/safesnap`:

```nginx
server {
    listen 80;
    server_name your-domain.com; # Or your server's IP address

    # 1. Frontend Web Showcase
    root /var/www/safe-snap/safe-snap-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy SafeSnap Streamlit Studio & WebSockets
    location /studio/ {
        proxy_pass http://127.0.0.1:8501/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Streamlit WebSocket stream endpoint
    location /studio/_stcore/stream {
        proxy_pass http://127.0.0.1:8501/_stcore/stream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

Enable the configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/safesnap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Secure with SSL (Let's Encrypt / Certbot):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option B: Docker Self-Hosting

If you prefer containerized deployment, you can run SafeSnap using Docker.

#### 1. Core Dockerfile (`core/Dockerfile`):
```dockerfile
FROM python:3.11-slim

# Install system dependencies for OpenCV and InsightFace
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

#### 2. Run with Docker Compose (`docker-compose.yml` in root):
```yaml
version: '3.8'

services:
  safesnap-core:
    build:
      context: ./core
      dockerfile: Dockerfile
    container_name: safesnap-core
    ports:
      - "8501:8501"
    volumes:
      - ~/.insightface:/root/.insightface
    restart: unless-stopped

  safesnap-web:
    image: node:20-alpine
    container_name: safesnap-web
    working_dir: /app
    volumes:
      - ./safe-snap-web:/app
    command: sh -c "npm install && npm run build && npx serve -s dist -l 5173"
    ports:
      - "5173:5173"
    restart: unless-stopped
    depends_on:
      - safesnap-core
```

Launch with:
```bash
docker compose up -d
```

---

## 🧠 AI Models & Storage

SafeSnap relies on two lightweight models that run locally:

| Model | Purpose | Default Location | Size | Acquisition |
|---|---|---|---|---|
| **`model.pt`** | YOLOv8-face detection | `core/model.pt` | ~6.2 MB | Pre-bundled in repo. |
| **`buffalo_l`** | ArcFace 512-D embeddings | `~/.insightface/models/buffalo_l/` | ~300 MB | Auto-downloaded on first run. |

### Air-Gapped / Offline Deployment
For offline or air-gapped environments:
1. Ensure `core/model.pt` is present.
2. Pre-download the InsightFace `buffalo_l.zip` package from the [InsightFace Model Zoo](https://github.com/deepinsight/insightface/releases).
3. Extract the contents into:
   - **Linux**: `~/.insightface/models/buffalo_l/`
   - **Windows**: `C:\Users\<YourUser>\.insightface\models\buffalo_l\`
4. SafeSnap will detect the models locally without attempting external network calls.

---

## 🛠️ Configuration & Tuning

Configuration is centralized in [`core/src/config.py`](core/src/config.py). You can adjust defaults to tailor performance for your camera setup:

```python
# Confidence cutoff for face detection (0.0 to 1.0)
DEFAULT_DETECTION_CONFIDENCE: float = 0.45

# Cosine similarity cutoff to classify a face as OWNER (0.0 to 1.0)
# (Can also be adjusted dynamically in the Streamlit UI slider)
DEFAULT_RECOGNITION_THRESHOLD: float = 0.40

# Default anonymization strength parameters
DEFAULT_BLUR_STRENGTH: int = 51         # Gaussian blur kernel size (must be odd)
DEFAULT_PIXEL_SIZE: int = 15            # Pixel block size for pixelation
DEFAULT_MASK_COLOR: tuple = (30, 30, 30)# BGR color for solid mask

# Face crop constraints
MIN_FACE_SIZE: int = 20                 # Faces smaller than 20x20 px are ignored
MAX_OWNER_REFERENCES: int = 3           # Number of owner reference photos
```

---

## 📖 How to Use

1. **Enroll Owner**:
   - Navigate to the **Owner Enrollment** tab in Streamlit Studio.
   - Upload 1 to 3 clear, front-facing photos of yourself.
   - Click **Enroll Owner**. The model creates and normalizes your 512-D ArcFace reference vector.

2. **Process Group Photos**:
   - Switch to the **Upload Image to Process** section.
   - Upload any group picture (`.jpg`, `.png`, `.jpeg`).
   - Choose your preferred anonymization mode:
     - 🌫️ **Blur**: Soft Gaussian blur.
     - 🔲 **Pixelate**: Mosaic pixelation effect.
     - ⬛ **Mask**: Solid privacy overlay block.
   - Fine-tune the **Similarity Threshold** slider if needed (default `0.40`).
   - Click **Process Image**.

3. **Export Result**:
   - Review detection metrics and side-by-side comparison.
   - Download the anonymized photo as `safesnap_anonymized.png`.

---

## ❓ Troubleshooting & FAQ

<details>
<summary><b>1. Error: <code>libGL.so.1: cannot open shared object file</code> on Linux</b></summary>
OpenCV requires system OpenGL libraries on headless Linux. Run:
```bash
sudo apt-get install -y libgl1-mesa-glx libglib2.0-0
```
</details>

<details>
<summary><b>2. InsightFace installation fails during <code>pip install</code></b></summary>
InsightFace compiles C++ extensions. Ensure build tools are installed:
- **Ubuntu/Debian**: `sudo apt install -y build-essential python3-dev`
- **Windows**: Install the "Desktop development with C++" workload from Visual Studio Build Tools.
</details>

<details>
<summary><b>3. "Face detection model not found" error</b></summary>
Ensure `model.pt` exists inside the `core/` directory (`core/model.pt`). If missing, you can supply any YOLOv8-face compatible weights or re-download `yolov8n-face.pt` as detailed in [`core/models/README.md`](core/models/README.md).
</details>

<details>
<summary><b>4. Streamlit shows "Please wait..." or WebSocket disconnects behind Nginx</b></summary>
Verify that `proxy_set_header Upgrade $http_upgrade;` and `proxy_set_header Connection "upgrade";` are present in your Nginx configuration, and that the `_stcore/stream` endpoint is properly mapped.
</details>

<details>
<summary><b>5. Does SafeSnap send my photos anywhere?</b></summary>
**No.** All inferences (detection, embedding generation, comparison, and image manipulation) happen entirely in memory on your host machine. No telemetry or images are sent to any external server.
</details>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to self-host, customize, and extend SafeSnap for personal or commercial privacy-preserving workflows!
