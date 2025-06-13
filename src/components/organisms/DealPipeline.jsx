import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';

const DealPipeline = ({ deals = [], contacts = [], onDealUpdate, onDealSelect }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    'Discovery',
    'Qualified', 
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  const stageColors = {
    'Discovery': 'border-info',
    'Qualified': 'border-primary',
    'Proposal': 'border-warning',
    'Negotiation': 'border-accent',
    'Closed Won': 'border-success',
    'Closed Lost': 'border-danger'
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== newStage) {
      onDealUpdate?.(draggedDeal.id, { stage: newStage });
    }
    setDraggedDeal(null);
  };

  const getTotalValue = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 h-full">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage);
        const totalValue = getTotalValue(stage);
        
        return (
          <div
            key={stage}
            className="flex flex-col min-h-0"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {/* Stage Header */}
            <div className={`p-4 bg-surface-50 border-l-4 ${stageColors[stage]} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-surface-900">{stage}</h3>
                <div className="text-xs text-surface-500">
                  {stageDeals.length} deals
                </div>
              </div>
              <div className="text-sm font-semibold text-surface-700 mt-1">
                {formatCurrency(totalValue)}
              </div>
            </div>

            {/* Deals List */}
            <div className="flex-1 p-2 bg-surface-25 border border-t-0 border-surface-200 rounded-b-lg min-h-96 overflow-y-auto">
              <AnimatePresence>
                {stageDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    onClick={() => onDealSelect?.(deal)}
                    className="mb-3 cursor-move"
                  >
                    <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-surface-900 line-clamp-2">
                          {deal.title}
                        </h4>
                        <button className="text-surface-400 hover:text-surface-600">
                          <ApperIcon name="MoreVertical" size={14} />
                        </button>
                      </div>
                      
                      <div className="text-lg font-bold text-primary mb-2">
                        {formatCurrency(deal.value)}
                      </div>
                      
                      <div className="text-xs text-surface-600 mb-2">
                        {getContactName(deal.contactId)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-surface-500">
                          <ApperIcon name="Target" size={12} className="mr-1" />
                          {deal.probability}%
                        </div>
                        <div className="text-xs text-surface-500">
                          {deal.expectedClose}
                        </div>
                      </div>
                      
                      {/* Probability Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-surface-200 rounded-full h-1">
                          <motion.div
                            className="bg-primary h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${deal.probability}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {stageDeals.length === 0 && (
                <div className="flex items-center justify-center h-32 text-surface-400">
                  <div className="text-center">
                    <ApperIcon name="Plus" size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop deals here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealPipeline;