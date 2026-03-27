import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AnimatedButton from './ui/AnimatedButton';
import GlassCard from './ui/GlassCard';

const PremiumHeader = ({ onOpenFilters }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-30 glass border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <motion.input
              type="text"
              placeholder="Search incidents, reports, volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 glass rounded-xl hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenFilters}
            className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-300" />
          </motion.button>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 glass rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-small font-medium text-white">
                  {user?.full_name || 'Admin User'}
                </p>
                <p className="text-caption text-gray-400">
                  {user?.role || 'ADMIN'}
                </p>
              </div>
            </motion.button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 glass rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <hr className="border-white/10 my-2" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-caption text-gray-400">System Status: Operational</span>
            </div>
            <div className="text-caption text-gray-400">
              Last sync: 2 minutes ago
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-caption text-gray-400">
              Active incidents: <span className="text-white font-semibold">12</span>
            </div>
            <div className="text-caption text-gray-400">
              Volunteers online: <span className="text-white font-semibold">248</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default PremiumHeader;
