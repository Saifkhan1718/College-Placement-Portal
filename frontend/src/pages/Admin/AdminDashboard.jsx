import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ShieldAlert,
  Server,
  Activity,
  HardDrive,
  Users,
  Clock,
  TrendingUp,
  FileCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/stats`),
          axios.get(`${API_URL}/admin/audit-logs`),
        ]);
        setStats(statsRes.data);
        setAuditLogs(logsRes.data.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-seed chart data for simulated server loads
  const mockTelemetry = [
    { time: '10:00', cpu: 12, mem: 45 },
    { time: '10:10', cpu: 18, mem: 48 },
    { time: '10:20', cpu: 15, mem: 46 },
    { time: '10:30', cpu: 22, mem: 50 },
    { time: '10:40', cpu: 35, mem: 55 },
    { time: '10:50', cpu: stats?.cpuUsage || 28, mem: stats?.memory?.percentage || 52 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Admin Management</h1>
        <p className="text-xs text-slate-500 mt-1">Audit security logs, check hardware telemetry loads, and manage portal accounts.</p>
      </div>

      {/* Grid: 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CPU Load */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">CPU Core Load</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{stats?.cpuUsage}%</h2>
          </div>
        </div>

        {/* Memory Load */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Server Memory</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{stats?.memory?.percentage}%</h2>
          </div>
        </div>

        {/* Active Sockets */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Socket Clients</h4>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{stats?.activeConnections} online</h2>
          </div>
        </div>

        {/* DB Status */}
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Database Link</h4>
            <h2 className="text-sm font-bold text-emerald-500 mt-2">Active (Healthy)</h2>
          </div>
        </div>
      </div>

      {/* Grid: Charts + Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts server load */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6">Server Load Curve (Telemetry Logs)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTelemetry}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                <Area type="monotone" dataKey="cpu" name="CPU Load" stroke="#6366f1" fillOpacity={0.15} fill="rgba(99, 102, 241, 0.15)" />
                <Area type="monotone" dataKey="mem" name="Memory Load" stroke="#a855f7" fillOpacity={0.1} fill="rgba(168, 85, 247, 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Administration panels */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-brand-500" />
              Portal Configuration
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Configure system parameters and locks.
            </p>

            <div className="space-y-3">
              <Link
                to="/admin/users"
                className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold text-center block shadow-md cursor-pointer transition-all"
              >
                Manage User Accounts
              </Link>
              <Link
                to="/admin/audit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold text-center block shadow-md cursor-pointer transition-all"
              >
                Inspect Audit Logs
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
            <span>Uptime: {Math.round(stats?.uptime / 60) || 0} Minutes</span>
            <Clock className="w-4.5 h-4.5 text-brand-500" />
          </div>
        </div>
      </div>

      {/* Audit Log Table banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent System Audit Events</h3>
          <Link to="/admin/audit" className="text-xs text-brand-500 hover:underline font-semibold flex items-center gap-0.5">
            Full Audit Logs
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Actor / Agent</th>
                <th className="pb-3">Activity description</th>
                <th className="pb-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="text-slate-700 dark:text-slate-350">
                  <td className="py-4 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-4 font-semibold text-slate-850 dark:text-white">{log.actor}</td>
                  <td className="py-4">{log.action}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
