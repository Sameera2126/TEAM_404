export type UserRole = 'farmer' | 'expert' | 'government';

export type Language = 'en' | 'hi' | 'te' | 'ta';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  language: Language;
  avatar?: string;
  location?: string;
  verified?: boolean;
}

export interface FarmerProfile extends User {
  role: 'farmer';
  crops: string[];
  farmSize: string;
  experience: string;
  district: string;
  state: string;
}

export interface ExpertProfile extends User {
  role: 'expert';
  specialization: string[];
  qualification: string;
  experience: string;
  rating: number;
  responsesCount: number;
}

export interface GovernmentProfile extends User {
  role: 'government';
  department: string;
  designation: string;
  jurisdiction: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  images?: string[];
  crops?: string[];
  createdAt: Date;
  isAnswered?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  isExpertReply?: boolean;
  upvotes: number;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  category: string;
  images?: string[];
  author: User;
  status: 'pending' | 'answered' | 'resolved';
  createdAt: Date;
  answer?: {
    content: string;
    expert: ExpertProfile;
    createdAt: Date;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  createdAt: Date;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  type: 'article' | 'video' | 'guide';
  thumbnail: string;
  readTime?: string;
  videoUrl?: string;
  author: string;
  publishedAt: Date;
  tags: string[];
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  steps: string[];
  deadline?: Date;
  state: string;
  category: string;
  isActive: boolean;
  publishedAt: Date;
}

export interface Advisory {
  id: string;
  title: string;
  content: string;
  type: 'alert' | 'notice' | 'update';
  severity: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  publishedAt: Date;
  expiresAt?: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
  soilMoisture: number;
  uvIndex: number;
}

export interface WeatherForecast {
  date: Date;
  high: number;
  low: number;
  condition: WeatherData['condition'];
  rainChance: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
}
