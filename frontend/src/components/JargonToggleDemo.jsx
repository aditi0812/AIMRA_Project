import { useState } from "react";
import { jargonDemo } from "../data/mockData";

export default function JargonToggleDemo() {
  const [plain, setPlain] = useState(false);

  return (
    <div className="bg-surface border border-slate-light/30 rounded-xl2 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-light/20">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          {plain ? "Plain language" : "Original report"}
        </span>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="font-body text-sm text-slate">Show in plain language</span>
          <span
            role="switch"
            aria-checked={plain}
            tabIndex={0}
            onClick={() => setPlain((v) => !v)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPlain((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              plain ? "bg-accent" : "bg-slate-light/50"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                plain ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </span>
        </label>
      </div>

      <div className="px-6 py-8 min-h-[120px] flex items-center">
        {plain ? (
          <p className="font-display text-xl leading-relaxed text-ink">
            {jargonDemo.plain}
          </p>
        ) : (
          <p className="font-mono text-sm leading-relaxed text-slate">
            {jargonDemo.clinical}
          </p>
        )}
      </div>
    </div>
  );
}
