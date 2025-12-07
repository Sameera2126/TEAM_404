import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configure nodemailer (you'll need to set up your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Store OTPs in memory (in production, use Redis or similar)
const otpStore = new Map();

// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for AgriConnect',
        text: `Your OTP for verification is: ${otp}. This OTP is valid for 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
};

// Store OTP with expiration (10 minutes)
const storeOTP = (email, otp) => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    otpStore.set(email, {
        otp,
        expiresAt
    });

    // Auto-remove OTP after expiration
    setTimeout(() => {
        if (otpStore.get(email)?.otp === otp) {
            otpStore.delete(email);
        }
    }, 10 * 60 * 1000);
};

// Verify OTP
const verifyOTP = (email, otp) => {
    const storedOTP = otpStore.get(email);
    
    if (!storedOTP || storedOTP.otp !== otp) {
        return { valid: false, message: 'Invalid OTP' };
    }

    if (new Date() > storedOTP.expiresAt) {
        otpStore.delete(email);
        return { valid: false, message: 'OTP has expired' };
    }

    // Clear the OTP after successful verification
    otpStore.delete(email);
    return { valid: true, message: 'OTP verified successfully' };
};

export {
    generateOTP,
    sendOTP,
    storeOTP,
    verifyOTP,
    otpStore
};
