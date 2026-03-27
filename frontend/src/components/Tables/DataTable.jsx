import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

export default function DataTable({ rows }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("created_at");
  const [ascending, setAscending] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));

    return [...searched].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      return ascending ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [rows, query, sortKey, ascending]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  return (
    <div className="card-ui p-4">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Live Incident Table</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="input-ui sm:w-56" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search" />
          <select className="input-ui sm:w-44" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="created_at">Created At</option>
            <option value="status">Status</option>
            <option value="severity">Severity</option>
          </select>
          <button className="btn-outline" onClick={() => setAscending((x) => !x)}>{ascending ? "Asc" : "Desc"}</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Message</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-3 py-2 text-slate-600">{String(row.id).slice(0, 8)}</td>
                <td className="px-3 py-2 text-slate-900">{row.message || "-"}</td>
                <td className="px-3 py-2 text-slate-700">{row.severity || "-"}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.status === "open" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {row.status || "unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Page {clampedPage} of {totalPages}</span>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
          <button className="btn-outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}