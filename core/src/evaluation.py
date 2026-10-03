"""
src/evaluation.py
-----------------
MODULE 6: Evaluation & Metrics

Measures processing performance (timing, CPU, RAM).
Only reports values from actual runs — no fabricated numbers.
"""
from __future__ import annotations

import time
from typing import Callable, Any

try:
    import psutil
    _PSUTIL_AVAILABLE = True
except ImportError:
    _PSUTIL_AVAILABLE = False


def measure_processing(
    func: Callable,
    *args,
    **kwargs,
) -> tuple[Any, dict]:
    """
    Run *func* with the given args/kwargs and measure:
      - Wall-clock time (ms)
      - CPU usage before/after
      - RAM usage before/after

    Returns
    -------
    (result, metrics_dict)
    """
    metrics: dict[str, Any] = {}

    if _PSUTIL_AVAILABLE:
        proc = psutil.Process()
        cpu_before = proc.cpu_percent(interval=None)
        mem_before = proc.memory_info().rss / (1024 * 1024)  # MB
    else:
        cpu_before = None
        mem_before = None

    t_start = time.perf_counter()
    result = func(*args, **kwargs)
    elapsed_ms = (time.perf_counter() - t_start) * 1000

    if _PSUTIL_AVAILABLE:
        cpu_after = proc.cpu_percent(interval=None)
        mem_after = proc.memory_info().rss / (1024 * 1024)
        metrics["cpu_percent"] = round(cpu_after, 1)
        metrics["ram_before_mb"] = round(mem_before, 1)
        metrics["ram_after_mb"] = round(mem_after, 1)
        metrics["ram_delta_mb"] = round(mem_after - mem_before, 1)

    metrics["wall_time_ms"] = round(elapsed_ms, 1)
    return result, metrics


def format_timings(timings: dict) -> str:
    """
    Format the timing dict from pipeline.process_image into a human-readable string.
    """
    lines = [
        f"🔍 Detection:      {timings.get('detection_ms', 0):.1f} ms",
        f"🧠 Recognition:    {timings.get('recognition_ms', 0):.1f} ms",
        f"🎭 Anonymization:  {timings.get('anonymization_ms', 0):.1f} ms",
        f"⏱️ Total:          {timings.get('total_ms', 0):.1f} ms",
    ]
    return "\n".join(lines)
