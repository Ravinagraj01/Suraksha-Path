import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map, Filter, RefreshCw, Layers } from "lucide-react";

import PremiumMapCard from "../components/Map/PremiumMapCard";
import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";

export default function PremiumMapView() {
  const [shelters, setShelters] = useState([]);
  const [sos, setSos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    state: "all",
    district: "all", 
    severity: "all"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [sheltersRes, sosRes] = await Promise.all([
        api.get("/shelters").catch(() => ({ data: [] })),
        api.get("/sos").catch(() => ({ data: [] }))
      ]);
      setShelters(sheltersRes.data);
      setSos(sosRes.data);
    } catch (error) {
      console.error("Failed to load map data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
            <h1 className="text-hero font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Live Map
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Real-time geospatial disaster monitoring and response coordination
            </p>
          </div>
          <AnimatedButton 
            variant="glass" 
            icon={<RefreshCw size={16} />}
            onClick={loadData}
            loading={loading}
          >
            Refresh Map
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Map Filters */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.1}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Filter className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-h2 font-semibold text-white">Map Filters</h2>
              <p className="text-small text-blue-200">Filter incidents and shelters by location</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-small text-blue-200 mb-2 block">State</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              >
                <option value="all">All States</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="gujarat">Gujarat</option>
                <option value="karnataka">Karnataka</option>
              </select>
            </div>
            
            <div>
              <label className="text-small text-blue-200 mb-2 block">District</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              >
                <option value="all">All Districts</option>
                <option value="mumbai">Mumbai</option>
                <option value="pune">Pune</option>
                <option value="nagpur">Nagpur</option>
              </select>
            </div>
            
            <div>
              <label className="text-small text-blue-200 mb-2 block">Severity</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <AnimatedButton 
                variant="primary" 
                icon={<Layers size={16} />}
                className="w-full"
              >
                Apply Filters
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Map Card */}
      <motion.div 
        variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard delay={0.3} className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
                  <Map className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">Geospatial Disaster Monitoring</h2>
                  <p className="text-small text-blue-200">Live tracking of incidents and shelter locations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-small">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-blue-200">{sos.length} SOS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-blue-200">{shelters.length} Shelters</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-[600px]">
            <PremiumMapCard
              shelters={shelters}
              sos={sos}
              title=""
              riskZones={[
                { id: "m1", points: [[20.1, 78.3], [20.8, 79], [20.4, 79.4]] },
                { id: "m2", points: [[21.2, 77.5], [21.6, 78], [21.1, 78.4]] },
                { id: "m3", points: [[19.8, 77.8], [20.3, 78.2], [19.9, 78.6]] },
              ]}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Map Statistics */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-4x1"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.4}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                {sos.filter(s => s.severity === 'critical').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Critical Incidents</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.5}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {shelters.reduce((acc, s) => acc + (s.available_capacity || 0), 0)}
              </p>
              <p className="text-small text-blue-200 mt-1">Available Beds</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.6}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {shelters.length}
              </p>
              <p className="text-small text-blue-200 mt-1">Active Shelters</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.7}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {sos.filter(s => s.status === 'open').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Pending Response</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
