import { useEffect, useState } from "react";

import api from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    title: "Flood damage in Sector 7",
    description: "Ground floor damaged, electrical wiring exposed, urgent inspection needed.",
    latitude: 20.5937,
    longitude: 78.9629,
  });

  const fetchReports = () => api.get("/damage-reports").then((r) => setReports(r.data)).catch(() => {});

  useEffect(() => {
    api.get("/meta/bootstrap").then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id })).catch(() => {});
    fetchReports();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    const data = new FormData();
    data.append("state_id", scope.state_id);
    data.append("district_id", scope.district_id);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("latitude", String(form.latitude));
    data.append("longitude", String(form.longitude));
    Array.from(files).forEach((file) => data.append("files", file));

    try {
      await api.post("/damage-reports", data, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus("Damage report uploaded successfully.");
      setFiles([]);
      fetchReports();
    } catch {
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="space-y-4 fade-up">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card-ui p-5">
          <h3 className="text-lg font-semibold text-[#1F1F1F]">Upload Damage Evidence</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Images and location are stored and visible in role-scoped sections.</p>

          <form className="mt-4 grid gap-3" onSubmit={submit}>
            <input className="input-ui" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="input-ui min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="input-ui" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
              <input className="input-ui" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
            </div>
            <input className="input-ui" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files || [])} />
            <button className="btn-primary w-fit" type="submit">Upload Report</button>
          </form>
          {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
        </div>

        <div className="card-ui overflow-hidden p-0">
          <img
            src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80"
            alt="Flood response"
            className="h-full min-h-[320px] w-full object-cover transition duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="card-ui p-5">
        <h3 className="text-lg font-semibold text-[#1F1F1F]">Damage Report Queue</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Admin sees all reports; citizens see their own reports.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{r.title}</p>
              <p className="mt-1 text-sm text-slate-600">{r.description}</p>
              <p className="mt-2 text-xs text-slate-600">Location: {r.latitude}, {r.longitude}</p>
              <p className="text-xs text-slate-600">Status: {r.status}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(r.evidence_urls || []).map((u) => (
                  <img key={u} src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${u}`} alt="evidence" className="h-20 w-full rounded-lg object-cover" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
