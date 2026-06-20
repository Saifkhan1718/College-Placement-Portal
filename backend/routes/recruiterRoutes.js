import express from 'express';
import {
  updateCompanyProfile,
  scheduleInterview,
  getRecruiterAnalytics,
} from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/company', protect, authorize('recruiter'), updateCompanyProfile);
router.post('/interviews', protect, authorize('recruiter'), scheduleInterview);
router.get('/analytics', protect, authorize('recruiter'), getRecruiterAnalytics);

export default router;
