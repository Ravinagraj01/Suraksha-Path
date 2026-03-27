import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, AlertTriangle, ExternalLink, RefreshCw, Clock, MapPin, TrendingUp, Filter } from "lucide-react";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";

function RiskBadge({ value }) {
  const colors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[value] || colors.low}`}>
      {value?.toUpperCase()}
    </span>
  );
}

export default function PremiumNewsPage() {
  const [news, setNews] = useState([]);
  const [meta, setMeta] = useState({ generated_at: "", providers: [], errors: [] });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/news/ai-disaster-updates?limit=15");
      setNews(response.data.items || []);
      setMeta({
        generated_at: response.data.generated_at,
        providers: response.data.providers || [],
        errors: response.data.errors || [],
      });
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60000);
    return () => clearInterval(id);
  }, []);

  const filteredNews = useMemo(() => {
    if (filter === "all") return news;
    return news.filter(item => item.risk_level === filter);
  }, [news, filter]);

  const headerNote = useMemo(() => {
    if (meta.errors.length) return "Live providers partially unavailable; fallback logic active.";
    return "Auto-refreshes every 60 seconds from free live disaster feeds.";
  }, [meta.errors]);

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'low': return <Clock className="w-4 h-4 text-green-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
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
            <h1 className="text-hero font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              AI News
            </h1>
            <p className="text-body text-blue-200 mt-2">
              Real-time disaster intelligence and emergency updates
            </p>
          </div>
          <AnimatedButton 
            variant="glass" 
            icon={<RefreshCw size={16} />}
            onClick={fetchNews}
            loading={loading}
          >
            Refresh
          </AnimatedButton>
        </div>
      </motion.div>

      {/* News Header */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <Newspaper className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">AI Disaster News - India</h2>
                  <p className="text-small text-blue-200">{headerNote}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-small">
                <div className="flex items-center text-blue-200">
                  <Clock className="w-4 h-4 mr-2" />
                  Updated: {meta.generated_at ? new Date(meta.generated_at).toLocaleString() : "Loading..."}
                </div>
                <div className="flex items-center text-blue-200">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Sources: {meta.providers.join(", ") || "N/A"}
                </div>
                <div className="flex items-center text-blue-200">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {meta.errors.length} errors
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Filter Controls */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <GlassCard delay={0.2}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Filter className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-white">Filter by Risk Level</h3>
              <p className="text-small text-blue-200">Show news based on severity</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {['all', 'high', 'medium', 'low'].map((level) => (
              <AnimatedButton
                key={level}
                variant={filter === level ? 'primary' : 'glass'}
                size="sm"
                onClick={() => setFilter(level)}
              >
                {level === 'all' ? 'All News' : `${level.toUpperCase()} Risk`}
              </AnimatedButton>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* News Grid */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-3x1"
      >
        {loading ? (
          [...Array(6)].map((_, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <GlassCard>
                <div className="space-y-3">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-6 w-full rounded" />
                  <div className="skeleton h-16 w-full rounded" />
                  <div className="skeleton h-4 w-32 rounded" />
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          filteredNews.map((item, index) => (
            <motion.article
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GlassCard delay={index * 0.1}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-caption text-blue-300 font-semibold">{item.source}</span>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(item.risk_level)}
                      <RiskBadge value={item.risk_level} />
                    </div>
                  </div>
                  <h3 className="text-h3 font-semibold text-white leading-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body text-blue-200 leading-relaxed mb-3">
                    {item.ai_summary}
                  </p>
                  
                  {item.location && (
                    <div className="flex items-center text-small text-blue-200 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="flex items-center text-caption text-blue-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : "No date"}
                  </div>
                  
                  {item.url ? (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center text-small text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>Read source</span>
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  ) : (
                    <span className="text-caption text-gray-400">No link</span>
                  )}
                </div>
              </GlassCard>
            </motion.article>
          ))
        )}
      </motion.div>

      {/* News Statistics */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bento-grid bento-grid-4x1"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.3}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Newspaper className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {news.length}
              </p>
              <p className="text-small text-blue-200 mt-1">Total Articles</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.4}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                {news.filter(n => n.risk_level === 'high').length}
              </p>
              <p className="text-small text-blue-200 mt-1">High Risk</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.5}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {news.filter(n => n.risk_level === 'medium').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Medium Risk</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <GlassCard delay={0.6}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-hero font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {news.filter(n => n.risk_level === 'low').length}
              </p>
              <p className="text-small text-blue-200 mt-1">Low Risk</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {filteredNews.length === 0 && !loading && (
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-center py-12"
        >
          <Newspaper className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-h3 font-semibold text-white mb-2">No news found</p>
          <p className="text-body text-blue-200">Try adjusting your filters or refresh the data</p>
        </motion.div>
      )}
    </motion.div>
  );
}
