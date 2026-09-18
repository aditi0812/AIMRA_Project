// Location: frontend/src/components/DoctorReviewView.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DoctorReviewView({ token, reportId, onBack }) {
  const [report, setReport] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/reports/${reportId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { setReport(data); setComment(data.doctor_comment || ''); });
  }, [reportId, token]);

  const handleReviewAction = async (targetStatus) => {
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: targetStatus, doctor_comment: comment })
      });
      if (response.ok) {
        alert(`Audit status updated: ${targetStatus}`);
        onBack();
      }
    } catch {
      alert("Error committing validation matrix array update to server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!report) return <div className="text-slate p-8 text-center animate-pulse text-sm font-body">Opening operational view node...</div>;

  return (
    <div className="space-y-6 animate-fadeIn flex flex-col h-full font-body">
      <div className="flex justify-between items-center border-b border-paper pb-4">
        <button onClick={onBack} className="text-slate hover:text-ink text-xs font-bold flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Return to Queue Desk
        </button>
        <div className="flex gap-2">
          <button disabled={submitting} onClick={() => handleReviewAction('needs_correction')} className="px-4 py-2 border border-slate-light/30 hover:bg-alert-light text-alert font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors">
            <AlertTriangle size={14} /> Flag Revisions
          </button>
          <button disabled={submitting} onClick={() => handleReviewAction('approved')} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm">
            <CheckCircle size={14} /> Approve Release
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-5 rounded-xl2 border border-slate-light/10 shadow-sm flex flex-col space-y-2">
          <h4 className="text-[10px] uppercase font-bold text-slate tracking-wider">Ingested Diagnostic Artifact (OCR Text)</h4>
          <div className="flex-1 overflow-y-auto bg-paper/50 p-4 rounded-xl text-xs text-ink font-mono leading-relaxed h-48 whitespace-pre-line border border-paper">{report.raw_text}</div>
        </div>
        <div className="bg-surface p-5 rounded-xl2 border border-slate-light/10 shadow-sm flex flex-col space-y-2">
          <h4 className="text-[10px] uppercase font-bold text-slate tracking-wider">Candidate Translation Summary (Gemma Output)</h4>
          <div className="flex-1 overflow-y-auto bg-positive-light/10 p-4 rounded-xl text-xs text-ink leading-relaxed font-medium h-48 border border-positive-light">{report.ai_summary}</div>
        </div>
      </div>

      <div className="bg-surface p-5 rounded-xl2 border border-slate-light/10 shadow-sm space-y-2">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate">Clinical Notes / Supplementary Guidelines</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows="3" className="w-full bg-paper border border-slate-light/20 focus:border-accent text-ink rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Provide annotations or clinical clarifications regarding the AI-generated health summary output here..." />
      </div>
    </div>
  );
}
