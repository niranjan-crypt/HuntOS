// ============================================
// HuntOS Application Detail & Interview Prep
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Link as LinkIcon,
  User,
  FileText,
  Plus,
  Save,
  ExternalLink,
  Sparkles,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import InterviewTimeline from '../components/InterviewTimeline';
import AIInterviewCopilot from '../components/AIInterviewCopilot';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import {
  getApplication,
  updateApplication,
  deleteApplication,
  addRound,
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

const InfoRow = ({ icon: Icon, label, value, href }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <Icon size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            {value} <ExternalLink size={11} />
          </a>
        ) : (
          <p className="text-xs font-semibold text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [app, setApp] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addRoundOpen, setAddRoundOpen] = useState(false);
  const [savingRound, setSavingRound] = useState(false);
  const [savingApp, setSavingApp] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);

  const { register: registerApp, handleSubmit: handleAppSubmit, reset: resetApp } = useForm();
  const { register: registerRound, handleSubmit: handleRoundSubmit, reset: resetRound } = useForm();

  const fetchApp = async () => {
    try {
      const res = await getApplication(id);
      const data = res.data.data;
      setApp(data);
      setRounds(data.interview_rounds || []);
      resetApp({
        ...data,
        application_date: data.application_date?.split('T')[0] || '',
      });
    } catch (err) {
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [id]);

  const handleSaveApp = async (data) => {
    setSavingApp(true);
    try {
      await updateApplication(id, data);
      toast.success('Application updated successfully');
      setEditMode(false);
      fetchApp();
    } catch {
      toast.error('Failed to update application');
    } finally {
      setSavingApp(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteApplication(id);
      navigate('/applications');
    } catch {
      toast.error('Failed to delete application');
      setDeleteLoading(false);
    }
  };

  const handleAddRound = async (data) => {
    setSavingRound(true);
    try {
      await addRound(id, data);
      toast.success('Interview round logged!');
      setAddRoundOpen(false);
      resetRound({});
      fetchApp();
    } catch {
      toast.error('Failed to log round');
    } finally {
      setSavingRound(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/60 font-sans">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="skeleton h-8 w-48 rounded mb-6" />
          <div className="grid grid-cols-2 gap-5">
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex min-h-screen bg-slate-50/60 font-sans">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-sm">Application record not found</p>
            <Link to="/applications" className="text-indigo-600 text-xs font-bold mt-2 block">
              ← Return to Applications Pipeline
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="ml-64 flex-1 p-8 min-w-0">
        {/* Back link */}
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Applications Pipeline
        </Link>

        {/* Hero Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {app.company_name}
              </h1>
              <StatusBadge status={app.status} size="md" />
              {app.priority && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    app.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {app.priority} Priority
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500">{app.role}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* AI Copilot Launch Button */}
            <button
              onClick={() => setAiCopilotOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-xs shadow-indigo-500/20 transition-all"
            >
              <Sparkles size={14} />
              <span>Launch AI Copilot</span>
            </button>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                editMode
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white'
              }`}
            >
              <Pencil size={13} />
              <span>{editMode ? 'Cancel Edit' : 'Edit'}</span>
            </button>

            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Application Details */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
                Application Specifications
              </h2>

              {editMode ? (
                <form onSubmit={handleAppSubmit(handleSaveApp)} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Company</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        {...registerApp('company_name')}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Role</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        {...registerApp('role')}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Status</label>
                      <select
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        {...registerApp('status')}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Location</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        {...registerApp('location')}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Compensation</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        {...registerApp('package')}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        {...registerApp('application_date')}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-600 mb-1">Notes</label>
                      <textarea
                        rows={3}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        {...registerApp('notes')}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingApp}
                      className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-xs shadow-indigo-500/20"
                    >
                      <Save size={13} /> {savingApp ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <InfoRow
                    icon={Calendar}
                    label="Application Date"
                    value={new Date(app.application_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  />
                  <InfoRow icon={MapPin} label="Location" value={app.location} />
                  <InfoRow icon={DollarSign} label="Package / CTC" value={app.package} />
                  <InfoRow
                    icon={LinkIcon}
                    label="Application Link"
                    value={app.application_link ? 'Direct Career URL' : null}
                    href={app.application_link}
                  />
                  {app.referral_name && (
                    <InfoRow icon={User} label="Internal Referral" value={app.referral_name} />
                  )}
                  {app.referral_linkedin && (
                    <InfoRow
                      icon={LinkIcon}
                      label="Referral Profile"
                      value="View on LinkedIn"
                      href={app.referral_linkedin}
                    />
                  )}
                  {app.tags && (
                    <div className="py-3 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {app.tags.split(',').map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {app.resume_name && (
                    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                      <FileText size={15} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                          Active Resume Version
                        </p>
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          {app.resume_name} ({app.resume_version}) <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  )}
                  {app.notes && (
                    <div className="pt-3">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Strategic Notes
                      </p>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3 font-medium">
                        {app.notes}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right: Interview Timeline */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Interview Rounds Timeline
                  </h2>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {rounds.length} Rounds
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAiCopilotOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Sparkles size={12} />
                    <span>Prep AI</span>
                  </button>
                  <button
                    onClick={() => {
                      setAddRoundOpen(true);
                      resetRound({});
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition-all shadow-xs"
                  >
                    <Plus size={12} />
                    <span>Log Round</span>
                  </button>
                </div>
              </div>

              <InterviewTimeline rounds={rounds} />
            </div>
          </div>
        </div>

        {/* Delete Confirm */}
        <ConfirmDialog
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Application Record"
          description={`Permanently remove ${app.company_name} from your pipeline? Associated interview rounds will also be deleted.`}
          confirmLabel="Delete"
          loading={deleteLoading}
        />

        {/* Add Round Modal */}
        <Modal isOpen={addRoundOpen} onClose={() => setAddRoundOpen(false)} title="Log Interview Round" size="md">
          <form onSubmit={handleRoundSubmit(handleAddRound)} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Round Title *</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Technical Round 1 (DSA & System Design)"
                  {...registerRound('round_name', { required: true })}
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  {...registerRound('round_date')}
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  {...registerRound('difficulty')}
                >
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Easy">Easy</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Outcome</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  {...registerRound('outcome')}
                >
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Questions Asked</label>
                <textarea
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono"
                  placeholder="Specific coding challenges, system design prompt..."
                  {...registerRound('questions_asked')}
                />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Topics Covered</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Dynamic Programming, Trees, WebSockets, Concurrency"
                  {...registerRound('topics_covered')}
                />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  placeholder="Feedback from interviewer, what to revise next..."
                  {...registerRound('personal_notes')}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddRoundOpen(false)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingRound}
                className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 shadow-xs"
              >
                {savingRound ? 'Adding...' : 'Log Round'}
              </button>
            </div>
          </form>
        </Modal>

        {/* AI Copilot Modal */}
        <AIInterviewCopilot
          isOpen={aiCopilotOpen}
          onClose={() => setAiCopilotOpen(false)}
          application={app}
        />
      </main>
    </div>
  );
};

export default ApplicationDetail;
