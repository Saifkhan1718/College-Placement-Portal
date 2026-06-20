import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import {
  applyJob,
  getApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Job Management Routes
router.get('/', getJobs);
router.post('/', protect, authorize('recruiter', 'tpo', 'admin'), createJob);
router.get('/:id', getJobById);
router.put('/:id', protect, authorize('recruiter', 'tpo', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'tpo', 'admin'), deleteJob);

// Application Management Routes
router.post('/apply', protect, authorize('student'), applyJob);
router.get('/applications/all', protect, getApplications);
router.put('/applications/:id/status', protect, authorize('recruiter', 'tpo', 'admin'), updateApplicationStatus);

export default router;
