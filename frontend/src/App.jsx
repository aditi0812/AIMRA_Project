import React, { useState } from 'react';
import { Shield, Upload, History, User, Users, BookOpen, LogOut, FileText } from 'lucide-react';
import UploadView from './components/UploadView';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState('upload');
  
  // Custom Feature States from your Notes
  const [selectedFamilyProfile, setSelectedFamilyProfile] = useState('Primary User Profile');
  const [reportData, setReportData] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email && password) setIsAuthenticated(true);
  };

  // 🔐 Secure Login View Container
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-teal-50 rounded-full text-teal-600 mb-1">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">CuraInsight AI</h1>
            <p className="text-xs text-slate-400">Secure Patient Data Verification Access</p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@patientportal.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors text-sm shadow-sm">
              Verify Identity & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 🏥 Main Secured Application Dashboard Shell
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Premium Chic Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-100">
            <div className="p-2 bg-teal-600 text-white rounded-xl shadow-md">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 tracking-tight">CuraInsight AI</h2>
              <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full">Patient Dashboard</span>
            </div>
          </div>

          {/* 📂 Family Tracking Folders Selector (Addresses Task #6) */}
          <div className="px-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users size={12} /> Family History Directory
            </label>
            <select 
              value={selectedFamilyProfile}
              onChange={(e) => setSelectedFamilyProfile(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option>Primary User Profile</option>
              <option>Spouse Archive</option>
              <option>Child Dependent Portfolio</option>
              <option>Parent Logs</option>
            </select>
          </div>

          {/* Navigation Matrix Tabs */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveView('upload')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeView === 'upload' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Upload size={18} /> Document Intake
            </button>
            <button 
              onClick={() => setActiveView('results')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeView === 'results' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText size={18} /> Clinical Translation
            </button>
            <button 
              onClick={() => setActiveView('history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeView === 'history' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <History size={18} /> Records Log Matrix
            </button>
          </nav>
        </div>

        {/* Footer Account Actions */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User size={16} />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">{email}</p>
              <p className="text-[10px] text-slate-400">Authenticated Patient Session</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut size={14} /> Close Session
          </button>
        </div>
      </aside>

      {/* Primary Context Container */}
      <main className="flex-1 p-8 overflow-y-auto h-screen max-w-5xl">
        {activeView === 'upload' && <UploadView onUploadComplete={(data) => { setReportData(data); setActiveView('results'); }} />}
        {activeView === 'results' && <ResultsView data={reportData} />}
        {activeView === 'history' && <HistoryView profileFilter={selectedFamilyProfile} />}
      </main>
    </div>
  );
}
