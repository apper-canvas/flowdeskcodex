import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { contactService, activityService, dealService } from '@/services';
import ContactTable from '@/components/organisms/ContactTable';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactActivities, setContactActivities] = useState([]);
  const [contactDeals, setContactDeals] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query)
    );
    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddContact = async (data) => {
    try {
      const newContact = await contactService.create(data);
      setContacts(prev => [...prev, newContact]);
      toast.success('Contact added successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleEditContact = async (contact) => {
    // In a real app, this would open an edit modal
    toast.info('Edit functionality would be implemented here');
  };

  const handleDeleteContact = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await contactService.delete(contact.id);
        setContacts(prev => prev.filter(c => c.id !== contact.id));
        setSelectedContacts(prev => prev.filter(id => id !== contact.id));
        toast.success('Contact deleted successfully!');
      } catch (error) {
        toast.error(`Failed to delete contact: ${error.message}`);
      }
    }
  };

  const handleContactSelect = async (contact) => {
    setSelectedContact(contact);
    
    try {
      const [activities, deals] = await Promise.all([
        activityService.getByContactId(contact.id),
        dealService.getByContactId(contact.id)
      ]);
      setContactActivities(activities);
      setContactDeals(deals);
    } catch (error) {
      toast.error('Failed to load contact details');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {
      try {
        await Promise.all(selectedContacts.map(id => contactService.delete(id)));
        setContacts(prev => prev.filter(c => !selectedContacts.includes(c.id)));
        setSelectedContacts([]);
        toast.success(`${selectedContacts.length} contacts deleted successfully!`);
      } catch (error) {
        toast.error('Failed to delete some contacts');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse" />
        </div>
        <div className="h-10 bg-surface-200 rounded w-full animate-pulse" />
        <SkeletonLoader type="table" count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadContacts}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Contacts</h1>
          <p className="text-surface-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        
        <Button
          icon="Plus"
          onClick={() => setQuickAddOpen(true)}
        >
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search contacts by name, email, company..."
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>
          
          {selectedContacts.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-surface-600">
                {selectedContacts.length} selected
              </span>
              <Button
                variant="danger"
                size="sm"
                icon="Trash2"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        searchQuery ? (
          <EmptyState
            title="No contacts found"
            description={`No contacts match your search for "${searchQuery}"`}
            icon="Search"
            showAction={false}
          />
        ) : (
          <EmptyState
            title="No contacts yet"
            description="Start building your customer relationships by adding your first contact"
            actionLabel="Add Contact"
            onAction={() => setQuickAddOpen(true)}
            icon="Users"
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ContactTable
            contacts={filteredContacts}
            selectedContacts={selectedContacts}
            onSelectionChange={setSelectedContacts}
            onContactSelect={handleContactSelect}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        </motion.div>
      )}

      {/* Contact Detail Panel */}
      {selectedContact && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Contact Details</h3>
            <button
              onClick={() => setSelectedContact(null)}
              className="p-2 hover:bg-surface-100 rounded-full"
            >
              <ApperIcon name="X" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Information</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {selectedContact.name}</div>
                <div><strong>Email:</strong> {selectedContact.email}</div>
                <div><strong>Phone:</strong> {selectedContact.phone}</div>
                <div><strong>Company:</strong> {selectedContact.company}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {contactActivities.slice(0, 3).map(activity => (
                  <div key={activity.id} className="text-sm text-surface-600">
                    {activity.type}: {activity.description}
                  </div>
                ))}
                {contactActivities.length === 0 && (
                  <p className="text-sm text-surface-500">No activities yet</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        type="contact"
        onSubmit={handleAddContact}
      />
    </div>
  );
};

export default ContactsPage;