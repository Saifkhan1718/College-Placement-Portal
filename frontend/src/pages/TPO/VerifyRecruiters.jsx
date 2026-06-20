import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const VerifyRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:5000/api';

  const fetchRecruiters = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tpo/recruiters`);
      setRecruiters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleApprove = async (id, currentStatus) => {
    setMessage({ text: '', type: '' });
    try {
      const newStatus = !currentStatus;
      await axios.put(`${API_URL}/tpo/recruiters/${id}/approve`, { isApproved: newStatus });
      setMessage({ text: `Recruiter account ${newStatus ? 'Approved' : 'Suspended'} successfully!`, type: 'success' });
      fetchRecruiters();
    } catch (err) {
      setMessage({ text: 'Failed to update recruiter registration.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Verify Corporate representative accounts</h1>
        <p className="text-xs text-slate-500 mt-1">Audit representative positions, company branding details, and approve hiring portals.</p>
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

      {/* Recruiter cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recruiters.length === 0 ? (
          <div className="col-span-full glass-panel py-16 text-center text-slate-505 rounded-2xl">
            No registered recruiter accounts logged.
          </div>
        ) : (
          recruiters.map((rec) => (
            <div
              key={rec._id}
              className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                    {rec.company?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">{rec.user?.name}</h3>
                    <p className="text-xs text-slate-500">{rec.position} @ <b>{rec.company?.name}</b></p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {rec.user?.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {rec.phone || 'No phone declared'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    Industry: {rec.company?.industry || 'Software & Technology'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 mt-5 pt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                    rec.isApproved
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}
                >
                  {rec.isApproved ? 'Approved representative' : 'Pending TPO Approval'}
                </span>

                <button
                  onClick={() => handleApprove(rec._id, rec.isApproved)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer shadow-sm ${
                    rec.isApproved
                      ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600'
                      : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600'
                  }`}
                >
                  {rec.isApproved ? 'Revoke Account' : 'Approve representative'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerifyRecruiters;
