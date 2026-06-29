import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    // Account/User Status
    active: 'bg-success-50 text-success-600 border-success-200',
    blocked: 'bg-error-50 text-error-600 border-error-200',
    pending: 'bg-warning-50 text-warning-600 border-warning-200',
    
    // Course Status
    approved: 'bg-primary-50/80 text-primary-700 border-primary-200/50',
    rejected: 'bg-error-50 text-error-600 border-error-200',
    
    // Payment/Payout Status
    released: 'bg-success-50 text-success-600 border-success-200',
    on_hold: 'bg-warning-50 text-warning-600 border-warning-200',
    
    // Live Class Status
    live: 'bg-rose-50 text-rose-600 border-rose-250 animate-pulse',
    scheduled: 'bg-primary-50/80 text-primary-700 border-primary-200/50',
    completed: 'bg-slate-50 text-slate-650 border-slate-200',
    cancelled: 'bg-error-50 text-error-600 border-error-200',
  };

  const normalizedStatus = status.toLowerCase().replace(' ', '_');
  const styleClass = styles[normalizedStatus] || 'bg-slate-50 text-slate-650 border-slate-200';

  return (
    <span className={`status-chip ${styleClass} whitespace-nowrap`}>
      {status}
    </span>
  );
};

export default StatusBadge;
