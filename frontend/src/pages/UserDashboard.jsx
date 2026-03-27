import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import KPIcard from "../components/KPIcard";
import MapCard from "../components/Map/MapCard";
import api from "../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [sos, setSos] = useState([]);
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    api.get("/shelters").then((r) => setShelters(r.data)).catch(() => {});
    api.get("/sos").then((r) => setSos(r.data)).catch(() => {});
    api.get("/damage-reports").then((r) => setReports(r.data)).catch(() => {});
    api.get("/volunteers").then((r) => setVolunteers(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 fade-up">
      <section className="card-ui grid items-center gap-6 overflow-hidden p-5 md:grid-cols-2 md:p-8">
        <div>
          <p className="text-sm text-[#6B7280]">Citizen Operations Panel</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#1F1F1F] md:text-5xl">Your Disaster Readiness Hub</h2>
          <p className="mt-3 text-base text-[#6B7280]">
            Track SOS, upload field evidence, follow AI disaster updates, and collaborate with district volunteer teams.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1400&q=80"
          alt="Citizen support collaboration"
          className="h-56 w-full rounded-2xl object-cover shadow-card transition duration-500 hover:scale-[1.02]"
        />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPIcard label="Nearby Shelters" value={shelters.length} tone="green" delta="Safe" />
        <KPIcard label="Local Alerts" value="4" tone="orange" delta="Watch" />
        <KPIcard label="My SOS Requests" value={sos.length} tone="red" delta="Live" />
        <KPIcard label="My Damage Reports" value={reports.length} tone="blue" delta="Monitor" />
      </div>

      <div className="card-ui grid gap-5 overflow-hidden p-5 md:grid-cols-2 md:p-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Citizen Quick Actions</h3>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Live Workspace
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Run critical tasks quickly during emergency response windows.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button className="btn-outline flex items-center justify-between" onClick={() => navigate("/dashboard/sos")}>
              <span>Raise SOS</span>
              <span className="text-red-600">●</span>
            </button>
            <button className="btn-outline flex items-center justify-between" onClick={() => navigate("/dashboard/reports")}>
              <span>Upload Damage Proof</span>
              <span>+</span>
            </button>
            <button className="btn-outline flex items-center justify-between" onClick={() => navigate("/dashboard/shelters")}>
              <span>Find Assigned Shelter</span>
              <span>→</span>
            </button>
            <button className="btn-outline flex items-center justify-between" onClick={() => navigate("/dashboard/news")}>
              <span>View Live AI News</span>
              <span>↗</span>
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Community Pulse</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">Volunteer profiles submitted: {volunteers.length}</p>
            <p className="text-xs text-slate-500">Local support strength for relief operations.</p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1469571486292-b53601020848?auto=format&fit=crop&w=1200&q=80"
            alt="Shelter coordination"
            className="h-56 w-full rounded-xl object-cover transition duration-500 hover:scale-[1.02]"
          />
          <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-xs shadow">
            Shelter coordination
          </div>
        </div>
      </div>

      <MapCard shelters={shelters} sos={sos} riskZones={[{ id: "u-risk", points: [[20.2, 78.4], [20.5, 78.9], [20.1, 79.2]] }]} title="Public Risk and Shelter Map" />
    </div>
  );
}
