import express from 'express';
import {
  updateStudentProfile,
  uploadResume,
  getStudentAnalytics,
  getStudentInterviews,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/profile', protect, authorize('student'), updateStudentProfile);
router.post('/upload-resume', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/analytics', protect, authorize('student'), getStudentAnalytics);
router.get('/interviews', protect, authorize('student'), getStudentInterviews);

export default router;
