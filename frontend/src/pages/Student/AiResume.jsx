import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export const AiResume = () => {
  const { profile } = useSelector((state) => state.auth);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/ai/analyze-resume`);
        setAnalysis(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to analyze resume profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Color selection based on score
  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', circle: '#10b981' };
    if (score >= 60) return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', circle: '#f59e0b' };
    return { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', circle: '#f43f5e' };
  };

  const colors = getScoreColor(analysis?.atsScore || 0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">AI Resume Analyzer</h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated parser scanning skills, projects, and format compliance for ATS benchmarking.
        </p>
      </div>

      {!profile?.resumeUrl ? (
        <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-slate-800/80 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">No Resume Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You must upload a PDF resume in the profile dashboard first to run deep resume parser scores.
          </p>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
          >
            Go to Profile Manager
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Card (ATS Score ring) */}
          <div className="glass-panel p-6 rounded-3xl border border-white/20 dark:border-slate-800/80 flex flex-col md:flex-row items-center gap-8">
            {/* Visual Score Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="8"
                  stroke="rgba(99, 102, 241, 0.05)"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="8"
                  stroke={colors.circle}
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (analysis?.atsScore || 0)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
                  {analysis?.atsScore || 0}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  ATS Score
                </span>
              </div>
            </div>

            {/* Score Descriptions */}
            <div className="space-y-3.5 flex-1">
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  Rating: {analysis?.rating}
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mt-2">
                  ATS Search Optimization Grade
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your profile score indicates how well indices parse and categorize your skills and experiences relative to verified recruiters postings.
              </p>
            </div>
          </div>

          {/* Grid missing skills / check list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Core Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
              <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <BrainCircuit className="w-4.5 h-4.5 text-brand-500" />
                Missing Demanded Skills
              </h3>
              
              <div className="space-y-3">
                {analysis?.missingSkills?.length === 0 ? (
                  <div className="flex gap-2.5 text-xs text-emerald-500 font-semibold p-2">
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                    All demanded industry skills are present in your dashboard.
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Recruiters frequently query these hot technologies. Inject them into your profile if you hold project proficiency:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {analysis?.missingSkills?.map((s) => (
                        <span key={s} className="px-2.5 py-1 text-[9px] font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 capitalize">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Improvement Recommendations list */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60">
              <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                ATS Optimization Advice
              </h3>

              <ul className="space-y-2.5">
                {analysis?.suggestions?.length === 0 ? (
                  <div className="flex gap-2 text-xs text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                    No suggestions. Your resume compliance is excellent!
                  </div>
                ) : (
                  analysis?.suggestions?.map((s, idx) => (
                    <li key={idx} className="flex gap-2 text-[11px] text-slate-500 leading-relaxed">
                      <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-400 shrink-0" />
                      {s}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiResume;
