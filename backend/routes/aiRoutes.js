import express from 'express';
import {
  analyzeResume,
  predictPlacement,
  chatAssistant,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze-resume', protect, analyzeResume);
router.post('/predict-placement', protect, predictPlacement);
router.post('/chat', protect, chatAssistant);

export default router;
