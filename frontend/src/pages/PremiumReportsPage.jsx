import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Camera, MapPin, Send, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import FloatingInput from "../components/ui/FloatingInput";

export default function PremiumReportsPage() {
  const [reports, setReports] = useState([]);
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "Flood damage in Sector 7",
    description: "Ground floor damaged, electrical wiring exposed, urgent inspection needed.",
    latitude: 20.5937,
    longitude: 78.9629,
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/damage-reports");
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/meta/bootstrap").then((r) => setScope({ state_id: r.data.state_id, district_id: r.data.district_id })).catch(() => {});
    fetchReports();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setUploading(true);
    
    const data = new FormData();
    data.append("state_id", scope.state_id);
    data.append("district_id", scope.district_id);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("latitude", String(form.latitude));
    data.append("longitude", String(form.longitude));
    Array.from(files).forEach((file) => data.append("files", file));

    try {
      await api.post("/damage-reports", data, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus("Damage report uploaded successfully.");
      setFiles([]);
      fetchReports();
      setForm({
        title: "",
        description: "",
        latitude: 20.5937,
        longitude: 78.9629,
      });
    } catch (error) {
      setStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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
            <h1 className="text-hero font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Reports
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Damage evidence collection and field assessment management
            </p>
          </div>
          <AnimatedButton 
            variant="glass" 
            icon={<RefreshCw size={16} />}
            onClick={fetchReports}
            loading={loading}
          >
            Refresh
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <div className="bento-grid bento-grid-2x1">
          {/* Upload Form */}
          <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}>
            <GlassCard delay={0.1}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <Upload className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">Upload Damage Evidence</h2>
                  <p className="text-small text-blue-200">Images and location for assessment</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={submit}>
                <FloatingInput
                  label="Report Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />

                <div>
                  <label className="text-small text-blue-200 mb-2 block">Description</label>
                  <textarea 
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all min-h-24 resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
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

                <div>
                  <label className="text-small text-blue-200 mb-2 block">Evidence Images</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => setFiles(e.target.files || [])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-slate-800/50"
                    >
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-small text-blue-200 mb-1">
                          {files.length > 0 ? `${files.length} file(s) selected` : "Click to upload images"}
                        </p>
                        <p className="text-caption text-blue-300">PNG, JPG up to 10MB each</p>
                      </div>
                    </label>
                  </div>
                </div>

                <AnimatedButton
                  variant="primary"
                  type="submit"
                  icon={<Send size={16} />}
                  className="w-full"
                  loading={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Report"}
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

          {/* Hero Image */}
          <motion.div 
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 z-10" />
            <img
              src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80"
              alt="Flood response"
              className="w-full h-full min-h-[400px] object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <FileText className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Damage Assessment</h2>
                <p className="text-lg text-blue-200">Document and report incident evidence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Reports Queue */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-white">Damage Report Queue</h2>
                <p className="text-small text-blue-200">Submitted reports and verification status</p>
              </div>
            </div>
            <div className="text-small text-blue-300">
              {reports.length} reports
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bento-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-h3 font-semibold text-white mb-2">{report.title}</h3>
                      <p className="text-body text-blue-200 mb-3 leading-relaxed">{report.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-small text-blue-200 mb-3">
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle size={14} className="mr-1" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                            {report.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(report.evidence_urls || []).length > 0 && (
                    <div className="mt-4">
                      <p className="text-small text-blue-200 mb-2">Evidence Images:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(report.evidence_urls || []).map((url, i) => (
                          <div key={i} className="relative group">
                            <img 
                              src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${url}`} 
                              alt={`Evidence ${i + 1}`}
                              className="w-full h-20 rounded-lg object-cover border border-slate-600 group-hover:border-blue-400 transition-colors cursor-pointer"
                              onClick={() => window.open(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${url}`, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-700">
                    <div className="text-caption text-blue-300">
                      Submitted: {report.created_at ? new Date(report.created_at).toLocaleString() : "Unknown"}
                    </div>
                    {report.status === 'verified' && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle size={16} className="mr-1" />
                        <span className="text-small">Verified</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {reports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-body text-blue-200">No damage reports submitted yet</p>
                  <p className="text-small text-blue-300 mt-2">Upload evidence to get started</p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Report Statistics */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-4x1"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.3}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {reports.length}
              </p>
              <p className="text-small text-blue-200 mt-1">Total Reports</p>
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
                {reports.filter(r => r.status === 'verified').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Verified</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.5}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {reports.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Pending</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.6}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {reports.reduce((acc, r) => acc + (r.evidence_urls?.length || 0), 0)}
              </p>
              <p className="text-small text-blue-200 mt-1">Total Images</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
