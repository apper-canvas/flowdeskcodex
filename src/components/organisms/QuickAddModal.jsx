import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const QuickAddModal = ({ isOpen, onClose, type = 'contact', onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const formConfigs = {
    contact: {
      title: 'Add New Contact',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, icon: 'User' },
        { name: 'email', label: 'Email', type: 'email', required: true, icon: 'Mail' },
        { name: 'phone', label: 'Phone', type: 'tel', icon: 'Phone' },
        { name: 'company', label: 'Company', type: 'text', icon: 'Building' }
      ]
    },
    deal: {
      title: 'Add New Deal',
      fields: [
        { name: 'title', label: 'Deal Title', type: 'text', required: true, icon: 'Target' },
        { name: 'value', label: 'Deal Value', type: 'number', required: true, icon: 'DollarSign' },
        { name: 'stage', label: 'Stage', type: 'select', required: true, icon: 'TrendingUp', 
          options: ['Discovery', 'Qualified', 'Proposal', 'Negotiation'] },
        { name: 'probability', label: 'Probability (%)', type: 'number', icon: 'Percent' },
        { name: 'expectedClose', label: 'Expected Close Date', type: 'date', icon: 'Calendar' }
      ]
    },
    activity: {
      title: 'Log Activity',
      fields: [
        { name: 'type', label: 'Activity Type', type: 'select', required: true, icon: 'Activity',
          options: ['call', 'email', 'meeting', 'task'] },
        { name: 'description', label: 'Description', type: 'textarea', required: true, icon: 'FileText' }
      ]
    }
  };

  const config = formConfigs[type];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = config.fields.filter(field => field.required);
      for (const field of requiredFields) {
        if (!formData[field.name]) {
          toast.error(`${field.label} is required`);
          setLoading(false);
          return;
        }
      }

      await onSubmit(formData);
      toast.success(`${config.title.split(' ')[1]} added successfully!`);
      setFormData({});
      onClose();
    } catch (error) {
      toast.error(`Failed to add ${type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              {config.title}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-surface-100 rounded-full transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {config.fields.map((field) => (
              <div key={field.name}>
                {field.type === 'select' ? (
                  <div className="relative">
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-danger ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-3 py-3 pl-10 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option} className="capitalize">
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <ApperIcon name={field.icon} size={16} className="text-surface-400" />
                      </div>
                    </div>
                  </div>
                ) : field.type === 'textarea' ? (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-danger ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-3 pl-10 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      <div className="absolute left-3 top-3">
                        <ApperIcon name={field.icon} size={16} className="text-surface-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <FormField
                    {...field}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                icon="Plus"
              >
                {loading ? 'Adding...' : `Add ${config.title.split(' ')[1]}`}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickAddModal;