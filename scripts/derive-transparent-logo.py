#!/usr/bin/env python3
"""
Derive a transparent version of the TBM logo from the supplied black-background
render.

The source is a glowing 3D mark composited over pure black, so the correct
conversion is an un-premultiply against black:

    alpha = max(r,g,b) / 255        (the pixel's contribution over black)
    rgb   = original / alpha        (its hue, normalised back to full strength)

This reproduces the original appearance exactly over a black backdrop — so the
hero still looks identical — while making the flat black surround genuinely
transparent instead of an opaque rectangle.

A small floor (max channel <= FLOOR) is treated as pure black to drop
compression noise from the empty margin.
"""
from pathlib import Path

import numpy as np
from PIL import Image

FLOOR = 8
FULL = 48
SRC = Path("public/images/logo-tbm.png")
OUT = Path("public/images/logo-tbm-transparent.png")

img = Image.open(SRC).convert("RGB")
arr = np.asarray(img).astype(np.float32)

mx = arr.max(axis=2)
# Ramp from the measured background noise ceiling (FLOOR ≈ 8) up to a solid
# glow level. Because colour is re-derived as v/alpha, the appearance over a
# black backdrop is preserved exactly for *any* ramp — the ramp only controls
# how the mark composites over lighter backdrops.
alpha = np.clip((mx - FLOOR) / (FULL - FLOOR), 0.0, 1.0)

safe = np.where(alpha > 0, alpha, 1.0)[..., None]
rgb = np.clip(arr / safe, 0, 255)
rgb = np.where(alpha[..., None] > 0, rgb, 0.0)

out = np.dstack([rgb, alpha * 255.0]).round().astype(np.uint8)
rgba = Image.fromarray(out, "RGBA")

# ---- trim the now-transparent margin so the mark fills its box ----
# Only fully transparent border is removed; the artwork is untouched.
PAD = 12
alpha_img = np.asarray(rgba.getchannel("A"))
ys, xs = np.where(alpha_img > 0)
top, bottom = max(ys.min() - PAD, 0), min(ys.max() + PAD + 1, rgba.height)
left, right = max(xs.min() - PAD, 0), min(xs.max() + PAD + 1, rgba.width)
rgba = rgba.crop((left, top, right, bottom))
rgba.save(OUT, optimize=True)
print(f"trimmed to content bbox {rgba.size} (kept {PAD}px glow padding)")

# ---- verification: recompositing over black must match the source ----
ref = Image.open(SRC).convert("RGB").crop((left, top, right, bottom))
test = Image.new("RGBA", rgba.size, (0, 0, 0, 255))
test.alpha_composite(rgba)
diff = np.abs(np.asarray(test.convert("RGB")).astype(int) - np.asarray(ref).astype(int))
print(f"recomposite over black -> mean abs diff {diff.mean():.2f}, max {diff.max()}")
print(f"output: {OUT} {rgba.size} {rgba.mode}")
print(f"source bytes: {SRC.stat().st_size:,}  output bytes: {OUT.stat().st_size:,}")
