import { useEffect, useState } from "react";

import api from "../services/api";

export default function SOSPage() {
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [sosList, setSosList] = useState([]);
  const [form, setForm] = useState({
    message: "Need emergency support near flooded market.",
    severity: "high",
    latitude: 20.5937,
    longitude: 78.9629,
    meta: { people: 2 },
  });
  const [status, setStatus] = useState("");

  const load = () => api.get("/sos").then((r) => setSosList(r.data)).catch(() => {});

  useEffect(() => {
    api.get("/meta/bootstrap").then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id })).catch(() => {});
    load();
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setForm((f) => ({
        ...f,
        latitude: Number(position.coords.latitude.toFixed(6)),
        longitude: Number(position.coords.longitude.toFixed(6)),
      }));
    });
  };

  const submitSOS = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await api.post("/sos", { ...form, state_id: scope.state_id, district_id: scope.district_id });
      setStatus("SOS request submitted successfully.");
      load();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setStatus(typeof detail === "string" ? detail : "Failed to submit SOS.");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3 fade-up">
      <div className="card-ui p-6 xl:col-span-1">
        <h3 className="text-lg font-semibold text-[#1F1F1F]">Emergency SOS</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Submit incident details and live location.</p>

        <form className="mt-4 grid gap-3" onSubmit={submitSOS}>
          <textarea className="input-ui min-h-28" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <select className="input-ui" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className="input-ui" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
            <input className="input-ui" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
          </div>
          <button type="button" className="btn-outline" onClick={useCurrentLocation}>Use Current Location</button>
          <button className="btn-primary w-fit" type="submit">Submit SOS</button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
      </div>

      <div className="card-ui p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold text-[#1F1F1F]">SOS Feed</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Admins see all requests; users see their own requests.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sosList.map((x) => (
            <div key={x.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{x.message}</p>
              <p className="mt-1 text-sm text-slate-600">Severity: {x.severity}</p>
              <p className="text-xs text-slate-600">Status: {x.status}</p>
              <p className="text-xs text-slate-600">Location: {x.latitude}, {x.longitude}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
