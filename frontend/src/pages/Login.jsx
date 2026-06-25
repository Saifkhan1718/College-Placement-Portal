import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, googleAuthLogin, clearError, API_URL } from '../store/authSlice.js';
import { motion } from 'framer-motion';
import { Briefcase, Mail, Lock, LogIn, AlertCircle, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, isLoading, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'waking_up' | 'offline'
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  // Clear previous errors when landing on this page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Ping backend to wake it up and monitor connection status
  useEffect(() => {
    let active = true;
    const checkServer = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        if (active) setApiStatus('waking_up');
      }, 4000); // Assume it's waking up if no response within 4s

      try {
        const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
        await axios.get(baseUrl, {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        clearTimeout(timeoutId);
        if (active) setApiStatus('online');
      } catch (err) {
        clearTimeout(timeoutId);
        if (active && err.code !== 'ERR_CANCELED') {
          if (err.response) {
            setApiStatus('online'); // Got a response back (e.g. 404 or CORS but server is alive)
          } else {
            setApiStatus('offline');
          }
        }
      }
    };

    checkServer();
    return () => {
      active = false;
    };
  }, []);

  // Monitor slow login requests (cold starts on Render free tier)
  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowSlowWarning(true);
      }, 4000);
    } else {
      setShowSlowWarning(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'recruiter') navigate('/recruiter/dashboard');
      else if (user.role === 'tpo') navigate('/tpo/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  const handleGoogleLogin = () => {
    // Mock google auth payload
    const mockGooglePayload = {
      email: 'rohan.verma@student.edu', // pre-seeded student
      name: 'Rohan Verma',
      googleId: 'g_1234567890',
      imageUrl: '',
    };
    dispatch(googleAuthLogin(mockGooglePayload));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-white font-sans overflow-hidden">
      {/* Brand Column (Left) */}
      <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-slate-950 border-r border-slate-900">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Brand Header */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">SuccessAchievers</h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Control Center</span>
          </div>
        </div>

        {/* Feature Cards/Stats Container */}
        <div className="relative my-auto space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-400">
              Placement Season 2026
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Empowering Careers, <br />
              Connecting Leaders.
            </h2>
            <p className="text-slate-400 text-sm max-w-sm">
              An all-in-one portal designed to connect students with top global enterprises.
            </p>
          </div>

          {/* Premium Glassmorphic Stats Widget */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Metric</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" /> +12% YoY
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Radial Progress Circle */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                  <circle cx="40" cy="40" r="34" className="stroke-brand-500" strokeWidth="6" fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - 0.942)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm font-extrabold text-white block">94.2%</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">Placed</span>
                </div>
              </div>

              {/* Quick Numbers */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span className="text-xs text-slate-350"><strong className="text-white">180+</strong> Recruiting Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent-400" />
                  <span className="text-xs text-slate-350"><strong className="text-white">14.2 LPA</strong> Average Package</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-350"><strong className="text-white">45 LPA</strong> Highest CTC Offered</span>
                </div>
              </div>
            </div>

            {/* Scrolling / Marquee of logos as elegant pills */}
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Our Top Recruiters</span>
              <div className="flex flex-wrap gap-2">
                {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company, index) => (
                  <span key={index} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 shadow-sm hover:border-brand-500 transition-colors">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-[11px] text-slate-600 font-medium">
            © 2026 Campus Placement Cell. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form Column (Right) */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        {/* Responsive Ambient Glows for mobile */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header (visible/styled for all screens) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
            {/* Small mobile brand header */}
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight">SuccessAchievers</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Access the College Placement Control Center</p>

            {/* Server Connection Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80 text-[11px] font-semibold">
              {apiStatus === 'checking' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping"></span>
                  <span className="text-slate-400 font-medium">Checking server connection...</span>
                </>
              )}
              {apiStatus === 'online' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                  <span className="text-emerald-400 font-medium">Server Connected</span>
                </>
              )}
              {apiStatus === 'waking_up' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                  <span className="text-amber-400 font-medium">Waking up server (takes ~50s)...</span>
                </>
              )}
              {apiStatus === 'offline' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                  <span className="text-rose-400 font-medium">Server Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {showSlowWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1.5 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 animate-bounce text-amber-400" />
                  <span>Waking up server container...</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  The backend is hosted on a free platform. It takes up to 50 seconds to boot on first launch after inactivity. Thank you for waiting!
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-[#111827] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            {/* Google Login Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-950 hover:text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Quick Student Demo Login
            </motion.button>
          </div>

          {/* Register Redirect link */}
          <p className="text-center lg:text-left text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-brand-400 hover:text-brand-300 hover:underline transition-colors"
            >
              Create an Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
