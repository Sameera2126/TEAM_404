// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { 
  generateOTP as generateOTPCode, 
  sendOTP as sendOTPEmail, 
  storeOTP, 
  verifyOTP as verifyOTPCode 
} from '../services/otpService.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send OTP for signin
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res, next) => {
    try {
        const { email, phone } = req.body;

        if (!email || !phone) {
            return next(new ErrorResponse('Please provide both email and phone number', 400));
        }

        // Check if user exists
        const user = await User.findOne({ 
            $and: [
                { email },
                { phone }
            ]
        });

        if (!user) {
            return next(new ErrorResponse('No user found with these credentials', 404));
        }

        // Generate and send OTP
        const otp = generateOTPCode();
        const otpSent = await sendOTPEmail(email, otp);

        if (!otpSent) {
            return next(new ErrorResponse('Failed to send OTP', 500));
        }

        // Store OTP for verification
        storeOTP(email, otp);
        req.session.otpEmail = email;

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            email
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP and authenticate user
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return next(new ErrorResponse('Please provide email and OTP', 400));
        }

        // Verify OTP
        const otpVerification = verifyOTPCode(email, otp);
        if (!otpVerification.valid) {
            return next(new ErrorResponse(otpVerification.message, 400));
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        // Remove sensitive data before sending response
        const userData = user.toObject();
        delete userData.__v;

        res.status(200).json({
            success: true,
            message: 'Sign in successful',
            token,
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            password,
            location,
            role = 'farmer' 
        } = req.body;

        // Validate input
        if (!name || !email || !phone || !password || !location) {
            return next(new ErrorResponse('Please provide all required fields', 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingUser) {
            return next(new ErrorResponse('User with this email or phone already exists', 400));
        }

        // Create new user with plain text password
        const user = await User.create({
            name,
            email,
            phone,
            password,  // Store password as plain text
            location,
            role
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                location: user.location
            }
        });

    } catch (error) {
        next(error);
    }
};
// In authController.js

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return next(new ErrorResponse('Please provide email and password', 400));
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches (plain text comparison)
        if (password !== user.password) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                location: user.location
            }
        });

    } catch (error) {
        next(error);
    }
};