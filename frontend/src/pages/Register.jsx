import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../store/authSlice.js';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, Lock, Phone, UserPlus, AlertCircle, Building, BookOpen, GraduationCap } from 'lucide-react';

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

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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
    <div className="min-h-screen relative flex items-center justify-center bg-slate-900 overflow-hidden py-12 px-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-brand-500/30 text-white mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Get started with the Placement Portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex p-1 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-800/80 mb-6 relative">
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

        {/* Glassmorphism Panel */}
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Generic Details (Name, Email, Password) */}
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

            {/* Dynamic Student Fields */}
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

            {/* Dynamic Recruiter Fields */}
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
                      Your Position / Role
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
                    Contact Phone Number
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

            {/* Submit Button */}
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
        <p className="text-center text-xs text-slate-500 mt-6">
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
  );
};

export default Register;
