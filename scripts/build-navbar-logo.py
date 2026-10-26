#!/usr/bin/env python3
"""Build the purpose-made navbar variant of the TBM monogram.

Why this file exists
--------------------
The navbar renders the logo at ~44-52 CSS px. The general-purpose variant is
1107x1024, i.e. it gets downsampled ~20x before it is ever painted. Two things
destroy it on the way down:

  1. 19.4% of its pixels are semi-transparent feather/halo. Averaged over a 20x
     reduction those halos bleed into the solid strokes, so the black of the
     monogram lifts toward the white navbar and the red desaturates.
  2. Next.js re-encodes the result as *lossy* WebP at q=75, which adds ringing
     exactly on the high-contrast monogram edges.

This script therefore exports a dedicated asset that is already the right size,
with the feather tightened, so the browser only has to do a single clean
resample (and, paired with `unoptimized`, no lossy re-encode at all).

The pixels are resampled in *premultiplied* space. That matters: resampling
RGBA in straight-alpha space lets the fully transparent background (whose RGB
is arbitrary) bleed into the edges, which is what produces the pale fringe
around cut-out artwork.

Nothing about the design changes - same artwork, same red/black/silver, no
recolouring, no cropping into the symbol, aspect ratio preserved.

Usage: python3 scripts/build-navbar-logo.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/images/logo-tbm-light.png"
OUT = ROOT / "public/images/logo-tbm-navbar.png"

# Tallest we ever render is 52 CSS px (desktop). At DPR 3 that is 156 device
# pixels; export a little above it so high-density screens never upscale.
TARGET_H = 168

# Edge tightening applied to the alpha channel after resampling.
ALPHA_SHARPEN = 0.7


def premultiplied_resize(im: Image.Image, target_h: int) -> Image.Image:
    """High quality downscale that cannot bleed transparent RGB into edges."""
    alpha = np.array(im.getchannel("A"), dtype=np.float32) / 255.0
    rgb = np.array(im.convert("RGB"), dtype=np.float32)

    # Premultiply, resize colour and alpha independently, then divide back out.
    pm = rgb * alpha[:, :, None]
    pm_img = Image.fromarray(np.clip(pm, 0, 255).astype(np.uint8), mode="RGB")
    a_img = Image.fromarray((alpha * 255).astype(np.uint8), mode="L")

    scale = target_h / im.height
    target_w = max(1, round(im.width * scale))
    size = (target_w, target_h)

    pm_small = np.array(pm_img.resize(size, Image.LANCZOS), dtype=np.float32)
    a_small = np.array(a_img.resize(size, Image.LANCZOS), dtype=np.float32) / 255.0

    # Undo the premultiplication, guarding against division by ~0.
    safe = np.maximum(a_small, 1e-4)
    rgb_out = pm_small / safe[:, :, None]
    rgb_out = np.where(a_small[:, :, None] > 0.004, rgb_out, 0.0)

    out = np.dstack([np.clip(rgb_out, 0, 255), np.clip(a_small * 255, 0, 255)])
    return Image.fromarray(out.astype(np.uint8), mode="RGBA")


def tighten_alpha(im: Image.Image, amount: float) -> Image.Image:
    """Unsharp the alpha channel so edges read as crisp, not feathered.

    Uses an unsharp mask rather than a hard threshold: a threshold would erode
    thin silver strokes and break the monogram, whereas unsharp only increases
    contrast *at* the edge and leaves flat regions untouched.
    """
    alpha = im.getchannel("A")
    blurred = alpha.filter(ImageFilter.GaussianBlur(radius=1.6))
    a = np.array(alpha, dtype=np.float32)
    b = np.array(blurred, dtype=np.float32)
    sharpened = np.clip(a + amount * (a - b), 0, 255)
    out = im.copy()
    out.putalpha(Image.fromarray(sharpened.astype(np.uint8), mode="L"))
    return out


def stats(im: Image.Image, label: str) -> dict:
    a = np.array(im.convert("RGBA"), dtype=np.float32)
    alpha, rgb = a[:, :, 3] / 255.0, a[:, :, :3]
    mx = rgb.max(2)
    sat = np.where(mx > 0, (mx - rgb.min(2)) / np.maximum(mx, 1), 0)
    red = (rgb[:, :, 0] > 90) & (rgb[:, :, 0] > rgb[:, :, 1] * 1.5) & (rgb[:, :, 0] > rgb[:, :, 2] * 1.5)
    semi = ((alpha > 0.004) & (alpha < 0.98)).sum()
    return {
        "label": label,
        "size": f"{im.width}x{im.height}",
        "semi_alpha_pct": round(100 * semi / alpha.size, 1),
        "red_rgb": [int(v) for v in rgb[red].mean(0).round()] if red.any() else None,
        "red_sat": round(float(sat[red].mean()), 3) if red.any() else 0.0,
    }


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    before = stats(src, "source")

    # Crop to the artwork so no dead margin survives into the small render.
    bbox = src.getbbox()
    cropped = src.crop(bbox)
    if cropped.height < TARGET_H:
        raise SystemExit(f"source too small: {cropped.size}")

    small = premultiplied_resize(cropped, TARGET_H)
    small = tighten_alpha(small, ALPHA_SHARPEN)
    small.save(OUT, optimize=True)

    after = stats(small, "navbar")
    print(f"bbox        : {bbox} -> cropped {cropped.width}x{cropped.height}")
    print(f"aspect      : {small.width / small.height:.4f} (source {cropped.width / cropped.height:.4f})")
    for row in (before, after):
        print(f"{row['label']:8} {row['size']:>10}  semi-alpha {row['semi_alpha_pct']:>5}%  "
              f"red {row['red_rgb']}  sat {row['red_sat']}")
    print(f"written     : {OUT.relative_to(ROOT)} ({OUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
