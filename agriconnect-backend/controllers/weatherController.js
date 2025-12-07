// controllers/weatherController.js
import axios from 'axios';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get weather by city
// @route   GET /api/weather/:city
// @access  Public
export const getWeatherByCity = async (req, res, next) => {
    try {
        const { city } = req.params;
        const apiKey = 'e1b20888022f42e6a4a190254250612';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

        const response = await axios.get(url);

        // Extract relevant weather data
        const weatherData = {
            location: response.data.location.name,
            country: response.data.location.country,
            temp_c: response.data.current.temp_c,
            temp_f: response.data.current.temp_f,
            condition: response.data.current.condition.text,
            icon: response.data.current.condition.icon,
            humidity: response.data.current.humidity,
            wind_kph: response.data.current.wind_kph,
            last_updated: response.data.current.last_updated
        };

        res.status(200).json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        return next(new ErrorResponse('Error fetching weather data', 500));
    }
};

// @desc    Get weather by coordinates
// @route   GET /api/weather/coordinates
// @access  Public
export const getWeatherByCoordinates = async (req, res, next) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return next(new ErrorResponse('Please provide latitude and longitude', 400));
        }

        const apiKey = 'e1b20888022f42e6a4a190254250612';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

        const response = await axios.get(url);

        // Extract relevant weather data
        const weatherData = {
            location: response.data.location.name,
            country: response.data.location.country,
            temp_c: response.data.current.temp_c,
            temp_f: response.data.current.temp_f,
            condition: response.data.current.condition.text,
            icon: response.data.current.condition.icon,
            humidity: response.data.current.humidity,
            wind_kph: response.data.current.wind_kph,
            last_updated: response.data.current.last_updated
        };

        res.status(200).json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        return next(new ErrorResponse('Error fetching weather data', 500));
    }
};