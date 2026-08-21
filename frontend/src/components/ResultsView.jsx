import { currentResult } from "../data/mockData";
import EntityChip from "./EntityChip";

const highlightBg = {
  disease: "bg-entity-disease/10 border-b-2 border-entity-disease",
  medication: "bg-entity-medication/10 border-b-2 border-entity-medication",
  dosage: "bg-entity-dosage/10 border-b-2 border-entity-dosage",
  test: "bg-entity-test/10 border-b-2 border-entity-test",
};

export default function ResultsView() {
  const r = currentResult;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-slate mb-2">
            {r.uploadedAt}
          </p>
          <h1 className="font-display text-3xl text-ink">{r.fileName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-ink text-white font-body text-sm px-4 py-2 rounded-full">
            {r.specialty}
          </span>
          <span className="bg-positive-light text-positive font-body text-sm px-4 py-2 rounded-full">
            {r.confidence}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-surface border border-slate-light/30 rounded-xl2 p-7">
          <h2 className="font-mono text-xs uppercase tracking-wider text-slate mb-4">
            Original report
          </h2>
          <p className="font-body text-[15px] leading-relaxed text-ink">
            {r.originalSegments.map((seg, i) =>
              seg.type ? (
                <span key={i} className={`${highlightBg[seg.type]} px-0.5 rounded-sm`}>
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </p>
        </div>

        <div className="bg-ink rounded-xl2 p-7">
          <h2 className="font-mono text-xs uppercase tracking-wider text-accent-light mb-4">
            In plain language
          </h2>
          <div className="space-y-4">
            {r.summary.map((para, i) => (
              <p key={i} className="font-display text-lg leading-relaxed text-white">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-mono text-xs uppercase tracking-wider text-slate mb-4">
          Extracted entities
        </h2>
        <div className="flex flex-wrap gap-2">
          {r.entities.map((e, i) => (
            <EntityChip key={i} text={e.text} type={e.type} />
          ))}
        </div>
      </div>
    </div>
  );
}
