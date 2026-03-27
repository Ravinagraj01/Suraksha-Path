import { useState } from "react";
import { Link } from "react-router-dom";

import FilterModal from "../components/FilterModal";
import PremiumHeader from "../components/PremiumHeader";
import PremiumSidebar from "../components/PremiumSidebar";
import { useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function DashboardLayout({ children }) {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <PremiumSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <div className={`transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
          <PremiumHeader onOpenFilters={() => setFiltersOpen(true)} />
          
          <main className="p-6">
            <section className="mt-5">{children}</section>
          </main>
        </div>
        
        <FilterModal open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
