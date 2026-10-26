#!/usr/bin/env python3
"""Score the navbar logo screenshots for perceived sharpness.

Two complementary metrics, both computed on the pixels a real user sees:

  edge_energy : mean |gradient| over the crop. Higher = crisper transitions.
  lap_var     : variance of the Laplacian. The classic focus/sharpness proxy.
  dark_pct    : share of clearly-dark pixels. Confirms the black strokes of the
                monogram survived instead of washing out into the background.
  red_pct     : share of the brand-red pixels. Confirms the red still reads.
  red_sat     : mean saturation of those red pixels.
  red_rgb     : mean colour of those red pixels (brand check).

Usage: python3 scripts/logo_sharpness.py <png> [<png> ...]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def laplacian_var(gray: np.ndarray) -> float:
    """Variance of the 4-neighbour Laplacian (no scipy needed)."""
    lap = (
        -4.0 * gray[1:-1, 1:-1]
        + gray[:-2, 1:-1]
        + gray[2:, 1:-1]
        + gray[1:-1, :-2]
        + gray[1:-1, 2:]
    )
    return float(lap.var())


def edge_energy(gray: np.ndarray) -> float:
    gx = np.abs(np.diff(gray, axis=1))[:-1, :]
    gy = np.abs(np.diff(gray, axis=0))[:, :-1]
    return float(np.hypot(gx, gy).mean())


def score(path: str) -> dict:
    im = Image.open(path).convert("RGB")
    a = np.array(im).astype(np.float32)
    gray = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)

    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)

    red = (r > 90) & (r > g * 1.5) & (r > b * 1.5)
    dark = mx < 90

    out = {
        "file": Path(path).name,
        "size": f"{im.size[0]}x{im.size[1]}",
        "edge_energy": round(edge_energy(gray), 2),
        "lap_var": round(laplacian_var(gray), 1),
        "dark_pct": round(100 * dark.sum() / dark.size, 1),
        "red_pct": round(100 * red.sum() / red.size, 1),
        "red_sat": round(float(sat[red].mean()), 3) if red.any() else 0.0,
        "red_rgb": [int(v) for v in a[red].mean(0).round()] if red.any() else None,
    }
    return out


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    rows = [score(p) for p in sys.argv[1:]]
    keys = list(rows[0].keys())
    print(" | ".join(f"{k:>12}" for k in keys))
    print("-" * (15 * len(keys)))
    for row in rows:
        print(" | ".join(f"{str(row[k]):>12}" for k in keys))


if __name__ == "__main__":
    main()
