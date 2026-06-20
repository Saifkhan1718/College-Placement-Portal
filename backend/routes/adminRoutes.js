import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getSystemStats,
  getAuditLogs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/stats', protect, authorize('admin'), getSystemStats);
router.get('/audit-logs', protect, authorize('admin'), getAuditLogs);

export default router;
