import { motion } from 'framer-motion';
import { cn } from 'clsx';
import { Loader2 } from 'lucide-react';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden font-semibold transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'btn-premium text-white focus:ring-blue-500',
    secondary: 'btn-premium text-white focus:ring-cyan-500',
    glass: 'btn-glass text-current focus:ring-white',
    danger: 'btn-premium text-white focus:ring-red-500',
    success: 'btn-premium text-white focus:ring-green-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-12 py-5 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        'rounded-xl',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="mr-2"
        >
          <Loader2 size={16} />
        </motion.div>
      )}
      
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default AnimatedButton;
