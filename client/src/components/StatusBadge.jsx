import React from 'react';

const STATUS_CONFIGS = {
  // Appointment statuses
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-[#171717] text-[#a3a3a3] border-[#262626]',
    dot: 'bg-[#a3a3a3]',
  },
  checked_in: {
    label: 'Checked In',
    bg: 'bg-[#212121] text-[#fafafa] border-[#333333]',
    dot: 'bg-[#fafafa]',
  },
  in_consultation: {
    label: 'In Consultation',
    bg: 'bg-[#212121] text-[#fafafa] border-[#333333]',
    dot: 'bg-[#e5e5e5] animate-pulse',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-[#171717] text-[#737373] border-[#262626]',
    dot: 'bg-[#525252]',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-[#1f1616] text-[#d4d4d4] border-[#382626]',
    dot: 'bg-[#737373]',
  },
  no_show: {
    label: 'No Show',
    bg: 'bg-[#171717] text-[#737373] border-[#262626]',
    dot: 'bg-[#525252]',
  },

  // Lab order statuses
  ordered: {
    label: 'Order Placed',
    bg: 'bg-[#171717] text-[#a3a3a3] border-[#262626]',
    dot: 'bg-[#a3a3a3]',
  },
  sample_collected: {
    label: 'Sample Collected',
    bg: 'bg-[#212121] text-[#fafafa] border-[#333333]',
    dot: 'bg-[#fafafa]',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-[#212121] text-[#fafafa] border-[#333333]',
    dot: 'bg-[#e5e5e5] animate-pulse',
  },
  verified: {
    label: 'Verified & Released',
    bg: 'bg-[#212121] text-[#fafafa] border-[#333333]',
    dot: 'bg-[#e5e5e5]',
  },

  // Invoice / Payment statuses
  pending: {
    label: 'Payment Pending',
    bg: 'bg-[#171717] text-[#a3a3a3] border-[#262626]',
    dot: 'bg-[#a3a3a3]',
  },
  partially_paid: {
    label: 'Partial',
    bg: 'bg-[#171717] text-[#a3a3a3] border-[#262626]',
    dot: 'bg-[#a3a3a3]',
  },
  paid: {
    label: 'Settled / Paid',
    bg: 'bg-[#212121] text-[#fafafa] border-[#333333]',
    dot: 'bg-[#e5e5e5]',
  },

  // Lab flags
  normal: {
    label: 'Normal',
    bg: 'bg-[#171717] text-[#a3a3a3] border-[#262626]',
    dot: 'bg-[#a3a3a3]',
  },
  abnormal: {
    label: 'Abnormal Flag',
    bg: 'bg-[#262626] text-[#fafafa] border-[#404040]',
    dot: 'bg-[#fafafa] animate-pulse',
  },
  critical: {
    label: 'Critical Alert',
    bg: 'bg-[#2a1c1c] text-[#fafafa] border-[#4a2e2e]',
    dot: 'bg-[#fafafa] animate-ping',
  },
};

export const StatusBadge = ({ status, className = '' }) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  const config = STATUS_CONFIGS[normalizedStatus] || {
    label: status || 'Unknown',
    bg: 'bg-[#171717] text-[#a3a3a3] border-[#262626]',
    dot: 'bg-[#737373]',
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
