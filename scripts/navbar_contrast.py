#!/usr/bin/env python3
"""Contrast report for the navbar logo against the real navbar background.

The logo carries three brand colours, so a single "contrast" number is
meaningless. This splits the logo box into its red, black and silver regions
and reports the WCAG contrast ratio of each against the navbar background
actually painted behind it (sampled from the strip corners, away from the logo).

WCAG 2.1 normal text needs 4.5:1 and large text/graphics 3:1; a logo is a
graphic, so 3:1 is the useful bar. Ratios are informational - brand marks are
exempt from WCAG - but they tell us objectively whether a region is washing out.

Usage: python3 scripts/navbar_contrast.py <strip.png> <logoW> <logoH> <logoX> <logoY>
"""
import sys

import numpy as np
from PIL import Image


def rel_luminance(rgb: np.ndarray) -> np.ndarray:
    """WCAG relative luminance for an (N,3) or (...,3) sRGB array."""
    c = rgb / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return c @ np.array([0.2126, 0.7152, 0.0722])


def contrast(l1: np.ndarray, l2: np.ndarray) -> np.ndarray:
    hi, lo = np.maximum(l1, l2), np.minimum(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def main() -> None:
    strip_path, w, h, x, y = sys.argv[1], *map(float, sys.argv[2:6])
    w, h, x, y = int(w), int(h), int(x), int(y)

    strip = np.array(Image.open(strip_path).convert("RGB")).astype(np.float32)
    scale = strip.shape[1] / (strip.shape[1])  # strip is full width, px == css*? handled by caller

    # Background: median of a patch just left of the logo (inside the navbar,
    # past the container padding but before the artwork starts).
    pad_l = max(0, x - 6)
    bg_patch = strip[max(0, y):y + h, max(0, pad_l - 4):pad_l + 1]
    if bg_patch.size == 0:
        bg_patch = strip[:, :5]
    bg = np.median(bg_patch.reshape(-1, 3), axis=0)
    bg_L = float(rel_luminance(bg))

    crop = strip[y:y + h, x:x + w]
    if crop.size == 0:
        raise SystemExit(f"logo box {w}x{h} at ({x},{y}) is outside {strip.shape}")

    px = crop.reshape(-1, 3)
    r, g, b = px[:, 0], px[:, 1], px[:, 2]
    mx = px.max(1)

    # A pixel belongs to the logo when it differs from the background at all.
    dist = np.linalg.norm(px - bg, axis=1)
    logo = dist > 25

    red = logo & (r > 90) & (r > g * 1.5) & (r > b * 1.5)
    black = logo & (mx < 90)
    silver = logo & (mx >= 90) & ~red

    print(f"navbar background      : rgb({bg[0]:.0f},{bg[1]:.0f},{bg[2]:.0f})  L={bg_L:.4f}")
    print(f"logo coverage          : {100 * logo.sum() / len(px):.1f}% of the logo box")
    for name, mask in (("RED", red), ("BLACK", black), ("SILVER", silver)):
        if not mask.any():
            print(f"  {name:<7} none")
            continue
        mean_rgb = px[mask].mean(0)
        L = float(rel_luminance(mean_rgb))
        print(
            f"  {name:<7} {100 * mask.sum() / len(px):>5.1f}%  "
            f"rgb({mean_rgb[0]:.0f},{mean_rgb[1]:.0f},{mean_rgb[2]:.0f})  "
            f"contrast vs bg {float(contrast(np.array(L), np.array(bg_L))):.2f}:1"
        )


if __name__ == "__main__":
    main()
