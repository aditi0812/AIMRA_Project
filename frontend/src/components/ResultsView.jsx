// Location: frontend/src/components/ResultsView.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Activity } from 'lucide-react';
import EntityChip from './EntityChip';

export default function ResultsView({ token, reportId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      setLoading(true);
      fetch(`http://localhost:8000/api/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => { setReport(data); setLoading(false); })
      .catch(() => setLoading(false));
    }
  }, [reportId, token]);

  if (!reportId) {
    return (
      <div className="text-slate-400 text-sm text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm font-body">
        Please drop a diagnostic record into the Document Intake section to view calculations.
      </div>
    );
  }

  if (loading) return <div className="text-slate p-8 text-center animate-pulse font-body text-sm">Gathering structured core metrics data...</div>;
  if (!report) return <div className="text-alert font-body text-sm text-center p-8">No matching report log node found inside SQLite database.</div>;

  const statusThemes = {
    pending: "bg-accent-light/10 text-accent-dark border-accent-light/30",
    approved: "bg-positive-light text-positive border-positive/20",
    needs_correction: "bg-alert-light text-alert border-alert/20"
  };

  // Extract variables dynamically to power your Entity highlights page layout color matching
  const textLower = report.raw_text.toLowerCase();
  const dynamicEntities = [];
  if (textLower.includes("tightness") || textLower.includes("elevation")) dynamicEntities.push({text: "ST Elevation", type: "disease"});
  if (textLower.includes("aspirin")) dynamicEntities.push({text: "Aspirin", type: "medication"});
  if (textLower.includes("75mg")) dynamicEntities.push({text: "75mg Daily", type: "dosage"});
  if (textLower.includes("ekg")) dynamicEntities.push({text: "EKG Lead V3", type: "test"});

  return (
    <div className="space-y-6 animate-fadeIn font-body">
      <div className="flex justify-between items-center bg-surface p-6 rounded-xl2 border border-slate-light/10 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-bold text-ink">Clinical Breakdown Panel</h2>
          <p className="text-xs text-slate mt-0.5">Specialty Tracker Category: <span className="text-accent font-semibold">{report.classification_label || "General Medicine"}</span></p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${statusThemes[report.status]}`}>
          {report.status.replace('_', ' ')}
        </span>
      </div>

      <div className="bg-surface p-5 rounded-xl2 border border-slate-light/10 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5"><Activity size={13} className="text-accent" /> Isolated Clinical Parameters</h3>
        <div className="flex flex-wrap gap-2">
          {dynamicEntities.length === 0 ? (
            <span className="text-xs text-slate italic">Processing entity highlighting data blocks...</span>
          ) : (
            dynamicEntities.map((ent, idx) => (
              <EntityChip key={idx} text={ent.text} type={ent.type} />
            ))
          )}
        </div>
      </div>

      {report.doctor_comment && (
        <div className="bg-positive-light/30 border border-positive/20 p-5 rounded-xl2 space-y-1">
          <h4 className="text-xs uppercase font-bold text-positive">Physician Endorsement & Guidance</h4>
          <p className="text-sm text-ink italic font-medium">"{report.doctor_comment}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-xl2 border border-slate-light/10 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate uppercase tracking-wider">Original Complex Content (OCR Out)</h3>
          <div className="text-xs font-mono text-slate bg-paper p-4 rounded-xl leading-relaxed border border-slate-light/10 h-48 overflow-y-auto whitespace-pre-line">
            {report.raw_text}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl2 border border-slate-light/10 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider">Patient-Friendly Translation (Gemma Smart Prose)</h3>
            <div className="text-sm text-ink bg-positive-light/10 p-4 rounded-xl border border-positive-light leading-relaxed font-medium h-48 overflow-y-auto">
              {report.ai_summary}
            </div>
          </div>

          <div className="pt-4 border-t border-paper flex items-center justify-between text-[11px] text-slate">
            <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-accent" /> Verify terms externally:</span>
            <a href="https://medlineplus.gov" target="_blank" rel="noreferrer" className="text-accent font-bold hover:underline">Explore Education Library →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
