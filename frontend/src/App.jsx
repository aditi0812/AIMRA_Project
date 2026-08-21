import { useState } from "react";
import NavBar from "./components/NavBar";
import UploadView from "./components/UploadView";
import ResultsView from "./components/ResultsView";
import HistoryView from "./components/HistoryView";

export default function App() {
  const [view, setView] = useState("upload");

  const handleFileReady = () => {
    // In the real app, this triggers the upload -> OCR -> NLP -> Classification
    // -> Summary pipeline via the FastAPI backend, then navigates once results
    // come back. For now, jump straight to the results demo.
    setTimeout(() => setView("results"), 600);
  };

  return (
    <div className="min-h-screen bg-paper font-body">
      <NavBar view={view} setView={setView} />
      {view === "upload" && <UploadView onFileReady={handleFileReady} />}
      {view === "results" && <ResultsView />}
      {view === "history" && <HistoryView setView={setView} />}
    </div>
  );
}
