import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Percent,
  Coins,
  GraduationCap,
  Calendar,
  Building,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TpoDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchTpoAnalytics = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/tpo/analytics`);
        setAnalytics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTpoAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Recharts color palettes
  const barColors = ['#6366f1', '#a855f7'];
  const pieColors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

  const deptData = analytics?.departmentWiseData || [];
  const companyData = analytics?.companyHiringData || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Training & Placement Control</h1>
          <p className="text-xs text-slate-500 mt-1">Oversee campus recruitment statistics, approve corporate job vacancies, and manage drive events.</p>
        </div>
        <Link
          to="/tpo/drives"
          className="px-4.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4" /> Schedule Campus Drive
        </Link>
      </div>

      {/* Grid: 6 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="glass-panel p-4 rounded-xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Students</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
            <Users className="w-4 h-4 text-brand-500" />
            {analytics?.totalStudents || 0}
          </h2>
        </div>

        {/* Placed Students */}
        <div className="glass-panel p-4 rounded-xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Placed Count</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {analytics?.placedStudents || 0}
          </h2>
        </div>

        {/* Placement Percentage */}
        <div className="glass-panel p-4 rounded-xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Placed Rate</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
            <Percent className="w-4 h-4 text-brand-500" />
            {analytics?.placementPercentage || 0}%
          </h2>
        </div>

        {/* Highest Package */}
        <div className="glass-panel p-4 rounded-xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Highest Offer</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
            <Coins className="w-4 h-4 text-amber-500" />
            {analytics?.highestPackage || 0} LPA
          </h2>
        </div>

        {/* Average Package */}
        <div className="glass-panel p-4 rounded-xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Average Offer</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            {analytics?.averagePackage || 0} LPA
          </h2>
        </div>

        {/* Eligible Students */}
        <div className="glass-panel p-4 rounded-xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Eligible Count</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
            <GraduationCap className="w-4 h-4 text-brand-500" />
            {analytics?.eligibleStudents || 0}
          </h2>
        </div>
      </div>

      {/* Grid: Recharts department bar chart + company pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department placement percentages */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6">Department Wise Placement Ratios</h3>
          <div className="h-[250px]">
            {deptData.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-20">No department statistics logged yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="total" name="Total Candidates" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Company hiring stats */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6">Company Hiring Volume Share</h3>
          <div className="h-[250px] flex items-center justify-center">
            {companyData.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-20">No placement hires reported yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="hiredCount"
                    nameKey="company"
                  >
                    {companyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
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
      </div>

      {/* Operations Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Operations Dashboard Quick Navigation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/tpo/students"
            className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-100 dark:border-slate-800 rounded-xl transition-all block text-center"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">Verify Students</h4>
            <span className="text-[10px] text-slate-500">Toggle placement eligibility flags</span>
          </Link>
          <Link
            to="/tpo/recruiters"
            className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-100 dark:border-slate-800 rounded-xl transition-all block text-center"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">Approve Corporate</h4>
            <span className="text-[10px] text-slate-500">Verify company recruiters profiles</span>
          </Link>
          <Link
            to="/tpo/jobs"
            className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-100 dark:border-slate-800 rounded-xl transition-all block text-center"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">Approve Job Posts</h4>
            <span className="text-[10px] text-slate-500">Audit company requirements & salary</span>
          </Link>
          <Link
            to="/tpo/drives"
            className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850/80 border border-slate-100 dark:border-slate-800 rounded-xl transition-all block text-center"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">Drives Schedule</h4>
            <span className="text-[10px] text-slate-500">Broadcast drive alerts to students</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TpoDashboard;
