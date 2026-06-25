import express from 'express';
import {
  getAllStudents,
  toggleStudentEligibility,
  getAllRecruiters,
  approveRecruiter,
  getPendingJobs,
  approveJobPost,
  getTpoAnalytics,
  scheduleCampusDrive,
} from '../controllers/tpoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', protect, authorize('tpo', 'admin', 'recruiter'), getAllStudents);
router.put('/students/:id/eligibility', protect, authorize('tpo', 'admin'), toggleStudentEligibility);
router.get('/recruiters', protect, authorize('tpo', 'admin', 'student'), getAllRecruiters);

router.put('/recruiters/:id/approve', protect, authorize('tpo', 'admin'), approveRecruiter);
router.get('/pending-jobs', protect, authorize('tpo', 'admin'), getPendingJobs);
router.put('/jobs/:id/approve', protect, authorize('tpo', 'admin'), approveJobPost);
router.get('/analytics', protect, authorize('tpo', 'admin'), getTpoAnalytics);
router.post('/campus-drives', protect, authorize('tpo', 'admin'), scheduleCampusDrive);

export default router;
