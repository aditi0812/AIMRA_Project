// Location: frontend/src/components/HistoryView.jsx
import React, { useState, useEffect } from 'react';
import { Folder, Eye } from 'lucide-react';

export default function HistoryView({ token, profileFilter, onSelectReport }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // This function fetches the freshest data straight from your SQLite database
  const fetchFreshLogs = () => {
    if (profileFilter) {
      setLoading(true);
      fetch(`http://localhost:8000/api/reports/history?profile_id=${profileFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => { 
        setLogs(data); 
        setLoading(false); 
      })
      .catch((err) => {
        console.error("Error pulling database sync logs:", err);
        setLoading(false);
      });
    }
  };

  // CRITICAL LIVE SYNC HOOK: Clears old caches and queries the FastAPI server
  useEffect(() => {
    fetchFreshLogs();
  }, [profileFilter, token]);

  if (loading) return <div className="text-slate p-8 text-center animate-pulse font-body text-sm">Querying structural history index files...</div>;

  const badgeThemes = {
    pending: "bg-accent-light/10 text-accent-dark border-accent-light/30",
    approved: "bg-positive-light text-positive border-positive/10",
    needs_correction: "bg-alert-light text-alert border-alert/10"
  };

  return (
    <div className="space-y-6 animate-fadeIn font-body">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-ink tracking-tight">Report History</h2>
          <p className="text-xs text-slate mt-1 flex items-center gap-1">
            <Folder size={12} className="text-accent" /> Active Sub-Profile Repository Isolation
          </p>
        </div>
        
        {/* Manual Force Sync Button for Project Demonstrations */}
        <button 
          onClick={fetchFreshLogs}
          className="px-3 py-1.5 bg-paper hover:bg-slate-light/10 border border-slate-light/20 text-ink rounded-xl text-xs font-semibold transition-colors"
        >
          🔄 Force Sync DB
        </button>
      </div>

      <div className="bg-surface rounded-xl2 border border-slate-light/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-paper text-slate font-bold border-b border-slate-light/10 tracking-wide uppercase text-[10px]">
              <th className="p-4">Report Index Token</th>
              <th className="p-4">Structural Class Type</th> 
              <th className="p-4">Ingestion Date</th>
              <th className="p-4">Review Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper text-slate font-medium">
            {logs.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate">No telemetry parameters matching this node branch.</td></tr>
            ) : (
              logs.map((row) => (
                <tr key={row.id} className="hover:bg-paper/40 transition-colors">
                  <td className="p-4 font-mono text-accent font-bold">#AIMRA-{row.id}</td>
                  <td className="p-4 text-ink font-semibold">{row.classification_label || "General Medicine"}</td>
                  <td className="p-4 text-slate font-mono">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold capitalize ${badgeThemes[row.status]}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onSelectReport(row.id)}
                      className="text-accent hover:text-accent-dark font-bold flex items-center gap-1 justify-end ml-auto text-[11px]"
                    >
                      Inspect Panel
                    </button>
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
