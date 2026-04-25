import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity, 
  TrendingUp, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Home
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
  const [shelters, setShelters] = useState([]);
  const [sos, setSos] = useState([]);
  const [reports, setReports] = useState([]);
  const [incidents, setIncidents] = useState([
    { id: '74b432b3', message: 'WebSocket Test SOS', severity: 'medium', status: 'open', createdAt: '2024-03-27T14:30:00Z', location: 'Mumbai Central', affectedPeople: 0 },
    { id: '71554e53', message: 'WebSocket Test SOS', severity: 'medium', status: 'open', createdAt: '2024-03-27T14:25:00Z', location: 'Pune Station', affectedPeople: 0 },
    { id: '45f9191e', message: 'Test SOS - Emergency flood situation', severity: 'high', status: 'open', createdAt: '2024-03-27T14:20:00Z', location: 'Delhi North', affectedPeople: 12 },
    { id: 'bc6b6b66', message: 'Need emergency support near flooded market.', severity: 'high', status: 'open', createdAt: '2024-03-27T14:15:00Z', location: 'Kolkata Market', affectedPeople: 8 },
    { id: 'd3a0dd45', message: 'Flash flood near Riverside Block, 3 people stranded', severity: 'critical', status: 'open', createdAt: '2024-03-27T14:10:00Z', location: 'Chennai Riverside', affectedPeople: 3 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

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
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // WebSocket connection with error handling
    let socket = null;
    try {
      socket = connectSocket("/ws");
      if (socket) {
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'newSOS') {
              setSos(prev => [data.payload, ...prev]);
            } else if (data.type === 'newReport') {
              setReports(prev => [data.payload, ...prev]);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      }
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  // Helper functions for incidents
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'in_progress': return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'closed': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-yellow-400';
      case 'in_progress': return 'text-blue-400';
      case 'resolved': return 'text-green-400';
      case 'closed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

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

      {/* Enhanced Recent Incidents Section */}
      <motion.div variants={itemVariants}>
        <GlassCard delay={1.0}>
          {/* Header with Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-h2 font-semibold text-white mb-2">Recent Incidents</h2>
                <p className="text-small text-gray-400">Latest SOS alerts and damage reports</p>
              </div>
              <div className="flex items-center gap-3">
                <AnimatedButton variant="glass" size="sm" icon={<RefreshCw size={14} />}>
                  Refresh
                </AnimatedButton>
                <AnimatedButton variant="primary" size="sm" icon={<Eye size={14} />}>
                  View All
                </AnimatedButton>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-slate-600"
                />
              </div>
              
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-600"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-600"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <div className="flex items-center justify-between text-small text-gray-400">
                <span>{filteredIncidents.length} incidents</span>
                <span className="text-green-400">Live</span>
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">ID</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">Message</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">Severity</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">Location</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">Affected</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-gray-300">Created</th>
                  <th className="text-center py-3 px-4 text-small font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident, index) => (
                  <motion.tr
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-small font-mono text-purple-300">{incident.id.slice(0, 8)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-small text-white max-w-xs truncate">{incident.message}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(incident.status)}
                        <span className={`text-small font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-small text-gray-300">
                        <MapPin size={14} className="mr-1" />
                        {incident.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-small text-gray-300">
                        <User size={14} className="mr-1" />
                        {incident.affectedPeople || 0}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-small text-gray-300">
                        <Clock size={14} className="mr-1" />
                        {formatTime(incident.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-1.5 rounded hover:bg-slate-700 transition-colors group">
                          <Eye size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-700 transition-colors group">
                          <Edit size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-700 transition-colors group">
                          <Trash2 size={14} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
            <div className="text-small text-gray-400">
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded">1</span>
              <button className="px-3 py-1 rounded bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
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
