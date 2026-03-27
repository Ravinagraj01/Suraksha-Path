import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield, CheckCircle, Edit, Save, Users, Crown, Key } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import FloatingInput from "../components/ui/FloatingInput";

export default function PremiumProfilePage() {
  const { role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", password: "" });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/me");
      setProfile(response.data);
      setForm((f) => ({ 
        ...f, 
        full_name: response.data.full_name || "", 
        phone: response.data.phone || "" 
      }));
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    if (role === "ADMIN") {
      api.get("/users").then((r) => setUsers(r.data)).catch(() => {});
    }
  }, [role]);

  const save = async (e) => {
    e.preventDefault();
    setStatus("");
    setSaving(true);
    try {
      await api.patch("/users/me", form);
      setStatus("Profile updated successfully.");
      loadProfile();
      setForm({ ...form, password: "" });
    } catch (error) {
      setStatus("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const getRoleIcon = (userRole) => {
    switch (userRole) {
      case 'ADMIN': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'USER': return <User className="w-4 h-4 text-blue-400" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-hero font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Manage your account details and system preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile Overview */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <div className="bento-grid bento-grid-3x1">
          {/* Profile Info */}
          <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}>
            <GlassCard delay={0.1}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">My Profile</h2>
                  <p className="text-small text-blue-200">Account details and credentials</p>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="skeleton h-6 w-24 rounded" />
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-4 w-28 rounded" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-small text-blue-200 mb-1">
                      {getRoleIcon(profile?.role)}
                      <span className="ml-2">Role</span>
                    </div>
                    <p className="text-h3 font-semibold text-white capitalize">
                      {profile?.role || "-"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-small text-blue-200 mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </div>
                    <p className="text-body text-blue-100">
                      {profile?.email || "-"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-small text-blue-200 mb-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </div>
                    <p className="text-body text-blue-100">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-small text-blue-200 mb-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Status
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(profile?.status)}`}>
                      {profile?.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Edit Profile Form */}
          <motion.div 
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
            className="xl:col-span-2"
          >
            <GlassCard delay={0.2}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Edit className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">Edit Profile</h2>
                  <p className="text-small text-blue-200">Update your personal information</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={save}>
                <FloatingInput
                  label="Full Name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  icon={<User size={16} />}
                />

                <FloatingInput
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  icon={<Phone size={16} />}
                />

                <FloatingInput
                  label="New Password (optional)"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  icon={<Key size={16} />}
                />

                <AnimatedButton
                  variant="primary"
                  type="submit"
                  icon={<Save size={16} />}
                  loading={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </AnimatedButton>
              </form>

              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-xl text-sm ${
                    status.includes("success") 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {status}
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Admin User Management */}
      {role === "ADMIN" && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <GlassCard delay={0.3}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">User Management</h2>
                  <p className="text-small text-blue-200">System user directory and roles</p>
                </div>
              </div>
              <div className="text-small text-blue-300">
                {users.length} users
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 p-3 border-b border-slate-700 text-small text-blue-200 font-medium">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Name
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Role
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Status
                  </div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-700">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-body text-white font-medium">{user.full_name}</p>
                          <p className="text-caption text-blue-300">ID: {user.id?.slice(0, 8)}</p>
                        </div>
                      </div>

                      <div className="text-body text-blue-100">
                        {user.email}
                      </div>

                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="text-body text-white capitalize">{user.role}</span>
                      </div>

                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status?.toUpperCase() || "ACTIVE"}
                        </span>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <AnimatedButton variant="glass" size="sm">
                          Edit
                        </AnimatedButton>
                        <AnimatedButton variant="glass" size="sm">
                          View
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-body text-blue-200">No users found</p>
                <p className="text-small text-blue-300 mt-2">User directory will appear here</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Profile Statistics */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-4x1"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.4}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {users.length}
              </p>
              <p className="text-small text-blue-200 mt-1">Total Users</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.5}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Administrators</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.6}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Active Users</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.7}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {users.filter(u => u.role === 'USER').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Regular Users</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
