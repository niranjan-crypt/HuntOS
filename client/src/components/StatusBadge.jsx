// ============================================
// HuntOS Status Badge Component
// ============================================

import React from 'react';

const statusConfig = {
  'Applied': { bg: 'bg-blue-50/80 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' },
  'OA Scheduled': { bg: 'bg-amber-50/80 text-amber-700 border-amber-200/60', dot: 'bg-amber-500 animate-pulse' },
  'OA Cleared': { bg: 'bg-teal-50/80 text-teal-700 border-teal-200/60', dot: 'bg-teal-500' },
  'Technical Round 1': { bg: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60', dot: 'bg-indigo-500 animate-pulse' },
  'Technical Round 2': { bg: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60', dot: 'bg-indigo-500 animate-pulse' },
  'Technical Round 3': { bg: 'bg-purple-50/80 text-purple-700 border-purple-200/60', dot: 'bg-purple-500 animate-pulse' },
  'HR Round': { bg: 'bg-violet-50/80 text-violet-700 border-violet-200/60', dot: 'bg-violet-500 animate-pulse' },
  'Offer Received': { bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-300 font-semibold', dot: 'bg-emerald-500 animate-ping' },
  'Accepted': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold', dot: 'bg-emerald-600' },
  'Rejected': { bg: 'bg-rose-50/80 text-rose-700 border-rose-200/60', dot: 'bg-rose-400' },
  'Declined': { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const StatusBadge = ({ status, size = 'sm', showDot = true }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs gap-1.5' : 'px-2.5 py-0.5 text-[11px] gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${config.bg} ${sizeClass} tracking-wide transition-all`}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        </span>
      )}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
