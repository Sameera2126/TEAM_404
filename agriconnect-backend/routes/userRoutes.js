import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getExperts } from '../controllers/userController.js';

const router = express.Router();

router.get('/experts', protect, getExperts);

export default router;
