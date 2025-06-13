import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { contactService, dealService, activityService } from '@/services';
import MetricCard from '@/components/molecules/MetricCard';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DashboardPage = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('contact');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (type, data) => {
    try {
      let newItem;
      switch (type) {
        case 'contact':
          newItem = await contactService.create(data);
          setContacts(prev => [...prev, newItem]);
          break;
        case 'deal':
          newItem = await dealService.create(data);
          setDeals(prev => [...prev, newItem]);
          break;
        case 'activity':
          newItem = await activityService.create(data);
          setActivities(prev => [...prev, newItem]);
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  const openQuickAdd = (type) => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  };

  // Calculate metrics
  const totalContacts = contacts.length;
  const activeDeals = deals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage)).length;
  const totalRevenue = deals
    .filter(deal => deal.stage === 'Closed Won')
    .reduce((sum, deal) => sum + deal.value, 0);
  const recentActivities = activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} type="metric" count={1} />
          ))}
        </div>
        
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600 mt-1">Overview of your sales pipeline and activities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Users"
            onClick={() => openQuickAdd('contact')}
          >
            Add Contact
          </Button>
          <Button
            variant="outline"
            icon="Target"
            onClick={() => openQuickAdd('deal')}
          >
            Add Deal
          </Button>
          <Button
            icon="Activity"
            onClick={() => openQuickAdd('activity')}
          >
            Log Activity
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Total Contacts"
            value={totalContacts}
            icon="Users"
            color="primary"
            trend="up"
            trendValue="+12%"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Active Deals"
            value={activeDeals}
            icon="Target"
            color="accent"
            trend="up"
            trendValue="+5%"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricCard
            title="Revenue Won"
            value={formatCurrency(totalRevenue)}
            icon="DollarSign"
            color="success"
            trend="up"
            trendValue="+23%"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricCard
            title="Activities Today"
            value={activities.filter(a => {
              const today = new Date().toDateString();
              return new Date(a.timestamp).toDateString() === today;
            }).length}
            icon="Clock"
            color="warning"
            trend="neutral"
            trendValue="Same as yesterday"
          />
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-surface-900">Recent Activities</h2>
          <Button
            variant="ghost"
            icon="ArrowRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>
        
        <ActivityFeed
          activities={recentActivities}
          contacts={contacts}
          deals={deals}
          showFilters={false}
        />
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        type={quickAddType}
        onSubmit={(data) => handleQuickAdd(quickAddType, data)}
      />
    </div>
  );
};

export default DashboardPage;