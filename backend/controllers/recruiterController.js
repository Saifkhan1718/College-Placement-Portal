import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

// Update Recruiter Company Info
export const updateCompanyProfile = async (req, res) => {
  const { name, website, logo, description, industry, location, position, phone } = req.body;

  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    // Update Recruiter details
    if (position) recruiter.position = position;
    if (phone) recruiter.phone = phone;
    await recruiter.save();

    // Update Company details
    if (recruiter.company) {
      const company = await Company.findById(recruiter.company);
      if (company) {
        if (name) company.name = name;
        if (website) company.website = website;
        if (logo) company.logo = logo;
        if (description) company.description = description;
        if (industry) company.industry = industry;
        if (location) company.location = location;
        await company.save();
      }
    }

    res.json({ message: 'Company profile updated successfully', recruiter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule Interview
export const scheduleInterview = async (req, res) => {
  const { applicationId, title, datetime, duration, link, location, instructions } = req.body;

  try {
    const application = await Application.findById(applicationId)
      .populate('student')
      .populate({ path: 'student', populate: { path: 'user' } })
      .populate({ path: 'job', populate: { path: 'company' } });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Create Interview
    const interview = await Interview.create({
      application: applicationId,
      student: application.student._id,
      job: application.job._id,
      title,
      datetime,
      duration: duration || 30,
      link,
      location,
      instructions,
    });

    // Update Application Status to "Interview Scheduled"
    application.status = 'Interview Scheduled';
    application.statusTimeline.push({
      status: 'Interview Scheduled',
      updatedAt: new Date(),
      remarks: `Interview scheduled: "${title}" on ${new Date(datetime).toLocaleString()}`,
    });
    await application.save();

    // Create Notification
    const studentUser = application.student.user;
    const notification = await Notification.create({
      recipient: studentUser._id,
      sender: req.user._id,
      title: 'Interview Scheduled!',
      message: `An interview has been scheduled for the role: ${application.job.title} at ${application.job.company.name}.`,
      type: 'interview_scheduled',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(studentUser._id.toString()).emit('new_notification', notification);
    }

    res.status(201).json({ message: 'Interview scheduled successfully', interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Recruiter Analytics
export const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } });

    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    // Conversion rate metrics: selected / total applications
    const selectedCount = applications.filter(app => app.status === 'Selected').length;
    const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length;
    const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

    const conversionRate = totalApplications > 0 ? Math.round((selectedCount / totalApplications) * 100) : 0;

    // Applicants per Job
    const jobMetrics = jobs.map((job) => {
      const jobApps = applications.filter(app => app.job.toString() === job._id.toString());
      return {
        title: job.title,
        applicantsCount: jobApps.length,
        selected: jobApps.filter(app => app.status === 'Selected').length,
        shortlisted: jobApps.filter(app => app.status === 'Shortlisted').length,
      };
    });

    res.json({
      totalJobs,
      totalApplications,
      selectedCount,
      shortlistedCount,
      rejectedCount,
      conversionRate,
      jobMetrics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
