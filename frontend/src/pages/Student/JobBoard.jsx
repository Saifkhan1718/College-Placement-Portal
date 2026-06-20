import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Coins,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export const JobBoard = () => {
  const { profile } = useSelector((state) => state.auth);
  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Filters State
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const fetchJobsAndApplications = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`${API_URL}/jobs`),
        axios.get(`${API_URL}/jobs/applications/all`),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApplications();
  }, []);

  const handleApply = async (jobId) => {
    setMessage({ text: '', type: '' });
    try {
      const { data } = await axios.post(`${API_URL}/jobs/apply`, { jobId });
      setMessage({ text: data.message || 'Applied successfully!', type: 'success' });
      fetchJobsAndApplications(); // refresh
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to submit application.', type: 'error' });
    }
  };

  // Check if student is eligible for a specific job
  const checkEligibility = (job) => {
    if (!profile) return { eligible: false, reasons: ['Profile not loaded'] };
    if (!profile.eligibilityStatus) return { eligible: false, reasons: ['Marked ineligible by Placement Office'] };
    
    const reasons = [];
    if (profile.cgpa < job.eligibilityCriteria.minCGPA) {
      reasons.push(`CGPA too low (Requires ${job.eligibilityCriteria.minCGPA}, you have ${profile.cgpa})`);
    }
    if (profile.backlogs > job.eligibilityCriteria.maxBacklogs) {
      reasons.push(`Too many backlogs (Max allowed: ${job.eligibilityCriteria.maxBacklogs}, you have ${profile.backlogs})`);
    }
    if (
      job.eligibilityCriteria.departments &&
      job.eligibilityCriteria.departments.length > 0 &&
      !job.eligibilityCriteria.departments.includes(profile.department)
    ) {
      reasons.push(`Only open to: ${job.eligibilityCriteria.departments.join(', ')}`);
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  };

  // Apply Query Filters locally
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesLocation = location ? job.location.toLowerCase().includes(location.toLowerCase()) : true;
    const matchesType = jobType ? job.jobType === jobType : true;
    const matchesSalary = minSalary ? job.salaryPackage >= Number(minSalary) : true;

    return matchesSearch && matchesLocation && matchesType && matchesSalary;
  });

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
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Active Job Postings</h1>
        <p className="text-xs text-slate-500 mt-1">Browse, filter, and apply for verified corporate placements.</p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertTriangle className="w-4.5 h-4.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters Card */}
      <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search role, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-brand-500"
          />
        </div>

        {/* Location Input */}
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-brand-500"
          />
        </div>

        {/* Job Type Select */}
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-brand-500 text-slate-700 dark:text-slate-300"
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        {/* Minimum Salary input */}
        <input
          type="number"
          placeholder="Min Salary (LPA)..."
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-brand-500 text-slate-800 dark:text-white"
        />
      </div>

      {/* Jobs grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full glass-panel py-16 text-center text-slate-500 rounded-2xl">
            No active jobs match your search parameters. Try adjusting filters.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const hasApplied = applications.some((app) => app.job?._id === job._id);
            const appliedObj = applications.find((app) => app.job?._id === job._id);
            const { eligible, reasons } = checkEligibility(job);

            return (
              <div
                key={job._id}
                className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between"
              >
                <div>
                  {/* Company Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={job.company?.logo}
                      alt={job.company?.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-white"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.company?.name}</p>
                    </div>
                  </div>

                  {/* Badges details */}
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-[10px] font-bold border border-brand-500/20">
                      <Coins className="w-3.5 h-3.5" />
                      {job.salaryPackage} LPA
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-500 text-[10px] font-bold border border-accent-500/20">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.jobType}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                  </div>

                  {/* Description summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-4 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Requirements snippet */}
                  <div className="mt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 mt-5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {/* Eligibility Badges */}
                  <div>
                    {hasApplied ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-500">
                        <Clock className="w-4 h-4" /> Already Applied (Status: {appliedObj?.status})
                      </span>
                    ) : eligible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <ShieldCheck className="w-4 h-4" /> Profile Eligible
                      </span>
                    ) : (
                      <div className="group relative">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 cursor-help">
                          <ShieldAlert className="w-4 h-4" /> Ineligible
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-56 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-rose-400 leading-normal shadow-xl z-20">
                          <span className="font-bold block mb-1">Fails requirements:</span>
                          {reasons.map((r, i) => <span key={i} className="block">• {r}</span>)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Apply Actions */}
                  {!hasApplied && (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={!eligible}
                      className="w-full sm:w-auto px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:hover:bg-brand-500 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobBoard;
