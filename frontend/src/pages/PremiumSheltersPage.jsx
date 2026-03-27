import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, MapPin, Phone, Shield, Search, Filter } from "lucide-react";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import FloatingInput from "../components/ui/FloatingInput";

export default function PremiumSheltersPage() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    capacity: "all",
    status: "all"
  });

  const loadShelters = async () => {
    setLoading(true);
    try {
      const response = await api.get("/shelters");
      setShelters(response.data);
    } catch (error) {
      console.error("Failed to load shelters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, []);

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = filters.capacity === "all" || 
                           (filters.capacity === "available" && shelter.available_capacity > 0) ||
                           (filters.capacity === "full" && shelter.available_capacity === 0);
    const matchesStatus = filters.status === "all" || shelter.status === filters.status;
    
    return matchesSearch && matchesCapacity && matchesStatus;
  });

  const getCapacityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (percentage > 20) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getCapacityText = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "Available";
    if (percentage > 20) return "Limited";
    return "Full";
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
            <h1 className="text-hero font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Shelters
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Real-time shelter capacities and emergency accommodation management
            </p>
          </div>
          <AnimatedButton 
            variant="glass" 
            icon={<Filter size={16} />}
            onClick={loadShelters}
            loading={loading}
          >
            Refresh Data
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.1}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
              <Search className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-h2 font-semibold text-white">Search & Filter</h2>
              <p className="text-small text-blue-200">Find shelters by location and capacity</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <FloatingInput
              label="Search shelters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
            
            <div>
              <label className="text-small text-blue-200 mb-2 block">Capacity Status</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              >
                <option value="all">All Shelters</option>
                <option value="available">Available</option>
                <option value="full">Full Capacity</option>
              </select>
            </div>
            
            <div>
              <label className="text-small text-blue-200 mb-2 block">Operational Status</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-slate-600 transition-all"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="standby">Standby</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Hero Image */}
      <motion.div 
        variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1200&q=80"
          alt="Emergency shelter camp"
          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <Home className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Emergency Shelter Network</h2>
            <p className="text-lg text-blue-200">Safe havens during disaster response</p>
          </div>
        </div>
      </motion.div>

      {/* Shelter Statistics */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-4x1"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.2}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {shelters.length}
              </p>
              <p className="text-small text-blue-200 mt-1">Total Shelters</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.3}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {shelters.reduce((acc, s) => acc + (s.available_capacity || 0), 0)}
              </p>
              <p className="text-small text-blue-200 mt-1">Available Beds</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.4}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {shelters.filter(s => s.status === 'active').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Active Facilities</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.5}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {shelters.filter(s => s.available_capacity > 0).length}
              </p>
              <p className="text-small text-blue-200 mt-1">With Capacity</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Shelter List */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.6}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Home className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-white">Shelter Directory</h2>
                <p className="text-small text-blue-200">Real-time capacity and contact information</p>
              </div>
            </div>
            <div className="text-small text-blue-300">
              {filteredShelters.length} of {shelters.length} shelters
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
              {filteredShelters.map((shelter, index) => (
                <motion.div
                  key={shelter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bento-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-h3 font-semibold text-white mb-2">{shelter.name}</h3>
                      <div className="flex items-center text-small text-blue-200 mb-2">
                        <MapPin size={14} className="mr-1" />
                        {shelter.address}
                      </div>
                      {shelter.contact && (
                        <div className="flex items-center text-small text-blue-200">
                          <Phone size={14} className="mr-1" />
                          {shelter.contact}
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCapacityColor(shelter.available_capacity, shelter.total_capacity)}`}>
                      {getCapacityText(shelter.available_capacity, shelter.total_capacity)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-800/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-h3 font-bold text-green-400">{shelter.available_capacity || 0}</p>
                      <p className="text-caption text-blue-200">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-h3 font-bold text-blue-400">{shelter.total_capacity || 0}</p>
                      <p className="text-caption text-blue-200">Total Capacity</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shelter.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      shelter.status === 'standby' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {shelter.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                    <AnimatedButton variant="glass" size="sm" icon={<MapPin size={14} />}>
                      View on Map
                    </AnimatedButton>
                  </div>
                </motion.div>
              ))}
              
              {filteredShelters.length === 0 && (
                <div className="text-center py-12">
                  <Home className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-body text-blue-200">No shelters found</p>
                  <p className="text-small text-blue-300 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
