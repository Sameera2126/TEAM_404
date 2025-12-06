import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { selectedRole, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setIsLoading(true);
      // Simulate OTP send
      setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
      }, 1500);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6 && selectedRole) {
      setIsLoading(true);
      // Simulate verification
      setTimeout(() => {
        login(phone, selectedRole);
        navigate('/dashboard');
      }, 1500);
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    // Show resend animation
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === 'otp' ? setStep('phone') : navigate('/role-select'))}
          className="mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col max-w-md mx-auto w-full"
      >
        {step === 'phone' ? (
          <>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Enter Phone Number
            </h1>
            <p className="text-muted-foreground mb-8">
              We'll send you a verification code
            </p>

            {/* Phone Input */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span className="font-medium">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-24 text-lg"
                autoFocus
              />
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={handlePhoneSubmit}
              disabled={phone.length < 10 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send OTP'
              )}
            </Button>

            {/* Help Link */}
            <button
              onClick={() => navigate('/forgot-number')}
              className="mt-6 text-sm text-primary hover:underline text-center"
            >
              Changed your phone number?
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Verify OTP
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter the 6-digit code sent to +91 {phone}
            </p>

            {/* OTP Input */}
            <div className="flex gap-3 mb-6 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-border bg-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full mb-4"
              onClick={handleOtpSubmit}
              disabled={otp.join('').length < 6 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Verify & Continue'
              )}
            </Button>

            <button
              onClick={handleResendOtp}
              className="text-sm text-primary hover:underline text-center"
            >
              Didn't receive code? Resend
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
