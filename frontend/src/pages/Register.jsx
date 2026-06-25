import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError, API_URL } from '../store/authSlice.js';
import { motion } from 'framer-motion';
import { Briefcase, User, Mail, Lock, Phone, UserPlus, AlertCircle, Building, BookOpen, GraduationCap, TrendingUp, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, isLoading, user } = useSelector((state) => state.auth);

  const [role, setRole] = useState('student'); // 'student' or 'recruiter'
  
  // Base State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [cgpa, setCgpa] = useState('');

  // Recruiter specific
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');

  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'waking_up' | 'offline'
  const [showSlowWarning, setShowSlowWarning] = useState(false);

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

  // Monitor slow signup requests (cold starts on Render free tier)
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
    
    const baseData = { name, email, password, role };
    let payload = { ...baseData };

    if (role === 'student') {
      payload = {
        ...payload,
        rollNumber,
        department,
        cgpa: Number(cgpa) || 7.0,
      };
    } else {
      payload = {
        ...payload,
        companyName,
        position,
        phone,
      };
    }

    dispatch(registerUser(payload));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-white font-sans overflow-x-hidden">
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
              Onboarding Center
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Unlock Top Tier <br />
              Career Opportunities.
            </h2>
            <p className="text-slate-400 text-sm max-w-sm">
              Create your account to start building your professional placement profile.
            </p>
          </div>

          {/* Premium Glassmorphic Features Widget */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portal Features</span>
              <span className="text-xs font-bold text-accent-400 flex items-center gap-1 bg-accent-500/10 px-2 py-0.5 rounded-full border border-accent-500/20">
                <TrendingUp className="w-3.5 h-3.5" /> Next Gen
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0 border border-brand-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">AI-Powered Resumes</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Build optimized profiles matching recruiter specs.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-400 shrink-0 border border-accent-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Real-Time Chat & Board</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Communicate directly with placement cells and recruiters.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Placement Predictor</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Calculate selection probabilities using AI scoring.</p>
                </div>
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
      <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-12 md:p-16 relative overflow-y-auto">
        {/* Responsive Ambient Glows for mobile */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-lg space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
            {/* Small mobile brand header */}
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight">SuccessAchievers</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-sm">Join the placement system today</p>

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

          {/* Role Selector Tabs */}
          <div className="flex p-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 relative">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer z-10 flex items-center justify-center gap-2 ${
                role === 'student' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4.5 h-4.5" />
              As Student
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer z-10 flex items-center justify-center gap-2 ${
                role === 'recruiter' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building className="w-4.5 h-4.5" />
              As Recruiter
            </button>
            
            {/* Animated Slider backdrop */}
            <motion.div
              layoutId="activeTab"
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 shadow-md"
              style={{
                left: role === 'student' ? '4px' : 'calc(50% + 0px)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
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
              {/* Name & Email in Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                    />
                  </div>
                </div>

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
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                  />
                </div>
              </div>

              {/* Student specific fields */}
              {role === 'student' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 border-t border-slate-800/60"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Roll Number / UID
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="CS2023005"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Current CGPA
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        required
                        placeholder="8.50"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-white text-sm outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Recruiter specific fields */}
              {role === 'recruiter' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 border-t border-slate-800/60"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Google Inc"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Position / Role
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Senior Technical Recruiter"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="+91 99999 88888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-white placeholder-slate-600 text-sm transition-all outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-4.5 h-4.5" />
                    Sign Up Account
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Login Redirect */}
          <p className="text-center lg:text-left text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-400 hover:text-brand-300 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
