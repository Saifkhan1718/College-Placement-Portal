import Student from '../models/Student.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Job from '../models/Job.js';

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Extract allowed fields
    const {
      rollNumber,
      department,
      cgpa,
      backlogs,
      skills,
      academicRecords,
      certifications,
      projects,
      experience,
    } = req.body;

    if (rollNumber) student.rollNumber = rollNumber;
    if (department) student.department = department;
    if (cgpa !== undefined) student.cgpa = cgpa;
    if (backlogs !== undefined) student.backlogs = backlogs;
    if (skills) student.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (academicRecords) student.academicRecords = academicRecords;
    if (certifications) student.certifications = certifications;
    if (projects) student.projects = projects;
    if (experience) student.experience = experience;

    // Recalculate profile completion score
    student.profileCompleted = student.calculateProfileCompletion();

    await student.save();

    // Update user name if requested
    if (req.body.name) {
      await User.findByIdAndUpdate(req.user._id, { name: req.body.name });
    }

    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload resume PDF (Multer file is placed in req.file by upload middleware)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // In a full production env, we'd upload to Cloudinary. Here we use the local path:
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    student.resumeUrl = fileUrl;
    student.resumePublicId = req.file.filename;
    student.profileCompleted = student.calculateProfileCompletion();

    await student.save();

    res.json({
      message: 'Resume uploaded successfully!',
      resumeUrl: fileUrl,
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Dashboard Analytics
export const getStudentAnalytics = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // 1. Fetch application status statistics
    const applications = await Application.find({ student: student._id });
    const stats = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      'Interview Scheduled': 0,
      Selected: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      if (stats[app.status] !== undefined) {
        stats[app.status]++;
      }
    });

    // 2. Placement Readiness Score computation
    // Factors: Profile completeness (30%), CGPA (30%), Projects count (20%), Skills count (20%)
    const cgpaScore = Math.min((student.cgpa / 10) * 100, 100);
    const projectsScore = Math.min((student.projects?.length || 0) * 25, 100);
    const skillsScore = Math.min((student.skills?.length || 0) * 10, 100);

    const readinessScore = Math.round(
      (student.profileCompleted * 0.3) +
      (cgpaScore * 0.3) +
      (projectsScore * 0.2) +
      (skillsScore * 0.2)
    );

    // 3. Skill Gap Analysis
    // Fetch top active approved jobs and compare student skills with job-required skills
    const jobs = await Job.find({ isApproved: true }).limit(10);
    const allRequiredSkills = new Set();
    jobs.forEach((job) => {
      job.skills.forEach((skill) => allRequiredSkills.add(skill.toLowerCase().trim()));
    });

    const studentSkills = new Set((student.skills || []).map(s => s.toLowerCase().trim()));
    const missingSkills = [];

    allRequiredSkills.forEach((skill) => {
      if (!studentSkills.has(skill) && missingSkills.length < 5) {
        missingSkills.push(skill);
      }
    });

    res.json({
      applicationStats: stats,
      totalApplications: applications.length,
      placementReadinessScore: readinessScore,
      skillGap: {
        currentSkills: student.skills,
        missingSkills,
        demandedSkills: Array.from(allRequiredSkills).slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Interviews List
export const getStudentInterviews = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const interviews = await Interview.find({ student: student._id })
      .populate({ path: 'job', populate: { path: 'company' } })
      .sort({ datetime: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
