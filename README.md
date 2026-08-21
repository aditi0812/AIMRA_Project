# AI Medical Report Analyzer (AIMRA)

Converts complex medical reports into clear, patient-friendly language using
OCR, NLP, and AI-generated summaries.

**Team:** Aditi Singh (G2) · Esha Patel (G17) · Priyanshu Thaore (G41) ·
Utkarsh Deshmukh (G58)
**Guide:** Prof. Reena Chauhan
**Department of Data Science, G H Raisoni College of Engineering &
Management, Nagpur**

## What this project does

Most patients can't easily read their own medical reports — dense clinical
language, abbreviations, and codes get in the way of understanding what's
actually going on with their health. AIMRA takes a report (scanned image,
PDF, or text), extracts the clinical entities that matter (diagnoses,
medications, dosages, test results), and rewrites it in plain language,
while explaining any numeric or clinical codes that would otherwise stay
confusing.

## Pipeline

```
Report Upload → Preprocessing (OCR) → NLP Analysis → Entity Extraction
              → Classification → Output Generation (plain-language summary)
```

## Repository structure

```
AIMRA-project/
├── frontend/                  React + Vite + Tailwind web interface
├── ocr_module/                OCR pipeline + synthetic scan generator
├── nlp_entity_module/         Entity extraction (scispaCy bootstrap + NER)
├── classification_module/     Report-type classifier
├── summarization_module/      Plain-language summary generation
├── backend/                   FastAPI backend (connects all modules)
├── data/                      Datasets (MTSamples, sample scans)
└── docs/                      Synopsis, seminar slides, project report drafts
```

## Current status

See `docs/` for the latest progress seminar slides, which track what's
actually been completed against our work plan. In short: literature review
done, dataset explored, OCR synthetic-scan testing pipeline built, entity
extraction bootstrapping pipeline built, and this frontend prototype
(currently running on mock data, not yet wired to a live backend).

## Getting started

Each module folder has its own setup — see `frontend/README.md` for the web
interface. Backend and model-training instructions will be added to their
respective folders as those modules come online.

## Dataset

We use the [MTSamples](https://www.mtsamples.com/) corpus — 4,999 real
transcribed medical reports across 40 specialties — as our primary source
for training and testing the NLP, entity extraction, and classification
modules. It contains no scanned images or entity-level labels natively, so:

- **OCR testing** uses a synthetic scan generator (in `ocr_module/`) that
  renders MTSamples text reports as realistic scanned images (with blur and
  skew), paired with ground-truth text.
- **Entity labels** are bootstrapped using a pretrained biomedical NER model
  (scispaCy), then manually corrected on a validation subset.
