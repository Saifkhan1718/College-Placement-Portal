import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Briefcase,
  Users,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Percent,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecruiterDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analRes, appsRes] = await Promise.all([
          axios.get(`${API_URL}/recruiter/analytics`),
          axios.get(`${API_URL}/jobs/applications/all`),
        ]);
        setAnalytics(analRes.data);
        setRecentApps(appsRes.data.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-seed chart data
  const chartData = analytics?.jobMetrics || [];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Recruitment Hub</h1>
        <p className="text-xs text-slate-500 mt-1">Review active posts, schedule rounds, and audit hiring metrics.</p>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Jobs */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Listings</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{analytics?.totalJobs || 0}</h2>
          </div>
        </div>

        {/* Total Applications */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Candidates Applied</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{analytics?.totalApplications || 0}</h2>
          </div>
        </div>

        {/* Selected count */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Offers Extended</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{analytics?.selectedCount || 0}</h2>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hiring Conv. Rate</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{analytics?.conversionRate || 0}%</h2>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Job Performance */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6">Listing Performance Metrics</h3>
          <div className="h-[250px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <div className="text-center text-xs text-slate-500">No active job statistics available yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="applicantsCount" name="Total Candidates" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="selected" name="Hired Offers" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-brand-500 animate-pulse" />
              Quick Operations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Create a new hiring listing or audit applicants.
            </p>

            <div className="space-y-3">
              <Link
                to="/recruiter/jobs"
                className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold text-center block shadow-md cursor-pointer transition-colors"
              >
                Post New Job Post
              </Link>
              <Link
                to="/recruiter/applicants"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-white text-xs font-bold text-center block shadow-md cursor-pointer transition-colors"
              >
                Manage Candidates
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Corporate Account Verified</span>
            <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Recent Applications table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Candidate Applications</h3>
          <Link to="/recruiter/applicants" className="text-xs text-brand-500 hover:underline font-semibold flex items-center gap-1">
            Track All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Candidate</th>
                <th className="pb-3">Job Listing</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">No applications received yet.</td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app._id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-4.5 pl-2 font-semibold text-slate-850 dark:text-white">{app.student?.user?.name}</td>
                    <td className="py-4.5">{app.job?.title}</td>
                    <td className="py-4.5">{app.student?.department}</td>
                    <td className="py-4.5 font-bold text-brand-500">{app.student?.cgpa} CGPA</td>
                    <td className="py-4.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
