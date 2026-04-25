import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, MapPin, Search, AlertTriangle, CheckCircle,
  Thermometer, Wind, Droplets, CloudRain, RefreshCw,
  Activity, TrendingUp, Info, ChevronDown, ChevronUp,
  History, Zap
} from "lucide-react";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import AnimatedButton from "../components/ui/AnimatedButton";

// ── Helpers ────────────────────────────────────────────────────────────────

const RISK_SAFE = "SAFE";
const RISK_HIGH = "HIGH RISK";

function riskColor(risk) {
  if (!risk) return "text-gray-400";
  if (risk === RISK_SAFE) return "text-green-400";
  if (risk === RISK_HIGH) return "text-red-400";
  return "text-yellow-400";
}

function riskBg(risk) {
  if (!risk) return "bg-gray-500/20 border-gray-500/30";
  if (risk === RISK_SAFE) return "bg-green-500/20 border-green-500/30";
  if (risk === RISK_HIGH) return "bg-red-500/20 border-red-500/30";
  return "bg-yellow-500/20 border-yellow-500/30";
}

function riskIcon(risk, size = "w-5 h-5") {
  if (risk === RISK_SAFE) return <CheckCircle className={`${size} text-green-400`} />;
  if (risk === RISK_HIGH) return <AlertTriangle className={`${size} text-red-400`} />;
  return <AlertTriangle className={`${size} text-yellow-400`} />;
}

