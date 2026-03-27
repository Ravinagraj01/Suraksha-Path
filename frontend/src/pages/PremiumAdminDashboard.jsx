import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  FileText, 
  Home, 
  CheckCircle, 
  TrendingUp,
  Activity,
  Users,
  Shield
} from "lucide-react";

import KpiCard from "../components/ui/KpiCard";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import PremiumTrendChart from "../components/Charts/PremiumTrendChart";
import PremiumDistributionChart from "../components/Charts/PremiumDistributionChart";
import CapacityBarChart from "../components/Charts/CapacityBarChart";
import DataTable from "../components/Tables/DataTable";
import MapCard from "../components/Map/MapCard";
import api from "../services/api";
import { connectSocket } from "../services/websocket";

export default function PremiumAdminDashboard() {
  const [sos, setSos] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sosRes, sheltersRes, reportsRes] = await Promise.all([
          api.get("/sos").catch(() => ({ data: [] })),
          api.get("/shelters").catch(() => ({ data: [] })),
          api.get("/damage-reports").catch(() => ({ data: [] }))
        ]);
        
        setSos(sosRes.data);
        setShelters(sheltersRes.data);
        setReports(reportsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const sosSocket = connectSocket("/ws/sos-feed", (msg) => {
      if (msg.event === "sos_created") setSos((prev) => [msg.data, ...prev].slice(0, 200));
    });

    const shelterSocket = connectSocket("/ws/shelter-updates", (msg) => {
      if (msg.event === "capacity_updated") {
        setShelters((prev) => prev.map((s) => (s.id === msg.data.id ? msg.data : s)));
      }
    });

    return () => {
      sosSocket.close();
      shelterSocket.close();
    };
  }, []);

  const trendData = useMemo(
    () => [
      { name: "Mon", sos: 12, resolved: 7 },
      { name: "Tue", sos: 19, resolved: 11 },
      { name: "Wed", sos: 17, resolved: 13 },
      { name: "Thu", sos: 26, resolved: 17 },
      { name: "Fri", sos: 31, resolved: 22 },
    ],
    []
  );

  const severityData = useMemo(
    () => [
      { name: "Low", value: 18 },
      { name: "Medium", value: 28 },
      { name: "High", value: 34 },
      { name: "Critical", value: 20 },
    ],
    []
  );

  const capacityData = useMemo(
    () => shelters.slice(0, 5).map((s) => ({ 
      name: s.name?.slice(0, 8) || "Shelter", 
      available: s.available_capacity || 0, 
      occupied: Math.max(0, (s.total_capacity || 0) - (s.available_capacity || 0)) 
    })),
    [shelters]
  );

  const riskZones = [{ id: "zone-1", points: [[20.2, 78.1], [20.9, 78.6], [20.4, 79.2]] }];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Command Center
          </h1>
          <p className="text-small text-gray-400">
            Real-time disaster management overview and response coordination
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <AnimatedButton variant="primary" icon={<Activity size={16} />}>
            Live Monitoring
          </AnimatedButton>
          <AnimatedButton variant="glass" icon={<Shield size={16} />}>
            Emergency Protocol
          </AnimatedButton>
        </div>
      </motion.div>

      {/* KPI Cards - Bento Grid */}
      <motion.div 
        variants={itemVariants}
        className="bento-grid bento-grid-4x1"
      >
        <KpiCard
          label="Active SOS"
          value={sos.filter((x) => x.status === "open").length}
          delta="+8%"
          tone="danger"
          icon={<AlertTriangle size={20} />}
          delay={0.1}
        />
        <KpiCard
          label="Damage Reports"
          value={reports.length}
          delta="+5%"
          tone="warning"
          icon={<FileText size={20} />}
          delay={0.2}
        />
        <KpiCard
          label="Open Shelters"
          value={shelters.length}
          delta="Stable"
          tone="primary"
          icon={<Home size={20} />}
          delay={0.3}
        />
        <KpiCard
          label="Resolved Today"
          value={sos.filter((x) => x.status !== "open").length}
          delta="Improving"
          tone="success"
          icon={<CheckCircle size={20} />}
          delay={0.4}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="bento-grid bento-grid-3x1">
        <div className="xl:col-span-2">
          <GlassCard delay={0.5}>
            <div className="mb-6">
              <h2 className="text-h2 font-semibold text-white mb-2">SOS Trends</h2>
              <p className="text-small text-gray-400">Weekly incident patterns and resolution rates</p>
            </div>
            <PremiumTrendChart data={trendData} />
          </GlassCard>
        </div>
        
        <GlassCard delay={0.6}>
          <div className="mb-6">
            <h2 className="text-h2 font-semibold text-white mb-2">Severity Distribution</h2>
            <p className="text-small text-gray-400">Incident priority breakdown</p>
          </div>
          <PremiumDistributionChart data={severityData} />
        </GlassCard>
      </motion.div>

      {/* Map and Analytics Section */}
      <motion.div variants={itemVariants} className="bento-grid bento-grid-3x1">
        <div className="xl:col-span-2">
          <GlassCard delay={0.7}>
            <div className="mb-6">
              <h2 className="text-h2 font-semibold text-white mb-2">Live Risk Map</h2>
              <p className="text-small text-gray-400">Real-time incident locations and shelter availability</p>
            </div>
            <MapCard 
              shelters={shelters} 
              sos={sos} 
              riskZones={riskZones} 
              title="" 
            />
          </GlassCard>
        </div>
        
        <div className="space-y-6">
          <GlassCard delay={0.8}>
            <div className="mb-6">
              <h2 className="text-h2 font-semibold text-white mb-2">Shelter Capacity</h2>
              <p className="text-small text-gray-400">Current occupancy rates</p>
            </div>
            <CapacityBarChart data={capacityData} />
          </GlassCard>
          
          <GlassCard delay={0.9}>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80"
                alt="Disaster response analytics"
                className="w-full h-36 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <h3 className="text-h3 font-semibold text-white mb-1">Response Analytics</h3>
                  <p className="text-caption text-gray-300">AI-powered insights</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Recent Incidents Table */}
      <motion.div variants={itemVariants}>
        <GlassCard delay={1.0}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-h2 font-semibold text-white mb-2">Recent Incidents</h2>
              <p className="text-small text-gray-400">Latest SOS alerts and damage reports</p>
            </div>
            <AnimatedButton variant="glass" size="sm">
              View All
            </AnimatedButton>
          </div>
          <DataTable rows={sos} />
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-caption text-gray-400">All systems operational</span>
          </div>
          <div className="text-caption text-gray-400">
            Last updated: <span className="text-white">2 min ago</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <AnimatedButton variant="glass" size="sm" icon={<Users size={14} />}>
            Contact Teams
          </AnimatedButton>
          <AnimatedButton variant="primary" size="sm" icon={<TrendingUp size={14} />}>
            Generate Report
          </AnimatedButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
