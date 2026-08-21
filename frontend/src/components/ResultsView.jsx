import React from 'react';
import { BookOpen } from 'lucide-react';

export default function ResultsView({ data }) {
  if (!data) return <div className="text-slate-400 text-sm text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">Please drop a diagnostic record into the Document Intake section to view calculations.</div>;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Breakdown Panel</h2>
        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-100">{data.category}</span>
      </div>

      {/* Color-Coded Entity Chips Highlight Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Isolated Clinical Parameters</h3>
        <div className="flex flex-wrap gap-2">
          {data.entities.map((item, idx) => (
            <span key={idx} className="inline-flex flex-col px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
              <span className="font-bold text-slate-800">{item.word}</span>
              <span className="text-[10px] text-teal-600 font-medium mt-0.5">{item.class}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Hand Card Context */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Complex Content</h3>
          <p className="text-xs font-mono text-slate-600 bg-slate-50/50 p-4 rounded-xl leading-relaxed border border-slate-100">{data.jargonText}</p>
        </div>

        {/* Right Hand Simplified Card Content */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider">Patient-Friendly Translation</h3>
            <p className="text-xs text-slate-700 bg-teal-50/20 p-4 rounded-xl border border-teal-50 leading-relaxed font-medium">{data.simplifiedText}</p>
          </div>

          {/* 🔗 Verified Clinical Information Links (Addresses Task #7) */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-teal-500" /> Verify terms externally:</span>
            <a 
              href={`https://medlineplus.gov{encodeURIComponent(data.entities[0].word)}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-teal-600 font-bold hover:underline"
            >
              Explore Education Library →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
