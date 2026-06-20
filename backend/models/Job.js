import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: {
    type: [String],
    required: [true, 'Job requirements are required'],
  },
  skills: {
    type: [String],
    required: [true, 'Target skills are required'],
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
  },
  salaryPackage: {
    type: Number, // in LPA, e.g. 12
    required: [true, 'Salary package (LPA) is required'],
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Contract'],
    required: true,
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
  },
  isApproved: {
    type: Boolean,
    default: false, // Jobs require TPO approval before they become active
  },
  eligibilityCriteria: {
    minCGPA: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    departments: { type: [String], default: [] }, // empty array means open to all
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
