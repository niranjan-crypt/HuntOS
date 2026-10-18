// ============================================
// HuntOS Dashboard
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  Trophy,
  XCircle,
  ArrowRight,
  Activity,
  Plus,
  Sparkles,
  Download,
  CheckCircle2,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import ApplicationFunnel from '../components/ApplicationFunnel';
import { getApplicationStats, getApplications, getReminders, getActivityLog, exportApplications } from '../api';

const StatCard = ({ label, value, icon: Icon, iconBg, iconColor, loading }) => (
  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 relative overflow-hidden shadow-2xs hover:shadow-xs transition-shadow">
    {loading ? (
      <div className="space-y-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-7 w-14 rounded" />
      </div>
    ) : (
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {value?.toLocaleString('en-IN') ?? '—'}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
    )}
  </div>
);

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, appsRes, remindersRes, activityRes] = await Promise.all([
          getApplicationStats(),
          getApplications({ sort: 'created_at', order: 'DESC' }),
          getReminders(),
          getActivityLog(),
        ]);
        setStats(statsRes.data.data);
        setRecentApps((appsRes.data.data || []).slice(0, 5));
        setReminders((remindersRes.data.data || []).filter((r) => !r.sent).slice(0, 3));
        setActivity((activityRes.data.data || []).slice(0, 8));
      } catch (err) {
        console.error('HuntOS Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await exportApplications('csv');
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'huntos_pipeline_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const statCards = [
    { label: 'Total Applications', value: stats?.counts?.total, icon: Briefcase, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { label: 'Assessments Pending', value: stats?.counts?.oa_pending, icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'In Interviews', value: stats?.counts?.interviews, icon: Calendar, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Offers Received', value: stats?.counts?.offers, icon: Trophy, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Archived / Rejected', value: stats?.counts?.rejected, icon: XCircle, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 min-w-0">
        {/* Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Executive Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous Career Command Center · Engineered by Niranjan Krishnakumar
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <Link
              to="/applications?add=true"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-500/20 transition-all"
            >
              <Plus size={15} />
              <span>Add Application</span>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-7">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} loading={loading} />
          ))}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-5">
          {/* Recent Applications */}
          <div className="xl:col-span-3 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Recent Applications</h2>
              <Link to="/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                View all in pipeline <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
              </div>
            ) : recentApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Briefcase size={24} className="mb-2 text-slate-300" />
                <p className="text-xs font-medium">No applications logged yet</p>
                <Link to="/applications?add=true" className="mt-2 text-xs font-semibold text-indigo-600">
                  Add your first application →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-6 py-3 text-[11px] font-bold uppercase text-slate-400">Company</th>
                      <th className="text-left px-6 py-3 text-[11px] font-bold uppercase text-slate-400">Role</th>
                      <th className="text-left px-6 py-3 text-[11px] font-bold uppercase text-slate-400">Status</th>
                      <th className="text-left px-6 py-3 text-[11px] font-bold uppercase text-slate-400">Date</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="text-xs font-bold text-slate-900">{app.company_name}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <p className="text-xs text-slate-600 truncate max-w-40">{app.role}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-3.5">
                          <p className="text-xs text-slate-400">
                            {new Date(app.application_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link
                            to={`/applications/${app.id}`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Application Funnel */}
          <div className="xl:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Conversion Pipeline Funnel
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-8 rounded-lg" />)}
                </div>
              ) : (
                <ApplicationFunnel data={stats?.funnel || []} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Upcoming Reminders */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Upcoming Smart Alerts
              </h2>
              <Link to="/reminders" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="p-4 space-y-2">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-xl" />)
              ) : reminders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No pending reminders scheduled</div>
              ) : (
                reminders.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{r.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(r.remind_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <Activity size={15} className="text-slate-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Live Audit Activity Feed
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                [1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-8 rounded" />)
              ) : activity.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No activity logged yet</div>
              ) : (
                activity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 leading-snug font-medium">{log.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(log.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
