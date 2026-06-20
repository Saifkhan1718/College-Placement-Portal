import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import ChatMessage from '../models/ChatMessage.js';

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal';
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Recruiter.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Interview.deleteMany();
    await ChatMessage.deleteMany();
    console.log('Cleared existing data.');

    // 1. Create Companies
    const microsoft = await Company.create({
      name: 'Microsoft',
      website: 'https://microsoft.com',
      logo: 'https://images.unsplash.com/photo-1625014020903-e329f58a4990?q=80&w=200&auto=format&fit=crop',
      description: 'Empower every person and every organization on the planet to achieve more.',
      industry: 'Software & Technology',
      location: 'Hyderabad, India',
    });

    const google = await Company.create({
      name: 'Google',
      website: 'https://google.com',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=200&auto=format&fit=crop',
      description: 'Organize the world\'s information and make it universally accessible and useful.',
      industry: 'Software & Cloud',
      location: 'Bangalore, India',
    });

    const accenture = await Company.create({
      name: 'Accenture',
      website: 'https://accenture.com',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop',
      description: 'Delivering on the promise of technology and human ingenuity.',
      industry: 'Consulting & IT Services',
      location: 'Pune, India',
    });

    // 2. Create Users (passwords hashed automatically via User model pre-save hook)
    // TPO User
    const tpoUser = await User.create({
      name: 'Prof. S. R. Sharma',
      email: 'tpo@college.edu',
      password: 'password123',
      role: 'tpo',
      isVerified: true,
    });

    // Admin User
    const adminUser = await User.create({
      name: 'Portal Administrator',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
      isVerified: true,
    });

    // Recruiter Users
    const microsoftRecruiter = await User.create({
      name: 'Anjali Gupta',
      email: 'anjali@microsoft.com',
      password: 'password123',
      role: 'recruiter',
      isVerified: true,
    });

    await Recruiter.create({
      user: microsoftRecruiter._id,
      company: microsoft._id,
      position: 'Senior Talent Acquisition Lead',
      phone: '+91 98765 43210',
      isApproved: true,
    });

    const googleRecruiter = await User.create({
      name: 'John Doe',
      email: 'john.doe@google.com',
      password: 'password123',
      role: 'recruiter',
      isVerified: true,
    });

    await Recruiter.create({
      user: googleRecruiter._id,
      company: google._id,
      position: 'HR Manager',
      phone: '+91 91234 56789',
      isApproved: true,
    });

    // Student Users & Profiles
    // Student 1: Rohan (Selected SDE)
    const rohanUser = await User.create({
      name: 'Rohan Verma',
      email: 'rohan.verma@student.edu',
      password: 'password123',
      role: 'student',
      isVerified: true,
    });

    const rohanStudent = await Student.create({
      user: rohanUser._id,
      rollNumber: 'CS2023001',
      department: 'Computer Science',
      cgpa: 9.2,
      backlogs: 0,
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Data Structures', 'C++'],
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      academicRecords: { tenth: 94, twelfth: 91, graduationYear: 2026 },
      projects: [{
        title: 'E-Commerce Platform',
        description: 'A fully functional MERN stack retail store with JWT auth and Stripe integration.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Redux'],
        link: 'https://github.com/rohan/ecommerce',
      }],
      certifications: [{
        name: 'AWS Cloud Practitioner',
        organization: 'Amazon Web Services',
        issueDate: new Date('2025-01-15'),
      }],
      experience: [{
        company: 'WebSolutions Inc',
        role: 'Web Development Intern',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-07-01'),
        description: 'Developed frontend features using React and integrated third-party REST APIs.',
      }],
      profileCompleted: 90,
    });

    // Student 2: Priya (Applied, Good CGPA)
    const priyaUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@student.edu',
      password: 'password123',
      role: 'student',
      isVerified: true,
    });

    const priyaStudent = await Student.create({
      user: priyaUser._id,
      rollNumber: 'CS2023002',
      department: 'Computer Science',
      cgpa: 8.5,
      backlogs: 0,
      skills: ['JavaScript', 'HTML/CSS', 'Python', 'Machine Learning', 'SQL'],
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      academicRecords: { tenth: 88, twelfth: 89, graduationYear: 2026 },
      projects: [{
        title: 'Crop Yield Predictor',
        description: 'Machine learning regression app predicting agricultural output from soil conditions.',
        technologies: ['Python', 'Flask', 'Scikit-Learn'],
      }],
      profileCompleted: 75,
    });

    // Student 3: Amit (Electronics, Selected Consulting)
    const amitUser = await User.create({
      name: 'Amit Patel',
      email: 'amit.patel@student.edu',
      password: 'password123',
      role: 'student',
      isVerified: true,
    });

    const amitStudent = await Student.create({
      user: amitUser._id,
      rollNumber: 'EC2023015',
      department: 'Electronics & Communication',
      cgpa: 7.8,
      backlogs: 0,
      skills: ['Python', 'Embedded Systems', 'IoT', 'SQL', 'Git'],
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      academicRecords: { tenth: 82, twelfth: 80, graduationYear: 2026 },
      projects: [{
        title: 'Smart Home Automation',
        description: 'IoT network connecting room sensors via ESP8266 and logging to an Express dashboard.',
        technologies: ['C++', 'Embedded C', 'Express'],
      }],
      profileCompleted: 75,
    });

    // Student 4: Rahul (Ineligible due to TPO / Backlogs)
    const rahulUser = await User.create({
      name: 'Rahul Sen',
      email: 'rahul.sen@student.edu',
      password: 'password123',
      role: 'student',
      isVerified: true,
    });

    const rahulStudent = await Student.create({
      user: rahulUser._id,
      rollNumber: 'ME2023044',
      department: 'Mechanical Engineering',
      cgpa: 6.2,
      backlogs: 2,
      skills: ['AutoCAD', 'SolidWorks', 'MATLAB', 'Python'],
      resumeUrl: '',
      academicRecords: { tenth: 75, twelfth: 72, graduationYear: 2026 },
      eligibilityStatus: false, // Ineligible
      profileCompleted: 40,
    });

    // 3. Create Job Posts
    // Microsoft Job (Approved)
    const msJob1 = await Job.create({
      company: microsoft._id,
      recruiter: microsoftRecruiter._id,
      title: 'Software Engineer - 1 (SDE)',
      description: 'Join the Azure Cloud Infrastructure team to build global-scale web services.',
      requirements: ['Excellent knowledge of Data Structures and Algorithms', 'Proficient in C++, Java, or C#', 'Familiarity with distributed system architectures'],
      skills: ['Data Structures', 'C#', 'Java', 'Distributed Systems'],
      location: 'Hyderabad, India',
      salaryPackage: 22, // 22 LPA
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days later
      isApproved: true,
      eligibilityCriteria: { minCGPA: 8.0, maxBacklogs: 0, departments: ['Computer Science', 'Information Technology'] },
    });

    // Google Job (Approved)
    const googleJob1 = await Job.create({
      company: google._id,
      recruiter: googleRecruiter._id,
      title: 'Software Engineering Intern',
      description: 'Work alongside Google engineers on indexing algorithms or cloud billing microservices.',
      requirements: ['Basic development experience in Python, JS, or Go', 'Familiarity with SQL/NoSQL databases', 'Good problem-solving abilities'],
      skills: ['JavaScript', 'Python', 'Go', 'Databases'],
      location: 'Bangalore, India',
      salaryPackage: 15, // 15 LPA (translated standard)
      jobType: 'Internship',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
      isApproved: true,
      eligibilityCriteria: { minCGPA: 7.5, maxBacklogs: 0, departments: [] }, // open to all
    });

    // Accenture Job (Approved)
    const accentureJob1 = await Job.create({
      company: accenture._id,
      recruiter: microsoftRecruiter._id, // Posted by MS recruiter just as mock
      title: 'Associate IT Consultant',
      description: 'Deliver tech consulting solutions, cloud strategy, and custom IT integration projects.',
      requirements: ['Good communication skills', 'Conceptual clarity of databases and software SDLC models', 'Analytical troubleshooting mind'],
      skills: ['SQL', 'SDLC', 'Cloud Computing', 'Communication'],
      location: 'Pune, India',
      salaryPackage: 6.5, // 6.5 LPA
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      isApproved: true,
      eligibilityCriteria: { minCGPA: 6.0, maxBacklogs: 1, departments: [] },
    });

    // Google Pending Job (For TPO Approval flow testing)
    const googlePendingJob = await Job.create({
      company: google._id,
      recruiter: googleRecruiter._id,
      title: 'Cloud Security Analyst',
      description: 'Assess microservice network vulnerabilities and audit cloud infrastructure compliance standards.',
      requirements: ['Basic grasp of Networking protocols', 'Knowledge of Linux operating environments', 'Interest in Cyber Security'],
      skills: ['Linux', 'Networking', 'Cyber Security'],
      location: 'Bangalore, India',
      salaryPackage: 18,
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isApproved: false, // Pending TPO approval
      eligibilityCriteria: { minCGPA: 8.0, maxBacklogs: 0, departments: ['Computer Science', 'Information Technology'] },
    });

    // 4. Create Job Applications
    // Rohan -> Microsoft (Selected)
    await Application.create({
      job: msJob1._id,
      student: rohanStudent._id,
      resume: rohanStudent.resumeUrl,
      status: 'Selected',
      statusTimeline: [
        { status: 'Applied', remarks: 'Application submitted.' },
        { status: 'Under Review', remarks: 'Resume matches Azure tech qualifications.' },
        { status: 'Shortlisted', remarks: 'Selected for Coding Assessment.' },
        { status: 'Interview Scheduled', remarks: 'Interviews scheduled for June 21.' },
        { status: 'Selected', remarks: 'Congratulations! Microsoft extended an offer of 22 LPA.' },
      ],
    });
    msJob1.applicants.push(rohanStudent._id);
    await msJob1.save();

    // Priya -> Microsoft (Interview Scheduled)
    const priyaApplication = await Application.create({
      job: msJob1._id,
      student: priyaStudent._id,
      resume: priyaStudent.resumeUrl,
      status: 'Interview Scheduled',
      statusTimeline: [
        { status: 'Applied', remarks: 'Application submitted.' },
        { status: 'Under Review', remarks: 'Profile is a match.' },
        { status: 'Shortlisted', remarks: 'Cleared coding round.' },
        { status: 'Interview Scheduled', remarks: 'Technical Interview scheduled.' },
      ],
    });
    msJob1.applicants.push(priyaStudent._id);
    await msJob1.save();

    // Amit -> Accenture (Selected)
    await Application.create({
      job: accentureJob1._id,
      student: amitStudent._id,
      resume: amitStudent.resumeUrl,
      status: 'Selected',
      statusTimeline: [
        { status: 'Applied', remarks: 'Application submitted.' },
        { status: 'Selected', remarks: 'Accenture selected Amit Patel (6.5 LPA).' },
      ],
    });
    accentureJob1.applicants.push(amitStudent._id);
    await accentureJob1.save();

    // Priya -> Google (Under Review)
    await Application.create({
      job: googleJob1._id,
      student: priyaStudent._id,
      resume: priyaStudent.resumeUrl,
      status: 'Under Review',
      statusTimeline: [
        { status: 'Applied', remarks: 'Application submitted.' },
        { status: 'Under Review', remarks: 'Pending HR screening.' },
      ],
    });
    googleJob1.applicants.push(priyaStudent._id);
    await googleJob1.save();

    // 5. Create Interview Schedule
    await Interview.create({
      application: priyaApplication._id,
      student: priyaStudent._id,
      job: msJob1._id,
      title: 'Microsoft Technical Interview - Round 1',
      datetime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      duration: 45,
      link: 'https://teams.microsoft.com/l/meetup-join/mock-interview-url',
      instructions: 'Please be prepared with dynamic programming concepts and project descriptions.',
      status: 'Scheduled',
    });

    // 6. Create Chat Message Dialogues & Announcements
    // Recruiter-Student conversation
    await ChatMessage.create({
      sender: microsoftRecruiter._id,
      recipient: rohanUser._id,
      message: 'Hi Rohan! Congratulations on clearing the coding round. We have scheduled your technical rounds.',
    });

    await ChatMessage.create({
      sender: rohanUser._id,
      recipient: microsoftRecruiter._id,
      message: 'Thank you Anjali! I have received the calendar invite. I will join on time.',
    });

    // TPO Announcement
    await ChatMessage.create({
      sender: tpoUser._id,
      isAnnouncement: true,
      message: 'Attention CS & EC Students: Microsoft and Accenture campus drives are officially open. Make sure your profiles are up to date and your resume PDF is uploaded before applying. Good luck!',
    });

    console.log('Database seeded successfully with premium mock records!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
