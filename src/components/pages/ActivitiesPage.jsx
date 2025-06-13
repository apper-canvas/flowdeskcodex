import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { activityService, contactService, dealService } from '@/services';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  useEffect(() => {
    loadActivitiesData();
  }, []);

  const loadActivitiesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError('Failed to load activities data');
      toast.error('Failed to load activities data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (data) => {
    try {
      // For demo purposes, we'll assign to the first contact if no contactId provided
      const activityData = {
        ...data,
        contactId: data.contactId || contacts[0]?.id,
        dealId: data.dealId || null
      };
      
      const newActivity = await activityService.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
      toast.success('Activity logged successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleActivityUpdate = async (activityId, updateData) => {
    try {
      const updatedActivity = await activityService.update(activityId, updateData);
      setActivities(prev => prev.map(activity => 
        activity.id === activityId ? updatedActivity : activity
      ));
      
      if (updateData.completed) {
        toast.success('Task marked as completed!');
      }
    } catch (error) {
      toast.error(`Failed to update activity: ${error.message}`);
    }
  };

  const getActivityStats = () => {
    const today = new Date().toDateString();
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    return {
      total: activities.length,
      today: activities.filter(a => new Date(a.timestamp).toDateString() === today).length,
      thisWeek: activities.filter(a => new Date(a.timestamp) >= thisWeek).length,
      pending: activities.filter(a => a.type === 'task' && !a.completed).length
    };
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-200 rounded animate-pulse" />
          ))}
        </div>
        
        <SkeletonLoader type="card" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadActivitiesData}
        />
      </div>
    );
  }

  const stats = getActivityStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Activities</h1>
          <p className="text-surface-600 mt-1">
            Track all your customer interactions and tasks
          </p>
        </div>
        
        <Button
          icon="Plus"
          onClick={() => setQuickAddOpen(true)}
        >
          Log Activity
        </Button>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-surface-900">{stats.total}</div>
              <div className="text-sm text-surface-600">Total Activities</div>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <ApperIcon name="Activity" size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">{stats.today}</div>
              <div className="text-sm text-surface-600">Today</div>
            </div>
            <div className="p-3 bg-accent/10 text-accent rounded-lg">
              <ApperIcon name="Calendar" size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-info">{stats.thisWeek}</div>
              <div className="text-sm text-surface-600">This Week</div>
            </div>
            <div className="p-3 bg-info/10 text-info rounded-lg">
              <ApperIcon name="Clock" size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-sm text-surface-600">Pending Tasks</div>
            </div>
            <div className="p-3 bg-warning/10 text-warning rounded-lg">
              <ApperIcon name="CheckSquare" size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Activities Feed */}
      {activities.length === 0 ? (
        <EmptyState
          title="No activities logged"
          description="Start tracking your customer interactions by logging your first activity"
          actionLabel="Log Activity"
          onAction={() => setQuickAddOpen(true)}
          icon="Activity"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ActivityFeed
            activities={activities}
            contacts={contacts}
            deals={deals}
            onActivityUpdate={handleActivityUpdate}
            showFilters={true}
          />
        </motion.div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        type="activity"
        onSubmit={handleAddActivity}
      />
    </div>
  );
};

export default ActivitiesPage;