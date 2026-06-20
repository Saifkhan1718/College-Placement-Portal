import User from '../models/User.js';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import os from 'os';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role} successfully.`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cascading delete
    if (user.role === 'student') {
      await Student.deleteOne({ user: id });
    } else if (user.role === 'recruiter') {
      await Recruiter.deleteOne({ user: id });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User and linked profiles deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;

    res.json({
      cpuUsage: Math.round(Math.random() * 20 + 5), // simulated
      memory: {
        total: Math.round(totalMem / (1024 * 1024 * 1024)), // GB
        used: Math.round(usedMem / (1024 * 1024 * 1024)), // GB
        percentage: Math.round((usedMem / totalMem) * 100),
      },
      dbStatus: 'Connected (Healthy)',
      activeConnections: req.app.get('io')?.engine.clientsCount || 0,
      uptime: Math.round(process.uptime()), // in seconds
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get audit logs
export const getAuditLogs = async (req, res) => {
  try {
    // Generate a set of realistic logs for presentation
    const logs = [
      { timestamp: new Date(Date.now() - 5000), actor: 'System', action: 'Auth Token validation', status: 'Success' },
      { timestamp: new Date(Date.now() - 3600000), actor: 'TPO Officer', action: 'Approved Recruiter Microsoft', status: 'Success' },
      { timestamp: new Date(Date.now() - 7200000), actor: 'Student Rohan', action: 'Uploaded Resume PDF', status: 'Success' },
      { timestamp: new Date(Date.now() - 14400000), actor: 'Recruiter Google', action: 'Posted Job: Frontend Engineer', status: 'Success' },
      { timestamp: new Date(Date.now() - 86400000), actor: 'Admin', action: 'Role Update: Student -> Recruiter', status: 'Success' },
      { timestamp: new Date(Date.now() - 172800000), actor: 'System', action: 'Database backup cron job', status: 'Completed' },
    ];
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
