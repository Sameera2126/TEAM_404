import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';

const OTPVerification = ({ email: propEmail, isSignIn = false }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [email, setEmail] = useState(propEmail || localStorage.getItem('verificationEmail') || '');
    const navigate = useNavigate();

    useEffect(() => {
        // Start the resend timer
        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = e.target.previousSibling;
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/verify-otp', {
                email,
                otp: otpValue
            });

            if (response.data.success) {
                // Store the token
                localStorage.setItem('token', response.data.token);
                localStorage.removeItem('verificationEmail');

                // Redirect based on user role
                const userRole = response.data.user?.role || 'farmer';
                navigate(`/${userRole}/dashboard`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        setError('');

        try {
            const endpoint = isSignIn ? '/auth/send-otp' : '/auth/register';
            const response = await api.post(endpoint, { email });

            if (response.data.success) {
                setResendTimer(60);
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Verify Your Email
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    We've sent a 6-digit verification code to {email}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        {otp.map((data, index) => (
                            <TextField
                                key={index}
                                type="text"
                                inputProps={{
                                    maxLength: 1,
                                    style: { textAlign: 'center' },
                                }}
                                value={data}
                                onChange={(e) => handleOtpChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                disabled={loading}
                                sx={{ width: '14%' }}
                                autoFocus={index === 0}
                            />
                        ))}
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || otp.join('').length !== 6}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Didn't receive the code?{' '}
                            <span
                                onClick={handleResendOTP}
                                style={{
                                    color: resendTimer === 0 ? '#1976d2' : 'gray',
                                    cursor: resendTimer === 0 ? 'pointer' : 'default',
                                    textDecoration: resendTimer === 0 ? 'underline' : 'none',
                                }}
                            >
                                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default OTPVerification;
