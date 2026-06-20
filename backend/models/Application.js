import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  resume: {
    type: String, // resume URL used for this application
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied',
  },
  statusTimeline: [{
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

// Auto-populate status timeline on creation
applicationSchema.pre('save', function (next) {
  if (this.isNew && this.statusTimeline.length === 0) {
    this.statusTimeline.push({
      status: 'Applied',
      updatedAt: new Date(),
      remarks: 'Application submitted successfully.',
    });
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
