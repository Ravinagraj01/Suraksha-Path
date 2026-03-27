import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '../../utils/cn';

const PremiumTrendChart = ({ data, className = '' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-3 rounded-xl border border-white/20"
        >
          <p className="text-small font-medium text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-caption">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">{entry.name}:</span>
              <span className="text-white font-semibold">{entry.value}</span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn('w-full h-80', className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.05)" 
            vertical={false}
          />
          
          <XAxis 
            dataKey="name" 
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="sos"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#sosGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
          
          <Area
            type="monotone"
            dataKey="resolved"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#resolvedGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PremiumTrendChart;
