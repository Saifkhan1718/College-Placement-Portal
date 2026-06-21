import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../store/authSlice.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Briefcase,
  FileCheck,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const StudentProfile = () => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);

  // Profile forms state
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [cgpa, setCgpa] = useState('');
  const [backlogs, setBacklogs] = useState('');
  const [skills, setSkills] = useState('');
  const [tenth, setTenth] = useState('');
  const [twelfth, setTwelfth] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  // Dynamic Array states
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [experience, setExperience] = useState([]);

  // File Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : 'https://college-placement-portal-fvu8.onrender.com/api');

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Load profile values into state on fetch
  useEffect(() => {
    if (profile) {
      setName(user?.name || '');
      setRollNumber(profile.rollNumber || '');
      setDepartment(profile.department || 'Computer Science');
      setCgpa(profile.cgpa || '');
      setBacklogs(profile.backlogs || 0);
      setSkills(profile.skills?.join(', ') || '');
      setTenth(profile.academicRecords?.tenth || '');
      setTwelfth(profile.academicRecords?.twelfth || '');
      setGraduationYear(profile.academicRecords?.graduationYear || '');
      
      setProjects(profile.projects || []);
      setCertifications(profile.certifications || []);
      setExperience(profile.experience || []);
    }
  }, [profile, user]);

  // Submit Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const payload = {
      name,
      rollNumber,
      department,
      cgpa: Number(cgpa),
      backlogs: Number(backlogs),
      skills: skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
      academicRecords: {
        tenth: Number(tenth),
        twelfth: Number(twelfth),
        graduationYear: Number(graduationYear),
      },
      projects,
      certifications,
      experience,
    };

    try {
      await axios.put(`${API_URL}/student/profile`, payload);
      dispatch(getProfile());
      setMessage({ text: 'Profile saved successfully!', type: 'success' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to save profile details.', type: 'error' });
    }
  };

  // Upload Resume
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploadProgress(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      await axios.post(`${API_URL}/student/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(getProfile());
      setMessage({ text: 'Resume PDF uploaded successfully!', type: 'success' });
      setResumeFile(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Upload failed. Ensure file is PDF under 5MB.', type: 'error' });
    } finally {
      setUploadProgress(false);
    }
  };

  // Dynamic Array Adders
  const addProject = () => {
    setProjects([...projects, { title: '', description: '', technologies: [], link: '' }]);
  };
  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const updateProjectField = (index, field, value) => {
    const updated = [...projects];
    if (field === 'technologies') {
      updated[index][field] = value.split(',').map((t) => t.trim());
    } else {
      updated[index][field] = value;
    }
    setProjects(updated);
  };

  const addCert = () => {
    setCertifications([...certifications, { name: '', organization: '', issueDate: '', link: '' }]);
  };
  const removeCert = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };
  const updateCertField = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const addExp = () => {
    setExperience([...experience, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
  };
  const removeExp = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };
  const updateExpField = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Profile Control Center</h1>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Completion Rate: <span className="text-brand-500 font-bold">{profile?.profileCompleted}%</span>
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
          {message.type === 'success' ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid Layout: Resume Uploader (Side) + Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Resume Uploader Details */}
        <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 h-fit space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 text-brand-500" />
            Resume PDF File
          </h3>

          {profile?.resumeUrl ? (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Document</span>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-brand-500 hover:underline break-all block mt-1"
              >
                View Uploaded PDF
              </a>
            </div>
          ) : (
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <p className="text-xs text-slate-400">No PDF uploaded. Mandatory for applying to active campus jobs.</p>
            </div>
          )}

          <form onSubmit={handleResumeUpload} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Upload New Resume
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.files?.[0] || e.target.files?.[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-slate-800 dark:file:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={!resumeFile || uploadProgress}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-brand-500 dark:hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              {uploadProgress ? 'Uploading...' : 'Upload PDF Document'}
            </button>
          </form>
        </div>

        {/* Right Side: Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Academic records */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <GraduationCap className="w-5 h-5 text-brand-500" />
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Roll Number / UID
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Current CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Active Backlogs Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={backlogs}
                    onChange={(e) => setBacklogs(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    required
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    10th Percentage (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={tenth}
                    onChange={(e) => setTenth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    12th Percentage (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={twelfth}
                    onChange={(e) => setTwelfth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Department / Branch
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Skills (comma separated, e.g. React, Node.js, Python)
                </label>
                <input
                  type="text"
                  placeholder="React, CSS, Git, PostgreSQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Projects list */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-500" />
                  Academic / Personal Projects
                </h3>
                <button
                  type="button"
                  onClick={addProject}
                  className="px-2.5 py-1 text-[10px] font-bold text-brand-500 hover:bg-brand-50 dark:hover:bg-slate-900 rounded-lg flex items-center gap-1 border border-brand-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              {projects.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No projects registered yet.</p>
              ) : (
                projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="absolute top-4 right-4 text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                        <input
                          type="text"
                          required
                          value={proj.title}
                          onChange={(e) => updateProjectField(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Project Repository Link</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => updateProjectField(idx, 'link', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-855 dark:text-white text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Technologies Used (comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies?.join(', ') || ''}
                        onChange={(e) => updateProjectField(idx, 'technologies', e.target.value)}
                        placeholder="React, MongoDB, Tailwind"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Brief Description</label>
                      <textarea
                        rows="2"
                        value={proj.description || ''}
                        onChange={(e) => updateProjectField(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs mt-1 outline-none resize-none"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Certifications List */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-500" />
                  Certifications
                </h3>
                <button
                  type="button"
                  onClick={addCert}
                  className="px-2.5 py-1 text-[10px] font-bold text-brand-500 hover:bg-brand-50 dark:hover:bg-slate-900 rounded-lg flex items-center gap-1 border border-brand-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              {certifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No certifications registered yet.</p>
              ) : (
                certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removeCert(idx)}
                      className="absolute top-4 right-4 text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Certification Name</label>
                        <input
                          type="text"
                          required
                          value={cert.name}
                          onChange={(e) => updateCertField(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Issuing Organization</label>
                        <input
                          type="text"
                          required
                          value={cert.organization}
                          onChange={(e) => updateCertField(idx, 'organization', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-855 dark:text-white text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Experience list */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-slate-800/60 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-500" />
                  Work / Internship Experience
                </h3>
                <button
                  type="button"
                  onClick={addExp}
                  className="px-2.5 py-1 text-[10px] font-bold text-brand-500 hover:bg-brand-50 dark:hover:bg-slate-900 rounded-lg flex items-center gap-1 border border-brand-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              {experience.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No internship experiences registered.</p>
              ) : (
                experience.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removeExp(idx)}
                      className="absolute top-4 right-4 text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                        <input
                          type="text"
                          required
                          value={exp.company}
                          onChange={(e) => updateExpField(idx, 'company', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Role / Title</label>
                        <input
                          type="text"
                          required
                          value={exp.role}
                          onChange={(e) => updateExpField(idx, 'role', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-855 dark:text-white text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Description of Duties</label>
                      <textarea
                        rows="2"
                        value={exp.description || ''}
                        onChange={(e) => updateExpField(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white text-xs mt-1 outline-none resize-none"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4.5 h-4.5" />
                Save Complete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
