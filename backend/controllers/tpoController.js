import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email role isVerified');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Student placement eligibility
export const toggleStudentEligibility = async (req, res) => {
  const { id } = req.params;
  const { eligibilityStatus } = req.body;

  try {
    const student = await Student.findById(id).populate('user');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.eligibilityStatus = eligibilityStatus;
    await student.save();

    // Notify student of eligibility status change
    const notification = await Notification.create({
      recipient: student.user._id,
      sender: req.user._id,
      title: 'Placement Eligibility Updated',
      message: `Your placement eligibility status has been updated to: ${eligibilityStatus ? 'Eligible' : 'Ineligible'} by the Placement Office.`,
      type: 'general',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(student.user._id.toString()).emit('new_notification', notification);
    }

    res.json({ message: `Student eligibility set to ${eligibilityStatus}`, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all recruiters
export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find()
      .populate('user', 'name email role')
      .populate('company');
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Recruiter
export const approveRecruiter = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const recruiter = await Recruiter.findById(id).populate('user');
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    recruiter.isApproved = isApproved;
    await recruiter.save();

    // Notify recruiter of approval status
    const notification = await Notification.create({
      recipient: recruiter.user._id,
      sender: req.user._id,
      title: 'Account Approval Status',
      message: `Your recruiter account verification status is now: ${isApproved ? 'Approved' : 'Pending/Rejected'}.`,
      type: 'general',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(recruiter.user._id.toString()).emit('new_notification', notification);
    }

    res.json({ message: `Recruiter approval status updated to ${isApproved}`, recruiter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending job posts
export const getPendingJobs = async (req, res) => {
  try {
    const pendingJobs = await Job.find({ isApproved: false })
      .populate('company')
      .populate('recruiter', 'name email');
    res.json(pendingJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject Job Post
export const approveJobPost = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const job = await Job.findById(id).populate('company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isApproved = isApproved;
    await job.save();

    // Notify Recruiter
    const recruiterNotification = await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      title: 'Job Post Approval',
      message: `Your job post for "${job.title}" has been ${isApproved ? 'Approved' : 'Rejected'} by the TPO.`,
      type: 'general',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(job.recruiter.toString()).emit('new_notification', recruiterNotification);
    }

    // Broadcast to all students if job is approved
    if (isApproved) {
      const students = await Student.find().populate('user');
      const studentIds = students.map(s => s.user._id);

      // Create broadcast notifications
      const notifications = studentIds.map((studentUserId) => ({
        recipient: studentUserId,
        sender: req.user._id,
        title: 'New Campus Job Opportunity!',
        message: `${job.company.name} has posted a new job: ${job.title} (Salary: ${job.salaryPackage} LPA)`,
        type: 'job_alert',
      }));

      await Notification.insertMany(notifications);

      if (io) {
        io.emit('new_job_broadcast', {
          title: 'New Campus Job Alert!',
          message: `${job.company.name} is hiring for ${job.title}`,
        });
      }
    }

    res.json({ message: `Job approval status set to ${isApproved}`, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TPO Dashboard Placement Analytics
export const getTpoAnalytics = async (req, res) => {
  try {
    const totalStudentsCount = await Student.countDocuments();
    const eligibleStudentsCount = await Student.countDocuments({ eligibilityStatus: true });

    // Placed students: applications where status is "Selected"
    const placedApps = await Application.find({ status: 'Selected' }).populate('student');
    const placedStudentIds = new Set(placedApps.map(app => app.student._id.toString()));
    const totalPlacedCount = placedStudentIds.size;

    const placementPercentage = totalStudentsCount > 0 ? Math.round((totalPlacedCount / totalStudentsCount) * 100) : 0;

    // Package stats
    const approvedJobs = await Job.find({ isApproved: true });
    // Find packages of jobs where a student was selected
    const selectedApps = await Application.find({ status: 'Selected' }).populate('job');
    const packages = selectedApps.map(app => app.job?.salaryPackage || 0).filter(p => p > 0);

    const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
    const averagePackage = packages.length > 0 ? Math.round((packages.reduce((a, b) => a + b, 0) / packages.length) * 10) / 10 : 0;

    // Department-wise placements
    const students = await Student.find();
    const deptStats = {};

    students.forEach((s) => {
      if (!deptStats[s.department]) {
        deptStats[s.department] = { total: 0, placed: 0 };
      }
      deptStats[s.department].total++;
      if (placedStudentIds.has(s._id.toString())) {
        deptStats[s.department].placed++;
      }
    });

    const departmentWiseData = Object.keys(deptStats).map(dept => ({
      department: dept,
      total: deptStats[dept].total,
      placed: deptStats[dept].placed,
      placementPercentage: deptStats[dept].total > 0 ? Math.round((deptStats[dept].placed / deptStats[dept].total) * 100) : 0,
    }));

    // Company-wise hiring stats
    const hiringStats = {};
    selectedApps.forEach((app) => {
      const companyName = app.job?.company?.name || 'Unknown Company';
      if (!hiringStats[companyName]) {
        hiringStats[companyName] = 0;
      }
      hiringStats[companyName]++;
    });

    const companyHiringData = Object.keys(hiringStats).map(comp => ({
      company: comp,
      hiredCount: hiringStats[comp],
    }));

    res.json({
      totalStudents: totalStudentsCount,
      eligibleStudents: eligibleStudentsCount,
      placedStudents: totalPlacedCount,
      placementPercentage,
      highestPackage,
      averagePackage,
      departmentWiseData,
      companyHiringData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule Campus Drive Announcement
export const scheduleCampusDrive = async (req, res) => {
  const { companyName, driveDate, location, description } = req.body;

  try {
    // Broadcast to all users
    const users = await User.find({ role: 'student' });
    const notifications = users.map((u) => ({
      recipient: u._id,
      sender: req.user._id,
      title: 'Upcoming Campus Drive scheduled!',
      message: `Campus recruitment drive for ${companyName} is scheduled on ${new Date(driveDate).toLocaleDateString()}. Venue: ${location}. details: ${description}`,
      type: 'announcement',
    }));

    await Notification.insertMany(notifications);

    const io = req.app.get('io');
    if (io) {
      io.emit('new_campus_drive', {
        companyName,
        driveDate,
        location,
      });
    }

    res.status(201).json({ message: 'Campus drive announced and students notified successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
