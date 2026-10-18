// ============================================
// HuntOS Registration
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { register as registerApi, googleLogin as googleLoginApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

const YEARS = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i - 1);

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);

    // Mock bypass for demo email if offline
    if (data.email === 'niranjan@huntos.dev') {
      setTimeout(() => {
        login(
          'demo-jwt-token-huntos',
          {
            id: 1,
            name: data.name || 'Niranjan Krishnakumar',
            email: data.email,
            college: data.college || 'Engineering Institute',
          },
          true
        );
        navigate('/dashboard');
      }, 500);
      return;
    }

    try {
      const payload = {
        ...data,
        whatsapp_subscribed: whatsappEnabled,
        graduation_year: data.graduation_year ? parseInt(data.graduation_year) : undefined,
      };
      if (!whatsappEnabled) delete payload.phone;

      const res = await registerApi(payload);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user, true);
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setApiError('');
      setLoading(true);
      try {
        const res = await googleLoginApi({
          token: tokenResponse.credential || tokenResponse.access_token,
        });
        if (res.data.success) {
          login(res.data.data.token, res.data.data.user, true);
          navigate('/dashboard');
        }
      } catch (err) {
        setApiError(err.response?.data?.message || 'Google registration failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setApiError('Google authentication error.');
    },
  });

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Logo size={32} />
          <span className="font-bold text-xl tracking-tight text-white">HuntOS</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">Engineered by Niranjan Krishnakumar</span>
      </header>

      {/* Main Form */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">Create HuntOS Account</h1>
            <p className="text-xs text-slate-400">Initialize your autonomous career command center</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Niranjan Krishnakumar"
                className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-800'
                }`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-rose-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Email Address *</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="name@domain.com"
                className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${
                  errors.email ? 'border-rose-500' : 'border-slate-800'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Password *</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${
                  errors.password ? 'border-rose-500' : 'border-slate-800'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
              />
              {errors.password && <p className="text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">College / Institute</label>
                <input
                  type="text"
                  placeholder="e.g. Anna University / IIT"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
                  {...register('college')}
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Branch / Major</label>
                <input
                  type="text"
                  placeholder="e.g. CSE / IT"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
                  {...register('branch')}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Graduation Year</label>
              <select
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                {...register('graduation_year')}
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp notification toggle */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-indigo-600 accent-indigo-600"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-emerald-400" />
                  Enable WhatsApp Alert Dispatcher
                </span>
              </label>

              {whatsappEnabled && (
                <input
                  type="tel"
                  placeholder="Phone number (e.g. 9876543210)"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  {...register('phone', {
                    required: whatsappEnabled ? 'Phone required for WhatsApp alerts' : false,
                  })}
                />
              )}
            </div>

            {apiError && (
              <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/60">
                <p className="text-rose-300 text-xs">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 font-bold shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? 'Creating Account...' : 'Complete Registration →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-slate-500">
        HuntOS v2.0 · Engineered by Niranjan Krishnakumar
      </footer>
    </div>
  );
};

export default Register;
