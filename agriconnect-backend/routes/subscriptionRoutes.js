
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { subscribeUser } from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/', protect, subscribeUser);

export default router;
