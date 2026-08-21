import { historyItems } from "../data/mockData";

export default function HistoryView({ setView }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink mb-2">Report history</h1>
      <p className="font-body text-slate mb-10">
        Every report you've analyzed, so you can track how things change over
        time.
      </p>

      <div className="bg-surface border border-slate-light/30 rounded-xl2 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-light/30">
              <th className="font-mono text-xs uppercase tracking-wider text-slate px-6 py-4">
                File
              </th>
              <th className="font-mono text-xs uppercase tracking-wider text-slate px-6 py-4">
                Specialty
              </th>
              <th className="font-mono text-xs uppercase tracking-wider text-slate px-6 py-4">
                Date
              </th>
              <th className="font-mono text-xs uppercase tracking-wider text-slate px-6 py-4">
                Status
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item, i) => (
              <tr
                key={item.id}
                className={i !== historyItems.length - 1 ? "border-b border-slate-light/15" : ""}
              >
                <td className="font-body text-sm text-ink px-6 py-4">{item.fileName}</td>
                <td className="font-body text-sm text-slate px-6 py-4">{item.specialty}</td>
                <td className="font-body text-sm text-slate px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 text-positive font-body text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-positive" />
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setView("results")}
                    className="font-body text-sm text-accent-dark hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
