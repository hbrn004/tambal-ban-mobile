#!/usr/bin/env python3
"""
Derive every TBM logo variant from the single supplied master file.

Source: public/images/logo-tbm.png  (3D TBM monogram rendered on solid black)

Outputs — all from the same master, so the identity never drifts:

  logo-tbm-transparent.png  DARK backgrounds (hero, footer).
      Un-premultiplied against black: alpha = ramp(max channel),
      rgb = v / alpha.  Compositing this over black reproduces the master
      pixel-for-pixel, so the mark looks exactly as supplied, while the flat
      black surround is genuinely transparent instead of an opaque box.

  logo-tbm-light.png        LIGHT backgrounds (white navbar, favicon).
      alpha = steeper ramp from max channel, rgb = ORIGINAL (no renormalise).
      The near-black backdrop still disappears, but the mark's own blacks are
      kept opaque, so its depth/detail survives on white instead of washing
      out to grey.

Both variants only touch pixels at or below the measured background noise
floor, so no part of the symbol itself is erased.
"""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path("public/images/logo-tbm.png")
DARK_OUT = Path("public/images/logo-tbm-transparent.png")
LIGHT_OUT = Path("public/images/logo-tbm-light.png")
ICON_OUT = Path("public/images/logo-tbm-icon.png")

# Measured background noise ceiling of the master file (median 2, p99.9 ≈ 8).
BG_FLOOR = 8
# Where the mark becomes fully opaque.
DARK_FULL = 48   # gentle: keeps the glow gradient smooth on dark backdrops
LIGHT_FULL = 34  # steeper: keeps the mark's own blacks opaque on white
TRIM_PAD = 12    # keeps the outer glow when trimming the empty margin


def ramp(maxc: np.ndarray, floor: int, full: int) -> np.ndarray:
    return np.clip((maxc - floor) / (full - floor), 0.0, 1.0)


def build(alpha: np.ndarray, rgb: np.ndarray) -> Image.Image:
    out = np.dstack([rgb, alpha * 255.0]).round().astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(img: Image.Image, pad: int = TRIM_PAD) -> tuple[Image.Image, tuple[int, int, int, int]]:
    a = np.asarray(img.getchannel("A"))
    ys, xs = np.where(a > 0)
    box = (
        max(xs.min() - pad, 0),
        max(ys.min() - pad, 0),
        min(xs.max() + pad + 1, img.width),
        min(ys.max() + pad + 1, img.height),
    )
    return img.crop(box), box


def report(label: str, img: Image.Image, path: Path) -> None:
    arr = np.asarray(img).astype(float)
    a = arr[..., 3] / 255.0
    lum = arr[..., :3] @ [0.2126, 0.7152, 0.0722]
    opaque = a > 0.5
    print(
        f"{label:9s} {img.size[0]}x{img.size[1]} "
        f"opaque={opaque.mean() * 100:5.1f}%  "
        f"dark-in-opaque={(lum[opaque] < 60).mean() * 100:5.1f}%  "
        f"{path.stat().st_size:>9,} B"
    )


def main() -> None:
    master = Image.open(SRC).convert("RGB")
    arr = np.asarray(master).astype(np.float32)
    maxc = arr.max(axis=2)

    # ---- dark-background variant (un-premultiplied) ----
    alpha = ramp(maxc, BG_FLOOR, DARK_FULL)
    safe = np.where(alpha > 0, alpha, 1.0)[..., None]
    rgb_dark = np.clip(arr / safe, 0, 255)
    rgb_dark = np.where(alpha[..., None] > 0, rgb_dark, 0.0)
    dark_img, crop = trim(build(alpha, rgb_dark))
    dark_img.save(DARK_OUT, optimize=True)

    # ---- light-background variant (colours untouched) ----
    alpha_l = ramp(maxc, BG_FLOOR, LIGHT_FULL)
    rgb_light = np.where(alpha_l[..., None] > 0, arr, 0.0)
    light_img, _ = trim(build(alpha_l, rgb_light))
    light_img.save(LIGHT_OUT, optimize=True)

    # ---- square icon (favicon) cut from the same artwork ----
    side = max(light_img.size)
    icon = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    icon.alpha_composite(
        light_img,
        ((side - light_img.width) // 2, (side - light_img.height) // 2),
    )
    icon.resize((512, 512), Image.LANCZOS).save(ICON_OUT, optimize=True)

    # ---- verification ----
    print(f"master    {master.size[0]}x{master.size[1]}  {SRC.stat().st_size:,} B")
    report("dark", dark_img, DARK_OUT)
    report("light", light_img, LIGHT_OUT)
    report("icon", Image.open(ICON_OUT).convert("RGBA"), ICON_OUT)

    # dark variant must still reproduce the master over black
    ref = master.crop(crop)
    over_black = Image.new("RGBA", dark_img.size, (0, 0, 0, 255))
    over_black.alpha_composite(dark_img)
    diff = np.abs(
        np.asarray(over_black.convert("RGB")).astype(int) - np.asarray(ref).astype(int)
    )
    print(f"dark variant over black vs master: mean {diff.mean():.2f}, max {diff.max()}")

    # light variant must keep the mark's blacks dark on white
    on_white = Image.new("RGBA", light_img.size, (255, 255, 255, 255))
    on_white.alpha_composite(light_img)
    lum_w = np.asarray(on_white.convert("RGB")).astype(float) @ [0.2126, 0.7152, 0.0722]
    lum_ref = np.asarray(master.crop((crop[0], crop[1], crop[2], crop[3]))).astype(float) @ [0.2126, 0.7152, 0.0722]
    mark = lum_ref > 40
    dark_ref = mark & (lum_ref < 60)
    print(
        f"light variant on white: mark-dark pixels stay dark "
        f"{(lum_w[dark_ref] < 80).mean() * 100:.1f}% (mean L {lum_w[dark_ref].mean():.0f})"
    )


if __name__ == "__main__":
    main()
