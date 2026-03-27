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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl mx-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard>
          <div className="p-4 md:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Settings className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-h2 md:text-h1 font-semibold text-white">Settings & Preferences</h2>
                  <p className="text-caption md:text-small text-blue-200 hidden md:block">Customize your dashboard experience</p>
                </div>
              </div>
              <AnimatedButton
                variant="glass"
                size="sm"
                icon={<X size={16} />}
                onClick={onClose}
                className="flex-shrink-0"
              >
                <span className="hidden md:inline">Close</span>
              </AnimatedButton>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Theme Settings */}
              <div className="bento-card p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      {theme === 'dark' ? <Moon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /> : <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />}
                    </div>
                    <div>
                      <h3 className="text-h3 md:text-h2 font-semibold text-white">Theme</h3>
                      <p className="text-caption text-blue-200 hidden md:block">Choose your preferred theme</p>
                    </div>
                  </div>
                  <AnimatedButton
                    variant={theme === 'dark' ? 'primary' : 'glass'}
                    size="sm"
                    onClick={toggleTheme}
                    icon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  >
                    <span className="hidden md:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    <span className="md:hidden">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </AnimatedButton>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bento-card p-3 md:p-4">
                <div className="flex items-center space-x-2 md:space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <Bell className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 md:text-h2 font-semibold text-white">Notifications</h3>
                    <p className="text-caption text-blue-200 hidden md:block">Manage alert preferences</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">SOS Alerts</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">Real-time emergency notifications</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">System Updates</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">Platform notifications</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">News Updates</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">AI-powered disaster news</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Settings */}
              <div className="bento-card p-3 md:p-4">
                <div className="flex items-center space-x-2 md:space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
                    <Filter className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 md:text-h2 font-semibold text-white">Default Filters</h3>
                    <p className="text-caption text-blue-200 hidden md:block">Set your preferred view filters</p>
                  </div>
                </div>

                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="text-small text-blue-200 mb-2 block text-xs md:text-sm">Default State</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>All States</option>
                      <option>Maharashtra</option>
                      <option>Gujarat</option>
                      <option>Karnataka</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-small text-blue-200 mb-2 block text-xs md:text-sm">Default District</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>All Districts</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                      <option>Nagpur</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-small text-blue-200 mb-2 block text-xs md:text-sm">Severity Filter</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>All Levels</option>
                      <option>Critical Only</option>
                      <option>High & Critical</option>
                      <option>Medium & Above</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-small text-blue-200 mb-2 block text-xs md:text-sm">Date Range</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-purple-400 focus:bg-slate-600 transition-all">
                      <option>Last 24 Hours</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 3 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bento-card p-3 md:p-4">
                <div className="flex items-center space-x-2 md:space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 md:text-h2 font-semibold text-white">Privacy & Security</h3>
                    <p className="text-caption text-blue-200 hidden md:block">Manage your data preferences</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">Location Sharing</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">Share location for SOS requests</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">Analytics</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">Help improve the platform</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bento-card p-3 md:p-4">
                <div className="flex items-center space-x-2 md:space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <Database className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-h3 md:text-h2 font-semibold text-white">Data Management</h3>
                    <p className="text-caption text-blue-200 hidden md:block">Cache and storage settings</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">Clear Cache</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">Free up storage space</p>
                    </div>
                    <AnimatedButton variant="glass" size="sm" className="flex-shrink-0">
                      <span className="hidden md:inline">Clear Now</span>
                      <span className="md:hidden">Clear</span>
                    </AnimatedButton>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-body text-white text-sm md:text-base">Export Data</p>
                      <p className="text-caption text-blue-200 text-xs md:text-sm">Download your activity data</p>
                    </div>
                    <AnimatedButton variant="glass" size="sm" className="flex-shrink-0">
                      <span className="hidden md:inline">Export</span>
                      <span className="md:hidden">Save</span>
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700">
              <AnimatedButton variant="glass" onClick={onClose} className="w-full md:w-auto">
                Cancel
              </AnimatedButton>
              <AnimatedButton variant="primary" onClick={onClose} className="w-full md:w-auto">
                Save Changes
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
