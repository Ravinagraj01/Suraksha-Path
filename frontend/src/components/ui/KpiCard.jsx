import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from 'clsx';

const KpiCard = ({ 
  label, 
  value, 
  delta, 
  tone = 'primary',
  icon,
  loading = false,
  delay = 0,
  className = ''
}) => {
  const tones = {
    primary: 'glow-primary',
    success: 'glow-success',
    warning: 'glow-warning',
    danger: 'glow-danger',
    critical: 'animate-pulseGlow'
  };

  const deltaColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const getDeltaType = (delta) => {
    if (typeof delta !== 'string') return 'neutral';
    if (delta.startsWith('+')) return 'positive';
    if (delta.startsWith('-')) return 'negative';
    return 'neutral';
  };

  const getDeltaIcon = (type) => {
    switch (type) {
      case 'positive':
        return <TrendingUp size={16} />;
      case 'negative':
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  const deltaType = getDeltaType(delta);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.68, -0.55, 0.265, 1.55]
      }}
      className={cn(
        'bento-card relative overflow-hidden cursor-pointer',
        tones[tone],
        className
      )}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-xl bg-white/10">
                {icon}
              </div>
            )}
            <p className="text-small text-gray-400 font-medium uppercase tracking-wider">
              {label}
            </p>
          </div>
          
          {delta && (
            <div className={cn('flex items-center space-x-1', deltaColors[deltaType])}>
              {getDeltaIcon(deltaType)}
              <span className="text-caption font-semibold">
                {delta}
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          {loading ? (
            <div className="skeleton h-12 w-24 rounded-lg" />
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: delay + 0.2,
                type: 'spring'
              }}
              className="text-hero font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              {value?.toLocaleString() || '0'}
            </motion.div>
          )}
        </div>

        {/* Subtle Progress Bar */}
        {!loading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 1, 
              delay: delay + 0.4,
              ease: 'easeOut'
            }}
            className="h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full"
          />
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default KpiCard;
