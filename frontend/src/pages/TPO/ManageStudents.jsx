import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:5000/api';

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tpo/students`);
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleEligibility = async (id, currentStatus) => {
    setMessage({ text: '', type: '' });
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_URL}/tpo/students/${id}/eligibility`, { eligibilityStatus: newStatus });
      setMessage({ text: 'Student eligibility status updated successfully!', type: 'success' });
      fetchStudents();
    } catch (err) {
      setMessage({ text: 'Failed to update student eligibility.', type: 'error' });
    }
  };

  const filteredStudents = students.filter((s) =>
    s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Verify Candidates</h1>
          <p className="text-xs text-slate-500 mt-1">Audit academic grade compliance and lock/unlock candidate placement eligibility.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roll no, name, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Students list Table */}
      <div className="glass-panel rounded-2xl border border-white/20 dark:border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="p-4">Student</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Department</th>
                <th className="p-4">CGPA / Backlogs</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No student registrations found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu._id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="p-4 font-semibold text-slate-850 dark:text-white">
                      {stu.user?.name}
                    </td>
                    <td className="p-4 font-mono">{stu.rollNumber}</td>
                    <td className="p-4">{stu.department}</td>
                    <td className="p-4">
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-white">{stu.cgpa} CGPA</span>
                        <span className="text-[10px] text-rose-500 block mt-1">
                          {stu.backlogs > 0 ? `${stu.backlogs} Backlogs` : 'No Backlogs'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {stu.eligibilityStatus ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Eligible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Ineligible
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleEligibility(stu._id, stu.eligibilityStatus)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition-colors shadow-sm ${
                          stu.eligibilityStatus
                            ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-650'
                            : 'bg-emerald-50 hover:bg-emerald-105 dark:bg-emerald-950/20 text-emerald-650'
                        }`}
                      >
                        {stu.eligibilityStatus ? 'Lock Placements' : 'Unlock Placements'}
                      </button>
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

export default ManageStudents;
