import React, { useState } from 'react';
import axios from 'axios';
import {
  Calendar,
  Building,
  MapPin,
  FileText,
  Megaphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CampusDrives = () => {
  const [companyName, setCompanyName] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const payload = {
      companyName,
      driveDate,
      location,
      description,
    };

    try {
      await axios.post(`${API_URL}/tpo/campus-drives`, payload);
      setMessage({
        text: 'Campus recruitment drive scheduled successfully and broadcast to all students!',
        type: 'success',
      });
      setCompanyName('');
      setDriveDate('');
      setLocation('');
      setDescription('');
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to schedule campus drive.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Schedule Campus Recruitment Drive</h1>
        <p className="text-xs text-slate-500 mt-1">
          Announce upcoming corporate campus drive visits. This triggers real-time alerts to all students.
        </p>
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

      {/* Input Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
              Hiring Corporate Name
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-450" />
              <input
                type="text"
                required
                placeholder="Amazon Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Drive Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="date"
                  required
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Drive Venue / Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Main Seminar Hall, CSE block"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Drive Description / Requirements guidelines
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <textarea
                rows="4"
                required
                placeholder="Eligibility criteria: CGPA > 8.0, 0 active backlogs. Online coding round begins at 10 AM, followed by technical interviews."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Megaphone className="w-4 h-4 animate-bounce" /> Broadcast Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampusDrives;
