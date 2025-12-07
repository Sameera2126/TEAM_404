// routes/weatherRoutes.js
import express from 'express';
import { getWeatherByCity, getWeatherByCoordinates } from '../controllers/weatherController.js';

const router = express.Router();

// Get weather by city name
router.get('/:city', getWeatherByCity);

// Get weather by coordinates
router.get('/coordinates', getWeatherByCoordinates);

export default router;