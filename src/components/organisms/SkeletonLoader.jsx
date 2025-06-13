import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card', className = '' }) => {
  const skeletonVariants = {
    card: () => (
      <div className="bg-white rounded-lg border border-surface-200 p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-surface-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-surface-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-200 rounded animate-pulse" />
          <div className="h-3 bg-surface-200 rounded animate-pulse w-5/6" />
        </div>
      </div>
    ),
    table: () => (
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
        <div className="p-4 border-b border-surface-200">
          <div className="h-4 bg-surface-200 rounded animate-pulse w-32" />
        </div>
        <div className="divide-y divide-surface-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center space-x-4">
              <div className="w-8 h-8 bg-surface-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-200 rounded animate-pulse w-24" />
                <div className="h-3 bg-surface-200 rounded animate-pulse w-16" />
              </div>
              <div className="h-3 bg-surface-200 rounded animate-pulse w-20" />
              <div className="h-3 bg-surface-200 rounded animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    ),
    metric: () => (
      <div className="bg-white rounded-lg border border-surface-200 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-surface-200 rounded animate-pulse w-20" />
            <div className="h-8 bg-surface-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-surface-200 rounded animate-pulse w-12" />
          </div>
          <div className="w-12 h-12 bg-surface-200 rounded-lg animate-pulse" />
        </div>
      </div>
    ),
    pipeline: () => (
      <div className="space-y-4">
        <div className="p-4 bg-surface-50 border-l-4 border-surface-200 rounded-t-lg">
          <div className="h-4 bg-surface-200 rounded animate-pulse w-24 mb-2" />
          <div className="h-3 bg-surface-200 rounded animate-pulse w-16" />
        </div>
        <div className="space-y-3 p-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-surface-200 p-4 space-y-3">
              <div className="h-4 bg-surface-200 rounded animate-pulse" />
              <div className="h-6 bg-surface-200 rounded animate-pulse w-20" />
              <div className="h-3 bg-surface-200 rounded animate-pulse w-24" />
              <div className="flex justify-between">
                <div className="h-3 bg-surface-200 rounded animate-pulse w-12" />
                <div className="h-3 bg-surface-200 rounded animate-pulse w-16" />
              </div>
              <div className="h-1 bg-surface-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {skeletonVariants[type]()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;