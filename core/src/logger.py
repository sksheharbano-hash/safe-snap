"""
src/logger.py
-------------
Logging configuration and in-memory trace buffer for SafeSnap.
Provides clear, structured console logging and an in-memory buffer
for inspecting pipeline execution traces in the terminal, Streamlit UI, or tests.
"""
from __future__ import annotations

import collections
import logging
import sys
from typing import Deque

LOG_FORMAT = "%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

_LOG_BUFFER: Deque[str] = collections.deque(maxlen=1000)


class LogBufferHandler(logging.Handler):
    """Logging handler that retains recent formatted log records in memory."""

    def __init__(self, buffer: Deque[str]) -> None:
        super().__init__()
        self.buffer = buffer

    def emit(self, record: logging.LogRecord) -> None:
        try:
            msg = self.format(record)
            self.buffer.append(msg)
        except Exception:
            self.handleError(record)


def setup_logging(
    level: int = logging.INFO,
    stream: bool = True,
    buffer: bool = True,
) -> logging.Logger:
    """
    Configure and return the root 'safesnap' logger.
    Avoids adding duplicate handlers on multiple calls.
    """
    logger = logging.getLogger("safesnap")
    logger.setLevel(level)

    formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)

    # Check if handlers already exist to prevent duplicate logging
    has_stream = any(
        isinstance(h, logging.StreamHandler) and not isinstance(h, LogBufferHandler)
        for h in logger.handlers
    )
    has_buffer = any(isinstance(h, LogBufferHandler) for h in logger.handlers)

    if stream and not has_stream:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        console_handler.setLevel(level)
        logger.addHandler(console_handler)

    if buffer and not has_buffer:
        buffer_handler = LogBufferHandler(_LOG_BUFFER)
        buffer_handler.setFormatter(formatter)
        buffer_handler.setLevel(level)
        logger.addHandler(buffer_handler)

    return logger


def get_logger(name: str = "safesnap") -> logging.Logger:
    """
    Get a namespaced logger under 'safesnap'.
    Maps names like 'src.pipeline' or '__main__' to 'safesnap.<module>'.
    """
    if name.startswith("src."):
        clean_name = "safesnap." + name[4:]
    elif name == "safesnap" or name.startswith("safesnap."):
        clean_name = name
    else:
        clean_name = f"safesnap.{name}"

    # Ensure root safesnap logger is configured
    setup_logging()
    return logging.getLogger(clean_name)


def get_recent_logs(n: int | None = None) -> list[str]:
    """Return the most recent log lines from the in-memory buffer."""
    if n is None:
        return list(_LOG_BUFFER)
    return list(_LOG_BUFFER)[-n:]


def get_recent_logs_as_text(n: int | None = None) -> str:
    """Return the most recent log lines joined as a single string."""
    return "\n".join(get_recent_logs(n))


def clear_logs() -> None:
    """Clear all stored logs in the buffer."""
    _LOG_BUFFER.clear()


# Initialize by default on import
setup_logging()
