import { useEffect, useMemo, useState } from "react";

import api from "../services/api";

function RiskBadge({ value }) {
  const tone = value === "high" ? "bg-rose-100 text-rose-700" : value === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{value?.toUpperCase()}</span>;
}

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [meta, setMeta] = useState({ generated_at: "", providers: [], errors: [] });
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/news/ai-disaster-updates?limit=15");
      setNews(response.data.items || []);
      setMeta({
        generated_at: response.data.generated_at,
        providers: response.data.providers || [],
        errors: response.data.errors || [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60000);
    return () => clearInterval(id);
  }, []);

  const headerNote = useMemo(() => {
    if (meta.errors.length) return "Live providers partially unavailable; fallback logic active.";
    return "Auto-refreshes every 60 seconds from free live disaster feeds.";
  }, [meta.errors]);

  return (
    <div className="space-y-4 fade-up">
      <div className="card-ui p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#1F1F1F]">AI Disaster News - India</h3>
            <p className="mt-1 text-sm text-[#6B7280]">{headerNote}</p>
            <p className="mt-1 text-xs text-slate-500">Sources: {meta.providers.join(", ") || "N/A"} | Updated: {meta.generated_at || "-"}</p>
          </div>
          <button className="btn-primary pulse-soft" onClick={fetchNews} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Now"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {news.map((item, i) => (
          <article key={item.id} className="card-ui p-4" style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{item.source}</span>
              <RiskBadge value={item.risk_level} />
            </div>
            <h4 className="text-base font-semibold leading-6 text-slate-900">{item.title}</h4>
            <p className="mt-2 text-sm text-slate-600">{item.ai_summary}</p>
            <p className="mt-2 text-xs text-slate-500">Location: {item.location}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">{item.published_at?.slice(0, 19).replace("T", " ")}</span>
              {item.url ? (
                <a className="text-sm font-medium text-[#3B5BDB] hover:underline" href={item.url} target="_blank" rel="noreferrer">
                  Read source
                </a>
              ) : (
                <span className="text-xs text-slate-400">No link</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
