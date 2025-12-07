import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Tractor, GraduationCap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'farmer',
    title: 'Farmer',
    description: 'Access expert advice, schemes, weather updates and connect with community',
    icon: <Tractor className="w-8 h-8" />,
  },
  {
    id: 'expert',
    title: 'Agricultural Expert',
    description: 'Help farmers with queries, share knowledge and build your reputation',
    icon: <GraduationCap className="w-8 h-8" />,
  },
  {
    id: 'government',
    title: 'Government Officer',
    description: 'Publish schemes, send advisories and manage agricultural programs',
    icon: <Building2 className="w-8 h-8" />,
  },
];

const RoleSelectPage = () => {
  const navigate = useNavigate();
  const { selectedRole, setSelectedRole } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/signup');
    }
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
          onClick={() => navigate('/language')}
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
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          I am a...
        </h1>
        <p className="text-muted-foreground mb-8">
          Select your role to personalize your experience
        </p>

        {/* Role Options */}
        <div className="space-y-4 flex-1">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleRoleSelect(role.id)}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                selectedRole === role.id
                  ? 'border-primary bg-primary/5 shadow-soft'
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-soft'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {role.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-lg mb-1">
                    {role.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 space-y-3"
        >
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Create Account
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelectPage;
