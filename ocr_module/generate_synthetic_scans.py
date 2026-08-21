"""
generate_synthetic_scans.py

Converts text reports from mtsamples.csv into synthetic "scanned" images,
so you have (image -> ground_truth_text) pairs to test/benchmark your OCR module.

Usage:
    python generate_synthetic_scans.py

Output:
    synthetic_scans/img_0001.png, img_0002.png, ...
    synthetic_scans/ground_truth.csv   (maps image filename -> original text)
"""

import pandas as pd
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import textwrap
import random
import os

# ---- Settings ----
INPUT_CSV = "mtsamples.csv"
OUTPUT_DIR = "synthetic_scans"
N_SAMPLES = 50          # how many reports to convert (start small, scale up later)
IMG_WIDTH = 1000
FONT_SIZE = 18
ADD_NOISE = True        # set True to simulate real scan imperfections

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---- Load data ----
df = pd.read_csv(INPUT_CSV)
df = df.dropna(subset=["transcription"])
df = df[df["transcription"].str.len() > 200]  # drop junk/too-short rows
sample_df = df.sample(n=N_SAMPLES, random_state=42).reset_index(drop=True)

# ---- Font (falls back to default if no TTF found) ----
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", FONT_SIZE)
except Exception:
    font = ImageFont.load_default()

def text_to_image(text, out_path, add_noise=True):
    wrapped = textwrap.wrap(text, width=90)
    line_height = FONT_SIZE + 6
    img_height = line_height * (len(wrapped) + 4) + 80

    img = Image.new("RGB", (IMG_WIDTH, img_height), color="white")
    draw = ImageDraw.Draw(img)

    y = 40
    draw.text((40, y), "MEDICAL TRANSCRIPTION REPORT", font=font, fill="black")
    y += line_height * 2
    for line in wrapped:
        draw.text((40, y), line, font=font, fill="black")
        y += line_height

    if add_noise:
        # slight blur to mimic scan softness
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.8)))
        # slight rotation to mimic skewed scans
        angle = random.uniform(-1.5, 1.5)
        img = img.rotate(angle, expand=True, fillcolor="white")

    img.save(out_path)

records = []
for i, row in sample_df.iterrows():
    fname = f"img_{i:04d}.png"
    out_path = os.path.join(OUTPUT_DIR, fname)
    text_to_image(row["transcription"], out_path, add_noise=ADD_NOISE)
    records.append({
        "filename": fname,
        "medical_specialty": row["medical_specialty"],
        "ground_truth_text": row["transcription"]
    })
    print(f"Generated {fname}")

pd.DataFrame(records).to_csv(os.path.join(OUTPUT_DIR, "ground_truth.csv"), index=False)
print(f"\nDone. {len(records)} synthetic scans saved to '{OUTPUT_DIR}/'")
print("Use ground_truth.csv to compute OCR accuracy (compare OCR output vs ground_truth_text).")
