import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, MapPin, Phone, CheckCircle, Clock, Award, Filter } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import FloatingInput from "../components/ui/FloatingInput";

export default function PremiumVolunteersPage() {
  const { role } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    skills: "first_aid,rescue_support",
    availability: "weekends",
    latitude: 20.5937,
    longitude: 78.9629,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/volunteers");
      setVolunteers(response.data);
    } catch (error) {
      console.error("Failed to load volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/meta/bootstrap").then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id })).catch(() => {});
    loadVolunteers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      await api.post("/volunteers", {
        ...form,
        state_id: scope.state_id,
        district_id: scope.district_id,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setStatus("Volunteer profile submitted successfully.");
      loadVolunteers();
      setForm({
        full_name: "",
        phone: "",
        skills: "",
        availability: "weekends",
        latitude: 20.5937,
        longitude: 78.9629,
      });
    } catch (error) {
      setStatus("Failed to submit volunteer profile.");
    } finally {
      setLoading(false);
    }
  };

  const approveVolunteer = async (volunteerId) => {
    try {
      await api.patch(`/volunteers/${volunteerId}/status`, { status: "approved", assigned_task: "Relief distribution" });
      loadVolunteers();
    } catch (error) {
      setStatus("Admin update failed.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSkillBadge = (skill) => {
    const colors = {
      'first_aid': 'bg-red-500/20 text-red-400',
      'rescue_support': 'bg-blue-500/20 text-blue-400',
      'medical': 'bg-green-500/20 text-green-400',
      'logistics': 'bg-purple-500/20 text-purple-400',
      'communication': 'bg-orange-500/20 text-orange-400',
      'food_distribution': 'bg-yellow-500/20 text-yellow-400',
    };
    return colors[skill] || 'bg-gray-500/20 text-gray-400';
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
            <h1 className="text-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Volunteers
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Community response network and emergency coordination team
            </p>
          </div>
          <AnimatedButton 
            variant="glass" 
            icon={<Filter size={16} />}
            onClick={loadVolunteers}
            loading={loading}
          >
            Refresh
          </AnimatedButton>
        </div>
      </motion.div>

      <div className="bento-grid bento-grid-3x1">
        {/* Volunteer Registration Form */}
        <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}>
          <GlassCard delay={0.1}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <UserPlus className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-white">Join Volunteer Network</h2>
                <p className="text-small text-blue-200">Provide skills and location for response teams</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <FloatingInput
                label="Full Name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />

              <FloatingInput
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />

              <div>
                <label className="text-small text-blue-200 mb-2 block">Skills (comma-separated)</label>
                <select 
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all mb-2"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                >
                  <option value="first_aid,rescue_support">First Aid & Rescue</option>
                  <option value="medical">Medical Support</option>
                  <option value="logistics">Logistics & Transport</option>
                  <option value="communication">Communication</option>
                  <option value="food_distribution">Food Distribution</option>
                  <option value="first_aid,rescue_support,medical">Multi-skilled</option>
                </select>
                <input 
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all text-small"
                  placeholder="Or enter custom skills..."
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>

              <div>
                <label className="text-small text-blue-200 mb-2 block">Availability</label>
                <select 
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                >
                  <option value="weekends">Weekends Only</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="evenings">Evenings Only</option>
                  <option value="24x7">24/7 Available</option>
                  <option value="emergency">Emergency Only</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FloatingInput
                  label="Latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                />
                <FloatingInput
                  label="Longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                />
              </div>

              <AnimatedButton
                variant="primary"
                type="submit"
                icon={<UserPlus size={16} />}
                className="w-full"
                loading={loading}
              >
                Submit Application
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

        {/* Volunteer Registry */}
        <motion.div 
          variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
          className="xl:col-span-2"
        >
          <GlassCard delay={0.2}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">Volunteer Registry</h2>
                  <p className="text-small text-blue-200">Active volunteers and their assignments</p>
                </div>
              </div>
              <div className="text-small text-blue-300">
                {volunteers.length} volunteers
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton h-32 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {volunteers.map((volunteer, index) => (
                  <motion.div
                    key={volunteer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bento-card p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-h3 font-semibold text-white">{volunteer.full_name}</h3>
                            <div className="flex items-center text-small text-blue-200">
                              <Phone size={14} className="mr-1" />
                              {volunteer.phone}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(volunteer.skills || []).map((skill, i) => (
                            <span 
                              key={i}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillBadge(skill)}`}
                            >
                              {skill.replace('_', ' ')}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-small">
                          <div className="flex items-center text-blue-200">
                            <Clock size={14} className="mr-1" />
                            {volunteer.availability?.replace('_', ' ') || 'Not specified'}
                          </div>
                          <div className="flex items-center text-blue-200">
                            <MapPin size={14} className="mr-1" />
                            {volunteer.latitude?.toFixed(2)}, {volunteer.longitude?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(volunteer.status)}`}>
                        {volunteer.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    {volunteer.assigned_task && (
                      <div className="mt-3 p-3 bg-slate-800/50 rounded-xl">
                        <div className="flex items-center text-small text-blue-200">
                          <Award className="w-4 h-4 mr-2 text-yellow-400" />
                          <span className="font-medium">Assigned Task:</span> {volunteer.assigned_task}
                        </div>
                      </div>
                    )}

                    {role === "ADMIN" && volunteer.status !== 'approved' && (
                      <div className="mt-3 flex justify-end">
                        <AnimatedButton
                          variant="glass"
                          size="sm"
                          icon={<CheckCircle size={14} />}
                          onClick={() => approveVolunteer(volunteer.id)}
                        >
                          Approve + Assign
                        </AnimatedButton>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {volunteers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-body text-blue-200">No volunteers registered yet</p>
                    <p className="text-small text-blue-300 mt-2">Be the first to join the response team</p>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Volunteer Statistics */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-4x1"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.3}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {volunteers.length}
              </p>
              <p className="text-small text-blue-200 mt-1">Total Volunteers</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.4}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {volunteers.filter(v => v.status === 'approved').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Approved</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.5}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {volunteers.filter(v => v.availability === '24x7').length}
              </p>
              <p className="text-small text-blue-200 mt-1">24/7 Available</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.6}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {volunteers.filter(v => v.assigned_task).length}
              </p>
              <p className="text-small text-blue-200 mt-1">Assigned</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
