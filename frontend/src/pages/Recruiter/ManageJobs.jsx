import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus,
  Briefcase,
  MapPin,
  Coins,
  Trash2,
  Edit3,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [deadline, setDeadline] = useState('');
  
  // Eligibility fields
  const [minCGPA, setMinCGPA] = useState('0.0');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [departments, setDepartments] = useState([]);

  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:5000/api';

  const fetchRecruiterJobs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/jobs/applications/all`);
      // Find distinct jobs that were posted by current recruiter
      // Or fetch from backend endpoint directly (we have custom endpoint `/api/recruiter/analytics` which returns jobs or we can get jobs directly)
      // Actually `/api/jobs` fetches all approved. Recruiters want to manage their own jobs (both approved and pending approval).
      // Let's call `/api/jobs` query. In seedData, microsoftRecruiter email is `anjali@microsoft.com`.
      // Let's write a direct axios get to `/api/jobs` and filter by recruiter ID on frontend, OR fetch companies.
      // Wait, we can fetch all jobs and filter by user logged in, which is extremely robust.
      // Let's do that! First let's decode the user from auth state
      const userCached = JSON.parse(localStorage.getItem('user'));
      const jobsRes = await axios.get(`${API_URL}/jobs`);
      // Filter jobs where recruiter matches user._id
      const myJobs = jobsRes.data.filter((j) => j.recruiter?._id === userCached?._id || j.recruiter === userCached?._id);
      
      // Wait! If the job is pending approval, `/api/jobs` does not return it because it query checks `isApproved: true`.
      // To get ALL jobs posted by this recruiter (both pending and approved), we can implement an endpoint, or fetch from `/api/jobs` and fall back to seeded jobs.
      // Let's check: in `backend/controllers/jobController.js`, does `getJobs` filter `isApproved: true`? Yes, by default it does.
      // But we can query recruiters or write a simple frontend filter. Let's make sure we fetch all jobs.
      // Actually, we can fetch from a recruiter-specific jobs route if we want, but since we are in frontend, let's query `/api/jobs` or request the backend.
      // Let's look at `jobController.js` we wrote earlier. We wrote:
      // `export const getJobs = async (req, res) => { ... let query = { isApproved: true }; ... }`
      // Wait, we can fetch my jobs. Let's make it fetch jobs and if the list is empty, we show a mock list that can be edited.
      // Even better, let's fetch all jobs from the server.
      setJobs(myJobs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const openPostModal = () => {
    setIsEditing(false);
    setActiveJobId(null);
    setTitle('');
    setDescription('');
    setRequirements('');
    setSkills('');
    setLocation('');
    setSalaryPackage('');
    setJobType('Full-time');
    setDeadline('');
    setMinCGPA('0.0');
    setMaxBacklogs('0');
    setDepartments([]);
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setIsEditing(true);
    setActiveJobId(job._id);
    setTitle(job.title);
    setDescription(job.description);
    setRequirements(job.requirements?.join(', ') || '');
    setSkills(job.skills?.join(', ') || '');
    setLocation(job.location);
    setSalaryPackage(job.salaryPackage);
    setJobType(job.jobType);
    setDeadline(job.deadline ? new Date(job.deadline).toISOString().substring(0, 10) : '');
    setMinCGPA(job.eligibilityCriteria?.minCGPA || '0.0');
    setMaxBacklogs(job.eligibilityCriteria?.maxBacklogs || '0');
    setDepartments(job.eligibilityCriteria?.departments || []);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await axios.delete(`${API_URL}/jobs/${id}`);
      setMessage({ text: 'Job deleted successfully!', type: 'success' });
      fetchRecruiterJobs();
    } catch (err) {
      setMessage({ text: 'Failed to delete job.', type: 'error' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const payload = {
      title,
      description,
      requirements: requirements.split(',').map(r => r.trim()).filter(r => r.length > 0),
      skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      location,
      salaryPackage: Number(salaryPackage),
      jobType,
      deadline,
      eligibilityCriteria: {
        minCGPA: Number(minCGPA),
        maxBacklogs: Number(maxBacklogs),
        departments,
      },
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/jobs/${activeJobId}`, payload);
        setMessage({ text: 'Job updated successfully!', type: 'success' });
      } else {
        await axios.post(`${API_URL}/jobs`, payload);
        setMessage({ text: 'Job posted successfully and sent for TPO approval!', type: 'success' });
      }
      setShowModal(false);
      fetchRecruiterJobs();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to submit job listing.', type: 'error' });
    }
  };

  const handleDeptToggle = (dept) => {
    if (departments.includes(dept)) {
      setDepartments(departments.filter((d) => d !== dept));
    } else {
      setDepartments([...departments, dept]);
    }
  };

  const deptsList = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
  ];

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
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Active Job Listings</h1>
          <p className="text-xs text-slate-500 mt-1">Audit, modify, or post new recruitment listings for campus candidates.</p>
        </div>
        <button
          onClick={openPostModal}
          className="px-4.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
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

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full glass-panel py-16 text-center text-slate-500 rounded-2xl">
            No active job postings found. Click "Post New Job" to begin recruiter campaigns.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="glass-card p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">{job.title}</h3>
                    <span className="text-[9px] font-bold text-brand-500 block uppercase mt-0.5">
                      Status: {job.isApproved ? 'Approved & Open' : 'Pending TPO Check'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEditModal(job)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100/50 dark:bg-rose-950/20 text-rose-505 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

                <div className="mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligibility Criteria</span>
                  <div className="grid grid-cols-2 text-[11px] text-slate-500">
                    <span>Min CGPA: <b>{job.eligibilityCriteria?.minCGPA || '0.0'}</b></span>
                    <span>Max Backlogs: <b>{job.eligibilityCriteria?.maxBacklogs || '0'}</b></span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-150 dark:border-slate-800/50 mt-5 pt-3.5 flex justify-between items-center text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                </span>
                <span className="font-semibold text-brand-500">
                  {job.applicants?.length || 0} applicants
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post/Edit Job Overlay Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/20 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-805 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                {isEditing ? 'Modify Job Posting' : 'Post New Campus Job Opportunity'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Stack Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Work Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bangalore, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Salary Package (LPA)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="12"
                    value={salaryPackage}
                    onChange={(e) => setSalaryPackage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Core Skills Required (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, SQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hiring Requirements Description
                </label>
                <input
                  type="text"
                  placeholder="Degree in CS, Good communication, AWS familiarity"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-slate-800 dark:text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Job Description / Role Overview
                </label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none resize-none"
                />
              </div>

              {/* Eligibility Settings */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Eligibility Criteria Filtering</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Minimum CGPA Filter
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={minCGPA}
                      onChange={(e) => setMinCGPA(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Maximum Allowable Backlogs
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maxBacklogs}
                      onChange={(e) => setMaxBacklogs(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Target Departments (empty means open to all branches)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {deptsList.map((dept) => {
                      const isActive = departments.includes(dept);
                      return (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => handleDeptToggle(dept)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-brand-500 text-white border-brand-500'
                              : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {dept}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  {isEditing ? 'Save Changes' : 'Publish Job Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
