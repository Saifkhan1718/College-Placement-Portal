import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FileText,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/admin/audit-logs`);
        setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.actor?.toLowerCase().includes(search.toLowerCase()) ||
      l.action?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Security Audits log</h1>
          <p className="text-xs text-slate-500 mt-1">Audit transactions, account modifications, database queries, and credentials validations.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search actor, activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* Logs Card list */}
      <div className="glass-panel rounded-2xl border border-white/20 dark:border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Event description</th>
                <th className="p-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-4 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-405" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-850 dark:text-white">{log.actor}</td>
                  <td className="p-4 leading-normal">{log.action}</td>
                  <td className="p-4 text-right">
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

export default AuditLogs;
