import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      <div className="relative w-14 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1">
        <motion.div
          animate={{ x: isDark ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <Moon size={12} className="text-gray-800" />
            ) : (
              <Sun size={12} className="text-yellow-500" />
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
