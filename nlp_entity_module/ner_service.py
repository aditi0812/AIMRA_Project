"""
ner_service.py
===============

This is the main entry point for Team Member 2's module.

It combines:
  - scispaCy model output (DISEASE -> diagnoses, CHEMICAL -> medications)
  - rule-based extraction (dosages, tests) from entity_processor.py

...into the final schema required by the AIMRA blueprint:

    {
        "diagnoses": [...],
        "medications": [...],
        "dosages": [...],
        "tests": [...]
    }

Usage (what Member 1 / Member 3 will actually do):

    from nlp_entity_module import analyze_medical_text
    result = analyze_medical_text(raw_text)

The spaCy model is loaded ONCE (lazily, on first use) and reused for
every call, which is important for performance in a real service.
"""

from __future__ import annotations

from typing import Dict, List, Optional

from .entity_processor import (
    Entity,
    deduplicate_texts,
    extract_dosages,
    extract_tests,
    resolve_overlaps,
)

# Name of the scispaCy biomedical model required by the project blueprint.
MODEL_NAME = "en_ner_bc5cdr_md"

# scispaCy's en_ner_bc5cdr_md model produces exactly two entity labels:
#   DISEASE  -> maps to our "diagnoses" category
#   CHEMICAL -> maps to our "medications" category
_MODEL_LABEL_MAP = {
    "DISEASE": "DIAGNOSIS",
    "CHEMICAL": "MEDICATION",
}

# The final output always has these four keys, even if a category is empty.
_OUTPUT_KEYS = ["diagnoses", "medications", "dosages", "tests"]

_LABEL_TO_OUTPUT_KEY = {
    "DIAGNOSIS": "diagnoses",
    "MEDICATION": "medications",
    "DOSAGE": "dosages",
    "TEST": "tests",
}


def _empty_result() -> Dict[str, List[str]]:
    """Return the required schema with all categories empty."""
    return {key: [] for key in _OUTPUT_KEYS}


class ClinicalNERService:
    """
    Class-based interface around the NER pipeline.

    Loading a spaCy model can take a couple of seconds, so this class
    loads it once in __init__ (or on first use, if lazy=True) and
    reuses it for every call to analyze().

    Example:
        service = ClinicalNERService()
        result = service.analyze(raw_text)
    """

    def __init__(self, model_name: str = MODEL_NAME, lazy: bool = False):
        self.model_name = model_name
        self._nlp = None  # loaded lazily unless lazy=False
        if not lazy:
            self._load_model()

    def _load_model(self):
        """
        Load the scispaCy model. Kept in its own method so errors are
        easy to catch and explain to the user (see README / common
        errors section).
        """
        if self._nlp is not None:
            return self._nlp

        try:
            import spacy
        except ImportError as exc:
            raise ImportError(
                "spaCy is not installed. Run: pip install spacy"
            ) from exc

        try:
            self._nlp = spacy.load(self.model_name)
        except OSError as exc:
            raise OSError(
                f"Could not load the '{self.model_name}' model.\n"
                "Make sure you installed it with the direct .whl/.tar.gz "
                "URL from the scispaCy releases page (see requirements.txt "
                "/ README for the exact command). A plain "
                "'pip install en_ner_bc5cdr_md' will NOT work."
            ) from exc

        return self._nlp

    def _run_model(self, text: str) -> List[Entity]:
        """Run the scispaCy model and convert its output to our Entity type."""
        nlp = self._load_model()
        doc = nlp(text)

        entities: List[Entity] = []
        for ent in doc.ents:
            # Defensive: skip any label the model produces that we don't
            # recognize, instead of crashing (requirement #14).
            mapped_label = _MODEL_LABEL_MAP.get(ent.label_)
            if mapped_label is None:
                continue
            entities.append(
                Entity(
                    text=ent.text,
                    start=ent.start_char,
                    end=ent.end_char,
                    label=mapped_label,
                    source="model",
                )
            )
        return entities

    def analyze(self, raw_text: Optional[str]) -> Dict[str, List[str]]:
        """
        Main analysis function. Accepts raw OCR/medical text and returns
        the final JSON-serializable dictionary.

        Safe against:
          - None input
          - empty / whitespace-only input
          - messy OCR text (extra spaces, line breaks, stray symbols)
        """
        # Requirement #12: handle empty text safely.
        if raw_text is None or not raw_text.strip():
            return _empty_result()

        # Requirement #13: normalize messy OCR formatting.
        # We collapse runs of whitespace (spaces, tabs, newlines) into a
        # single space. We do NOT alter character content otherwise,
        # because that would shift character offsets away from the
        # original text in ways that are hard to reason about.
        normalized_text = _normalize_whitespace(raw_text)

        # 1. Model-based entities (diagnoses, medications).
        try:
            model_entities = self._run_model(normalized_text)
        except (ImportError, OSError):
            # Re-raise setup errors -- these mean the environment isn't
            # configured correctly and the caller needs to know.
            raise
        except Exception:
            # Requirement #14: never crash the whole service just because
            # the model had trouble with one document. Degrade gracefully.
            model_entities = []

        # 2. Rule-based entities (dosages, tests).
        rule_entities = extract_dosages(normalized_text) + extract_tests(normalized_text)

        # 3. Combine everything and resolve overlaps across ALL categories.
        #    (e.g. this prevents a test name from partially overlapping
        #    with a chemical name, etc.)
        all_entities = resolve_overlaps(model_entities + rule_entities)

        # 4. Group into the four output categories.
        grouped: Dict[str, List[str]] = _empty_result()
        for ent in all_entities:
            key = _LABEL_TO_OUTPUT_KEY.get(ent.label)
            if key is None:
                continue  # unknown label -> skip safely, don't crash
            grouped[key].append(ent.text)

        # 5. Deduplicate within each category (case-insensitive).
        for key in _OUTPUT_KEYS:
            grouped[key] = deduplicate_texts(grouped[key])

        return grouped


def _normalize_whitespace(text: str) -> str:
    """Collapse any run of whitespace characters into a single space."""
    return " ".join(text.split())


# ---------------------------------------------------------------------------
# Module-level convenience function (the function Member 1/3 will import)
# ---------------------------------------------------------------------------
#
# A single shared service instance is created lazily on first call, so
# that simply importing this file does not immediately try to load the
# (slow, and possibly-not-yet-installed) spaCy model.

_default_service: Optional[ClinicalNERService] = None


def analyze_medical_text(raw_text: Optional[str]) -> Dict[str, List[str]]:
    """
    Simple function-based entry point.

    Example:
        from nlp_entity_module import analyze_medical_text
        result = analyze_medical_text(raw_text)
        # result == {"diagnoses": [...], "medications": [...],
        #            "dosages": [...], "tests": [...]}
    """
    global _default_service
    if _default_service is None:
        _default_service = ClinicalNERService()
    return _default_service.analyze(raw_text)
