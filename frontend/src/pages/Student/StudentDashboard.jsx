import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../store/authSlice.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  GraduationCap,
  Briefcase,
  Calendar,
  FileCheck,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    dispatch(getProfile());
    
    const fetchDashboardData = async () => {
      try {
        const [analRes, appRes, intRes] = await Promise.all([
          axios.get(`${API_URL}/student/analytics`),
          axios.get(`${API_URL}/jobs/applications/all`),
          axios.get(`${API_URL}/student/interviews`),
        ]);
        setAnalytics(analRes.data);
        setRecentApps(appRes.data.slice(0, 3));
        setUpcomingInterviews(intRes.data.slice(0, 2));
      } catch (e) {
        console.error('Failed to load student dashboard data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prep Recharts data from applicationStats
  const statusColors = {
    Applied: '#6366f1',
    'Under Review': '#a855f7',
    Shortlisted: '#f59e0b',
    'Interview Scheduled': '#06b6d4',
    Selected: '#10b981',
    Rejected: '#f43f5e',
  };

  const chartData = analytics?.applicationStats
    ? Object.keys(analytics.applicationStats)
        .map((key) => ({
          name: key,
          value: analytics.applicationStats[key],
        }))
        .filter((item) => item.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner Message */}
      <div className="glass-panel p-6 rounded-3xl border border-white/20 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Welcome back, {user?.name}!
            {profile?.eligibilityStatus ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Placements Eligible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5" /> Placements Blocked
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Department of {profile?.department} | Roll No: {profile?.rollNumber}
          </p>
        </div>
        <Link
          to="/student/profile"
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/10 flex items-center gap-1.5"
        >
          Edit Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid: 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Readiness Score */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Readiness Score</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
              {analytics?.placementReadinessScore || 0}%
            </h2>
          </div>
        </div>

        {/* Profile Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Profile Completed</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
              {profile?.profileCompleted || 0}%
            </h2>
          </div>
        </div>

        {/* Applications */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Job Applications</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
              {analytics?.totalApplications || 0}
            </h2>
          </div>
        </div>

        {/* CGPA */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Academic Grade</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
              {profile?.cgpa || 0} CGPA
            </h2>
          </div>
        </div>
      </div>

      {/* Grid: Charts + Side Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts status distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6">Application Status Tracking</h3>
          <div className="h-[250px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <div className="text-center text-xs text-slate-500">
                <Briefcase className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
                No applications submitted yet. Browse jobs to apply!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Skill Gap Analysis Box */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-brand-500" />
              Recruiter Demands & Skill Gap
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Analyzing active campus drives and identifying gaps in your profile.
            </p>

            <div className="space-y-4">
              {/* Missing Skills */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recommended Additions</h4>
                <div className="flex flex-wrap gap-1.5">
                  {analytics?.skillGap?.missingSkills?.length > 0 ? (
                    analytics.skillGap.missingSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[9px] font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 capitalize">
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-500">Perfect! You match top recruiter tech demands.</span>
                  )}
                </div>
              </div>

              {/* Current Skills list */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your Tracked Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[9px] font-bold rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No skills declared yet. Add them in profile page.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/student/profile"
            className="text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 mt-6"
          >
            Update Your Skills Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid: Recent Applications + Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications table */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Applications</h3>
            <Link to="/student/jobs" className="text-xs text-brand-500 hover:underline font-semibold">
              Browse More
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentApps.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">You haven't applied for any jobs yet.</p>
            ) : (
              recentApps.map((app) => (
                <div key={app._id} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{app.job?.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{app.job?.company?.name} • {app.job?.location}</p>
                  </div>
                  <span
                    className="px-2 py-0.5 text-[9px] font-bold rounded-lg border"
                    style={{
                      color: statusColors[app.status] || '#6366f1',
                      borderColor: statusColors[app.status] ? `${statusColors[app.status]}30` : '#6366f130',
                      backgroundColor: statusColors[app.status] ? `${statusColors[app.status]}10` : '#6366f110',
                    }}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Interviews schedule list */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Upcoming Interviews</h3>
            <Link to="/student/interviews" className="text-xs text-brand-500 hover:underline font-semibold">
              Full Calendar
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingInterviews.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No interviews scheduled at this moment.</p>
            ) : (
              upcomingInterviews.map((int) => (
                <div key={int._id} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">{int.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{int.job?.title} • {int.job?.company?.name}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-brand-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(int.datetime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {int.link && (
                    <a
                      href={int.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3.5 inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[10px] font-bold shadow-md cursor-pointer"
                    >
                      Join Meeting Round
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
