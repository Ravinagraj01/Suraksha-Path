import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Users, Send, RefreshCw } from "lucide-react";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import FloatingInput from "../components/ui/FloatingInput";

export default function PremiumSOSPage() {
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [sosList, setSosList] = useState([]);
  const [form, setForm] = useState({
    message: "Need emergency support near flooded market.",
    severity: "high",
    latitude: 20.5937,
    longitude: 78.9629,
    meta: { people: 2 },
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get("/sos");
      setSosList(response.data);
    } catch (error) {
      console.error("Failed to load SOS data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/meta/bootstrap").then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id })).catch(() => {});
    load();
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setForm((f) => ({
        ...f,
        latitude: Number(position.coords.latitude.toFixed(6)),
        longitude: Number(position.coords.longitude.toFixed(6)),
      }));
    });
  };

  const submitSOS = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      await api.post("/sos", { ...form, state_id: scope.state_id, district_id: scope.district_id });
      setStatus("SOS request submitted successfully.");
      load();
      setForm({
        message: "",
        severity: "medium",
        latitude: 20.5937,
        longitude: 78.9629,
        meta: { people: 1 },
      });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setStatus(typeof detail === "string" ? detail : "Failed to submit SOS.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'low': return 'bg-green-500/20 border-green-500 text-green-400';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
            <h1 className="text-hero font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              SOS Center
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Emergency response coordination and real-time incident tracking
            </p>
          </div>
          <AnimatedButton 
            variant="glass" 
            icon={<RefreshCw size={16} />}
            onClick={load}
            loading={loading}
          >
            Refresh
          </AnimatedButton>
        </div>
      </motion.div>

      <div className="bento-grid bento-grid-3x1">
        {/* SOS Form */}
        <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}>
          <GlassCard delay={0.1}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-white">Emergency SOS</h2>
                <p className="text-small text-blue-200">Submit incident details and live location</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={submitSOS}>
              <FloatingInput
                label="Emergency Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />

              <div>
                <label className="text-small text-blue-200 mb-2 block">Severity Level</label>
                <select 
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                  value={form.severity} 
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                >
                  <option value="low">Low - Minor assistance needed</option>
                  <option value="medium">Medium - Moderate urgency</option>
                  <option value="high">High - Immediate attention required</option>
                  <option value="critical">Critical - Life-threatening emergency</option>
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
                variant="glass"
                type="button"
                onClick={useCurrentLocation}
                icon={<MapPin size={16} />}
                className="w-full"
              >
                Use Current Location
              </AnimatedButton>

              <AnimatedButton
                variant="primary"
                type="submit"
                icon={<Send size={16} />}
                className="w-full"
                loading={loading}
              >
                Submit SOS
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

        {/* SOS Feed */}
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
                  <h2 className="text-h2 font-semibold text-white">SOS Feed</h2>
                  <p className="text-small text-blue-200">Live emergency requests and response status</p>
                </div>
              </div>
              <div className="text-small text-blue-300">
                {sosList.length} active requests
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {sosList.map((x, index) => (
                  <motion.div
                    key={x.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bento-card p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-body text-white font-medium mb-2">{x.message}</p>
                        <div className="flex items-center space-x-3 text-small">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(x.severity)}`}>
                            {x.severity?.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(x.status)}`}>
                            {x.status?.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-small text-blue-200">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{x.latitude?.toFixed(4)}, {x.longitude?.toFixed(4)}</span>
                      </div>
                      <div className="text-caption">
                        {new Date(x.created_at).toLocaleString()}
                      </div>
                    </div>

                    {x.meta?.people && (
                      <div className="mt-2 text-small text-blue-300">
                        People affected: {x.meta.people}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {sosList.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-body text-blue-200">No active SOS requests</p>
                    <p className="text-small text-blue-300 mt-2">Emergency feed will appear here</p>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
