// routes/authRoutes.js
import express from 'express';
import { sendOTP, verifyOTP, getMe, register,login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Register new user (sends OTP)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);
router.post('/login', login);
// @desc    Send OTP for signin
// @route   POST /api/auth/send-otp
// @access  Public
router.post('/send-otp', sendOTP);

// @desc    Verify OTP and signin user
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', verifyOTP);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

export default router;