// ============================================
// HuntOS Login
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { login as loginApi, googleLogin as googleLoginApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import { KeyRound, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'niranjan@huntos.dev',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);

    try {
      const res = await loginApi(data);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user, rememberMe);
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'niranjan@huntos.dev');
    setValue('password', 'hunt123');
    setApiError('');
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
          login(res.data.data.token, res.data.data.user, rememberMe);
          navigate('/dashboard');
        }
      } catch (err) {
        setApiError(err.response?.data?.message || 'Google login failed.');
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

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">Sign In to HuntOS</h1>
            <p className="text-xs text-slate-400">Autonomous Placement & Career Command Center</p>
          </div>

          {/* 1-Click Demo Credentials Pill */}
          <div className="mb-5 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Sparkles size={13} className="text-cyan-400" />
                <span>Demo Account</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">niranjan@huntos.dev / hunt123</p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all shadow-xs"
            >
              Fill In
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                className={`w-full px-3 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                className={`w-full px-3 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${
                  errors.password ? 'border-rose-500' : 'border-slate-800'
                }`}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900 rounded cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-slate-400 cursor-pointer text-xs">
                Keep session authenticated
              </label>
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
              {loading ? 'Authenticating...' : 'Sign In to HuntOS →'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="px-2 bg-slate-950 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl py-2.5 font-semibold text-xs transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google Account</span>
          </button>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Need a new account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Sign Up
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

export default Login;
