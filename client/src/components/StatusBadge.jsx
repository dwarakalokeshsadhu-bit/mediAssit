import React from 'react';

const STATUS_CONFIGS = {
  // Appointment statuses
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  checked_in: {
    label: 'Checked In',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  in_consultation: {
    label: 'In Consultation',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500 animate-pulse',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-neutral-100 text-neutral-500 border-neutral-200',
    dot: 'bg-neutral-400',
  },
  no_show: {
    label: 'No Show',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },

  // Lab order statuses
  ordered: {
    label: 'Order Placed',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  sample_collected: {
    label: 'Sample Collected',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500 animate-pulse',
  },
  verified: {
    label: 'Verified & Released',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },

  // Invoice / Payment statuses
  pending: {
    label: 'Payment Pending',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  partially_paid: {
    label: 'Partial',
    bg: 'bg-orange-50 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
  },
  paid: {
    label: 'Settled / Paid',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600',
  },

  // Lab flags
  normal: {
    label: 'Normal',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  abnormal: {
    label: 'Abnormal Flag',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500 animate-pulse',
  },
  critical: {
    label: 'Critical Alert',
    bg: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold',
    dot: 'bg-rose-600 animate-ping',
  },
};

export const StatusBadge = ({ status, className = '' }) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  const config = STATUS_CONFIGS[normalizedStatus] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border rounded-md tracking-wide uppercase transition-colors ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
