import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  AlertTriangle, 
  Home, 
  FileText, 
  Users, 
  Map, 
  Newspaper, 
  Send, 
  Upload, 
  Navigation,
  Activity,
  CheckCircle
} from "lucide-react";

import KpiCard from "../components/ui/KpiCard";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import PremiumMapCard from "../components/Map/PremiumMapCard";
import api from "../services/api";

export default function PremiumUserDashboard() {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [sos, setSos] = useState([]);
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sheltersRes, sosRes, reportsRes, volunteersRes] = await Promise.all([
          api.get("/shelters").catch(() => ({ data: [] })),
          api.get("/sos").catch(() => ({ data: [] })),
          api.get("/damage-reports").catch(() => ({ data: [] })),
          api.get("/volunteers").catch(() => ({ data: [] }))
        ]);
        setShelters(sheltersRes.data);
        setSos(sosRes.data);
        setReports(reportsRes.data);
        setVolunteers(volunteersRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const quickActions = [
    {
      title: "Raise SOS",
      description: "Emergency assistance request",
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      color: "from-red-500/20 to-orange-500/20",
      route: "/dashboard/sos",
      badge: "●"
    },
    {
      title: "Upload Damage Proof",
      description: "Submit evidence and photos",
      icon: <Upload className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/20 to-purple-500/20",
      route: "/dashboard/reports",
      badge: "+"
    },
    {
      title: "Find Assigned Shelter",
      description: "Locate emergency accommodation",
      icon: <Home className="w-5 h-5 text-green-400" />,
      color: "from-green-500/20 to-blue-500/20",
      route: "/dashboard/shelters",
      badge: "→"
    },
    {
      title: "View Live AI News",
      description: "Real-time disaster updates",
      icon: <Newspaper className="w-5 h-5 text-orange-400" />,
      color: "from-orange-500/20 to-yellow-500/20",
      route: "/dashboard/news",
      badge: "↗"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Section */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.1}>
          <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-8">
            <div>
              <p className="text-small text-blue-300 font-medium uppercase tracking-wider">Citizen Operations Panel</p>
              <h1 className="mt-4 text-display font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent md:leading-[1.05]">
                Your Disaster Readiness Hub
              </h1>
              <p className="mt-6 max-w-xl text-body text-blue-200 leading-relaxed">
                Track SOS, upload field evidence, follow AI disaster updates, and collaborate with district volunteer teams.
              </p>
            </div>
            
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1400&q=80"
                alt="Citizen support collaboration"
                className="relative h-64 w-full rounded-2xl object-cover border border-slate-700"
              />
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <div className="bento-grid bento-grid-4x1">
          <KpiCard
            label="Nearby Shelters"
            value={shelters.length}
            delta="Safe"
            tone="success"
            icon={<Home className="w-5 h-5" />}
            delay={0.2}
          />
          <KpiCard
            label="Local Alerts"
            value="4"
            delta="Watch"
            tone="warning"
            icon={<AlertTriangle className="w-5 h-5" />}
            delay={0.3}
          />
          <KpiCard
            label="My SOS Requests"
            value={sos.length}
            delta="Live"
            tone="danger"
            icon={<Send className="w-5 h-5" />}
            delay={0.4}
          />
          <KpiCard
            label="My Damage Reports"
            value={reports.length}
            delta="Monitor"
            tone="primary"
            icon={<FileText className="w-5 h-5" />}
            delay={0.5}
          />
        </div>
      </motion.div>

      {/* Quick Actions & Community */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <div className="bento-grid bento-grid-2x1">
          {/* Quick Actions */}
          <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}>
            <GlassCard delay={0.6}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h2 font-semibold text-white">Citizen Quick Actions</h2>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-xs font-semibold text-blue-300 border border-blue-500/30">
                    Live Workspace
                  </span>
                </div>
                <p className="text-body text-blue-200">
                  Run critical tasks quickly during emergency response windows.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    onClick={() => navigate(action.route)}
                    className="group relative overflow-hidden rounded-xl border border-slate-600 bg-slate-800 p-4 text-left transition-all hover:border-blue-400 hover:bg-slate-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: `linear-gradient(135deg, ${action.color.replace('from-', '').replace(' to-', ', ')})` }} />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                          {action.icon}
                        </div>
                        <div>
                          <p className="text-body font-medium text-white">{action.title}</p>
                          <p className="text-caption text-blue-200">{action.description}</p>
                        </div>
                      </div>
                      <span className="text-lg text-blue-400 group-hover:scale-110 transition-transform">
                        {action.badge}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <p className="text-caption text-blue-300 uppercase tracking-wider">Community Pulse</p>
                </div>
                <p className="text-h3 font-semibold text-white mb-1">
                  Volunteer profiles submitted: {volunteers.length}
                </p>
                <p className="text-small text-blue-200">
                  Local support strength for relief operations.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Shelter Coordination */}
          <motion.div variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}>
            <GlassCard delay={0.7}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1469571486292-b53601020848?auto=format&fit=crop&w=1200&q=80"
                  alt="Shelter coordination"
                  className="relative h-56 w-full rounded-2xl object-cover border border-slate-700"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="backdrop-blur-md bg-slate-800/80 rounded-xl p-3 border border-slate-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-small font-medium text-white">Shelter coordination active</p>
                    </div>
                    <p className="text-caption text-blue-200 mt-1">
                      {shelters.filter(s => s.available_capacity > 0).length} shelters with available capacity
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Map Section */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.8}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
              <Map className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-h2 font-semibold text-white">Public Risk and Shelter Map</h2>
              <p className="text-small text-blue-200">Live monitoring of incidents and safe locations</p>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-xl overflow-hidden border border-slate-700">
            <PremiumMapCard 
              shelters={shelters} 
              sos={sos} 
              riskZones={[{ id: "u-risk", points: [[20.2, 78.4], [20.5, 78.9], [20.1, 79.2]] }]} 
              title="" 
            />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
