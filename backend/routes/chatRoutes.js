import express from 'express';
import {
  getMessages,
  sendMessage,
  getAnnouncements,
  postAnnouncement,
} from '../controllers/chatController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/messages/:recipientId', protect, getMessages);
router.post('/messages', protect, sendMessage);
router.get('/announcements', protect, getAnnouncements);
router.post('/announcements', protect, authorize('tpo', 'admin'), postAnnouncement);

export default router;
