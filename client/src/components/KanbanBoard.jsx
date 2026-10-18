// ============================================
// HuntOS Kanban Board Component
// Engineered by Niranjan Krishnakumar
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  MapPin,
  Sparkles,
  ChevronRight,
  Clock,
  Building2,
  DollarSign,
  Tag,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const COLUMNS = [
  {
    id: 'applied',
    title: 'Applied',
    statuses: ['Applied'],
    accent: 'border-t-blue-500',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'oa',
    title: 'Assessments (OA)',
    statuses: ['OA Scheduled', 'OA Cleared'],
    accent: 'border-t-amber-500',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'interviewing',
    title: 'Interviewing',
    statuses: ['Technical Round 1', 'Technical Round 2', 'Technical Round 3', 'HR Round'],
    accent: 'border-t-indigo-600',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'offer',
    title: 'Offer Received',
    statuses: ['Offer Received', 'Accepted'],
    accent: 'border-t-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'archived',
    title: 'Closed / Rejected',
    statuses: ['Rejected', 'Declined'],
    accent: 'border-t-slate-400',
    badge: 'bg-slate-100 text-slate-700',
  },
];

const priorityStyles = {
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-slate-50 text-slate-600 border-slate-200',
};

const KanbanBoard = ({ applications, onStatusChange, onOpenAiCopilot }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-6">
      {COLUMNS.map((col) => {
        const columnApps = applications.filter((app) => col.statuses.includes(app.status));

        return (
          <div
            key={col.id}
            className={`flex flex-col bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-xs border-t-4 ${col.accent} min-w-[270px] max-h-[calc(100vh-250px)] overflow-hidden`}
          >
            {/* Column Header */}
            <div className="px-4 py-3.5 border-b border-slate-200/60 bg-white/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800 tracking-tight">{col.title}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}
                >
                  {columnApps.length}
                </span>
              </div>
            </div>

            {/* Column Body / Cards */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {columnApps.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No applications in this stage
                </div>
              ) : (
                columnApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-xl p-3.5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group relative"
                  >
                    {/* Top Row: Company & Priority */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 flex-shrink-0">
                          {app.company_name?.charAt(0) || 'C'}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-900 truncate">
                          {app.company_name}
                        </h4>
                      </div>
                      {app.priority && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                            priorityStyles[app.priority] || priorityStyles.Medium
                          }`}
                        >
                          {app.priority}
                        </span>
                      )}
                    </div>

                    {/* Role */}
                    <p className="text-xs text-slate-600 font-medium mb-2 line-clamp-1">{app.role}</p>

                    {/* Meta info: Package & Location */}
                    <div className="space-y-1 mb-3">
                      {app.package && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-md w-fit">
                          <DollarSign size={11} />
                          <span>{app.package}</span>
                        </div>
                      )}
                      {app.location && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin size={11} className="text-slate-400" />
                          <span className="truncate">{app.location}</span>
                        </div>
                      )}
                      {app.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.tags.split(',').slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                            >
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <StatusBadge status={app.status} size="sm" />
                    </div>

                    {/* Card Footer: Quick Actions */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onOpenAiCopilot && onOpenAiCopilot(app)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Prepare with AI Copilot"
                      >
                        <Sparkles size={12} className="text-indigo-500" />
                        AI Prep
                      </button>

                      <Link
                        to={`/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 font-medium"
                      >
                        Details
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
