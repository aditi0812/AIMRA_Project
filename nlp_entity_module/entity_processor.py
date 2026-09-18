"""
entity_processor.py
====================

This file contains all the "logic" pieces that are NOT the scispaCy
model itself:

1. A simple internal Entity structure.
2. Rule-based (regex) extraction for DOSAGE and TEST entities, since
   the en_ner_bc5cdr_md model only recognizes DISEASE and CHEMICAL
   entities -- it has no concept of "dosage" or "medical test".
3. Overlap resolution (so we never return two entities that share
   characters).
4. Case-insensitive duplicate removal (so "Metformin" / "metformin" /
   "METFORMIN" collapse into a single entry).

Keeping all of this separate from ner_service.py makes it easy to
unit test the rules on their own, without loading the (slow) spaCy
model at all.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List


# ---------------------------------------------------------------------------
# 1. Internal entity structure
# ---------------------------------------------------------------------------

@dataclass
class Entity:
    """
    Internal representation of a single detected entity.

    text  : the exact substring as it appeared in the original text
    start : character offset where the entity begins (inclusive)
    end   : character offset where the entity ends (exclusive)
    label : one of "DIAGNOSIS", "MEDICATION", "DOSAGE", "TEST"
    source: "model" (came from scispaCy) or "rule" (came from regex),
            kept only for debugging / transparency, not returned to
            the caller.
    """
    text: str
    start: int
    end: int
    label: str
    source: str = "rule"

    def __len__(self) -> int:
        return self.end - self.start


# ---------------------------------------------------------------------------
# 2. Rule-based extraction: DOSAGES
# ---------------------------------------------------------------------------
#
# We deliberately keep these patterns simple and explainable, rather than
# trying to build a fully general medical-dosage parser (out of scope for
# a final-year project). Each pattern is commented so a reviewer / examiner
# can see exactly what it matches.

_DOSAGE_PATTERNS = [
    # e.g. "500 mg", "250mg", "10 ml", "5 mL", "100 mcg", "1 g", "2 IU"
    # \b\d+(\.\d+)?   -> an integer or decimal number, e.g. 500 or 2.5
    # \s?             -> an optional single space between number and unit
    # (mg|mcg|g|ml|mL|iu|IU) -> the supported units
    r"\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|mL|IU|iu)\b",

    # e.g. "2 tablets", "1 capsule", "3 drops", "2 puffs"
    r"\b\d+\s?(?:tablets?|capsules?|drops?|puffs?|tabs?)\b",

    # e.g. "twice daily", "once daily", "three times a day", "twice a day"
    r"\b(?:once|twice|thrice|one|two|three|four)\s+(?:times\s+)?(?:a\s+day|daily|per\s+day)\b",
]

_DOSAGE_REGEX = re.compile("|".join(f"(?:{p})" for p in _DOSAGE_PATTERNS), re.IGNORECASE)


def extract_dosages(text: str) -> List[Entity]:
    """Find dosage-like substrings using the regex patterns above."""
    entities: List[Entity] = []
    for match in _DOSAGE_REGEX.finditer(text):
        entities.append(
            Entity(
                text=match.group(0),
                start=match.start(),
                end=match.end(),
                label="DOSAGE",
                source="rule",
            )
        )
    return entities


# ---------------------------------------------------------------------------
# 3. Rule-based extraction: MEDICAL TESTS
# ---------------------------------------------------------------------------
#
# This is a small, EDITABLE keyword list -- not a medically exhaustive
# ontology. Add / remove terms here as needed. Longer, more specific
# phrases are listed so they are matched preferentially over short generic
# ones (handled later during overlap resolution).

COMMON_MEDICAL_TESTS = [
    "complete blood count", "cbc",
    "hba1c", "hb a1c",
    "blood glucose", "fasting blood sugar", "random blood sugar",
    "blood test",
    "urine test", "urinalysis",
    "mri", "mri scan",
    "ct scan", "computed tomography",
    "x-ray", "xray",
    "ecg", "ekg",
    "eeg",
    "lipid profile",
    "lft", "liver function test",
    "kft", "kidney function test",
    "thyroid test", "thyroid profile",
    "t3", "t4", "tsh",
    "echocardiogram", "echo",
    "ultrasound",
    "biopsy",
]

# Sort longest-first so the regex alternation tries specific phrases
# ("liver function test") before short substrings ("t3") that might
# otherwise match a fragment of a longer, more meaningful phrase.
_TEST_TERMS_SORTED = sorted(COMMON_MEDICAL_TESTS, key=len, reverse=True)
_TEST_REGEX = re.compile(
    r"\b(?:" + "|".join(re.escape(term) for term in _TEST_TERMS_SORTED) + r")\b",
    re.IGNORECASE,
)


def extract_tests(text: str) -> List[Entity]:
    """Find medical-test mentions using the configurable keyword list above."""
    entities: List[Entity] = []
    for match in _TEST_REGEX.finditer(text):
        entities.append(
            Entity(
                text=match.group(0),
                start=match.start(),
                end=match.end(),
                label="TEST",
                source="rule",
            )
        )
    return entities


# ---------------------------------------------------------------------------
# 4. Overlap resolution
# ---------------------------------------------------------------------------

def _spans_overlap(a: Entity, b: Entity) -> bool:
    """Two entities overlap if their [start, end) ranges intersect at all."""
    return a.start < b.end and b.start < a.end


def resolve_overlaps(entities: List[Entity]) -> List[Entity]:
    """
    Given a list of entities (possibly from different sources: model
    output + rule-based output), remove overlapping spans.

    Strategy (kept simple on purpose):
      1. Sort entities by length (longest first). Longer spans are
         usually more specific / informative ("diabetes mellitus" is
         more useful than just "diabetes").
      2. Walk the sorted list and greedily keep an entity only if it
         does not overlap with any entity we've already accepted.
      3. Because we process longest-first, the "more specific" entity
         always wins over a shorter one it overlaps with.

    This guarantees the final list has NO overlapping character spans.
    """
    # Sort by span length, descending. Ties broken by start position so
    # the result is deterministic (required by the project spec).
    candidates = sorted(entities, key=lambda e: (-len(e), e.start))

    accepted: List[Entity] = []
    for candidate in candidates:
        if not any(_spans_overlap(candidate, kept) for kept in accepted):
            accepted.append(candidate)

    # Return in reading order (by start position) for a natural output.
    accepted.sort(key=lambda e: e.start)
    return accepted


# ---------------------------------------------------------------------------
# 5. Duplicate removal (case-insensitive, preserves first readable form)
# ---------------------------------------------------------------------------

def deduplicate_texts(texts: List[str]) -> List[str]:
    """
    Remove case-insensitive duplicates while preserving the first
    occurrence's original casing/spelling.

    Example: ["Metformin", "metformin", "METFORMIN"] -> ["Metformin"]
    """
    seen = set()
    result: List[str] = []
    for t in texts:
        cleaned = t.strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key not in seen:
            seen.add(key)
            result.append(cleaned)
    return result
