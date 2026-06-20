import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Coins,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  Inbox
} from 'lucide-react';

export const ApproveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:5000/api';

  const fetchPendingJobs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tpo/pending-jobs`);
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleApproveJob = async (jobId) => {
    setMessage({ text: '', type: '' });
    try {
      await axios.put(`${API_URL}/tpo/jobs/${jobId}/approve`, { isApproved: true });
      setMessage({ text: 'Job posting approved and broadcast to student job boards!', type: 'success' });
      fetchPendingJobs();
    } catch (err) {
      setMessage({ text: 'Failed to approve job posting.', type: 'error' });
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
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Approve Corporate Job Posts</h1>
        <p className="text-xs text-slate-500 mt-1">Audit minimum CGPA thresholds, backlogs limits, and branches eligibility filters before opening posts to students.</p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid pending jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full glass-panel py-16 text-center text-slate-500 rounded-2xl flex flex-col items-center justify-center">
            <Inbox className="w-10 h-10 text-slate-400 opacity-50 mb-2" />
            No pending job approval postings at this time.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold font-mono">
                    {job.company?.name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">{job.title}</h3>
                    <p className="text-xs text-slate-500">Proposed by: {job.recruiter?.name} @ <b>{job.company?.name}</b></p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-[10px] font-bold border border-brand-500/20">
                    <Coins className="w-3.5 h-3.5" /> {job.salaryPackage} LPA
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-500 text-[10px] font-bold border border-accent-500/20">
                    <Briefcase className="w-3.5 h-3.5" /> {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Filters details */}
                <div className="mt-4 border-t border-slate-105 dark:border-slate-800/80 pt-4 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Proposed Filters Check</span>
                  <div className="grid grid-cols-2 text-[11px] text-slate-500">
                    <span>Min CGPA: <b>{job.eligibilityCriteria?.minCGPA || '0.0'}</b></span>
                    <span>Max Backlogs: <b>{job.eligibilityCriteria?.maxBacklogs || '0'}</b></span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">
                      Open to departments:{' '}
                      <b>
                        {job.eligibilityCriteria?.departments?.length > 0
                          ? job.eligibilityCriteria.departments.join(', ')
                          : 'All branches'}
                      </b>
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 mt-5 pt-4 flex justify-between items-center text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                </span>
                
                <button
                  onClick={() => handleApproveJob(job._id)}
                  className="px-4.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Approve Posting
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApproveJobs;
