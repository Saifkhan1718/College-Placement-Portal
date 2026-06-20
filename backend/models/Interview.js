import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Interview title is required'], // e.g. "Technical Round 1"
    trim: true,
  },
  datetime: {
    type: Date,
    required: [true, 'Interview date & time are required'],
  },
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  link: {
    type: String, // Zoom / Google Meet Link
    trim: true,
  },
  location: {
    type: String, // If in-person campus drive
    trim: true,
  },
  instructions: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
}, {
  timestamps: true,
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
