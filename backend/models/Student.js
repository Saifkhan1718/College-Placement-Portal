import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number / UID is required'],
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  cgpa: {
    type: Number,
    required: [true, 'CGPA is required'],
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10'],
  },
  backlogs: {
    type: Number,
    default: 0,
    min: [0, 'Backlogs cannot be negative'],
  },
  skills: {
    type: [String],
    default: [],
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  resumePublicId: {
    type: String,
    default: '',
  },
  academicRecords: {
    tenth: { type: Number, default: 0 },
    twelfth: { type: Number, default: 0 },
    graduationYear: { type: Number, default: new Date().getFullYear() },
  },
  certifications: [{
    name: { type: String, required: true },
    organization: { type: String, required: true },
    issueDate: { type: Date },
    link: { type: String },
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    technologies: [String],
    link: { type: String },
  }],
  experience: [{
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
  }],
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  eligibilityStatus: {
    type: Boolean,
    default: true,
  },
  profileCompleted: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Post-save or pre-save profile percentage calculation helper
studentSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  if (this.rollNumber) score += 10;
  if (this.department) score += 10;
  if (this.cgpa) score += 15;
  if (this.skills && this.skills.length > 0) score += 15;
  if (this.resumeUrl) score += 20;
  if (this.projects && this.projects.length > 0) score += 10;
  if (this.experience && this.experience.length > 0) score += 10;
  if (this.certifications && this.certifications.length > 0) score += 10;
  return score;
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
