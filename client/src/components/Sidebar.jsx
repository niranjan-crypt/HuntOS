// ============================================
// HuntOS Sidebar Component
// Engineered by Niranjan Krishnakumar
// ============================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bell,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applications', icon: Briefcase, label: 'Applications Pipeline' },
  { to: '/resumes', icon: FileText, label: 'Resumes & ATS' },
  { to: '/reminders', icon: Bell, label: 'Smart Alerts' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics & Offers' },
  { to: '/settings', icon: Settings, label: 'System Settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Niranjan Krishnakumar';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col z-30 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold text-lg tracking-tight font-sans">HuntOS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Autonomous Career OS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Command Center
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={17} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}

        {/* AI Copilot Badge Promo */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 via-cyan-50/40 to-slate-50 border border-indigo-100/70">
            <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-semibold mb-1">
              <Sparkles size={14} className="text-indigo-600" />
              <span>Gemini AI Copilot</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Interview prep kits & ATS resume scorer active in pipeline.
            </p>
          </div>
        </div>
      </nav>

      {/* User profile footer */}
      <div className="px-3 py-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white border border-slate-200/60 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center flex-shrink-0 text-white shadow-xs font-bold text-xs">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'niranjan@huntos.dev'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors p-1.5 rounded-lg"
            title="Sign out of HuntOS"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
