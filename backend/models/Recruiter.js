import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  position: {
    type: String,
    required: [true, 'Recruiter position / job title is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false, // Must be approved by TPO
  },
}, {
  timestamps: true,
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
