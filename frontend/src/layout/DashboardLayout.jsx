import { useState } from "react";
import { Link } from "react-router-dom";

import FilterModal from "../components/FilterModal";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (role === "USER") {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#F5F5F7]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
            <Link to="/" className="text-xl font-semibold tracking-tight text-[#1F1F1F]">SurakshaPath</Link>
            <nav className="hidden items-center gap-6 text-sm text-[#6B7280] md:flex">
              <Link to="/dashboard">Overview</Link>
              <Link to="/dashboard/sos">SOS</Link>
              <Link to="/dashboard/reports">Reports</Link>
              <Link to="/dashboard/news">AI News</Link>
              <Link to="/dashboard/volunteers">Volunteers</Link>
              <Link to="/dashboard/profile">Profile</Link>
            </nav>
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">{role}</span>
              <button className="btn-primary" onClick={logout}>Logout</button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent md:flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="w-full p-4 md:p-6">
        <Header onOpenFilters={() => setFiltersOpen(true)} />
        <section className="mt-5">{children}</section>
      </main>
      <FilterModal open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}
