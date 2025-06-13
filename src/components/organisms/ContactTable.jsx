import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import StatusBadge from '@/components/molecules/StatusBadge';

const ContactTable = ({ 
  contacts = [], 
  onContactSelect, 
  onEdit, 
  onDelete,
  selectedContacts = [],
  onSelectionChange 
}) => {
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });

  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(contacts.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectContact = (contactId, checked) => {
    if (checked) {
      onSelectionChange([...selectedContacts, contactId]);
    } else {
      onSelectionChange(selectedContacts.filter(id => id !== contactId));
    }
  };

  const isAllSelected = selectedContacts.length === contacts.length && contacts.length > 0;
  const isPartiallySelected = selectedContacts.length > 0 && selectedContacts.length < contacts.length;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-surface-300 text-primary focus:ring-primary"
                />
              </th>
              {[
                { field: 'name', label: 'Name' },
                { field: 'company', label: 'Company' },
                { field: 'email', label: 'Email' },
                { field: 'phone', label: 'Phone' },
                { field: 'lastActivity', label: 'Last Activity' }
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:text-surface-700"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {label}
                    <ApperIcon 
                      name={sortConfig.field === field ? 
                        (sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                        'ChevronsUpDown'
                      } 
                      size={14} 
                      className="ml-1" 
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {sortedContacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-surface-50 transition-colors cursor-pointer"
                onClick={() => onContactSelect?.(contact)}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => handleSelectContact(contact.id, e.target.checked)}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-surface-900">{contact.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-900">{contact.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-500">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-500">{contact.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-500">
                    {format(new Date(contact.lastActivity), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.map((tag) => (
                      <StatusBadge key={tag} status={tag} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit?.(contact)}
                      className="text-primary hover:text-primary/80 p-1 rounded"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete?.(contact)}
                      className="text-danger hover:text-danger/80 p-1 rounded"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ContactTable;