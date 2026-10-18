// ============================================
// HuntOS Landing Page
// Engineered by Niranjan Krishnakumar
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Calendar,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../components/Logo';

const features = [
  {
    icon: <Layers className="w-6 h-6 text-indigo-600" />,
    title: 'Dual-View Pipeline (Kanban + Table)',
    description: 'Manage every job and internship application in an interactive Linear-style Kanban board or detailed data table.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-cyan-500" />,
    title: 'Gemini AI Interview Copilot',
    description: 'Instant technical questions, DSA approaches, system design prompts, and behavioral STAR frameworks tailored to each company.',
  },
  {
    icon: <FileText className="w-6 h-6 text-indigo-600" />,
    title: 'ATS Resume Scorer & Matcher',
    description: 'Analyze resume versions against target job descriptions with keyword gap detection and Google XYZ-formula bullet rewrites.',
  },
  {
    icon: <Calendar className="w-6 h-6 text-cyan-500" />,
    title: 'Autonomous Smart Reminders',
    description: 'Never miss an OA or interview round with automated WhatsApp (Twilio) and Gmail notifications powered by node-cron.',
  },
  {
    icon: <LineChart className="w-6 h-6 text-indigo-600" />,
    title: 'Analytics & Offer Comparator',
    description: 'Visualize your placement conversion funnel and calculate first-year compensation (Base + Stocks + Bonuses) side-by-side.',
  },
  {
    icon: <Terminal className="w-6 h-6 text-cyan-500" />,
    title: 'FastClip Browser Extension',
    description: 'Extract job descriptions in 1-click from LinkedIn, Unstop, Internshala, Naukri, and Wellfound directly into your pipeline.',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">HuntOS</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-4 py-2 rounded-xl shadow-xs shadow-indigo-500/30 transition-all"
            >
              Launch Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 blur-[130px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-semibold mb-8 border border-indigo-800/60 shadow-xs">
            <Sparkles size={13} className="text-cyan-400" />
            <span>The Autonomous Career Operating System</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Engineered by Niranjan Krishnakumar</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
            Dominate Your Hunt with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              Machine Intelligence
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A developer-first career command center. Ditch messy spreadsheets for an interactive Kanban pipeline, Gemini-powered interview prep kits, automated ATS resume scoring, and WhatsApp reminders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-6 py-3.5 rounded-xl font-semibold transition-all"
            >
              Explore Live Demo
            </Link>
          </div>

          {/* Quick Demo Credentials pill */}
          <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 font-mono">
            <span>Demo: <strong className="text-indigo-300">niranjan@huntos.dev</strong></span>
            <span>·</span>
            <span>Password: <strong className="text-indigo-300">hunt123</strong></span>
          </div>
        </div>
      </section>

      {/* Stats Proof Bar */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 lg:gap-24 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white mb-1">100%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Automated Pipeline</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white mb-1">Gemini 2.5</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Copilot Engine</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white mb-1">Sub-100ms</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Query Response Time</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white mb-1">Twilio + SMTP</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dual Alert Dispatch</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-white">
              Architected for High-Impact Job Hunts
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Everything required to land Tier-1 tech roles, from application clipping to offer negotiation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 hover:border-indigo-500/40 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Logo size={22} />
            <span className="font-bold text-white">HuntOS</span>
            <span>— The Autonomous Career OS</span>
          </div>
          <div>
            Built & Engineered from scratch by <strong className="text-slate-300">Niranjan Krishnakumar</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
