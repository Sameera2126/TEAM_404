import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import FarmerDashboard from '@/components/dashboard/FarmerDashboard';
import ExpertDashboard from '@/components/dashboard/ExpertDashboard';
import GovernmentDashboard from '@/components/dashboard/GovernmentDashboard';
import AppLayout from '@/components/layout/AppLayout';

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'expert':
        return <ExpertDashboard />;
      case 'government':
        return <GovernmentDashboard />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderDashboard()}
      </motion.div>
    </AppLayout>
  );
};

export default DashboardPage;
