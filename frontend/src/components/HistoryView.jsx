import React from 'react';
import { Folder, FileText } from 'lucide-react';

export default function HistoryView({ profileFilter }) {
  
  // Custom mock database items mapped using standard labels (Addresses Task #8)
  const structuralHistoryRows = [
    { timestamp: "Aug 22, 2026", cat: "Laboratory Panel (Blood Test)", targetFile: "cbc_metabolic_panel.pdf" },
    { timestamp: "Jul 14, 2026", cat: "Diagnostic Imaging (MRI)", targetFile: "lumbar_spine_scan.png" },
    { timestamp: "Jun 02, 2026", cat: "Diagnostic Imaging (CT Scan)", targetFile: "abdominal_contrast_scan.jpg" },
    { timestamp: "May 18, 2026", cat: "Diagnostic Imaging (X-Ray)", targetFile: "chest_posterior_view.png" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Records Matrix Log</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Folder size={12} className="text-teal-600" /> Active Directory: <span className="font-semibold text-slate-700">{profileFilter}</span>
          </p>
        </div>
      </div>

      {/* Main Table Structure containing Category Word Replacement */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 tracking-wide uppercase text-[10px]">
              <th className="p-4">Log Timestamp</th>
              <th className="p-4">Report Category Type</th> {/* Changed from Specialty word */}
              <th className="p-4">Source Documentation Reference File</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {structuralHistoryRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 text-slate-400 font-mono">{row.timestamp}</td>
                <td className="p-4 text-slate-900 font-semibold">{row.cat}</td>
                <td className="p-4 flex items-center gap-1.5 text-slate-500">
                  <FileText size={14} className="text-slate-400" /> {row.targetFile}
                </td>
                <td className="p-4 text-right">
                  <button className="text-teal-600 hover:underline font-bold text-[11px]">View Dashboard Analysis</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
