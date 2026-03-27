import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ full_name: "", phone: "", password: "" });

  const loadProfile = async () => {
    const response = await api.get("/users/me");
    setProfile(response.data);
    setForm((f) => ({ ...f, full_name: response.data.full_name || "", phone: response.data.phone || "" }));
  };

  useEffect(() => {
    loadProfile().catch(() => {});
    if (role === "ADMIN") {
      api.get("/users").then((r) => setUsers(r.data)).catch(() => {});
    }
  }, [role]);

  const save = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await api.patch("/users/me", form);
      setStatus("Profile updated.");
      loadProfile();
    } catch {
      setStatus("Failed to update profile.");
    }
  };

  return (
    <div className="space-y-4 fade-up">
      <div className="card-ui p-5">
        <h3 className="text-lg font-semibold text-[#1F1F1F]">My Profile</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Manage your account details and credentials.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card-ui p-5 xl:col-span-1">
          <p className="text-sm text-slate-500">Role</p>
          <p className="text-xl font-semibold text-slate-900">{profile?.role || "-"}</p>
          <p className="mt-3 text-sm text-slate-500">Email</p>
          <p className="text-sm font-medium text-slate-800">{profile?.email || "-"}</p>
          <p className="mt-3 text-sm text-slate-500">Status</p>
          <p className="text-sm font-medium text-slate-800">{profile?.status || "-"}</p>
        </div>

        <form className="card-ui grid gap-3 p-5 xl:col-span-2" onSubmit={save}>
          <input className="input-ui" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" />
          <input className="input-ui" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <input className="input-ui" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="New password (optional)" />
          <button className="btn-primary w-fit" type="submit">Save Profile</button>
          {status && <p className="text-sm text-slate-600">{status}</p>}
        </form>
      </div>

      {role === "ADMIN" && (
        <div className="card-ui p-5">
          <h4 className="text-base font-semibold text-[#1F1F1F]">Registered Users</h4>
          <p className="mt-1 text-sm text-[#6B7280]">Multi-user directory visible to admin.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{u.full_name}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
