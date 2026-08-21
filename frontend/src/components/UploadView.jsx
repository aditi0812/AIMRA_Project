import { useState, useCallback } from "react";
import JargonToggleDemo from "./JargonToggleDemo";

export default function UploadView({ onFileReady }) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setFileName(file.name);
        onFileReady?.(file.name);
      }
    },
    [onFileReady]
  );

  const handlePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileReady?.(file.name);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <section className="max-w-2xl mb-14">
        <p className="font-mono text-xs uppercase tracking-wider text-accent-dark mb-4">
          OCR &middot; NLP &middot; Entity Extraction &middot; Summarization
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink mb-6">
          Medical reports,
          <br />
          in <span className="italic text-accent-dark">plain language.</span>
        </h1>
        <p className="font-body text-lg text-slate leading-relaxed">
          Upload a scanned report, PDF, or plain text file. We pull out the
          diagnoses, medications, and test results, and rewrite the whole
          thing in language you can actually act on.
        </p>
      </section>

      <section className="mb-14">
        <JargonToggleDemo />
      </section>

      <section>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl2 border-2 border-dashed px-8 py-14 text-center transition-colors ${
            dragOver
              ? "border-accent bg-accent-light/10"
              : "border-slate-light/40 bg-surface"
          }`}
        >
          <p className="font-display text-2xl text-ink mb-2">
            {fileName ? fileName : "Drop a report here"}
          </p>
          <p className="font-body text-sm text-slate mb-6">
            Supports PDF, JPG, PNG, and TXT
          </p>

          <label className="inline-flex items-center gap-2 bg-ink text-white font-body text-sm px-6 py-3 rounded-full cursor-pointer hover:bg-ink/90 transition-colors">
            Choose a file
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              className="hidden"
              onChange={handlePick}
            />
          </label>

          {fileName && (
            <p className="font-mono text-xs text-positive mt-6">
              Ready to analyze &mdash; this demo shows sample results below.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
