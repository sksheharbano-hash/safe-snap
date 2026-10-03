"""
app.py
------
SafeSnap – Owner-Aware Privacy-Preserving Image Sharing
Streamlit UI (MODULE 5 of the SafeSnap architecture)

Run:
    streamlit run app.py

All processing is local.  Images are NOT uploaded to external services.
"""
from __future__ import annotations

import io
import os
import sys

import cv2
import numpy as np
import streamlit as st
from PIL import Image

# ---------------------------------------------------------------------------
# Ensure src/ is on the path when running from the project root
# ---------------------------------------------------------------------------
sys.path.insert(0, os.path.dirname(__file__))

from src.config import (
    DEFAULT_DETECTION_CONFIDENCE,
    DEFAULT_RECOGNITION_THRESHOLD,
    DEFAULT_BLUR_STRENGTH,
    DEFAULT_PIXEL_SIZE,
    YOLO_MODEL_PATH,
)
from src.detector import FaceDetector
from src.recognition import FaceRecognizer, OwnerRecognizer
from src.enrollment import enroll_image
from src.pipeline import process_image
from src.visualization import draw_face_results
from src.evaluation import format_timings
from src.utils import pil_to_bgr, bgr_to_rgb, image_to_bytes
from src.logger import setup_logging, get_recent_logs_as_text, clear_logs, get_logger

logger = get_logger("app")


