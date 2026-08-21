export default function NavBar({ view, setView }) {
  const links = [
    { id: "upload", label: "Upload" },
    { id: "results", label: "Results" },
    { id: "history", label: "History" },
  ];

  return (
    <header className="border-b border-slate-light/30 bg-surface/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setView("upload")}
          className="font-display text-base sm:text-xl tracking-tight text-ink flex items-baseline gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
        >
          <span className="font-semibold">AIMRA</span>
          <span className="hidden sm:inline italic text-accent">Report Analyzer</span>
        </button>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setView(link.id)}
              className={`font-body text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                view === link.id
                  ? "bg-ink text-white"
                  : "text-slate hover:text-ink hover:bg-paper"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
