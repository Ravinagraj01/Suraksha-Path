import { motion } from 'framer-motion';
import { cn } from 'clsx';

const FloatingInput = ({ 
  label, 
  type = 'text', 
  id,
  error,
  required = false,
  className = '',
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="floating-label-group">
      <motion.input
        type={type}
        id={inputId}
        className={cn(
          'floating-input input-premium w-full',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        placeholder=" "
        {...props}
      />
      
      <motion.label
        htmlFor={inputId}
        className="floating-label"
        initial={{ y: 0 }}
        whileFocus={{ y: -20, scale: 0.85 }}
        transition={{ duration: 0.2 }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FloatingInput;
