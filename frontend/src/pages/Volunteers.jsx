import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Volunteers() {
  const { role } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    skills: "first_aid,rescue_support",
    availability: "weekends",
    latitude: 20.5937,
    longitude: 78.9629,
  });
  const [status, setStatus] = useState("");

  const load = () => api.get("/volunteers").then((r) => setVolunteers(r.data)).catch(() => {});

  useEffect(() => {
    api.get("/meta/bootstrap").then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id })).catch(() => {});
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await api.post("/volunteers", {
        ...form,
        state_id: scope.state_id,
        district_id: scope.district_id,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setStatus("Volunteer profile submitted.");
      load();
    } catch {
      setStatus("Failed to submit volunteer profile.");
    }
  };

  const approveVolunteer = async (volunteerId) => {
    try {
      await api.patch(`/volunteers/${volunteerId}/status`, { status: "approved", assigned_task: "Relief distribution" });
      load();
    } catch {
      setStatus("Admin update failed.");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3 fade-up">
      <div className="card-ui p-5 xl:col-span-1">
        <h3 className="text-lg font-semibold text-[#1F1F1F]">Join Volunteer Network</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Provide skills and location for district response teams.</p>

        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <input className="input-ui" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <input className="input-ui" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input className="input-ui" placeholder="Skills (comma-separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <input className="input-ui" placeholder="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
          <button className="btn-primary w-fit" type="submit">Submit</button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
      </div>

      <div className="card-ui p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold text-[#1F1F1F]">Volunteer Registry</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Users see their own records. Admin sees all volunteers.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {volunteers.map((v) => (
            <div key={v.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{v.full_name}</p>
              <p className="text-sm text-slate-600">{v.phone}</p>
              <p className="mt-2 text-xs text-slate-600">Skills: {(v.skills || []).join(", ")}</p>
              <p className="text-xs text-slate-600">Status: {v.status}</p>
              <p className="text-xs text-slate-600">Task: {v.assigned_task}</p>
              {role === "ADMIN" && (
                <button className="btn-outline mt-2 text-xs" onClick={() => approveVolunteer(v.id)}>
                  Approve + Assign
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
