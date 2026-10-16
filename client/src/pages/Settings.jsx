// ============================================
// HuntOS Settings & Preferences
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Lock, AlertTriangle, Save, Download, Database, Info } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword, deleteAccount, exportApplications } from '../api';

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden mb-5 shadow-2xs">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <Icon size={15} className="text-slate-500" />
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">{title}</h2>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const YEARS = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i - 1);

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [whatsappOn, setWhatsappOn] = useState(user?.whatsapp_subscribed || false);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      college: user?.college || '',
      branch: user?.branch || '',
      graduation_year: user?.graduation_year || '',
      phone: user?.phone || '',
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passErrors },
  } = useForm();

  const newPassword = watchPassword('newPassword', '');

  const onSaveProfile = async (data) => {
    setSavingProfile(true);
    try {
      const res = await updateProfile({
        ...data,
        whatsapp_subscribed: whatsappOn,
        graduation_year: data.graduation_year ? parseInt(data.graduation_year) : null,
      });
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onSavePassword = async (data) => {
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
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
      a.download = `huntos_backup.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`Downloaded ${format.toUpperCase()} archive`);
    } catch {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
      logout();
      navigate('/login');
    } catch {
      toast.error('Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="ml-64 flex-1 p-8 min-w-0">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage credentials, notifications & export archives</p>
        </div>

        <div className="max-w-2xl">
          {/* Profile */}
          <SectionCard title="Candidate Profile" icon={User}>
            <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                    profileErrors.name ? 'border-rose-400' : 'border-slate-200'
                  }`}
                  {...regProfile('name', { required: 'Name is required' })}
                />
                {profileErrors.name && (
                  <p className="text-xs text-rose-600 mt-1">{profileErrors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">University / Institute</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    {...regProfile('college')}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Major / Branch</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    {...regProfile('branch')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                    {...regProfile('graduation_year')}
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    {...regProfile('phone')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-xs shadow-indigo-500/20 transition-all disabled:opacity-60"
              >
                {savingProfile ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </form>
          </SectionCard>

          {/* Data Export & Backup */}
          <SectionCard title="Data Export & Archival" icon={Database}>
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 leading-relaxed">
                Export your full application history, interview notes, and timeline metrics into portable CSV or JSON files.
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Download size={13} />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Notification Preferences" icon={Bell}>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Email Notifications</p>
                  <p className="text-slate-400 mt-0.5">Automated reminders via Nodemailer SMTP</p>
                </div>
                <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-default">
                  <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">WhatsApp Alert Dispatcher</p>
                  <p className="text-slate-400 mt-0.5">Requires valid phone number (Twilio)</p>
                </div>
                <button
                  onClick={() => setWhatsappOn(!whatsappOn)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    whatsappOn ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      whatsappOn ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {whatsappOn && (
                <button
                  onClick={() => handleProfileSubmit(onSaveProfile)()}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Save alert preferences →
                </button>
              )}
            </div>
          </SectionCard>

          {/* Password */}
          <SectionCard title="Security & Password" icon={Lock}>
            <form onSubmit={handlePasswordSubmit(onSavePassword)} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                    passErrors.currentPassword ? 'border-rose-400' : 'border-slate-200'
                  }`}
                  {...regPassword('currentPassword', { required: 'Current password required' })}
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                    passErrors.newPassword ? 'border-rose-400' : 'border-slate-200'
                  }`}
                  {...regPassword('newPassword', {
                    required: true,
                    minLength: { value: 8, message: 'Min 8 characters' },
                  })}
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
                    passErrors.confirmPassword ? 'border-rose-400' : 'border-slate-200'
                  }`}
                  {...regPassword('confirmPassword', {
                    validate: (v) => v === newPassword || 'Passwords do not match',
                  })}
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-xs shadow-indigo-500/20 transition-all disabled:opacity-60"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </SectionCard>

          {/* Danger Zone */}
          <div className="bg-white border border-rose-200/80 rounded-2xl overflow-hidden shadow-2xs">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-rose-100 bg-rose-50/50">
              <AlertTriangle size={15} className="text-rose-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-700">Danger Zone</h2>
            </div>
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Delete Account & Purge Data</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Permanently delete your profile and all tracking records.
                </p>
              </div>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete confirm */}
        <ConfirmDialog
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account & Purge Data"
          description="Are you sure you want to delete your HuntOS account? All data will be permanently wiped."
          confirmLabel="Delete Account"
          loading={deleteLoading}
        />
      </main>
    </div>
  );
};

export default Settings;
