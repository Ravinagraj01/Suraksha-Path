import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { cn } from '../../utils/cn';

const PremiumDistributionChart = ({ data, className = '' }) => {
  const COLORS = {
    'Low': '#10B981',
    'Medium': '#F59E0B', 
    'High': '#EF4444',
    'Critical': '#DC2626'
  };

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const color = COLORS[data.name] || '#64748B';
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-3 rounded-xl border border-white/20"
        >
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="text-small font-medium text-white">{data.name}</span>
          </div>
          <p className="text-caption text-gray-300">
            Incidents: <span className="text-white font-semibold">{data.value}</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn('w-full h-80', className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PremiumDistributionChart;