# ===========================================================================
# Page configuration
# ===========================================================================
st.set_page_config(
    page_title="SafeSnap",
    page_icon="🔒",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------------------------
# Inject custom CSS for a polished look
# ---------------------------------------------------------------------------
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* Main background */
    .stApp {
        /* background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%); */
        /* color: #e0e0e0; */
    }

    /* Sidebar */
    [data-testid="stSidebar"] {
        /* background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%); */
        /* border-right: 1px solid #2a2a4a; */
    }

    /* Cards */
    .ss-card {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 1.5rem 2rem;
        margin-bottom: 1.5rem;
        backdrop-filter: blur(10px);
    }

    /* Section headers */
    .ss-section-title {
        font-size: 1.15rem;
        font-weight: 600;
        letter-spacing: 0.03em;
        color: #a78bfa;
        margin-bottom: 0.75rem;
        padding-bottom: 0.4rem;
        border-bottom: 1px solid rgba(167,139,250,0.25);
    }

    /* Hero title */
    .ss-hero-title {
        font-size: 2.8rem;
        font-weight: 700;
        background: linear-gradient(90deg, #a78bfa, #60a5fa, #34d399);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.25rem;
    }

    .ss-hero-sub {
        font-size: 1rem;
        color: #9ca3af;
        margin-bottom: 0.5rem;
    }

    .ss-privacy-notice {
        font-size: 0.78rem;
        color: #6b7280;
        font-style: italic;
    }

    /* Metric card */
    .ss-metric {
        background: rgba(167,139,250,0.10);
        border: 1px solid rgba(167,139,250,0.25);
        border-radius: 12px;
        padding: 0.9rem 1.2rem;
        text-align: center;
    }
    .ss-metric-label { font-size: 0.78rem; color: #9ca3af; margin-bottom: 4px; }
    .ss-metric-value { font-size: 1.6rem; font-weight: 700; color: #a78bfa; }

    /* Status pills */
    .ss-pill-success {
        display: inline-block;
        background: rgba(52,211,153,0.15);
        color: #34d399;
        border: 1px solid rgba(52,211,153,0.35);
        border-radius: 20px;
        padding: 2px 12px;
        font-size: 0.82rem;
        font-weight: 500;
    }
    .ss-pill-warning {
        display: inline-block;
        background: rgba(251,191,36,0.15);
        color: #fbbf24;
        border: 1px solid rgba(251,191,36,0.35);
        border-radius: 20px;
        padding: 2px 12px;
        font-size: 0.82rem;
        font-weight: 500;
    }

    /* Table styling */
    .ss-table th { color: #a78bfa !important; }

    /* Separator */
    hr.ss-divider {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.07);
        margin: 1.5rem 0;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


# ===========================================================================
# Session state initialisation
# ===========================================================================
def _init_session_state() -> None:
    defaults = {
        "owner_recognizer": OwnerRecognizer(),
        "enrollment_done": False,
        "face_results": [],
        "processed_image": None,
        "original_image": None,
        "timings": {},
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val


_init_session_state()


# ===========================================================================
# Cached resource loaders (model only loaded once per session)
# ===========================================================================
@st.cache_resource(show_spinner="Loading face detection model…")
def load_detector() -> FaceDetector | None:
    try:
        logger.info("Initializing FaceDetector model...")
        return FaceDetector(YOLO_MODEL_PATH)
    except FileNotFoundError as exc:
        logger.error("FaceDetector file not found: %s", exc)
        st.error(str(exc))
        return None
    except Exception as exc:
        logger.exception("Failed to load face detector: %s", exc)
        st.error(f"Failed to load face detector: {exc}")
        return None


@st.cache_resource(show_spinner="Loading face recognition model (InsightFace ArcFace)…")
def load_recognizer() -> FaceRecognizer | None:
    try:
        logger.info("Initializing FaceRecognizer model...")
        rec = FaceRecognizer()
        rec._ensure_loaded()
        return rec
    except Exception as exc:
        logger.exception("Failed to load face recognizer: %s", exc)
        st.error(f"Failed to load face recognizer: {exc}")
        return None


# ===========================================================================
# Hero header
# ===========================================================================
st.markdown('<div class="ss-hero-title">🔒 SafeSnap</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="ss-hero-sub">Owner-Aware Privacy-Preserving Image Sharing</div>',
    unsafe_allow_html=True,
)
st.markdown(
    '<div class="ss-privacy-notice">'
    "🛡️ SafeSnap processes all images locally on your device. "
    "Images are never uploaded to external AI services or cloud APIs."
    "</div>",
    unsafe_allow_html=True,
)
st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)


# ===========================================================================
# Sidebar controls
# ===========================================================================
with st.sidebar:
    st.markdown("### ⚙️ Settings")
    st.markdown("---")

    # --- Recognition threshold ---
    st.markdown("**Recognition Threshold**")
    threshold = st.slider(
        "Cosine similarity cutoff",
        min_value=0.10,
        max_value=0.90,
        value=DEFAULT_RECOGNITION_THRESHOLD,
        step=0.01,
        help=(
            "Faces with similarity ≥ threshold → OWNER.\n"
            "This is a configurable parameter, not a universal constant.\n"
            "Adjust based on your images and lighting conditions."
        ),
    )

    # --- Detection confidence ---
    st.markdown("**Detection Confidence**")
    det_conf = st.slider(
        "Min face detection confidence",
        min_value=0.10,
        max_value=0.95,
        value=DEFAULT_DETECTION_CONFIDENCE,
        step=0.01,
    )

    st.markdown("---")

    # --- Anonymization method ---
    st.markdown("**Anonymization Method**")
    anon_method = st.radio(
        "Method",
        options=["blur", "pixelate", "mask"],
        format_func=lambda x: {"blur": "🌫️ Blur", "pixelate": "🔲 Pixelate", "mask": "⬛ Mask"}[x],
        label_visibility="collapsed",
    )

    # --- Method-specific settings ---
    anon_settings: dict = {}
    if anon_method == "blur":
        blur_val = st.slider("Blur Strength", 11, 101, DEFAULT_BLUR_STRENGTH, step=2)
        anon_settings["blur_strength"] = blur_val
    elif anon_method == "pixelate":
        ps_val = st.slider("Pixel Block Size", 5, 40, DEFAULT_PIXEL_SIZE)
        anon_settings["pixel_size"] = ps_val
    # mask needs no extra settings

    st.markdown("---")

    # --- Enrollment status indicator ---
    st.markdown("**Enrollment Status**")
    owner_rec: OwnerRecognizer = st.session_state["owner_recognizer"]
    if st.session_state["enrollment_done"]:
        st.markdown(
            f'<span class="ss-pill-success">✅ Enrolled ({owner_rec.num_references} ref)</span>',
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            '<span class="ss-pill-warning">⚠️ Not Enrolled</span>',
            unsafe_allow_html=True,
        )

    st.markdown("---")

    if st.button("🗑️ Reset Enrollment", use_container_width=True):
        st.session_state["owner_recognizer"] = OwnerRecognizer()
        st.session_state["enrollment_done"] = False
        st.success("Enrollment cleared.")


# ===========================================================================
# Load models
# ===========================================================================
detector = load_detector()
recognizer = load_recognizer()

if detector is None or recognizer is None:
    st.error(
        "⚠️ Could not load required models. "
        "Please check that **model.pt** exists in the project root and "
        "that InsightFace + ONNX Runtime are installed.\n\n"
        "See `models/README.md` for setup instructions."
    )
    st.stop()


# ===========================================================================
# SECTION 1: Owner Enrollment
# ===========================================================================
st.markdown('<div class="ss-section-title">👤 Owner Enrollment</div>', unsafe_allow_html=True)

with st.container():
    st.markdown(
        "_Upload 1–3 clear, single-person reference photos of the owner.  "
        "More references improve recognition accuracy under different lighting / poses._"
    )

    ref_cols = st.columns(3)
    ref_files = []
    for i, col in enumerate(ref_cols, start=1):
        with col:
            f = st.file_uploader(
                f"Reference Image {i}{'  (optional)' if i > 1 else ''}",
                type=["jpg", "jpeg", "png", "webp"],
                key=f"ref_{i}",
            )
            ref_files.append(f)

    enroll_btn = st.button("🔐 Enroll Owner", type="primary", use_container_width=True)

    if enroll_btn:
        uploaded_refs = [f for f in ref_files if f is not None]
        if not uploaded_refs:
            st.warning("Please upload at least one reference image before enrolling.")
        else:
            # Reset previous enrollment
            st.session_state["owner_recognizer"] = OwnerRecognizer()
            st.session_state["enrollment_done"] = False
            owner_rec = st.session_state["owner_recognizer"]

            logger.info("Starting owner enrollment with %d reference image(s)...", len(uploaded_refs))
            success_count = 0
            with st.spinner("Enrolling owner…"):
                for idx, ref_file in enumerate(uploaded_refs, start=1):
                    file_name = getattr(ref_file, "name", f"ref_{idx}")
                    logger.info("Processing reference image #%d: '%s'", idx, file_name)
                    try:
                        pil_img = Image.open(ref_file)
                        bgr_img = pil_to_bgr(pil_img)
                    except Exception as exc:
                        logger.exception("Reference #%d ('%s') could not be opened: %s", idx, file_name, exc)
                        st.error(f"❌ Reference {idx}: Could not open image. Please try a different file.")
                        continue

                    result = enroll_image(
                        bgr_img, detector, recognizer, owner_rec,
                        confidence_threshold=det_conf,
                    )
                    if result.success:
                        st.success(f"Reference {idx}: {result.message}")
                        success_count += 1
                    else:
                        st.error(f"Reference {idx}: {result.message}")

            if success_count > 0:
                st.session_state["enrollment_done"] = True
                st.info(
                    f"✅ Owner enrolled with {success_count} reference image(s). "
                    "You can now process a group photo."
                )
            else:
                st.error("Enrollment failed for all uploaded images. Please try different photos.")

st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)


# ===========================================================================
# SECTION 2: Upload Target Image
# ===========================================================================
st.markdown('<div class="ss-section-title">📸 Upload Image to Process</div>', unsafe_allow_html=True)

uploaded_image = st.file_uploader(
    "Upload a group/target image (JPG, JPEG, PNG)",
    type=["jpg", "jpeg", "png", "webp"],
    key="target_image",
)

if uploaded_image is not None:
    try:
        pil_target = Image.open(uploaded_image).convert("RGB")
        bgr_target = pil_to_bgr(pil_target)
        st.session_state["original_image"] = bgr_target
    except Exception as exc:
        st.error(f"❌ Could not open image: {exc}")
        st.stop()

    # Show original image preview
    col_orig, col_info = st.columns([2, 1])
    with col_orig:
        st.image(pil_target, caption="Original Image", use_container_width=True)
    with col_info:
        h, w = bgr_target.shape[:2]
        st.markdown(
            f"""
            <div class="ss-card">
            <div style="color:#9ca3af; font-size:0.82rem;">Image Info</div>
            <div style="margin-top:8px;">
                <b>Size:</b> {w} × {h} px<br>
                <b>Mode:</b> RGB<br>
                <b>Enrolled:</b> {'Yes' if st.session_state["enrollment_done"] else 'No'}
            </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    process_btn = st.button("⚡ Process Image", type="primary", use_container_width=True)

    if process_btn:
        if not st.session_state["enrollment_done"]:
            st.warning(
                "⚠️ No owner enrolled.  Processing will anonymize **all** detected faces."
            )

        logger.info(
            "Processing target image '%s' (method='%s', threshold=%.2f, conf=%.2f)...",
            getattr(uploaded_image, "name", "target_image"),
            anon_method,
            threshold,
            det_conf,
        )
        with st.spinner("Processing image…"):
            try:
                processed, face_results, timings = process_image(
                    bgr_target,
                    detector=detector,
                    recognizer=recognizer,
                    owner_recognizer=st.session_state["owner_recognizer"],
                    threshold=threshold,
                    anonymization_method=anon_method,
                    anonymization_settings=anon_settings,
                    detection_confidence=det_conf,
                )
                st.session_state["processed_image"] = processed
                st.session_state["face_results"] = face_results
                st.session_state["timings"] = timings
            except Exception as exc:
                logger.exception("Processing failed with unhandled exception: %s", exc)
                st.error(f"❌ Processing failed: {exc}")
                st.stop()

st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)


# ===========================================================================
# SECTION 3: Detection & Recognition Results
# ===========================================================================
face_results: list[dict] = st.session_state.get("face_results", [])
processed_image: np.ndarray | None = st.session_state.get("processed_image")
timings: dict = st.session_state.get("timings", {})

if processed_image is not None:
    st.markdown('<div class="ss-section-title">📊 Detection & Recognition Results</div>', unsafe_allow_html=True)

    # Metrics row
    total_faces = len(face_results)
    owner_count = sum(1 for f in face_results if f["is_owner"])
    non_owner_count = total_faces - owner_count

    if total_faces == 0:
        st.info("ℹ️ No faces detected in the uploaded image.")
    else:
        m1, m2, m3 = st.columns(3)
        with m1:
            st.markdown(
                f'<div class="ss-metric">'
                f'<div class="ss-metric-label">Total Faces</div>'
                f'<div class="ss-metric-value">{total_faces}</div>'
                f"</div>",
                unsafe_allow_html=True,
            )
        with m2:
            st.markdown(
                f'<div class="ss-metric">'
                f'<div class="ss-metric-label">Owner Faces</div>'
                f'<div class="ss-metric-value" style="color:#34d399">{owner_count}</div>'
                f"</div>",
                unsafe_allow_html=True,
            )
        with m3:
            st.markdown(
                f'<div class="ss-metric">'
                f'<div class="ss-metric-label">Non-Owner Faces</div>'
                f'<div class="ss-metric-value" style="color:#f87171">{non_owner_count}</div>'
                f"</div>",
                unsafe_allow_html=True,
            )

        st.markdown("<br>", unsafe_allow_html=True)

        # Results table
        table_rows = []
        for f in face_results:
            label_colored = (
                "🟢 OWNER" if f["is_owner"] else "🔴 NON-OWNER"
            )
            table_rows.append(
                {
                    "Face": f"#{f['face_id']}",
                    "Detection Confidence": f"{f['detection_confidence']:.4f}",
                    "Similarity": f"{f['similarity']:.4f}",
                    "Classification": label_colored,
                    "Bounding Box": str(f["box"]),
                }
            )

        import pandas as pd
        df = pd.DataFrame(table_rows)
        st.dataframe(df, use_container_width=True, hide_index=True)

    st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)

    # ===========================================================================
    # SECTION 4: Side-by-side Image Display
    # ===========================================================================
    st.markdown('<div class="ss-section-title">🖼️ Original vs Processed</div>', unsafe_allow_html=True)

    original_bgr: np.ndarray | None = st.session_state.get("original_image")

    col_left, col_right = st.columns(2)

    with col_left:
        st.markdown("**Original Image**")
        if original_bgr is not None:
            # Draw annotated boxes on original for context
            annotated_orig = draw_face_results(original_bgr, face_results)
            st.image(bgr_to_rgb(annotated_orig), use_container_width=True)
        else:
            st.info("Original image not available.")

    with col_right:
        st.markdown("**Processed Image (Anonymized)**")
        # Draw boxes on processed to show labels
        annotated_proc = draw_face_results(processed_image, face_results)
        st.image(bgr_to_rgb(annotated_proc), use_container_width=True)

    st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)

    # ===========================================================================
    # SECTION 5: Download
    # ===========================================================================
    st.markdown('<div class="ss-section-title">⬇️ Download Processed Image</div>', unsafe_allow_html=True)

    dl_col1, dl_col2 = st.columns([1, 2])
    with dl_col1:
        processed_bytes = image_to_bytes(processed_image, fmt="PNG")
        st.download_button(
            label="💾 Download safesnap_anonymized.png",
            data=processed_bytes,
            file_name="safesnap_anonymized.png",
            mime="image/png",
            use_container_width=True,
        )
    with dl_col2:
        # Also offer JPEG (smaller file size)
        processed_bytes_jpg = image_to_bytes(processed_image, fmt="JPEG")
        st.download_button(
            label="💾 Download safesnap_anonymized.jpg",
            data=processed_bytes_jpg,
            file_name="safesnap_anonymized.jpg",
            mime="image/jpeg",
            use_container_width=True,
        )

    # ===========================================================================
    # SECTION 6: Performance Metrics
    # ===========================================================================
    if timings:
        st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)
        st.markdown('<div class="ss-section-title">⏱️ Processing Performance</div>', unsafe_allow_html=True)

        t1, t2, t3, t4 = st.columns(4)
        metric_pairs = [
            (t1, "Detection", "detection_ms"),
            (t2, "Recognition", "recognition_ms"),
            (t3, "Anonymization", "anonymization_ms"),
            (t4, "Total", "total_ms"),
        ]
        for col, label, key in metric_pairs:
            with col:
                val = timings.get(key, 0)
                st.markdown(
                    f'<div class="ss-metric">'
                    f'<div class="ss-metric-label">{label}</div>'
                    f'<div class="ss-metric-value" style="font-size:1.2rem">{val:.1f} ms</div>'
                    f"</div>",
                    unsafe_allow_html=True,
                )



# ===========================================================================
# SECTION 7: Execution & Pipeline Trace Logs
# ===========================================================================
st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)
st.markdown('<div class="ss-section-title">📋 Execution & Pipeline Trace Logs</div>', unsafe_allow_html=True)

with st.expander("🔍 View Live Stage-by-Stage Logs", expanded=True if processed_image is not None else False):
    st.markdown(
        "_Real-time trace showing inputs, outputs, bounding boxes, similarities, and timings for each stage._"
    )
    log_text = get_recent_logs_as_text()
    if log_text:
        st.code(log_text, language="log")
    else:
        st.info("No logs generated yet. Enroll an owner or process an image to view the pipeline trace.")

    col_clr, _ = st.columns([1, 4])
    with col_clr:
        if st.button("🗑️ Clear Logs", key="clear_logs_btn", use_container_width=True):
            clear_logs()
            st.rerun()


# ===========================================================================
# Footer
# ===========================================================================
st.markdown('<hr class="ss-divider">', unsafe_allow_html=True)
st.markdown(
    "<div style='text-align:center; color:#4b5563; font-size:0.78rem;'>"
    "SafeSnap — College Major Project Prototype &nbsp;|&nbsp; "
    "On-device processing only &nbsp;|&nbsp; "
    "Built with Python · Streamlit · InsightFace · YOLOv8"
    "</div>",
    unsafe_allow_html=True,
)