# AIMRA Frontend

The web interface for the AI Medical Report Analyzer — upload a medical
report, see it broken down into plain language.

## What's here

Three screens, built with React + Vite + Tailwind CSS:

- **Upload** — landing page with a live demo (toggle a real clinical
  sentence between jargon and plain language) plus a drag-and-drop upload
  area.
- **Results** — the original report with extracted entities highlighted
  (diagnosis / medication / dosage / test), a plain-language summary panel,
  and the entities listed as tags underneath.
- **History** — a table of previously analyzed reports.

Right now all three screens run on **mock data** (see `src/data/mockData.js`)
so the UI is fully demoable without the backend being wired up yet. The
`onFileReady` callback in `UploadView` is where the real upload → OCR → NLP
→ Classification → Summary pipeline will eventually hook in via a `fetch()`
call to the FastAPI backend — the components themselves won't need to
change, just what feeds them.

## Running it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
```

Output goes to `dist/`.

## Project structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── UploadView.jsx
│   │   ├── JargonToggleDemo.jsx   <- signature interactive demo
│   │   ├── ResultsView.jsx
│   │   ├── EntityChip.jsx
│   │   └── HistoryView.jsx
│   ├── data/
│   │   └── mockData.js            <- swap this for real API responses later
│   ├── App.jsx                    <- view routing (upload/results/history)
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── package.json
```

## Design notes

Color and type tokens live in `tailwind.config.js` under `theme.extend` —
change them there rather than hardcoding colors in components. The four
entity-highlight colors (`entity.disease`, `entity.medication`,
`entity.dosage`, `entity.test`) are used consistently between the
highlighted report text and the entity chips, so if you add a new entity
type, update both `tailwind.config.js` and `entityTypeLabels` in
`mockData.js`.
