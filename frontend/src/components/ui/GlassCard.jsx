import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  ...props 
}) => {
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
        'bento-card',
        hover && 'hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
