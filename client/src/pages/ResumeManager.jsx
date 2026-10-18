// ============================================
// HuntOS Resume & ATS Manager
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useEffect, useState, useRef } from 'react';
import { UploadCloud, FileText, X, Sparkles, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ResumeCard from '../components/ResumeCard';
import ATSResumeMatcher from '../components/ATSResumeMatcher';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getResumes, uploadResume, deleteResume } from '../api';

const ResumeManager = () => {
  const { toasts, toast, removeToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [resumeVersion, setResumeVersion] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [atsModalOpen, setAtsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const fetchResumes = async () => {
    try {
      const res = await getResumes();
      setResumes(res.data.data || []);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setSelectedFile(file);
    if (!resumeName) setResumeName(file.name.replace(/\.[^/.]+$/, ''));
    if (!resumeVersion) setResumeVersion('v1.0');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !resumeName || !resumeVersion) {
      toast.error('Please fill in all required fields');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('name', resumeName);
      formData.append('version', resumeVersion);
      await uploadResume(formData);
      toast.success('Resume uploaded successfully to Cloudinary!');
      setSelectedFile(null);
      setResumeName('');
      setResumeVersion('');
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteResume(deleteTarget.id);
      toast.success('Resume deleted');
      setDeleteTarget(null);
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeleteLoading(false);
    }
  };

  const sortedResumes = [...resumes].sort(
    (a, b) => parseFloat(b.success_rate) - parseFloat(a.success_rate)
  );

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      <Sidebar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="ml-64 flex-1 p-8 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Resume Intelligence & ATS Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Version control, Cloudinary storage, callback analytics & Gemini ATS evaluation
            </p>
          </div>

          <button
            onClick={() => setAtsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs shadow-emerald-500/20 transition-all"
          >
            <Sparkles size={14} />
            <span>Launch ATS Resume Scorer</span>
          </button>
        </div>

        {/* Upload Area */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 mb-7 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
            Upload New Resume Version
          </h2>

          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50/60'
                : selectedFile
                ? 'border-emerald-500 bg-emerald-50/40'
                : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60'
            }`}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-emerald-700" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setResumeName('');
                    setResumeVersion('');
                  }}
                  className="ml-2 text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-600">
                  <UploadCloud size={24} />
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1">
                  Drag & drop resume or browse file system
                </p>
                <p className="text-[11px] text-slate-400">PDF or DOCX documents · Up to 5MB</p>
              </>
            )}
          </div>

          {selectedFile && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Profile / Focus *</label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="e.g. Distributed Systems & Core SWE"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Version Label *</label>
                <input
                  type="text"
                  value={resumeVersion}
                  onChange={(e) => setResumeVersion(e.target.value)}
                  placeholder="v2.0"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-2 pt-1">
                <button
                  onClick={handleUpload}
                  disabled={uploading || !resumeName || !resumeVersion}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs shadow-indigo-500/20 transition-all disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Syncing with Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={14} />
                      <span>Upload & Version Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
            <EmptyState
              title="No resumes uploaded"
              description="Upload your tailored resume versions to track callback metrics and calculate ATS scores."
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={(r) => setDeleteTarget(r)}
                  onView={(url) => window.open(url, '_blank')}
                  onScoreAts={() => setAtsModalOpen(true)}
                />
              ))}
            </div>

            {/* Performance comparison table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Callback Conversion Breakdown
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Effectiveness of each resume version ranked by response rate
                  </p>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-6 py-3 font-bold uppercase text-[11px] text-slate-400">Version</th>
                    <th className="text-center px-6 py-3 font-bold uppercase text-[11px] text-slate-400">ATS Rating</th>
                    <th className="text-right px-6 py-3 font-bold uppercase text-[11px] text-slate-400">Applications</th>
                    <th className="text-right px-6 py-3 font-bold uppercase text-[11px] text-slate-400">Interviews</th>
                    <th className="text-right px-6 py-3 font-bold uppercase text-[11px] text-slate-400">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedResumes.map((r) => {
                    const rate = parseFloat(r.success_rate) || 0;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="font-bold text-slate-900">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.version}</p>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          {r.ats_score ? (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60">
                              {r.ats_score}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Unscanned</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold text-slate-600">
                          {r.application_count}
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold text-slate-600">
                          {r.interview_count}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span
                            className={`font-bold ${
                              rate > 30 ? 'text-emerald-700' : rate >= 15 ? 'text-amber-700' : 'text-rose-700'
                            }`}
                          >
                            {rate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Confirm Delete */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Resume Version"
          description={`Delete "${deleteTarget?.name} (${deleteTarget?.version})"? If linked to active applications, deletion is prevented to protect historical records.`}
          confirmLabel="Delete"
          loading={deleteLoading}
        />

        {/* ATS Matcher Modal */}
        <ATSResumeMatcher
          isOpen={atsModalOpen}
          onClose={() => setAtsModalOpen(false)}
          resumes={resumes}
          onAtsUpdated={fetchResumes}
        />
      </main>
    </div>
  );
};

export default ResumeManager;
