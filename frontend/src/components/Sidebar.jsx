import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminNavItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/map", label: "Map View" },
  { to: "/dashboard/sos", label: "SOS Center" },
  { to: "/dashboard/shelters", label: "Shelters" },
  { to: "/dashboard/reports", label: "Damage Reports" },
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/news", label: "AI News" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { role } = useAuth();
  const { pathname } = useLocation();
  const navItems = role === "ADMIN" ? adminNavItems : [];

  return (
    <aside className={`${collapsed ? "w-[84px]" : "w-[252px]"} hidden min-h-screen shrink-0 bg-sidebar text-slate-100 transition-all duration-300 md:block`}>
      <div className="flex h-full flex-col p-4">
        <button className="mb-5 rounded-lg bg-slate-700 px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-100 hover:bg-slate-600" onClick={() => setCollapsed((x) => !x)}>
          {collapsed ? "Expand" : "Collapse"}
        </button>

        <div className="mb-6 rounded-xl border border-slate-600 bg-slate-800/70 p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Platform</p>
          <h1 className={`mt-1 font-semibold ${collapsed ? "text-xs" : "text-base"}`}>{collapsed ? "SP" : "Suraksha Path"}</h1>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-xl px-3 py-2 text-sm transition ${active ? "bg-slate-100 text-slate-900" : "text-slate-200 hover:bg-slate-700"}`}
              >
                {collapsed ? item.label.charAt(0) : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-600 bg-slate-800/60 p-3 text-xs text-slate-300">
          <p className="font-semibold text-slate-100">AI Insights (Beta)</p>
          <p className="mt-1">Preparedness and response recommendations are shown in dashboards.</p>
        </div>
      </div>
    </aside>
  );
}
