import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

// Import routes
import authRoutes from '../routes/authRoutes.js';
import weatherRoutes from '../routes/weatherRoutes.js';
import translationRoutes from '../routes/translationRoutes.js';
import forumRoutes from '../routes/forumRoutes.js';
import chatRoutes from '../routes/chatRoutes.js';
import subscriptionRoutes from '../routes/subscriptionRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import schemeRoutes from '../routes/schemeRoutes.js';

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schemes', schemeRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});