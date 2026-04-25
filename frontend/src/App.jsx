import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import api from "./services/api";
import DashboardLayout from "./layout/DashboardLayout";
import PremiumAdminDashboard from "./pages/PremiumAdminDashboard";
import PremiumLandingPage from "./pages/PremiumLandingPage";
import PremiumMapView from "./pages/PremiumMapView";
import PremiumReportsPage from "./pages/PremiumReportsPage";
import PremiumShelters from "./pages/PremiumSheltersPage";
import PremiumSOSPage from "./pages/PremiumSOSPage";
import PremiumUserDashboard from "./pages/PremiumUserDashboard";
import PremiumVolunteers from "./pages/PremiumVolunteersPage";
import PremiumNewsPage from "./pages/PremiumNewsPage";
import PremiumLoginPage from "./pages/PremiumLoginPage";
import PremiumProfilePage from "./pages/PremiumProfilePage";
import PremiumDisasterPredictionPage from "./pages/PremiumDisasterPredictionPage";

function ProtectedRoute({ children, roles }) {
  const { token, role, ready } = useAuth();
  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Checking session...</div>;
  }
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function RoleRoute({ children, roles }) {
  const { role } = useAuth();
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function LoginPage() {
  return <PremiumLoginPage />;
}

export default function App() {
  const { role } = useAuth();

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PremiumLandingPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={["ADMIN", "USER"]}>
              <DashboardLayout>
                <Routes>
                  <Route index element={role === "ADMIN" ? <PremiumAdminDashboard /> : <PremiumUserDashboard />} />
                  <Route path="map" element={<PremiumMapView />} />
                  <Route path="sos" element={<PremiumSOSPage />} />
                  <Route path="shelters" element={<PremiumShelters />} />
                  <Route
                    path="volunteers"
                    element={
                      <RoleRoute roles={["USER"]}>
                        <PremiumVolunteers />
                      </RoleRoute>
                    }
                  />
                  <Route path="news" element={<PremiumNewsPage />} />
                  <Route path="profile" element={<PremiumProfilePage />} />
                  <Route path="reports" element={<PremiumReportsPage />} />
                  <Route path="predict" element={<PremiumDisasterPredictionPage />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
