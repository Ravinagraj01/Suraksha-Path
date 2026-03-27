import { useState } from "react";
import { Link } from "react-router-dom";

import PremiumSettingsModal from "../components/PremiumSettingsModal";
import PremiumHeader from "../components/PremiumHeader";
import PremiumSidebar from "../components/PremiumSidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <PremiumSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={`transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <PremiumHeader onOpenFilters={() => setFiltersOpen(true)} />
        
        <main className="p-6">
          <section className="mt-5">{children}</section>
        </main>
      </div>
      
      <PremiumSettingsModal open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}
