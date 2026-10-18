// ============================================
// HuntOS ATS Resume Scorer & Matcher (Powered by Gemini)
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useState } from 'react';
import {
  FileCheck2,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { reviewResumeATS, updateResumeATS } from '../api';

const ATSResumeMatcher = ({ isOpen, onClose, resumes, onAtsUpdated }) => {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes?.[0]?.id || '');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !selectedResumeId) {
      setError('Please provide resume content or choose a resume version');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the target job description');
      return;
    }

    setLoading(true);
    setError(null);

    const chosenResume = resumes?.find((r) => r.id === parseInt(selectedResumeId));
    const effectiveText = resumeText.trim() || `Resume Version: ${chosenResume?.name || 'Default'}\n${chosenResume?.cloudinary_url}`;

    try {
      const res = await reviewResumeATS({
        resume_text: effectiveText,
        job_description: jobDescription,
        role: role || 'Software Engineer',
        company_name: companyName || 'Target Company',
      });

      if (res.data?.success) {
        const data = res.data.data;
        setResult(data);

        // Update score in DB if linked to a resume version
        if (selectedResumeId && data.ats_score) {
          try {
            await updateResumeATS(selectedResumeId, data.ats_score);
            if (onAtsUpdated) onAtsUpdated();
          } catch (e) {
            // Non-critical
          }
        }
      } else {
        setError(res.data?.message || 'ATS evaluation failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to reach Gemini AI service. Ensure your GEMINI_API_KEY is configured in .env'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 via-white to-cyan-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileCheck2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">HuntOS ATS Keyword & Resume Matcher</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  AI Evaluator
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Score your resume against any job description with instant keyword analysis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Resume Source</label>
                {resumes?.length > 0 && (
                  <span className="text-[11px] text-slate-400">or paste text below</span>
                )}
              </div>
              {resumes?.length > 0 && (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full mb-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                >
                  <option value="">Select an uploaded resume version...</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.version}) {r.ats_score ? `— Prior ATS: ${r.ats_score}%` : ''}
                    </option>
                  ))}
                </select>
              )}
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume bullet points / text here..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none font-mono"
              />
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Target Role (e.g. SDE II)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Company (e.g. Google)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target Job Description / Requirements here..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Running ATS Screening Engine...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Score Resume & Evaluate Keywords</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Results Card */}
          {result && (
            <div className="space-y-5 pt-2">
              {/* ATS Metric banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-xl font-extrabold">{result.ats_score}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">Score</span>
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                      {result.match_level}
                    </span>
                    <p className="text-xs text-slate-300 max-w-md">{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Keyword Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Matched Keywords Found</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched_skills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-2">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span>Missing Keywords To Add</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords?.map((k, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-md"
                      >
                        + {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact Rewrites */}
              {result.impact_improvements?.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
                    Quantified Bullet Point Upgrades (Google XYZ Formula)
                  </h4>
                  <div className="space-y-2.5">
                    {result.impact_improvements.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5 shadow-2xs"
                      >
                        <div className="text-slate-400 line-through">"{item.original}"</div>
                        <div className="text-slate-800 font-medium text-emerald-700 bg-emerald-50/40 p-2 rounded-lg border border-emerald-100">
                          <strong>Recommended:</strong> "{item.suggested}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
          <span>Engineered by Niranjan Krishnakumar</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSResumeMatcher;
