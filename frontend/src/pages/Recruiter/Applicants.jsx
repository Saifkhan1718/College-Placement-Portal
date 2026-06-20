import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Video,
  MapPin,
  Clock,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interview modal states
  const [showModal, setShowModal] = useState(false);
  const [activeApp, setActiveApp] = useState(null);

  // Interview Form Fields State
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [duration, setDuration] = useState('30');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');
  const [instructions, setInstructions] = useState('');

  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:5000/api';

  const fetchApplicants = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/jobs/applications/all`);
      setApplicants(data);
    } catch (e) {
      console.error('Failed to fetch applicants', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStatus = async (appId, status, remarks = '') => {
    setMessage({ text: '', type: '' });
    try {
      await axios.put(`${API_URL}/jobs/applications/${appId}/status`, { status, remarks });
      setMessage({ text: `Application marked as ${status} successfully!`, type: 'success' });
      fetchApplicants();
    } catch (err) {
      setMessage({ text: 'Failed to update status.', type: 'error' });
    }
  };

  const openInterviewModal = (app) => {
    setActiveApp(app);
    setTitle('Technical Interview Round 1');
    setDatetime('');
    setDuration('30');
    setLink('https://meet.google.com/mock-id');
    setLocation('');
    setInstructions('Please be prepared to discuss your projects and core DSA concepts.');
    setShowModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setMessage({ text: '', type: '' });

    const payload = {
      applicationId: activeApp._id,
      title,
      datetime,
      duration: Number(duration),
      link,
      location,
      instructions,
    };

    try {
      await axios.post(`${API_URL}/recruiter/interviews`, payload);
      setMessage({ text: 'Interview scheduled successfully and student notified!', type: 'success' });
      setShowModal(false);
      fetchApplicants();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to schedule interview.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Shortlisted':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Interview Scheduled':
        return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'text-brand-500 bg-brand-500/10 border-brand-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Applicants Tracker</h1>
        <p className="text-xs text-slate-500 mt-1">Shortlist candidates, schedule technical interviews, and recruit top graduates.</p>
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

      {/* Main Applicants Table Card */}
      <div className="glass-panel rounded-2xl border border-white/20 dark:border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="p-4">Candidate Details</th>
                <th className="p-4">Target Job</th>
                <th className="p-4">Academics Details</th>
                <th className="p-4">Resume</th>
                <th className="p-4">Application Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-505">
                    No candidates have applied for your posted listings yet.
                  </td>
                </tr>
              ) : (
                applicants.map((app) => (
                  <tr key={app._id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    {/* Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                          {app.student?.user?.name?.[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-850 dark:text-white leading-none">
                            {app.student?.user?.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 block mt-1.5">{app.student?.user?.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Job Info */}
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      {app.job?.title}
                    </td>

                    {/* Academics */}
                    <td className="p-4">
                      <div>
                        <span className="font-extrabold text-brand-500 block">{app.student?.cgpa} CGPA</span>
                        <span className="text-[10px] text-slate-450 mt-1 block">{app.student?.department}</span>
                      </div>
                    </td>

                    {/* Resume link */}
                    <td className="p-4">
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-brand-500 border border-slate-200 dark:border-slate-800 rounded-lg font-bold"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </a>
                      ) : (
                        <span className="text-slate-400">None uploaded</span>
                      )}
                    </td>

                    {/* Application Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Action controls */}
                    <td className="p-4 text-right">
                      {app.status === 'Applied' || app.status === 'Under Review' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Shortlisted', 'Shortlisted by Recruiter.')}
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/50 dark:bg-emerald-950/20 text-emerald-600 hover:text-emerald-500 cursor-pointer flex items-center justify-center"
                            title="Shortlist Candidate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Rejected', 'Profile did not meet criteria.')}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100/50 dark:bg-rose-950/20 text-rose-600 hover:text-rose-500 cursor-pointer flex items-center justify-center"
                            title="Reject Candidate"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : app.status === 'Shortlisted' ? (
                        <button
                          onClick={() => openInterviewModal(app)}
                          className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" /> Schedule Round
                        </button>
                      ) : app.status === 'Interview Scheduled' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Selected', 'Offer extended (MERN requirements met).')}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            Hire
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Rejected', 'Did not clear interview panel round.')}
                            className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hiring Done</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/20 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-8">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Video className="w-5 h-5 text-brand-500" />
                Schedule Recruiter Interview
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-805 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
                  Interview Round Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Technical Interview Round 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs outline-none"
                  >
                    <option value="30">30 Mins</option>
                    <option value="45">45 Mins</option>
                    <option value="60">60 Mins</option>
                    <option value="90">90 Mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Virtual Conference Link (Google Meet / Zoom / Teams)
                </label>
                <div className="relative">
                  <Video className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Office Venue (for offline / physical checks)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Block C, Main Auditorium Room 2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Candidate instructions / Prep material
                </label>
                <textarea
                  rows="3"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Schedule Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
