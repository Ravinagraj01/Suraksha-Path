import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const titles = {
  "/dashboard": "Operational Overview",
  "/dashboard/map": "Disaster Map",
  "/dashboard/sos": "SOS Command",
  "/dashboard/shelters": "Shelter Management",
  "/dashboard/profile": "Profile",
  "/dashboard/volunteers": "Volunteer Coordination",
  "/dashboard/news": "AI Disaster News",
  "/dashboard/reports": "Recovery Reports",
};

export default function Header({ onOpenFilters }) {
  const { role, logout } = useAuth();
  const { pathname } = useLocation();
  const title = useMemo(() => titles[pathname] || "Dashboard", [pathname]);

  return (
    <header className="card-ui flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Disaster Management</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input className="input-ui sm:w-72" placeholder="Search incidents, shelters, reports" />
        <button className="btn-outline" onClick={onOpenFilters}>Filters</button>
        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">{role}</span>
        <button onClick={logout} className="btn-primary">Logout</button>
      </div>
    </header>
  );
}
