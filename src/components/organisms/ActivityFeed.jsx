import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';

const ActivityFeed = ({ 
  activities = [], 
  contacts = [], 
  deals = [],
  onActivityUpdate,
  showFilters = true 
}) => {
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const activityTypes = ['all', 'call', 'email', 'meeting', 'task'];

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.id === dealId);
    return deal?.title || 'Unknown Deal';
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Calendar',
      task: 'CheckSquare'
    };
    return icons[type] || 'Activity';
  };

  const filteredActivities = activities
    .filter(activity => filter === 'all' || activity.type === filter)
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleCompleteTask = async (activityId) => {
    await onActivityUpdate?.(activityId, { completed: true });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-surface-700">Filter:</span>
              <div className="flex space-x-2">
                {activityTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      filter === type
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon={sortOrder === 'desc' ? 'ArrowDown' : 'ArrowUp'}
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
          </div>
        </Card>
      )}

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card className="p-8 text-center">
            <ApperIcon name="Activity" size={48} className="mx-auto text-surface-300 mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No activities found</h3>
            <p className="text-surface-500">
              {filter === 'all' 
                ? 'No activities have been logged yet.' 
                : `No ${filter} activities found.`
              }
            </p>
          </Card>
        ) : (
          filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.completed ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                    }`}>
                      <ApperIcon 
                        name={activity.completed ? 'CheckCircle' : getActivityIcon(activity.type)} 
                        size={18} 
                      />
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <StatusBadge status={activity.type} />
                          <span className="text-sm font-medium text-surface-900">
                            {getContactName(activity.contactId)}
                          </span>
                          {activity.dealId && (
                            <>
                              <span className="text-surface-400">•</span>
                              <span className="text-sm text-primary">
                                {getDealTitle(activity.dealId)}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <p className="text-surface-700 mb-2">{activity.description}</p>
                        
                        <div className="flex items-center text-xs text-surface-500">
                          <ApperIcon name="Clock" size={12} className="mr-1" />
                          <span>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</span>
                          <span className="ml-2">
                            ({formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })})
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {activity.type === 'task' && !activity.completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            icon="Check"
                            onClick={() => handleCompleteTask(activity.id)}
                          >
                            Complete
                          </Button>
                        )}
                        <button className="text-surface-400 hover:text-surface-600 p-1 rounded">
                          <ApperIcon name="MoreHorizontal" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;