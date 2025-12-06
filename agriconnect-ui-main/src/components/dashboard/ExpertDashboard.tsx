import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { questions } from '@/data/mockData';

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

const ExpertDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pendingQuestions = questions.filter((q) => q.status === 'pending');
  const answeredCount = questions.filter((q) => q.status === 'answered').length;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20 lg:pb-0"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
          Welcome back, {user?.name?.split(' ')[0]}! 👨‍🔬
        </h1>
        <p className="text-muted-foreground">Help farmers with your expertise</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Pending', value: pendingQuestions.length, color: 'text-sun' },
          { icon: CheckCircle, label: 'Answered', value: answeredCount, color: 'text-growth' },
          { icon: MessageSquare, label: 'Chats', value: 5, color: 'text-primary' },
          { icon: Star, label: 'Rating', value: '4.8', color: 'text-sun' },
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

      {/* Pending Questions */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Pending Questions</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/expert-questions')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {pendingQuestions.slice(0, 3).map((question) => (
            <Card key={question.id} variant="elevated" className="cursor-pointer hover:-translate-y-0.5 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">{question.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {question.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-lg">
                        {question.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(question.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Analytics Preview */}
      <motion.div variants={item}>
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-growth" />
              Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-foreground">1,250+</p>
                <p className="text-sm text-muted-foreground">Farmers Helped</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">2hrs</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ExpertDashboard;
