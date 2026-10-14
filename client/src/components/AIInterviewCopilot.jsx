// ============================================
// HuntOS AI Interview Copilot (Powered by Gemini)
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  Code2,
  Users,
  Lightbulb,
  Copy,
  Check,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { generateInterviewPrep } from '../api';

const AIInterviewCopilot = ({ isOpen, onClose, application }) => {
  const [roundName, setRoundName] = useState('Technical Round');
  const [topics, setTopics] = useState('DSA, System Architecture, Core Concepts');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen || !application) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateInterviewPrep({
        company_name: application.company_name,
        role: application.role,
        round_name: roundName,
        topics,
        difficulty,
      });
      if (res.data?.success) {
        setPrepData(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to generate prep kit');
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

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">HuntOS AI Interview Copilot</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Targeting <span className="font-semibold text-slate-700">{application.role}</span> at{' '}
                <span className="font-semibold text-slate-700">{application.company_name}</span>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Round</label>
              <select
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="Technical Screening">Technical Screening</option>
                <option value="DSA & Algorithms">DSA & Algorithms</option>
                <option value="System Design (HLD/LLD)">System Design (HLD/LLD)</option>
                <option value="Hiring Manager / HR Round">Hiring Manager / HR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="Medium">Medium (Industry Standard)</option>
                <option value="Hard">Hard (FAANG / Tier 1)</option>
                <option value="Easy">Easy (Fundamentals)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-xs transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Analyzing Company...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Generate Prep Kit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-semibold">Notice:</span> {error}
            </div>
          )}

          {/* Results Display */}
          {prepData ? (
            <div className="space-y-6">
              {/* Company Insights */}
              {prepData.company_overview && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1.5">
                    <BookOpen size={14} />
                    <span>Recruiter & Company Expectations</span>
                  </div>
                  <p className="text-xs text-indigo-950/80 leading-relaxed font-medium">
                    {prepData.company_overview}
                  </p>
                </div>
              )}

              {/* Technical Questions */}
              {prepData.technical_questions && (
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                    <Code2 size={16} className="text-indigo-600" />
                    <span>Predicted Technical & DSA Questions</span>
                  </div>
                  <div className="space-y-3">
                    {prepData.technical_questions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <span className="font-semibold text-xs text-slate-900">
                            {idx + 1}. {q.question}
                          </span>
                          <button
                            onClick={() => handleCopy(q.question, `tech-${idx}`)}
                            className="text-slate-400 hover:text-slate-700 p-1"
                            title="Copy question"
                          >
                            {copiedIndex === `tech-${idx}` ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                        {q.concept && (
                          <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md mb-2">
                            Focus: {q.concept}
                          </span>
                        )}
                        {q.approach_hint && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-1.5">
                            <Lightbulb size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-slate-700">Approach Hint:</strong> {q.approach_hint}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Behavioral Questions */}
              {prepData.behavioral_questions && (
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                    <Users size={16} className="text-purple-600" />
                    <span>Behavioral & Culture Fit (STAR Model)</span>
                  </div>
                  <div className="space-y-3">
                    {prepData.behavioral_questions.map((b, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                        <p className="font-semibold text-xs text-slate-900 mb-1.5">
                          {idx + 1}. {b.question}
                        </p>
                        {b.star_tip && (
                          <div className="text-[11px] text-slate-600 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                            <strong className="text-purple-900">STAR Framing Tip:</strong> {b.star_tip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insider Tips */}
              {prepData.insider_tips && (
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100">
                  <div className="flex items-center gap-2 font-bold text-xs text-cyan-400 mb-2">
                    <Lightbulb size={14} />
                    <span>HuntOS Insider Round Tips</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {prepData.insider_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">›</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <div className="py-16 text-center text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 text-indigo-600">
                  <Sparkles size={24} />
                </div>
                <h4 className="font-bold text-slate-700 text-sm mb-1">Targeted Interview Intelligence</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click <strong>Generate Prep Kit</strong> above to receive tailor-made coding questions, system design prompts, and recruiter hints for {application.company_name}.
                </p>
              </div>
            )
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

export default AIInterviewCopilot;
