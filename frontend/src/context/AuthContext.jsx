import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || "USER";
  } catch {
    return "USER";
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");
  const [ready, setReady] = useState(false);

  const login = (nextToken, nextRole) => {
    const resolvedRole = nextRole || getRoleFromToken(nextToken);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("role", resolvedRole);
    setToken(nextToken);
    setRole(resolvedRole);
    setReady(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("USER");
    setReady(true);
  };

  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      if (!token) {
        if (mounted) setReady(true);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (!mounted) return;
        const serverRole = response?.data?.role || getRoleFromToken(token);
        localStorage.setItem("role", serverRole);
        setRole(serverRole);
      } catch {
        if (!mounted) return;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken("");
        setRole("USER");
      } finally {
        if (mounted) setReady(true);
      }
    };

    validate();
    return () => {
      mounted = false;
    };
  }, [token]);

  const value = useMemo(() => ({ token, role, ready, login, logout }), [token, role, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
