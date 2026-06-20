import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';

// Apply for a job (Student only)
export const applyJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: 'Only registered students can apply for jobs.' });
    }

    if (!student.eligibilityStatus) {
      return res.status(403).json({ message: 'You have been marked ineligible for placements by the TPO.' });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Check application deadline
    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: 'Application deadline has passed.' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({ job: jobId, student: student._id });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // Check CGPA Criteria
    if (student.cgpa < job.eligibilityCriteria.minCGPA) {
      return res.status(400).json({
        message: `Eligibility failed: Minimum CGPA required is ${job.eligibilityCriteria.minCGPA}, your CGPA is ${student.cgpa}`,
      });
    }

    // Check Backlogs Criteria
    if (student.backlogs > job.eligibilityCriteria.maxBacklogs) {
      return res.status(400).json({
        message: `Eligibility failed: Maximum backlogs allowed is ${job.eligibilityCriteria.maxBacklogs}, you have ${student.backlogs}`,
      });
    }

    // Check Department Criteria
    if (
      job.eligibilityCriteria.departments &&
      job.eligibilityCriteria.departments.length > 0 &&
      !job.eligibilityCriteria.departments.includes(student.department)
    ) {
      return res.status(400).json({
        message: `Eligibility failed: Job is only open to ${job.eligibilityCriteria.departments.join(', ')} departments. Your department is ${student.department}`,
      });
    }

    // Check if resume exists
    if (!student.resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume in your profile before applying.' });
    }

    // Create Application
    const application = await Application.create({
      job: jobId,
      student: student._id,
      resume: student.resumeUrl,
    });

    // Add student to job applicants
    job.applicants.push(student._id);
    await job.save();

    // Create Notification for recruiter
    const notification = await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      title: 'New Job Application',
      message: `${req.user.name} applied for your job post: ${job.title}`,
      type: 'job_alert',
    });

    // Emit Realtime Notification via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(job.recruiter.toString()).emit('new_notification', notification);
    }

    res.status(201).json({ message: 'Applied successfully!', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applications
export const getApplications = async (req, res) => {
  try {
    let applications;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      applications = await Application.find({ student: student._id })
        .populate({ path: 'job', populate: { path: 'company' } })
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'recruiter') {
      // Find jobs posted by this recruiter
      const jobs = await Job.find({ recruiter: req.user._id });
      const jobIds = jobs.map((job) => job._id);

      applications = await Application.find({ job: { $in: jobIds } })
        .populate('student')
        .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
        .populate('job')
        .sort({ createdAt: -1 });
    } else {
      // TPO / Admin - return all
      applications = await Application.find()
        .populate('student')
        .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'job', populate: { path: 'company' } })
        .sort({ createdAt: -1 });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change status of application (Recruiter/TPO only)
export const updateApplicationStatus = async (req, res) => {
  const { status, remarks } = req.body;
  const { id } = req.params;

  try {
    const application = await Application.findById(id)
      .populate('student')
      .populate({ path: 'student', populate: { path: 'user' } })
      .populate({ path: 'job', populate: { path: 'company' } });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check permission: job recruiter or TPO
    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'tpo' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change application status.' });
    }

    // Update status and timeline
    application.status = status;
    application.statusTimeline.push({
      status,
      updatedAt: new Date(),
      remarks: remarks || `Application status updated to ${status}.`,
    });

    await application.save();

    // Notify Student
    const studentUser = application.student.user;
    const notification = await Notification.create({
      recipient: studentUser._id,
      sender: req.user._id,
      title: 'Application Status Update',
      message: `Your application for ${application.job.title} at ${application.job.company.name} is now: ${status}`,
      type: 'application_status',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(studentUser._id.toString()).emit('new_notification', notification);
    }

    res.json({ message: `Application status updated to ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
