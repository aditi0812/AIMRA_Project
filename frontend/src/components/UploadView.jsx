// Location: frontend/src/components/UploadView.jsx
import React, { useState } from 'react';
import { Upload, ChevronRight, FileText } from 'lucide-react';

export default function UploadView({ token, profileId, onUploadComplete }) {
  const [dragOverActive, setDragOverActive] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const processDragEvents = (e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragOverActive(true);
    else if (e.type === "dragleave") setDragOverActive(false);
  };

  const processDropEvents = (e) => {
    e.preventDefault();
    setDragOverActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCurrentFile(e.dataTransfer.files[0]);
    }
  };

  const runAnalysisEngine = async () => {
    if (!currentFile) return;
    setAnalyzing(true);
    
    // Create modern multipart form-data payload matching your backend rules
    const payload = new FormData();
    payload.append('file', currentFile);
    payload.append('family_member_id', profileId);

    try {
      const response = await fetch('http://localhost:8000/api/reports/upload', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: payload
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Pipeline Ingestion Complete! Sent securely to doctor queue.");
        onUploadComplete(data.report_id);
      } else {
        alert(data.detail || "Error extracting diagnostic text patterns.");
      }
    } catch (err) {
      alert("Connection with backend failed. Ensure uvicorn server is running on port 8000.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-ink">Document Intake Hub</h1>
        <p className="text-slate text-sm max-w-2xl">Securely process complex metrics sheets, physical photos, or digital print text artifacts directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body">
        {[
          { title: "1. Upload", desc: "Drop a medical artifact scan, image, or PDF." },
          { title: "2. Clinician Evaluation", desc: "Your assigned medical doctor reviews and cross-checks the summaries." },
          { title: "3. Verified Records Log", desc: "Once approved, summaries release permanently to your history log." }
        ].map((item, idx) => (
          <div key={idx} className="bg-surface p-5 rounded-xl2 border border-slate-light/10 shadow-sm space-y-1">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wide">{item.title}</h3>
            <p className="text-[11px] text-slate leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div 
        onDragEnter={processDragEvents}
        onDragOver={processDragEvents}
        onDragLeave={processDragEvents}
        onDrop={processDropEvents}
        className={`bg-surface border-2 border-dashed rounded-xl2 p-12 text-center transition-all ${dragOverActive ? 'border-accent bg-paper/50' : 'border-slate-light/20'}`}
      >
        <div className="max-w-md mx-auto space-y-4 flex flex-col items-center font-body">
          <div className="p-4 bg-paper text-accent rounded-xl">
            <Upload size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Select or drop a report here</p>
            <p className="text-xs text-slate mt-1">Accepts diagnostic photos, files, and text blocks</p>
          </div>
          
          <label className="px-4 py-2 bg-paper text-ink text-xs font-semibold rounded-xl hover:bg-slate-light/10 cursor-pointer transition-colors border border-slate-light/20">
            Browse System Folders
            <input type="file" className="hidden" onChange={(e) => e.target.files && setCurrentFile(e.target.files[0])} />
          </label>

          {currentFile && (
            <div className="w-full flex items-center justify-between p-3 bg-paper border border-slate-light/10 rounded-xl mt-4">
              <div className="flex items-center gap-2 truncate">
                <FileText size={16} className="text-accent shrink-0" />
                <span className="text-xs font-mono text-ink truncate">{currentFile.name}</span>
              </div>
              <button 
                onClick={runAnalysisEngine}
                disabled={analyzing}
                className="flex items-center gap-1 text-xs font-bold bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
              >
                {analyzing ? "Running Ingestion..." : "Analyze"} <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
