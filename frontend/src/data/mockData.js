// Mock data standing in for FastAPI responses until the backend pipeline
// (OCR -> NLP -> Entity Extraction -> Classification -> Summary) is wired up.
// Shape mirrors what the real API is expected to return, so swapping in
// real fetch() calls later should not require changing the components.

export const jargonDemo = {
  clinical:
    "Pt is a 50-year-old female p/w CP and dyspnea on exertion. Hx of NSTEMI s/p PCI in 11/07. EKG: NSR, incomplete RBBB.",
  plain:
    "The patient is a 50-year-old woman who came in with chest pain and shortness of breath during activity. She had a heart attack in November 2007, treated with a stent. Her heart's electrical rhythm is normal, with a minor, usually harmless, conduction delay.",
};

export const currentResult = {
  fileName: "cardiology_report_08.pdf",
  uploadedAt: "21 Aug 2026, 9:14 AM",
  specialty: "Cardiovascular / Pulmonary",
  confidence: "High confidence",
  originalSegments: [
    { text: "REASON FOR CONSULTATION: ", type: null },
    { text: "Lightheadedness, dizziness, and palpitation", type: "disease" },
    { text: ".\n\nHISTORY OF PRESENT ILLNESS: The patient is a 50-year-old female who came to the Emergency Room. She relates the heart was racing. Her ", type: null },
    { text: "EKG", type: "test" },
    { text: " revealed normal sinus rhythm. No evidence of ", type: null },
    { text: "arrhythmia", type: "disease" },
    { text: ".\n\nMEDICATIONS: On pain medications, ", type: null },
    { text: "ibuprofen", type: "medication" },
    { text: ", ", type: null },
    { text: "400mg as needed", type: "dosage" },
    { text: ".\n\nPAST MEDICAL HISTORY: History of chest pain in the past. Had workup done including ", type: null },
    { text: "nuclear myocardial perfusion scan", type: "test" },
    { text: ", which was reportedly abnormal. Subsequently, the patient underwent ", type: null },
    { text: "cardiac catheterization", type: "test" },
    { text: " in 11/07, which was also normal.", type: null },
  ],
  entities: [
    { text: "Lightheadedness, dizziness, palpitation", type: "disease" },
    { text: "Arrhythmia (ruled out)", type: "disease" },
    { text: "Ibuprofen", type: "medication" },
    { text: "400mg as needed", type: "dosage" },
    { text: "EKG", type: "test" },
    { text: "Nuclear myocardial perfusion scan", type: "test" },
    { text: "Cardiac catheterization", type: "test" },
  ],
  summary: [
    "You came in feeling dizzy and lightheaded, with your heart racing. The good news: your heart's electrical activity (EKG) came back normal, and there's no sign of an irregular heartbeat.",
    "You're currently taking ibuprofen as needed for pain. Your history shows a heart-imaging scan that once looked abnormal, but a follow-up procedure to check your heart's blood vessels came back normal.",
    "Nothing here points to an active heart problem right now, but keep your follow-up appointments so your care team can keep watching these results over time.",
  ],
};

export const historyItems = [
  { id: 1, fileName: "cardiology_report_08.pdf", specialty: "Cardiovascular / Pulmonary", date: "21 Aug 2026", status: "Reviewed" },
  { id: 2, fileName: "annual_bloodwork_scan.jpg", specialty: "Hematology", date: "14 Aug 2026", status: "Reviewed" },
  { id: 3, fileName: "orthopedic_followup.pdf", specialty: "Orthopedic", date: "02 Aug 2026", status: "Reviewed" },
  { id: 4, fileName: "radiology_chest_xray.pdf", specialty: "Radiology", date: "27 Jul 2026", status: "Reviewed" },
  { id: 5, fileName: "gi_endoscopy_notes.pdf", specialty: "Gastroenterology", date: "19 Jul 2026", status: "Reviewed" },
];

export const entityTypeLabels = {
  disease: "Diagnosis",
  medication: "Medication",
  dosage: "Dosage",
  test: "Test / Procedure",
};
