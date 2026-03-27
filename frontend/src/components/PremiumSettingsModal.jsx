import { motion } from "framer-motion";
import { X, Settings, Filter, Calendar, MapPin, AlertTriangle, Moon, Sun, Bell, Shield, Database } from "lucide-react";

import GlassCard from "./ui/GlassCard";
import AnimatedButton from "./ui/AnimatedButton";
import FloatingInput from "./ui/FloatingInput";
import { useTheme } from "../context/ThemeContext";

export default function PremiumSettingsModal({ open, onClose }) {
  const { theme, toggleTheme } = useTheme();

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard>
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-white">Settings & Preferences</h2>
                  <p className="text-small text-blue-200">Customize your dashboard experience</p>
                </div>
              </div>
              <AnimatedButton
                variant="glass"
                size="sm"
                icon={<X size={16} />}
                onClick={onClose}
              >
                Close
              </AnimatedButton>
            </div>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="bento-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold text-white">Theme</h3>
                      <p className="text-caption text-blue-200">Choose your preferred theme</p>
                    </div>
                  </div>
                  <AnimatedButton
                    variant={theme === 'dark' ? 'primary' : 'glass'}
                    size="sm"
                    onClick={toggleTheme}
                    icon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </AnimatedButton>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bento-card p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <Bell className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-semibold text-white">Notifications</h3>
                    <p className="text-caption text-blue-200">Manage alert preferences</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">SOS Alerts</p>
                      <p className="text-caption text-blue-200">Real-time emergency notifications</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">System Updates</p>
                      <p className="text-caption text-blue-200">Platform notifications</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">News Updates</p>
                      <p className="text-caption text-blue-200">AI-powered disaster news</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Settings */}
              <div className="bento-card p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
                    <Filter className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-semibold text-white">Default Filters</h3>
                    <p className="text-caption text-blue-200">Set your preferred view filters</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-small text-blue-200 mb-2 block">Default State</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>All States</option>
                      <option>Maharashtra</option>
                      <option>Gujarat</option>
                      <option>Karnataka</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-small text-blue-200 mb-2 block">Default District</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>All Districts</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                      <option>Nagpur</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-small text-blue-200 mb-2 block">Severity Filter</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>All Levels</option>
                      <option>Critical Only</option>
                      <option>High & Critical</option>
                      <option>Medium & Above</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-small text-blue-200 mb-2 block">Date Range</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>Last 24 Hours</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 3 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bento-card p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-semibold text-white">Privacy & Security</h3>
                    <p className="text-caption text-blue-200">Manage your data preferences</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">Location Sharing</p>
                      <p className="text-caption text-blue-200">Share location for SOS requests</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">Analytics</p>
                      <p className="text-caption text-blue-200">Help improve the platform</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bento-card p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <Database className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-semibold text-white">Data Management</h3>
                    <p className="text-caption text-blue-200">Cache and storage settings</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">Clear Cache</p>
                      <p className="text-caption text-blue-200">Free up storage space</p>
                    </div>
                    <AnimatedButton variant="glass" size="sm">
                      Clear Now
                    </AnimatedButton>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body text-white">Export Data</p>
                      <p className="text-caption text-blue-200">Download your activity data</p>
                    </div>
                    <AnimatedButton variant="glass" size="sm">
                      Export
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-700">
              <AnimatedButton variant="glass" onClick={onClose}>
                Cancel
              </AnimatedButton>
              <AnimatedButton variant="primary" onClick={onClose}>
                Save Changes
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
