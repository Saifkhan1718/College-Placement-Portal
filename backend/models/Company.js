import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  logo: {
    type: String, // Cloudinary URL
    default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
  },
  description: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);
export default Company;
