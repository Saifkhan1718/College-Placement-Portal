import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  Trash2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/users`);
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    setMessage({ text: '', type: '' });
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/role`, { role: newRole });
      setMessage({ text: 'User role updated successfully!', type: 'success' });
      fetchUsers();
    } catch (err) {
      setMessage({ text: 'Failed to update user role.', type: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account? This deletes linked student/recruiter profile profiles.')) return;
    setMessage({ text: '', type: '' });
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      setMessage({ text: 'User account and profile deleted successfully.', type: 'success' });
      fetchUsers();
    } catch (err) {
      setMessage({ text: 'Failed to delete user account.', type: 'error' });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">User Accounts Manager</h1>
          <p className="text-xs text-slate-500 mt-1">Audit profiles, modify administrative roles, and delete accounts.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, role..."
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

      {/* Users table */}
      <div className="glass-panel rounded-2xl border border-white/20 dark:border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Registered Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-4 font-semibold text-slate-850 dark:text-white">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="tpo">Placement Officer (TPO)</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {u.isVerified ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Email Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100/50 dark:bg-rose-950/20 text-rose-600 hover:text-rose-500 cursor-pointer inline-flex items-center justify-center border border-transparent hover:border-rose-500/20"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default ManageUsers;
