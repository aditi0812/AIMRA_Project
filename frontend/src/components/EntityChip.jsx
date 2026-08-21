import { entityTypeLabels } from "../data/mockData";

const dotColor = {
  disease: "bg-entity-disease",
  medication: "bg-entity-medication",
  dosage: "bg-entity-dosage",
  test: "bg-entity-test",
};

export default function EntityChip({ text, type }) {
  return (
    <span className="inline-flex items-center gap-2 bg-paper border border-slate-light/30 rounded-full px-3 py-1.5 text-sm font-body text-ink">
      <span className={`w-2 h-2 rounded-full ${dotColor[type]}`} />
      {text}
      <span className="font-mono text-[11px] text-slate uppercase tracking-wide">
        {entityTypeLabels[type]}
      </span>
    </span>
  );
}
