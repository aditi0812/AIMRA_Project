# nlp_entity_module — AIMRA Team Member 2 (Clinical NER)

## 1. Architecture, in simple words

This module takes in a raw string of medical report text and returns a
dictionary with four buckets: `diagnoses`, `medications`, `dosages`,
`tests`.

It gets those four buckets from **two different sources**, combined:

1. **The scispaCy model (`en_ner_bc5cdr_md`)** — a machine-learning
   model trained on biomedical text. It can only recognize two kinds
   of things: **diseases** and **chemicals/drugs**. So:
   - model `DISEASE` → our `diagnoses`
   - model `CHEMICAL` → our `medications`

2. **Simple rule-based pattern matching (regex)** — written by us,
   because the model has *no idea* what a "dosage" or a "medical
   test" is. So:
   - regex for things like `500 mg`, `2 tablets`, `twice daily` → `dosages`
   - regex/keyword list for things like `CBC`, `MRI`, `HbA1c` → `tests`

After collecting entities from both sources, we do two clean-up steps:

- **Overlap resolution**: if two detected entities share any
  characters (e.g. the model tags "diabetes" but our logic somehow
  also tagged "diabetes mellitus"), we keep the longer/more specific
  one and discard the shorter one that overlaps it.
- **Duplicate removal**: "Metformin", "metformin", "METFORMIN" all
  collapse into a single entry, keeping the first spelling seen.

The end result is a clean, predictable, JSON-serializable dictionary —
nothing more, nothing less.

## 2. Folder structure

```
nlp_entity_module/
├── __init__.py          # exposes analyze_medical_text() and ClinicalNERService
├── ner_service.py        # main service: loads model, combines model + rules
├── entity_processor.py   # regex rules, overlap resolution, dedup logic
├── requirements.txt
├── test_ner.py            # 5 sample reports + edge case tests
└── README.md               # this file
```

## 3. Installation (Windows)

Open Command Prompt / PowerShell inside your project folder.

```bat
:: 1. (Recommended) create and activate a virtual environment
python -m venv venv
venv\Scripts\activate

:: 2. Install spaCy and scispaCy
pip install "spacy>=3.4.0,<3.8.0"
pip install scispacy>=0.5.3

:: 3. Install the biomedical NER model (en_ner_bc5cdr_md)
:: This is NOT on PyPI under a normal name — install it directly
:: from the scispaCy model release URL:
pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.3/en_ner_bc5cdr_md-0.5.3.tar.gz
```

**Compatibility notes:**
- scispaCy `0.5.3` is built and tested against spaCy `3.4`–`3.7`. Using
  spaCy 3.8+ can cause the model to fail to load — stick to the pinned
  range in `requirements.txt`.
- Use Python 3.9–3.11. scispaCy's official wheels do not reliably
  support very new Python versions (3.12+) yet — check the scispaCy
  GitHub releases page if you hit install errors on a newer Python.
- If `pip install scispacy` fails with a build error on Windows, make
  sure you have the "Microsoft C++ Build Tools" installed (some of
  scispaCy's dependencies need to compile).

To verify installation:

```bat
python -c "import spacy; nlp = spacy.load('en_ner_bc5cdr_md'); print('OK')"
```

## 4. How to use it

```python
from nlp_entity_module import analyze_medical_text

raw_text = "Patient has diabetes mellitus. Prescribed Metformin 500 mg twice daily."
result = analyze_medical_text(raw_text)
print(result)
# {
#   "diagnoses": ["diabetes mellitus"],
#   "medications": ["Metformin"],
#   "dosages": ["500 mg", "twice daily"],
#   "tests": []
# }
```

Or, if you prefer the class-based interface (e.g. to load the model
once and reuse it inside a FastAPI app):

```python
from nlp_entity_module import ClinicalNERService

service = ClinicalNERService()  # loads the model once
result = service.analyze(raw_text)
```

## 5. How Member 1 passes text into this module

Member 1's OCR pipeline (OpenCV + Tesseract) produces a plain Python
string. They simply call this module's function directly with that
string — no files, no database, no network calls needed:

```python
# inside Member 1's / Member 4's integration code
from nlp_entity_module import analyze_medical_text

ocr_text = run_tesseract_ocr(preprocessed_image)  # Member 1's function
entities = analyze_medical_text(ocr_text)
```

This module doesn't care whether the text came from a perfect PDF or
messy scanned OCR output — it normalizes whitespace internally and
won't crash on empty or malformed text.

## 6. How this module's output is passed to Member 3

Member 3's specialty classifier and Gemma summarizer can take the
`entities` dictionary above (or the original raw text, or both,
depending on how Member 3 designs their prompt) as input:

```python
entities = analyze_medical_text(ocr_text)

# Example of how Member 3 might use it:
specialty = classify_specialty(ocr_text)          # Member 3's function
summary = generate_patient_summary(ocr_text, entities, specialty)  # Member 3's function
```

Because `entities` is a plain dict of lists of strings, it is directly
JSON-serializable and can also be stored in the database by Member 4,
or sent as-is inside an API response.

## 7. Common errors and how to fix them

| Error | Likely cause | Fix |
|---|---|---|
| `OSError: [E050] Can't find model 'en_ner_bc5cdr_md'` | Model not installed, or installed into a different virtual environment | Re-run the `pip install` command from step 3 above, inside the *same* venv you're running Python from |
| `ImportError: No module named 'spacy'` | spaCy not installed / wrong environment activated | `pip install spacy`, make sure venv is activated |
| Build errors while installing `scispacy` on Windows | Missing C++ build tools | Install "Microsoft C++ Build Tools", then retry `pip install scispacy` |
| Model loads but everything returns empty lists | Text has no recognizable disease/chemical terms, or is not in English | Test with the sample reports in `test_ner.py` first to confirm the environment is working |
| `analyze_medical_text` is very slow the first time it's called | This is normal — the spaCy model is being loaded into memory | Use `ClinicalNERService()` once at app startup, not per-request, so the model loads only once |

## 8. Git commands for this module

```bash
# 1. Sync with the latest main branch
git checkout main
git pull origin main

# 2. Create your feature branch
git checkout -b feature/member2-clinical-ner

# 3. Stage and commit your work
git add nlp_entity_module/
git commit -m "feat: implement clinical NER module (scispaCy + rule-based dosage/test extraction)"

# 4. Push and open a Pull Request
git push origin feature/member2-clinical-ner
# Then open a PR on GitHub and have a teammate pull + run test_ner.py locally before merging.
```

## 9. Notes / limitations (be upfront about these in your viva)

- The medical test keyword list in `entity_processor.py` is a small,
  editable list for demonstration purposes — it is **not** a medically
  exhaustive ontology of all lab tests.
- The dosage regex covers common formats (mg, mcg, g, ml, tablets,
  frequency phrases) but won't catch every possible way a dosage could
  be written in free text.
- This module makes no diagnostic claims of its own — it only extracts
  and organizes terms that already appear in the input text.
