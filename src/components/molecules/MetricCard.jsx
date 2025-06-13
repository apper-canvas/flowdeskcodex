import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  className = '' 
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-surface-500'
  };

  return (
    <Card className={`p-6 ${className}`} hoverable>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <motion.p 
            className="text-2xl font-bold text-surface-900 mt-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
                className="mr-1" 
              />
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;