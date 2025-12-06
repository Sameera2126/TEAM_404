import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  MessageSquare,
  HelpCircle,
  BookOpen,
  FileText,
  ArrowRight,
  Bell,
  ThumbsUp,
} from 'lucide-react';
import { currentWeather, weatherForecast, forumPosts, advisories } from '@/data/mockData';

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

const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-sun" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-muted-foreground" />;
      case 'rainy':
        return <Droplets className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-sun" />;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const urgentAdvisory = advisories.find((a) => a.severity === 'high' || a.severity === 'critical');

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
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">{user?.location}</p>
      </motion.div>

      {/* Alert Banner */}
      {urgentAdvisory && (
        <motion.div variants={item}>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-destructive mb-1">
                  {urgentAdvisory.title}
                </p>
                <p className="text-sm text-destructive/80 line-clamp-2">
                  {urgentAdvisory.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weather Card */}
      <motion.div variants={item}>
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Today's Weather</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/weather')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {getWeatherIcon(currentWeather.condition)}
                <div>
                  <p className="text-4xl font-bold text-foreground">
                    {currentWeather.temperature}°C
                  </p>
                  <p className="text-muted-foreground capitalize">
                    {currentWeather.condition}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">
                    {currentWeather.humidity}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {currentWeather.windSpeed} km/h
                  </span>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {weatherForecast.slice(0, 5).map((day, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-16 text-center p-3 rounded-xl bg-muted/50"
                >
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                  {getWeatherIcon(day.condition)}
                  <p className="text-sm font-medium mt-2">{day.high}°</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: HelpCircle, label: 'Ask Expert', path: '/ask-expert', color: 'bg-primary/10 text-primary' },
            { icon: MessageSquare, label: 'Community', path: '/forum', color: 'bg-secondary text-secondary-foreground' },
            { icon: BookOpen, label: 'Learn', path: '/knowledge', color: 'bg-growth/10 text-growth' },
            { icon: FileText, label: 'Schemes', path: '/schemes', color: 'bg-soil/10 text-soil' },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="p-4 bg-card rounded-2xl border border-border shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="font-medium text-foreground text-sm">{action.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Forum Posts */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Community Discussions</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/forum')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {forumPosts.slice(0, 3).map((post) => (
            <Card key={post.id} variant="default" className="hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate(`/forum/${post.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground mb-1 line-clamp-2">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FarmerDashboard;
