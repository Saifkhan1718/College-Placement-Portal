import User from '../models/User.js';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jwt_default_secret_key', {
    expiresIn: '30d',
  });
};

// Register
export const register = async (req, res) => {
  const { name, email, password, role, ...profileData } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken,
    });

    if (role === 'student') {
      // Create student entry
      await Student.create({
        user: user._id,
        rollNumber: profileData.rollNumber || `STU-${Date.now().toString().slice(-6)}`,
        department: profileData.department || 'Computer Science',
        cgpa: profileData.cgpa || 7.0,
        backlogs: profileData.backlogs || 0,
      });
    } else if (role === 'recruiter') {
      // Find or create company
      let companyName = profileData.companyName || 'Dream Company';
      let company = await Company.findOne({ name: companyName });
      if (!company) {
        company = await Company.create({
          name: companyName,
          website: profileData.companyWebsite || '',
          location: profileData.companyLocation || '',
        });
      }

      // Create recruiter entry
      await Recruiter.create({
        user: user._id,
        company: company._id,
        position: profileData.position || 'HR Recruiter',
        phone: profileData.phone || '',
        isApproved: false, // Pending TPO approval
      });
    }

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    const emailHtml = `
      <h1>Email Verification</h1>
      <p>Hello ${name},</p>
      <p>Thank you for registering on the College Placement Portal. Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}" target="_blank">Verify Email Address</a>
      <p>If you did not register for this account, please ignore this email.</p>
    `;
    await sendEmail({
      to: email,
      subject: 'Verify your College Placement Portal Account',
      html: emailHtml,
    });

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  const { email, name, googleId, imageUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      const dummyPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email,
        password: dummyPassword,
        role: 'student', // Default Google login as student
        isVerified: true, // Google accounts are pre-verified
      });

      // Create student entry
      await Student.create({
        user: user._id,
        rollNumber: `STU-G-${Date.now().toString().slice(-5)}`,
        department: 'Computer Science',
        cgpa: 8.0,
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send('<h1>Verification link is invalid or has expired.</h1>');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send('<h1>Email Verified Successfully! You can now close this window and log in.</h1>');
  } catch (error) {
    res.status(500).send(`<h1>Verification failed: ${error.message}</h1>`);
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    // In production, point to frontend route. Here we point to a backend mock reset page or log it.
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const emailHtml = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request - College Placement Portal',
      html: emailHtml,
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password (GET to render form, POST to update)
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id }).populate('savedJobs');
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ user: user._id }).populate('company');
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
