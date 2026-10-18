// ============================================
// HuntOS Analytics & Offer Intelligence
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useEffect, useState } from 'react';
import { TrendingUp, Briefcase, Award, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { MonthlyBarChart, StatusPieChart } from '../components/AnalyticsChart';
import ApplicationFunnel from '../components/ApplicationFunnel';
import OfferComparator from '../components/OfferComparator';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getApplicationStats, getResumes } from '../api';

const MetricCard = ({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={16} className={iconColor} />
      </div>
    </div>
    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, resumesRes] = await Promise.all([
          getApplicationStats(),
          getResumes(),
        ]);
        setStats(statsRes.data.data);
        setResumes(resumesRes.data.data || []);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const counts = stats?.counts || {};
  const total = parseInt(counts.total) || 0;
  const offers = parseInt(counts.offers) || 0;
  const interviews = parseInt(counts.interviews) || 0;

  const interviewRate = total > 0 ? `${Math.round((interviews / total) * 100)}%` : '—';
  const offerRate = interviews > 0 ? `${Math.round((offers / interviews) * 100)}%` : '—';

  const rejectionStages = (stats?.statusBreakdown || []).filter((s) =>
    ['Technical Round 1', 'Technical Round 2', 'HR Round', 'OA Scheduled'].includes(s.status)
  );

  const sortedResumes = [...resumes].sort(
    (a, b) => parseFloat(b.success_rate) - parseFloat(a.success_rate)
  );

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 min-w-0">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Career Intelligence & Compensation Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conversion funnel analytics, interview throughput & offer compensation comparison
          </p>
        </div>

        {loading ? (
          <>
            <LoadingSkeleton type="stat" count={4} />
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div className="skeleton h-64 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Row 1: Metrics */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard
                label="Total Applications"
                value={total.toLocaleString('en-IN')}
                icon={Briefcase}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
              />
              <MetricCard
                label="Interview Throughput"
                value={interviewRate}
                sub={`${interviews} of ${total} converted to rounds`}
                icon={TrendingUp}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              />
              <MetricCard
                label="Offer Conversion"
                value={offerRate}
                sub={`${offers} offers from ${interviews} interviews`}
                icon={Award}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <MetricCard
                label="Active Pipeline"
                value={(total - (parseInt(counts.rejected) || 0)).toLocaleString('en-IN')}
                sub="In-flight opportunities"
                icon={Clock}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
              />
            </div>

            {/* Row 2: Offer Comparator Widget */}
            <OfferComparator />

            {/* Row 3: Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-5">
                  Monthly Application Velocity
                </h2>
                <MonthlyBarChart data={stats?.monthly || []} />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-5">
                  Pipeline Status Distribution
                </h2>
                <StatusPieChart data={stats?.statusBreakdown || []} />
              </div>
            </div>

            {/* Row 4: Funnel + Resume Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-5">
                  Placement Conversion Funnel
                </h2>
                <ApplicationFunnel data={stats?.funnel || []} />
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Resume Version Performance
                  </h2>
                </div>
                {resumes.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Upload resumes to see performance data
                  </div>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="text-left px-5 py-3 text-[11px] font-bold uppercase text-slate-400">
                          Resume
                        </th>
                        <th className="text-right px-5 py-3 text-[11px] font-bold uppercase text-slate-400">
                          Apps
                        </th>
                        <th className="text-right px-5 py-3 text-[11px] font-bold uppercase text-slate-400">
                          Interviews
                        </th>
                        <th className="text-right px-5 py-3 text-[11px] font-bold uppercase text-slate-400">
                          Success
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedResumes.map((r) => {
                        const rate = parseFloat(r.success_rate) || 0;
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-3">
                              <p className="font-bold text-slate-900">{r.name}</p>
                              <p className="text-[11px] text-slate-400">{r.version}</p>
                            </td>
                            <td className="px-5 py-3 text-right font-medium text-slate-600">
                              {r.application_count}
                            </td>
                            <td className="px-5 py-3 text-right font-medium text-slate-600">
                              {r.interview_count}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span
                                className={`font-bold ${
                                  rate > 30 ? 'text-emerald-700' : rate >= 15 ? 'text-amber-700' : 'text-rose-700'
                                }`}
                              >
                                {rate.toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Row 5: Rejection Stages */}
            {rejectionStages.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
                  Where Applications Stall (Friction Points)
                </h2>
                <div className="space-y-3">
                  {rejectionStages.map((stage) => {
                    const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                    return (
                      <div key={stage.status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">{stage.status}</span>
                          <span className="font-bold text-slate-900">
                            {stage.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
