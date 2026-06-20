import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  FileCheck,
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-brand-500 selection:text-white">
      {/* Premium background gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10 border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            NexusPlacement
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4.5 py-2 text-sm font-bold bg-white hover:bg-slate-100 text-slate-950 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Tag */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-400 mb-6"
          >
            <Zap className="w-3.5 h-3.5 animate-pulse text-brand-400" />
            AI-POWERED COLLEGE PLACEMENT ECOSYSTEM
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6"
          >
            Bridging Academics and Careers with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-accent-400">
              Intelligent Analytics
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
          >
            A unified web platform mapping students, recruiters, and placement offices. Streamlined scheduling, ATS evaluations, and real-time conversion monitoring.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 font-bold text-sm shadow-xl shadow-brand-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              Sign Up For Placements
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              Demo Portal Access
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Banner */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10 border-y border-white/5 bg-slate-900/20 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">96%</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Placement rate</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">22 LPA</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Highest Package</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">50+</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Hiring Corporates</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">500+</h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Offers Extended</p>
          </div>
        </div>
      </section>

      {/* Role Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-16">
          Tailored Workflows For Every Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student */}
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:border-brand-500/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Students</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Build professional profiles, track ATS scores, predict placement probabilities, and apply directly to top vacancies.
              </p>
            </div>
            <Link to="/login" className="text-brand-400 hover:text-brand-300 text-xs font-bold flex items-center gap-1">
              Explore Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recruiter */}
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:border-accent-500/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Recruiters</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Post approved jobs, manage applicants, schedule direct Google/Teams interviews, and track talent acquisition metrics.
              </p>
            </div>
            <Link to="/login" className="text-accent-400 hover:text-accent-300 text-xs font-bold flex items-center gap-1">
              Explore Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TPO */}
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:border-emerald-500/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Placement Officers (TPO)</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Oversee student eligibility, approve corporate postings, broadcast drive schedules, and generate analytical performance charts.
              </p>
            </div>
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1">
              Explore Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Smart Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-slate-900/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-accent-400 uppercase tracking-widest mb-6">
              <BrainCircuit className="w-3.5 h-3.5" />
              Nexus Smart Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              Equipped with Intelligent AI Analytics
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-brand-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">ATS Resume Evaluator</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Upload resumes and get instant scoring, missing skill listings, and vocabulary improvements.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-accent-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Placement Readiness Predictor</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Predict placement chances using mathematical weight models based on projects, certifications, and grades.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">AI Placement Chatbot</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Instant guides for interview topics, mock questions, and answers for typical company formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            {/* Visual Glass Box */}
            <div className="w-full max-w-md p-6 rounded-3xl border border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-brand-500 rounded-full blur-md"></div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <span className="text-xs font-bold text-slate-400">Mock Smart Engine Panel</span>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">Online</span>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-300">ATS Resume Score</span>
                    <span className="text-xs font-extrabold text-emerald-400">85/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[85%] rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-300">Placement Probability</span>
                    <span className="text-xs font-extrabold text-brand-400">92%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full w-[92%] rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 text-xs text-slate-400">
                  <span className="text-slate-300 font-bold block mb-1">AI Recommendation:</span>
                  "Clear outstanding mechanical backlogs and acquire 1 additional cloud certification."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 relative z-10 text-center border-t border-white/5 text-slate-500 text-xs font-medium">
        <p>© 2026 NexusPlacement College Portal. Built as a Senior Engineering Showcase.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
