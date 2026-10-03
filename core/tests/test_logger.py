"""
tests/test_logger.py
--------------------
Unit tests for the SafeSnap logging module and in-memory trace capture.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import numpy as np
import pytest
from unittest.mock import MagicMock

from src.logger import (
    get_logger,
    get_recent_logs,
    get_recent_logs_as_text,
    clear_logs,
    setup_logging,
)
from src.pipeline import process_image
from src.recognition import OwnerRecognizer


def test_logger_namespacing():
    logger = get_logger("test_module")
    assert logger.name == "safesnap.test_module"


def test_buffer_captures_logs():
    clear_logs()
    logger = get_logger("buffer_test")
    test_msg = "Unique test message for buffer capture 12345"
    logger.info(test_msg)

    logs = get_recent_logs()
    assert any(test_msg in line for line in logs)

    text = get_recent_logs_as_text()
    assert test_msg in text


def test_clear_logs():
    logger = get_logger("clear_test")
    logger.info("Message to be cleared")
    assert len(get_recent_logs()) > 0

    clear_logs()
    assert len(get_recent_logs()) == 0


def test_pipeline_emits_stage_logs():
    clear_logs()
    detector = MagicMock()
    detector.detect_faces.return_value = [{"box": [10, 10, 50, 50], "confidence": 0.95}]

    recognizer = MagicMock()
    recognizer.get_embedding.return_value = np.ones(512, dtype=np.float32)

    owner_rec = OwnerRecognizer()
    test_img = np.zeros((100, 100, 3), dtype=np.uint8)

    process_image(test_img, detector, recognizer, owner_rec)

    log_text = get_recent_logs_as_text()
    assert "[Pipeline Start]" in log_text
    assert "[Stage 1/4: Face Detection]" in log_text
    assert "[Stage 2/4: Embedding" in log_text
    assert "[Stage 4/4: Anonymization]" in log_text
    assert "[Pipeline Finished]" in log_text
