import Badge from '@/components/atoms/Badge';

const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    // Deal stages
    'Discovery': { variant: 'info', label: 'Discovery' },
    'Qualified': { variant: 'primary', label: 'Qualified' },
    'Proposal': { variant: 'warning', label: 'Proposal' },
    'Negotiation': { variant: 'accent', label: 'Negotiation' },
    'Closed Won': { variant: 'success', label: 'Closed Won' },
    'Closed Lost': { variant: 'danger', label: 'Closed Lost' },
    
    // Activity types
    'call': { variant: 'primary', label: 'Call' },
    'email': { variant: 'info', label: 'Email' },
    'meeting': { variant: 'accent', label: 'Meeting' },
    'task': { variant: 'warning', label: 'Task' },
    
    // Contact tags
    'lead': { variant: 'warning', label: 'Lead' },
    'prospect': { variant: 'info', label: 'Prospect' },
    'client': { variant: 'success', label: 'Client' },
    'enterprise': { variant: 'primary', label: 'Enterprise' },
    'startup': { variant: 'accent', label: 'Startup' },
    'high-value': { variant: 'success', label: 'High Value' },
    'vip': { variant: 'accent', label: 'VIP' },
    'creative': { variant: 'secondary', label: 'Creative' }
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge 
      variant={config.variant} 
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;