import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  Home,
  Users,
  Newspaper,
  User,
  FileText,
  Menu,
  X,
  Shield,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/ThemeToggle';

const menuItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/sos', label: 'SOS Center', icon: AlertTriangle },
  { path: '/dashboard/map', label: 'Live Map', icon: Map },
  { path: '/dashboard/shelters', label: 'Shelters', icon: Home },
  { path: '/dashboard/volunteers', label: 'Volunteers', icon: Users },
  { path: '/dashboard/news', label: 'AI News', icon: Newspaper },
  { path: '/dashboard/reports', label: 'Reports', icon: FileText },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
];

const PremiumSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!collapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          x: collapsed && isMobile ? -280 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-slate-800 border-r border-slate-600 z-50 md:z-30"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-h3 font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SurakshaPath
                  </h1>
                  <p className="text-caption text-purple-200">Disaster Management</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setCollapsed(true)}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-300 cursor-pointer group
                    ${active 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                      : 'hover:bg-slate-800'
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"
                    />
                  )}

                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${active 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                      : 'text-gray-400 group-hover:text-white group-hover:bg-slate-700'
                    }
                  `}>
                    <Icon size={18} />
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1"
                      >
                        <span className={`
                          font-medium transition-colors
                          ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                        `}>
                          {item.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-small font-medium text-white">System Active</p>
                    <p className="text-caption text-gray-400">All systems operational</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <ThemeToggle />
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default PremiumSidebar;
