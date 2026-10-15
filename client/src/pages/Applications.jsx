// ============================================
// HuntOS Applications Pipeline (Kanban + Table)
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  LayoutGrid,
  List,
  Download,
  Sparkles,
  Filter,
  DollarSign,
  Tag,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import KanbanBoard from '../components/KanbanBoard';
import AIInterviewCopilot from '../components/AIInterviewCopilot';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getResumes,
  exportApplications,
} from '../api';

const STATUSES = [
  'Applied',
  'OA Scheduled',
  'OA Cleared',
  'Technical Round 1',
  'Technical Round 2',
  'Technical Round 3',
  'HR Round',
  'Offer Received',
  'Accepted',
  'Rejected',
  'Declined',
];

const SlideOver = ({ isOpen, onClose, onSuccess, editApp, resumes }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editApp) {
      reset({
        ...editApp,
        application_date: editApp.application_date?.split('T')[0] || '',
        deadline: editApp.deadline?.split('T')[0] || '',
      });
    } else {
      reset({
        application_date: new Date().toISOString().split('T')[0],
        deadline: '',
        priority: 'Medium',
        tags: 'Full-Time',
      });
    }
  }, [editApp, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editApp) {
        await updateApplication(editApp.id, data);
      } else {
        await createApplication(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {editApp ? 'Edit Application' : 'Log New Application'}
            </h2>
            <p className="text-[11px] text-slate-400">HuntOS Career Tracking Pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
              <input
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                  errors.company_name ? 'border-rose-400' : 'border-slate-200'
                }`}
                placeholder="Google, Stripe, Microsoft"
                {...register('company_name', { required: true })}
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Role *</label>
              <input
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                  errors.role ? 'border-rose-400' : 'border-slate-200'
                }`}
                placeholder="Software Development Engineer"
                {...register('role', { required: true })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="Bangalore / Remote"
                {...register('location')}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Compensation / Package</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="45 LPA or 80k/mo"
                {...register('package')}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Applied Date *</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                {...register('application_date', { required: true })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deadline (Alert Trigger)</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                {...register('deadline')}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                {...register('status')}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                {...register('priority')}
              >
                <option value="High">High (Target / Dream)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Low">Low (Backup)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Tags (Comma Separated)</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="Remote, Referral, Dream Job, Product"
                {...register('tags')}
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Job Link</label>
              <input
                type="url"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="https://careers.google.com/jobs/..."
                {...register('application_link')}
              />
            </div>

            {resumes?.length > 0 && (
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Linked Resume Version</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  {...register('resume_version_id')}
                >
                  <option value="">None / External</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.version}) {r.ats_score ? `— ATS: ${r.ats_score}%` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Notes & Next Actions</label>
              <textarea
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                placeholder="Referral name, round notes, recruiter contact info..."
                {...register('notes')}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold transition-all shadow-xs shadow-indigo-500/20"
            >
              {loading ? 'Saving...' : editApp ? 'Update Application' : 'Add to Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const Applications = () => {
  const { toasts, toast, removeToast } = useToast();
  const location = useLocation();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [apps, setApps] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // AI Copilot Modal
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [activeCopilotApp, setActiveCopilotApp] = useState(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const [appsRes, resumesRes] = await Promise.all([getApplications(params), getResumes()]);
      setApps(appsRes.data.data || []);
      setResumes(resumesRes.data.data || []);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, toast]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Open Add panel if ?add=true in URL (used by FastClip extension or Quick Action)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      setEditApp(null);
      setIsSlideOverOpen(true);
    }
  }, [location.search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteApplication(deleteTarget.id);
      toast.success('Application removed from pipeline');
      setDeleteTarget(null);
      fetchApps();
    } catch {
      toast.error('Failed to delete application');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await exportApplications(format);
      const blob = new Blob([res.data], {
        type: format === 'json' ? 'application/json' : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `huntos_applications.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`Exported pipeline as ${format.toUpperCase()}`);
    } catch {
      toast.error('Export failed');
    }
  };

  const openAiCopilotForApp = (app) => {
    setActiveCopilotApp(app);
    setAiCopilotOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 min-w-0">
        <Toast toasts={toasts} removeToast={removeToast} />

        {/* Header with View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Applications Pipeline</h1>
            <p className="text-xs text-slate-500 mt-1">
              Active candidate pipeline ({apps.length} applications tracked)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: Kanban vs Table */}
            <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid size={13} />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List size={13} />
                <span>Table</span>
              </button>
            </div>

            {/* Export CSV button */}
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
              title="Download full CSV"
            >
              <Download size={13} />
              <span>Export</span>
            </button>

            {/* Add Application Button */}
            <button
              onClick={() => {
                setEditApp(null);
                setIsSlideOverOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-500/20 transition-all"
            >
              <Plus size={15} />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 mb-6 shadow-2xs flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, roles, locations, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              <option value="">All Stages</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Main Content: Kanban or Table */}
        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton type="table" count={5} />
          </div>
        ) : apps.length === 0 ? (
          <EmptyState
            title="No applications in pipeline"
            description="Start building your career pipeline by adding an application manually or using the HuntOS FastClip extension."
            actionLabel="Add First Application"
            onAction={() => {
              setEditApp(null);
              setIsSlideOverOpen(true);
            }}
          />
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            applications={apps}
            onOpenAiCopilot={openAiCopilotForApp}
            onStatusChange={fetchApps}
          />
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Company</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Role</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Priority</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Status</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Package</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Date</th>
                    <th className="text-right px-5 py-3 text-[11px] font-bold uppercase text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {apps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                            {app.company_name?.charAt(0)}
                          </div>
                          <span>{app.company_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 truncate max-w-44">{app.role}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            app.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {app.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-emerald-700">
                        {app.package || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {new Date(app.application_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAiCopilotForApp(app)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50"
                            title="AI Interview Copilot"
                          >
                            <Sparkles size={14} />
                          </button>
                          <Link
                            to={`/applications/${app.id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="View details"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => {
                              setEditApp(app);
                              setIsSlideOverOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="Edit application"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Slide-over Form */}
        <SlideOver
          isOpen={isSlideOverOpen}
          onClose={() => setIsSlideOverOpen(false)}
          onSuccess={() => {
            fetchApps();
            toast.success(editApp ? 'Application updated' : 'Application added to pipeline');
          }}
          editApp={editApp}
          resumes={resumes}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Remove from Pipeline?"
          message={`Are you sure you want to remove ${deleteTarget?.company_name} from your pipeline? This will also remove associated interview rounds.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />

        {/* AI Copilot Modal */}
        <AIInterviewCopilot
          isOpen={aiCopilotOpen}
          onClose={() => setAiCopilotOpen(false)}
          application={activeCopilotApp}
        />
      </main>
    </div>
  );
};

export default Applications;
