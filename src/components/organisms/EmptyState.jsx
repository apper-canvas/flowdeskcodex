import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const EmptyState = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  onAction,
  icon = 'Package',
  showAction = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className="p-12 text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-surface-100 text-surface-300 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name={icon} size={40} />
          </div>
        </motion.div>
        
        <h3 className="text-xl font-heading font-semibold text-surface-900 mb-3">
          {title}
        </h3>
        
        <p className="text-surface-600 mb-8 max-w-md mx-auto">
          {description}
        </p>
        
        {showAction && onAction && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onAction}
              icon="Plus"
              size="lg"
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default EmptyState;