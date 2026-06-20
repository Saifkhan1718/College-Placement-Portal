import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Recruiter from '../models/Recruiter.js';
import Student from '../models/Student.js';

// Create Job (Recruiter only)
export const createJob = async (req, res) => {
  const {
    title,
    description,
    requirements,
    skills,
    location,
    salaryPackage,
    jobType,
    deadline,
    eligibilityCriteria,
  } = req.body;

  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter) {
      return res.status(403).json({ message: 'Only registered recruiters can post jobs' });
    }

    if (!recruiter.isApproved) {
      return res.status(403).json({ message: 'Your profile is pending TPO approval. You cannot post jobs yet.' });
    }

    const job = await Job.create({
      company: recruiter.company,
      recruiter: req.user._id,
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(','),
      skills: Array.isArray(skills) ? skills : skills.split(','),
      location,
      salaryPackage,
      jobType,
      deadline,
      eligibilityCriteria: eligibilityCriteria || { minCGPA: 0, maxBacklogs: 0, departments: [] },
    });

    res.status(201).json({ message: 'Job posted successfully and sent for TPO approval.', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Approved Jobs (Browse/Search/Filter)
export const getJobs = async (req, res) => {
  const { search, location, jobType, minSalary, department } = req.query;

  try {
    let query = { isApproved: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (minSalary) {
      query.salaryPackage = { $gte: Number(minSalary) };
    }

    if (department) {
      query['eligibilityCriteria.departments'] = { $in: [department] };
    }

    // Populate company info
    const jobs = await Job.find(query).populate('company').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Job Details
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Job (Recruiter only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'tpo') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Job updated successfully.', job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'tpo') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
