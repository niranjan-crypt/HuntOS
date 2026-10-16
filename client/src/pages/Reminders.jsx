// ============================================
// HuntOS Reminders & Smart Alerts
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Bell, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ReminderCard from '../components/ReminderCard';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { getReminders, createReminder, deleteReminder, getApplications } from '../api';

const REMINDER_TYPES = [
  'OA',
  'Interview',
  'Referral Follow Up',
  'Application Deadline',
  'Resume Update',
  'Offer Decision',
  'Other',
];

const Reminders = () => {
  const { user } = useAuth();
  const { toasts, toast, removeToast } = useToast();
  const [reminders, setReminders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { send_email: true, send_whatsapp: false },
  });

  const fetchReminders = async () => {
    try {
      const res = await getReminders();
      setReminders(res.data.data || []);
    } catch {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [remRes, appsRes] = await Promise.all([getReminders(), getApplications()]);
        setReminders(remRes.data.data || []);
        setApplications(appsRes.data.data || []);
      } catch {
        toast.error('Failed to load alert schedules');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const onSubmit = async (data) => {
    setCreating(true);
    try {
      const payload = {
        ...data,
        application_id: data.application_id || null,
        send_email: !!data.send_email,
        send_whatsapp: !!data.send_whatsapp,
        remind_at: new Date(data.remind_at).toISOString(),
      };
      await createReminder(payload);
      toast.success('Smart alert scheduled successfully!');
      setModalOpen(false);
      reset({ send_email: true, send_whatsapp: false });
      fetchReminders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create reminder');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteReminder(deleteTarget.id);
      toast.success('Alert deleted');
      setDeleteTarget(null);
      fetchReminders();
    } catch {
      toast.error('Failed to delete reminder');
    } finally {
      setDeleteLoading(false);
    }
  };

  const upcoming = reminders.filter((r) => !r.sent && new Date(r.remind_at) > new Date());
  const past = reminders.filter((r) => r.sent || new Date(r.remind_at) <= new Date());

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="ml-64 flex-1 p-8 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Smart Alerts & Dispatcher
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous notification engine · {upcoming.length} active scheduled alerts
            </p>
          </div>
          <button
            onClick={() => {
              setModalOpen(true);
              reset({ send_email: true, send_whatsapp: false });
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-xs shadow-indigo-500/20 transition-all"
          >
            <Plus size={15} />
            Schedule Alert
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
          </div>
        ) : reminders.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
            <EmptyState
              title="No alerts scheduled"
              description="Schedule automated email and WhatsApp alerts for upcoming coding tests, interviews, and deadlines."
              actionLabel="Schedule First Alert"
              onAction={() => setModalOpen(true)}
            />
          </div>
        ) : (
          <div className="space-y-7">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-indigo-600" />
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upcoming Alerts ({upcoming.length})
                  </h2>
                </div>
                <div className="space-y-2.5">
                  {upcoming.map((r) => (
                    <ReminderCard key={r.id} reminder={r} onDelete={setDeleteTarget} />
                  ))}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-slate-400" />
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Dispatched / Past Alerts ({past.length})
                  </h2>
                </div>
                <div className="space-y-2.5 opacity-80">
                  {past.map((r) => (
                    <ReminderCard key={r.id} reminder={r} onDelete={setDeleteTarget} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Add Reminder Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Smart Alert" size="md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Alert Title *</label>
              <input
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                  errors.title ? 'border-rose-400' : 'border-slate-200'
                }`}
                placeholder="Google Round 1 Technical Screening"
                {...register('title', { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Category *</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  {...register('reminder_type', { required: true })}
                >
                  {REMINDER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Linked Application</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  {...register('application_id')}
                >
                  <option value="">None (General)</option>
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.company_name} – {a.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Dispatch Time *</label>
              <input
                type="datetime-local"
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                  errors.remind_at ? 'border-rose-400' : 'border-slate-200'
                }`}
                {...register('remind_at', { required: true })}
              />
            </div>

            {/* Channels */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2.5 bg-slate-50/60">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Notification Channels
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="rounded accent-indigo-600" {...register('send_email')} />
                <span className="text-xs text-slate-700 font-medium">📧 Send Email Notification</span>
              </label>
              {user?.whatsapp_subscribed && (
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded accent-indigo-600" {...register('send_whatsapp')} />
                  <span className="text-xs text-slate-700 font-medium">💬 Send WhatsApp Alert (Twilio)</span>
                </label>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 shadow-xs shadow-indigo-500/20"
              >
                {creating ? 'Scheduling...' : 'Set Reminder'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirm */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Reminder"
          description={`Remove reminder "${deleteTarget?.title}"?`}
          confirmLabel="Delete"
          loading={deleteLoading}
        />
      </main>
    </div>
  );
};

export default Reminders;
