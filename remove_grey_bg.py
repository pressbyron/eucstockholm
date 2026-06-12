#!/usr/bin/env python3
"""
Remove the dark grey background from the EUC Stockholm poster.
Saves a PNG with transparency so printing on grey paper skips the background.

Usage: python3 remove_grey_bg.py input.jpg output.png
"""
import sys
from PIL import Image
import numpy as np

def remove_grey_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.int32)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # The background is a dark grey: roughly RGB(55, 55, 55)
    # A pixel is "grey background" if R≈G≈B (neutral) and all channels are dark
    target_r, target_g, target_b = 55, 55, 55

    dr = np.abs(r - target_r)
    dg = np.abs(g - target_g)
    db = np.abs(b - target_b)

    # Also catch slightly lighter grey areas near the background
    channel_spread = np.abs(r - g) + np.abs(g - b) + np.abs(r - b)

    mask = (dr < tolerance) & (dg < tolerance) & (db < tolerance) & (channel_spread < 40)

    data[:,:,3] = np.where(mask, 0, a).astype(np.uint8)

    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    result.save(output_path, "PNG")
    print(f"Saved: {output_path}")
    print(f"Transparent pixels: {mask.sum()} / {mask.size} ({100*mask.sum()/mask.size:.1f}%)")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 remove_grey_bg.py input.jpg output.png")
        sys.exit(1)
    remove_grey_background(sys.argv[1], sys.argv[2])
