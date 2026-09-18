import React from 'react';
import { entityTypeLabels } from "../data/mockData";

// FIXED TASK: Dynamic color configuration mapping exact requested hex codes
const entityThemeMapping = {
  disease: { dotColor: "#D97706", label: "Diagnosis" },
  test: { dotColor: "#0D9488", label: "Test / Procedure" },
  medication: { dotColor: "#2563EB", label: "Medication" },
  dosage: { dotColor: "#7C3AED", label: "Dosage" },
};

export default function EntityChip({ text, type }) {
  // Graceful fallback to disease if an unknown type gets passed
  const currentTheme = entityThemeMapping[type] || entityThemeMapping["disease"];

  return (
    <span className="inline-flex items-center gap-2 bg-white border border-slate-200/50 rounded-full px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm">
      {/* Dynamic left color dot utilizing custom hex specifications safely */}
      <span 
        className="w-2 h-2 rounded-full shrink-0" 
        style={{ backgroundColor: currentTheme.dotColor }} 
      />
      
      <span className="font-semibold text-slate-700">{text}</span>
      
      {/* Static text breakdown fallback caption block */}
      <span className="font-mono text-[11px] uppercase tracking-wider font-bold opacity-70" style={{ color: currentTheme.dotColor }}>
        {entityTypeLabels[type] || currentTheme.label}
      </span>
    </span>
  );
}
