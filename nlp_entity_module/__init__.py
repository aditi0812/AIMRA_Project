"""
nlp_entity_module
==================

Team Member 2's module for AIMRA (AI Medical Report Analyzer).

Responsibility: Clinical Named Entity Recognition (NER).

Public API:
    analyze_medical_text(raw_text: str) -> dict
    ClinicalNERService (class-based interface)

This module is intentionally self-contained. It does NOT depend on
OCR, the database, JWT auth, the frontend, or any other team member's
code. It only needs a raw text string as input.
"""

from .ner_service import analyze_medical_text, ClinicalNERService

__all__ = ["analyze_medical_text", "ClinicalNERService"]
