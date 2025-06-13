import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { dealService, contactService } from '@/services';
import DealPipeline from '@/components/organisms/DealPipeline';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    loadDealsData();
  }, []);

  const loadDealsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load deals data');
      toast.error('Failed to load deals data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async (data) => {
    try {
      const newDeal = await dealService.create({
        ...data,
        stage: data.stage || 'Discovery',
        probability: data.probability || 30
      });
      setDeals(prev => [...prev, newDeal]);
      toast.success('Deal added successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleDealUpdate = async (dealId, updateData) => {
    try {
      const updatedDeal = await dealService.update(dealId, updateData);
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? updatedDeal : deal
      ));
      
      if (updateData.stage) {
        toast.success(`Deal moved to ${updateData.stage}!`);
      }
    } catch (error) {
      toast.error(`Failed to update deal: ${error.message}`);
    }
  };

  const handleDealSelect = (deal) => {
    setSelectedDeal(deal);
    // In a real app, this might open a detail modal or navigate to a detail page
    toast.info(`Selected deal: ${deal.title}`);
  };

  const calculatePipelineMetrics = () => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const activeDeals = deals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage));
    const wonDeals = deals.filter(deal => deal.stage === 'Closed Won');
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    return {
      totalValue,
      activeDeals: activeDeals.length,
      wonValue,
      winRate: deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0
    };
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-200 rounded animate-pulse" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} type="pipeline" count={1} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDealsData}
        />
      </div>
    );
  }

  const metrics = calculatePipelineMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Deals Pipeline</h1>
          <p className="text-surface-600 mt-1">
            Track your sales opportunities through each stage
          </p>
        </div>
        
        <Button
          icon="Plus"
          onClick={() => setQuickAddOpen(true)}
        >
          Add Deal
        </Button>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatCurrency(metrics.totalValue)}</div>
            <div className="text-sm text-surface-600">Total Pipeline Value</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{metrics.activeDeals}</div>
            <div className="text-sm text-surface-600">Active Deals</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{formatCurrency(metrics.wonValue)}</div>
            <div className="text-sm text-surface-600">Revenue Won</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{metrics.winRate}%</div>
            <div className="text-sm text-surface-600">Win Rate</div>
          </div>
        </Card>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <EmptyState
          title="No deals in pipeline"
          description="Start tracking your sales opportunities by adding your first deal"
          actionLabel="Add Deal"
          onAction={() => setQuickAddOpen(true)}
          icon="Target"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-96"
        >
          <DealPipeline
            deals={deals}
            contacts={contacts}
            onDealUpdate={handleDealUpdate}
            onDealSelect={handleDealSelect}
          />
        </motion.div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        type="deal"
        onSubmit={handleAddDeal}
      />
    </div>
  );
};

export default Deals;