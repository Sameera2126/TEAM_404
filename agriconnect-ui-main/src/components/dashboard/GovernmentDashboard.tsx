import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Bell,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { schemes, advisories } from '@/data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const GovernmentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20 lg:pb-0"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
            Admin Dashboard 🏛️
          </h1>
          <p className="text-muted-foreground">Manage schemes and advisories</p>
        </div>
        <Button variant="hero" onClick={() => navigate('/manage-schemes')}>
          <Plus className="w-4 h-4 mr-2" />
          New Scheme
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Active Schemes', value: schemes.length, color: 'text-primary' },
          { icon: Bell, label: 'Advisories', value: advisories.length, color: 'text-sun' },
          { icon: Users, label: 'Farmers Reached', value: '15.2K', color: 'text-growth' },
          { icon: TrendingUp, label: 'Engagement', value: '+24%', color: 'text-primary' },
        ].map((stat, index) => (
          <Card key={index} variant="default">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="elevated" className="cursor-pointer hover:-translate-y-0.5 transition-all" onClick={() => navigate('/manage-schemes')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Manage Schemes</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or deactivate government schemes</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card variant="elevated" className="cursor-pointer hover:-translate-y-0.5 transition-all" onClick={() => navigate('/manage-advisories')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-sun/10 rounded-2xl flex items-center justify-center">
              <Bell className="w-7 h-7 text-sun" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Send Advisories</h3>
              <p className="text-sm text-muted-foreground">Publish alerts and important notices</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Advisories */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Advisories</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/manage-advisories')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {advisories.slice(0, 3).map((advisory) => (
            <Card key={advisory.id} variant="default">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    advisory.severity === 'high' || advisory.severity === 'critical'
                      ? 'bg-destructive/10'
                      : 'bg-sun/10'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      advisory.severity === 'high' || advisory.severity === 'critical'
                        ? 'text-destructive'
                        : 'text-sun'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">{advisory.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {advisory.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        advisory.severity === 'high' || advisory.severity === 'critical'
                          ? 'bg-destructive/10 text-destructive'
                          : advisory.severity === 'medium'
                            ? 'bg-sun/10 text-sun'
                            : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {advisory.severity}
                      </span>
                      <span className="text-xs text-muted-foreground">{advisory.region}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Active Schemes */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Active Schemes</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/manage-schemes')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {schemes.slice(0, 2).map((scheme) => (
            <Card key={scheme.id} variant="default">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">{scheme.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {scheme.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-growth/10 text-growth px-2 py-0.5 rounded-full">
                    Active
                  </span>
                  <span className="text-xs text-muted-foreground">{scheme.state}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GovernmentDashboard;
