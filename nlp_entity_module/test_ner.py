"""
test_ner.py
============

Simple, dependency-free test script (not pytest, to keep things
beginner-friendly) that runs analyze_medical_text() against 5
realistic-but-fictional sample medical reports and prints the
detected entities + final JSON output for each.

Run with:
    python test_ner.py

NOTE: This requires the scispaCy model (en_ner_bc5cdr_md) to be
installed. See README / installation instructions. All sample text
below is fictional/synthetic and contains no real patient data.
"""

import json

from nlp_entity_module import analyze_medical_text


# ---------------------------------------------------------------------------
# 5 sample reports (all fictional, no hard-coded real patient information)
# ---------------------------------------------------------------------------

SAMPLE_REPORTS = {
    "1. Diabetes": """
        Patient presents with a history of diabetes mellitus.
        Prescribed Metformin 500 mg twice daily.
        HbA1c test is recommended to monitor blood glucose control.
    """,

    "2. Hypertension": """
        Patient has been diagnosed with hypertension.
        Started on Amlodipine 5 mg once daily.
        Blood pressure to be re-checked in two weeks. ECG advised.
    """,

    "3. Respiratory condition": """
        Patient reports symptoms consistent with bronchial asthma.
        Prescribed Salbutamol inhaler, 2 puffs as needed.
        Chest X-ray recommended to rule out infection.
    """,

    "4. Multiple medications and dosages": """
        Patient with type 2 diabetes mellitus and hypertension.
        Medications: Metformin 500 mg twice daily, Amlodipine 5 mg
        once daily, and Aspirin 75 mg once daily.
        Lipid profile and KFT advised at next visit.
    """,

    "5. Tests without obvious diagnosis": """
        Routine health checkup requested by patient.
        Recommended tests: CBC, blood glucose, lipid profile,
        thyroid test (TSH, T3, T4), and an ultrasound of the abdomen.
    """,
}


def run_all_tests() -> None:
    for title, report_text in SAMPLE_REPORTS.items():
        print("=" * 70)
        print(title)
        print("-" * 70)
        print("INPUT TEXT:")
        print(report_text.strip())
        print()

        result = analyze_medical_text(report_text)

        print("FINAL JSON OUTPUT:")
        print(json.dumps(result, indent=2))
        print()


def test_empty_text() -> None:
    """Requirement #12: empty text must not crash and must return the schema."""
    print("=" * 70)
    print("Edge case: empty string")
    print("-" * 70)
    result = analyze_medical_text("")
    print(json.dumps(result, indent=2))
    assert result == {"diagnoses": [], "medications": [], "dosages": [], "tests": []}
    print("PASSED: empty text handled safely.\n")

    print("Edge case: None input")
    result_none = analyze_medical_text(None)
    print(json.dumps(result_none, indent=2))
    assert result_none == {"diagnoses": [], "medications": [], "dosages": [], "tests": []}
    print("PASSED: None input handled safely.\n")


def test_duplicate_removal() -> None:
    """Requirement: case-insensitive duplicates should collapse to one entry."""
    print("=" * 70)
    print("Edge case: duplicate medication mentions with different casing")
    print("-" * 70)
    text = "Patient prescribed Metformin. Continue metformin. Do not stop METFORMIN."
    result = analyze_medical_text(text)
    print(json.dumps(result, indent=2))
    assert len(result["medications"]) <= 1, "Duplicates were not collapsed correctly."
    print("PASSED: duplicates collapsed.\n")


def test_messy_ocr_text() -> None:
    """Requirement #13: extra spaces / line breaks / symbols should not break extraction."""
    print("=" * 70)
    print("Edge case: messy OCR-style text")
    print("-" * 70)
    text = "Patient   has\n\ndiabetes    mellitus.***\n Metformin   500   mg   twice   daily!!"
    result = analyze_medical_text(text)
    print(json.dumps(result, indent=2))
    print("PASSED: messy text processed without crashing.\n")


if __name__ == "__main__":
    run_all_tests()
    test_empty_text()
    test_duplicate_removal()
    test_messy_ocr_text()
    print("All tests completed.")
