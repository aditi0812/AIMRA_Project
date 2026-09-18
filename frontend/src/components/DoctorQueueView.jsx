// Location: frontend/src/components/DoctorQueueView.jsx
import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';

export default function DoctorQueueView({ token, onSelectReport }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/reports/doctor/queue', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { setQueue(data); setLoading(false); })
    .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-slate p-8 text-center animate-pulse text-sm font-body">Gathering physician queue logs...</div>;

  return (
    <div className="space-y-6 animate-fadeIn font-body">
      <div>
        <h2 className="text-2xl font-display font-bold text-ink">Clinical Validation Board</h2>
        <p className="text-xs text-slate mt-1">Showing isolated review rows assigned exclusively to your practitioner account key.</p>
      </div>

      <div className="bg-surface rounded-xl2 border border-slate-light/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-paper text-slate font-bold border-b border-slate-light/10 tracking-wide uppercase text-[10px]">
              <th className="p-4">Target Log Node</th>
              <th className="p-4">Classification Label</th>
              <th className="p-4">Ingestion Date</th>
              <th className="p-4 text-right">Action Pipeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper text-slate font-medium">
            {queue.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate">
                  <div className="flex flex-col items-center gap-1 justify-center py-4">
                    <ClipboardList size={20} className="text-slate-light" />
                    <span>Your clinical task board is completely clear.</span>
                  </div>
                </td>
              </tr>
            ) : (
              queue.map(row => (
                <tr key={row.id} className="hover:bg-paper/40 transition-colors">
                  <td className="p-4 font-mono text-accent font-bold">#AIMRA-{row.id}</td>
                  <td className="p-4"><span className="bg-paper border border-slate-light/10 text-ink px-2 py-0.5 rounded-md font-bold text-[10px]">{row.classification_label || "Cardiology"}</span></td>
                  <td className="p-4 text-slate font-mono">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => onSelectReport(row.id)} className="bg-accent hover:bg-accent-dark text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-colors">Evaluate Matrix</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