function ScoreBar({ value, max = 10, color = "from-blue-500 to-purple-500" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-2 rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
}

function barColor(score) {
  if (score < 3.5) return "from-green-500 to-emerald-400";
  if (score < 6) return "from-yellow-500 to-orange-400";
  return "from-red-500 to-rose-400";
}

// Maps NN level number to a display label matching our rule-based labels
function nnLevelToLabel(level) {
  if (level === 0) return RISK_SAFE;
  if (level === 2) return RISK_HIGH;
  return "MODERATE RISK";
}

// Decides the final verdict when the two models disagree
function combinedVerdict(ruleBased, nnLevel) {
  const nnLabel = nnLevelToLabel(nnLevel);
  if (ruleBased === nnLabel) return { label: ruleBased, agreed: true };
  // Models disagree — take the more conservative (higher risk) reading
  const order = [RISK_SAFE, "MODERATE RISK", RISK_HIGH];
  const ruleIdx = order.indexOf(ruleBased);
  const nnIdx = order.indexOf(nnLabel);
  return { label: order[Math.max(ruleIdx, nnIdx)], agreed: false };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ModelDisagreementNote({ ruleBased, nnLabel }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-blue-200 space-y-1">
        <p className="font-semibold text-blue-300">Why do the two scores differ?</p>
        <p>
          The <span className="text-white font-medium">Combined Score</span> ({ruleBased}) includes live weather data
          and is scored on a numeric scale — even a small margin above the threshold triggers a higher label.
        </p>
        <p>
          The <span className="text-white font-medium">Neural Network</span> ({nnLabel}) is trained on long-term
          historical disaster patterns only and does not see real-time weather, so it reflects the district's
          baseline risk profile.
        </p>
        <p className="text-blue-300 font-medium">
          The overall verdict uses the more cautious of the two assessments.
        </p>
      </div>
    </div>
  );
}

function RiskCard({ result }) {
  const [expanded, setExpanded] = useState(false);

  const nnLabel = nnLevelToLabel(result.nn_risk_level);
  const verdict = combinedVerdict(result.risk, result.nn_risk_level);
  const modelsDisagree = !verdict.agreed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* ── Header: location + overall verdict ── */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{result.district}</h2>
              {result.is_alias && (
                <p className="text-xs text-purple-400 mb-0.5">
                  "{result.searched_as}" resolved to {result.district} (official district name)
                </p>
              )}
              <p className="text-sm text-gray-400">
                {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                {result.is_coordinate_input && (
                  <span className="ml-2 text-purple-400">
                    · nearest district to your coordinates (dist: {result.coordinate_distance}°)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Overall verdict badge */}
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${riskBg(verdict.label)}`}>
              {riskIcon(verdict.label)}
              <span className={`font-bold text-sm ${riskColor(verdict.label)}`}>
                {verdict.label}
              </span>
            </div>
            <p className="text-xs text-gray-500">Overall verdict (most cautious)</p>
          </div>
        </div>
      </GlassCard>

      {/* ── Disagreement explanation ── */}
      {modelsDisagree && (
        <ModelDisagreementNote ruleBased={result.risk} nnLabel={nnLabel} />
      )}

      {/* ── Two model score cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model 1: rule-based (history + weather) */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/20">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Combined Score</p>
              <p className="text-xs text-gray-400">Historical data + live weather</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {result.final_score}
            <span className="text-base text-gray-400">/10</span>
          </p>
          <ScoreBar value={result.final_score} color={barColor(result.final_score)} />
          <div className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${riskBg(result.risk)}`}>
            {riskIcon(result.risk, "w-3.5 h-3.5")}
            <span className={`text-xs font-semibold ${riskColor(result.risk)}`}>{result.risk}</span>
          </div>
          {result.seasonal_info?.length > 0 && (
            <p className="mt-2 text-xs text-yellow-400">
              ↑ Seasonal boost applied · Adjusted: {result.adjusted_seasonal_score}/10
            </p>
          )}
        </GlassCard>

        {/* Model 2: neural network (historical patterns only) */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-purple-500/20">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Neural Network</p>
              <p className="text-xs text-gray-400">Historical patterns only (no live weather)</p>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${riskColor(nnLabel)}`}>{nnLabel}</p>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs text-gray-400">Confidence:</p>
            <p className="text-sm font-bold text-white">{result.nn_confidence?.toFixed(1)}%</p>
          </div>
          <ScoreBar value={result.nn_confidence || 0} max={100} color="from-purple-500 to-pink-500" />
          <p className="mt-3 text-xs text-gray-500">
            Trained on flood, cyclone, earthquake, drought &amp; historical scores of all 31 districts
          </p>
        </GlassCard>
      </div>

      {/* ── Disaster type breakdown ── */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Disaster Type Risks
        </h3>
        <div className="space-y-4">
          {[
            { label: "Flood", key: "flood_risk", icon: "🌊" },
            { label: "Cyclone", key: "cyclone_risk", icon: "🌪️" },
            { label: "Earthquake", key: "earthquake_risk", icon: "🏚️" },
            { label: "Drought", key: "drought_risk", icon: "🏜️" },
          ].map(({ label, key, icon }) => {
            const val = result.disaster_risks[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-6 text-center">{icon}</span>
                <span className="w-24 text-sm text-gray-300">{label}</span>
                <div className="flex-1">
                  <ScoreBar value={val} color={barColor(val)} />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-white">{val}/10</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-gray-400">
          <span>Historical composite score</span>
          <span className="text-white font-semibold">{result.historical_score}/10</span>
        </div>
      </GlassCard>

      {/* ── Weather + Seasonal ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.weather_data && (
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Current Weather
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-400">Temperature</p>
                  <p className="text-white font-semibold">{result.weather_data.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Humidity</p>
                  <p className="text-white font-semibold">{result.weather_data.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-gray-400">Rainfall</p>
                  <p className="text-white font-semibold">{result.weather_data.rainfall} mm/hr</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <div>
                  <p className="text-xs text-gray-400">Wind Speed</p>
                  <p className="text-white font-semibold">{result.weather_data.wind} km/h</p>
                </div>
              </div>
            </div>
            {result.weather_score !== null && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">
                  Weather Risk Score:{" "}
                  <span className="text-white">{result.weather_score}/10</span>
                </p>
                <ScoreBar value={result.weather_score} color={barColor(result.weather_score)} />
              </div>
            )}
          </GlassCard>
        )}

        {result.seasonal_info?.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Seasonal Factors
            </h3>
            <div className="space-y-2 mb-4">
              {result.seasonal_info.map((info, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-300">{info}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-slate-700/50">
              <p className="text-xs text-gray-400 mb-1">Seasonally adjusted score</p>
              <p className="text-xl font-bold text-white">
                {result.adjusted_seasonal_score}
                <span className="text-sm text-gray-400">/10</span>
              </p>
              <ScoreBar
                value={result.adjusted_seasonal_score}
                color={barColor(result.adjusted_seasonal_score)}
              />
            </div>
          </GlassCard>
        )}
      </div>

      {/* ── AI Insights ── */}
      {result.ai_insights?.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" /> AI-Powered Insights
          </h3>
          <div className="space-y-2">
            {result.ai_insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
              >
                <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-purple-200">{insight}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Similar districts ── */}
      {result.similar_districts?.length > 0 && (
        <GlassCard className="p-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Similar Disaster Patterns
            </h3>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-xs text-gray-500">
                  Districts with the most similar long-term disaster risk profile (via K-Means clustering)
                </p>
                <div className="mt-3 space-y-2">
                  {result.similar_districts.map((sd, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{i + 1}.</span>
                        <span className="text-white font-medium">{sd.district}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        Pattern similarity: {(1 / (1 + sd.distance)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      )}
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function PremiumDisasterPredictionPage() {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    api
      .get("/ai/disaster-districts")
      .then((res) => setDistricts(res.data.districts || []))
      .catch(() => {});
  }, []);

  const handleInput = (val) => {
    setLocation(val);
    if (val.length >= 2) {
      const matches = districts.filter((d) =>
        d.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectDistrict = (name) => {
    setLocation(name);
    setShowSuggestions(false);
  };

  const handlePredict = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.get(
        `/ai/disaster-predict?location=${encodeURIComponent(location.trim())}`
      );
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handlePredict();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Disaster Prediction</h1>
          <p className="text-gray-400 text-sm">
            Neural network + live weather analysis for any Karnataka district
          </p>
        </div>
      </motion.div>

      {/* Search Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => location.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Enter district name (e.g. Kodagu, Mangalore) or coordinates (12.97,77.59)"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {suggestions.map((d, i) => (
                    <button
                      key={i}
                      onMouseDown={() => selectDistrict(d)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3 text-purple-400" />
                      {d}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatedButton
            onClick={handlePredict}
            disabled={loading || !location.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-semibold whitespace-nowrap disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Analysing…
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" /> Predict Risk
              </>
            )}
          </AnimatedButton>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Covers all 31 Karnataka districts · Aliases supported (e.g. Mangalore → Dakshina
          Kannada) · Real-time weather from Open-Meteo
        </p>
      </GlassCard>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-slate-700/50 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-36 bg-slate-700/50 rounded-2xl" />
            <div className="h-36 bg-slate-700/50 rounded-2xl" />
          </div>
          <div className="h-48 bg-slate-700/50 rounded-2xl" />
        </div>
      )}

      {/* Result */}
      {result && !loading && <RiskCard result={result} />}

      {/* Empty state */}
      {!result && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-purple-400 opacity-60" />
          </div>
          <p className="text-gray-400 text-lg font-medium">Enter a location to get started</p>
          <p className="text-gray-500 text-sm mt-1">
            Type a Karnataka district or common name (e.g. Mangalore, Bangalore, Coorg)
          </p>
        </motion.div>
      )}
    </div>
  );
}
