// ============================================
// HuntOS Resume Card Component
// Engineered by Niranjan Krishnakumar
// ============================================

import React from 'react';
import { FileText, ExternalLink, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

const ResumeCard = ({ resume, onDelete, onView, onScoreAts }) => {
  const successRate = parseFloat(resume.success_rate) || 0;

  const getRateColor = (rate) => {
    if (rate > 30) return 'text-emerald-700';
    if (rate >= 15) return 'text-amber-700';
    return 'text-rose-700';
  };

  const getRateBg = (rate) => {
    if (rate > 30) return 'bg-emerald-50/70 border border-emerald-100';
    if (rate >= 15) return 'bg-amber-50/70 border border-amber-100';
    return 'bg-rose-50/70 border border-rose-100';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-slate-900 truncate">{resume.name}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-200/60">
              {resume.version}
            </span>
            {resume.ats_score && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200/60">
                <Sparkles size={9} />
                <span>ATS: {resume.ats_score}%</span>
              </span>
            )}
            {resume.created_at && (
              <span className="text-[11px] text-slate-400">{formatDate(resume.created_at)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-base font-extrabold text-slate-900">{resume.application_count || 0}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Linked</p>
        </div>
        <div className="text-center p-2 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-base font-extrabold text-slate-900">{resume.interview_count || 0}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Interviews</p>
        </div>
        <div className={`text-center p-2 rounded-xl ${getRateBg(successRate)}`}>
          <p className={`text-base font-extrabold ${getRateColor(successRate)}`}>
            {successRate.toFixed(0)}%
          </p>
          <p className={`text-[10px] font-bold uppercase tracking-wide ${getRateColor(successRate)}`}>
            Callbacks
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onView(resume.cloudinary_url)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
        >
          <ExternalLink size={12} />
          View Document
        </button>
        {onScoreAts && (
          <button
            onClick={() => onScoreAts(resume)}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
            title="Scan ATS Score"
          >
            <Sparkles size={12} />
            ATS
          </button>
        )}
        <button
          onClick={() => onDelete(resume)}
          className="flex items-center justify-center p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          title="Delete resume version"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;
