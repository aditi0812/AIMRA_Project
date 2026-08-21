import React, { useState } from 'react';
import { Upload, ChevronRight, FileText } from 'lucide-react';

export default function UploadView({ onUploadComplete }) {
  const [dragOverActive, setDragOverActive] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

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

  // Mock processing dataset trigger simulation
  const runAnalysisEngine = () => {
    if (!currentFile) return;
    
    onUploadComplete({
      category: 'Diagnostic Panel (Laboratory)', // Replaces specialty layout tags (Addresses Task #5)
      date: 'August 22, 2026',
      fileName: currentFile.name,
      jargonText: 'Patient presents with acute sinus bradycardia. ECG demonstrates prominent RBBB morphology with standard ST-elevation intervals across anterior leads.',
      simplifiedText: 'Your heart is beating slightly slower than average (sinus bradycardia). The electrical signals travel down a normal but slightly delayed alternate path on the right side of the heart (Right Bundle Branch Block), which is a common pattern that clinicians monitor safely.',
      entities: [
        { word: 'sinus bradycardia', class: 'Observed Heart Rhythm' },
        { word: 'ECG', class: 'Diagnostic Heart Graph Test' },
        { word: 'RBBB morphology', class: 'Right Conduction Delay Pattern' }
      ]
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Premium Intro Header Elements */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Document Intake Hub</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Securely convert clinical records, complex lab readouts, or text summaries into clear, plain language descriptions. 
        </p>
      </div>

      {/* Guide Panels Explanation Section (Addresses Task #4) */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "1. Intake & Stream", desc: "Securely drag and drop scanned files, picture panels, or raw printed charts directly into your secure workspace." },
          { title: "2. Structural Clarification", desc: "Our layout model safely reviews complex medical sentences, isolating parameters and terms automatically." },
          { title: "3. Health Log Consolidation", desc: "Results catalog automatically into your secure timeline profile to keep your historical tracking records unified." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
            <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wide">{item.title}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* File Dropping Section */}
      <div 
        onDragEnter={processDragEvents}
        onDragOver={processDragEvents}
        onDragLeave={processDragEvents}
        onDrop={processDropEvents}
        className={`bg-white border-2 border-dashed rounded-3xl p-12 text-center transition-all ${dragOverActive ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200'}`}
      >
        <div className="max-w-md mx-auto space-y-4 flex flex-col items-center">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl">
            <Upload size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Select or drop file packages here</p>
            <p className="text-xs text-slate-400 mt-1">Accepts diagnostic PDFs, JPGs, PNG scans, or clean text exports</p>
          </div>
          
          <label className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 cursor-pointer transition-colors">
            Browse Local System
            <input type="file" className="hidden" onChange={(e) => e.target.files && setCurrentFile(e.target.files[0])} />
          </label>

          {currentFile && (
            <div className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl mt-4">
              <div className="flex items-center gap-2 truncate">
                <FileText size={16} className="text-teal-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate">{currentFile.name}</span>
              </div>
              <button 
                onClick={runAnalysisEngine}
                className="flex items-center gap-1 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm shadow-teal-100"
              >
                Analyze <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
