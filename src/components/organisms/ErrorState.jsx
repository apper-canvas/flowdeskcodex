import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const ErrorState = ({ 
  message = 'Something went wrong', 
  description,
  onRetry,
  showRetry = true,
  icon = 'AlertCircle',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-8 text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} size={32} />
          </div>
        </motion.div>
        
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          {message}
        </h3>
        
        {description && (
          <p className="text-surface-600 mb-6">
            {description}
          </p>
        )}
        
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            icon="RefreshCw"
            variant="outline"
          >
            Try Again
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default ErrorState;