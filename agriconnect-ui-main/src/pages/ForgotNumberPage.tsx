import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotNumberPage = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate('/login')}
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
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Changed Your Number?
        </h1>
        <p className="text-muted-foreground mb-8">
          If you've changed your phone number, please contact our support team to update your account.
        </p>

        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Contact Support</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Your Name
              </label>
              <Input placeholder="Enter your full name" />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Old Phone Number
              </label>
              <Input placeholder="Enter your old phone number" />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                New Phone Number
              </label>
              <Input placeholder="Enter your new phone number" />
            </div>
          </div>
        </div>

        <Button variant="hero" size="xl" className="w-full">
          Submit Request
        </Button>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Or call our helpline
          </p>
          <a href="tel:1800-XXX-XXXX" className="text-lg font-semibold text-primary">
            1800-XXX-XXXX
          </a>
          <p className="text-xs text-muted-foreground mt-1">
            (Toll Free, 9 AM - 6 PM)
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotNumberPage;
