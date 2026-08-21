"""
bootstrap_entities_scispacy.py

Runs scispaCy over mtsamples transcriptions to auto-generate entity labels
(diseases, drugs/chemicals). This gives Esha a starting point for the
Entity Extraction module WITHOUT waiting for manual labeling.

Requires (install on your own machine, not restricted sandboxes):
    pip install spacy scispacy
    pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.4/en_ner_bc5cdr_md-0.5.4.tar.gz

Usage:
    python bootstrap_entities_scispacy.py
"""

import spacy
import pandas as pd
import json

INPUT_CSV = "mtsamples.csv"
OUTPUT_JSON = "bootstrapped_entities.json"
N_SAMPLES = 300   # start with a manageable batch; scale up once it's working

# Load the pretrained biomedical NER pipeline (diseases + chemicals/drugs)
nlp = spacy.load("en_ner_bc5cdr_md")

df = pd.read_csv(INPUT_CSV)
df = df.dropna(subset=["transcription"])
df = df[df["transcription"].str.len() > 200]
sample_df = df.sample(n=N_SAMPLES, random_state=42).reset_index(drop=True)

results = []
for i, row in sample_df.iterrows():
    text = row["transcription"]
    doc = nlp(text)

    entities = [
        {
            "text": ent.text,
            "label": ent.label_,          # DISEASE or CHEMICAL
            "start_char": ent.start_char,
            "end_char": ent.end_char,
        }
        for ent in doc.ents
    ]

    results.append({
        "report_id": int(i),
        "medical_specialty": row["medical_specialty"],
        "text": text,
        "entities": entities,
    })
    print(f"Report {i}: found {len(entities)} entities")

with open(OUTPUT_JSON, "w") as f:
    json.dump(results, f, indent=2)

print(f"\nDone. Bootstrapped labels for {len(results)} reports saved to '{OUTPUT_JSON}'.")
print("Next: load a subset of these into an annotation tool (e.g. Label Studio) for manual correction.")
