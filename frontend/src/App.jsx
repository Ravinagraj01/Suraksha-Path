import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "./context/AuthContext";
import api from "./services/api";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import MapView from "./pages/MapView";
import Reports from "./pages/Reports";
import Shelters from "./pages/Shelters";
import SOSPage from "./pages/SOSPage";
import UserDashboard from "./pages/UserDashboard";
import Volunteers from "./pages/Volunteers";
import NewsPage from "./pages/NewsPage";
import ProfilePage from "./pages/ProfilePage";

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
  const { login, token, ready } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [roleChoice, setRoleChoice] = useState("ADMIN");
  const [email, setEmail] = useState("admin@surakshapath.in");
  const [password, setPassword] = useState("Admin@123");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (ready && token) return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    api.get("/meta/bootstrap")
      .then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id }))
      .catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Check backend/API URL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        phone,
        role: roleChoice,
        state_id: scope.state_id,
        district_id: scope.district_id,
      });
      const loginResp = await api.post("/auth/login", { email, password });
      login(loginResp.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyRolePreset = (nextRole) => {
    setRoleChoice(nextRole);
    if (nextRole === "ADMIN") {
      setEmail("admin@surakshapath.in");
      setPassword("Admin@123");
      return;
    }
    setEmail("user@surakshapath.in");
    setPassword("User@123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="card-ui w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{mode === "login" ? "Sign In" : "Create Account"}</h2>
        <p className="mt-1 text-sm text-slate-500">Disaster Management Dashboard</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={mode === "login" ? "btn-primary" : "btn-outline"} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "btn-primary" : "btn-outline"} onClick={() => setMode("register")}>Register</button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={mode === "login" ? handleLogin : handleRegister}>
          <select className="input-ui" value={roleChoice} onChange={(e) => applyRolePreset(e.target.value)}>
            <option value="ADMIN">Admin Role</option>
            <option value="USER">User Role</option>
          </select>
          {mode === "register" && (
            <>
              <input className="input-ui" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <input className="input-ui" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          )}
          <input className="input-ui" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="input-ui" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (mode === "login" ? "Signing in..." : "Creating account...") : (mode === "login" ? "Login" : "Register")}
          </button>
        </form>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="btn-outline" onClick={() => applyRolePreset("ADMIN")}>
            Admin Demo
          </button>
          <button className="btn-outline" onClick={() => applyRolePreset("USER")}>
            User Demo
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const { role } = useAuth();

  return (
    <Routes>
          <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute roles={["ADMIN", "USER"]}>
            <DashboardLayout>
              <Routes>
                <Route index element={role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />} />
                <Route path="map" element={<MapView />} />
                <Route path="sos" element={<SOSPage />} />
                <Route path="shelters" element={<Shelters />} />
                <Route
                  path="volunteers"
                  element={
                    <RoleRoute roles={["USER"]}>
                      <Volunteers />
                    </RoleRoute>
                  }
                />
                <Route path="news" element={<NewsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="reports" element={<Reports />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
