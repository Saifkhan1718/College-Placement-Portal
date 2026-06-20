import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  FileText,
  AlertCircle,
  Inbox
} from 'lucide-react';

export const InterviewCalendar = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/student/interviews`);
        setInterviews(data);
      } catch (e) {
        console.error('Failed to fetch interviews', e);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Interview Schedule</h1>
        <p className="text-xs text-slate-500 mt-1">Calendar agendas for coding assessments and technical rounds.</p>
      </div>

      <div className="space-y-5">
        {interviews.length === 0 ? (
          <div className="glass-panel py-16 text-center text-slate-500 rounded-2xl flex flex-col items-center justify-center">
            <Inbox className="w-10 h-10 text-slate-400 mb-2 opacity-50" />
            No interviews scheduled at this time.
          </div>
        ) : (
          interviews.map((int) => (
            <div
              key={int._id}
              className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6"
            >
              {/* Highlight status left border */}
              <div
                className="absolute top-0 bottom-0 left-0 w-1.5"
                style={{
                  backgroundColor:
                    int.status === 'Completed'
                      ? '#10b981'
                      : int.status === 'Cancelled'
                      ? '#f43f5e'
                      : '#6366f1',
                }}
              />

              <div className="space-y-3.5">
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-brand-500 uppercase block mb-1">
                    {int.job?.company?.name || 'Recruitment Drive'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{int.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Role: {int.job?.title}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(int.datetime).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(int.datetime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    ({int.duration} mins)
                  </span>
                </div>

                {int.instructions && (
                  <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-xl max-w-xl">
                    <AlertCircle className="w-4.5 h-4.5 text-slate-450 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-normal">
                      <span className="font-semibold text-slate-700 dark:text-slate-350 block">Instructions:</span>
                      {int.instructions}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start md:items-end gap-3 shrink-0 self-start md:self-auto">
                {int.link ? (
                  <a
                    href={int.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    Join Video Conference
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {int.location || 'On-campus Drive Venue'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewCalendar;
