import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  TrendingUp,
  Award,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export const AiPredictor = () => {
  const { profile } = useSelector((state) => state.auth);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/ai/predict-placement`);
        setPrediction(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to calculate prediction.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getProbabilityColor = (prob) => {
    if (prob >= 75) return 'text-emerald-500';
    if (prob >= 50) return 'text-brand-500';
    return 'text-rose-500';
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">AI Placement Predictor</h1>
        <p className="text-xs text-slate-500 mt-1">
          Predicts placement success probability based on academic grades, certifications, and project counts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Probability display */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 lg:col-span-1 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-800 animate-spin duration-[15s]"></div>
            <span className={`text-3xl font-extrabold ${getProbabilityColor(prediction?.probability || 0)}`}>
              {prediction?.probability || 0}%
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-white mt-4 uppercase tracking-wider">
            Placement Probability
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Success Predictive Engine v1.2</p>
        </div>

        {/* Diagnosis analysis */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            Diagnostic Analysis
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            "{prediction?.analysis}"
          </p>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Active Parameters Checked
            </span>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-slate-500">CGPA weight: <b className="text-slate-700 dark:text-white">{profile?.cgpa}</b></span>
              <span className="text-slate-500">Backlogs filter: <b className="text-slate-700 dark:text-white">{profile?.backlogs || 'None'}</b></span>
              <span className="text-slate-500">Projects count: <b className="text-slate-700 dark:text-white">{profile?.projects?.length || 0}</b></span>
              <span className="text-slate-500">Certifications: <b className="text-slate-700 dark:text-white">{profile?.certifications?.length || 0}</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4.5 h-4.5 text-brand-500" />
          Recommended Action Steps to Improve Placement Chance
        </h3>

        <ul className="space-y-3.5">
          {prediction?.recommendation?.map((rec, idx) => (
            <li key={idx} className="flex gap-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-900/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AiPredictor;
