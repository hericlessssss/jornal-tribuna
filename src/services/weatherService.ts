import { WeatherResponse, WeatherData } from '../types/weather';
import { logError } from '../utils/errorHandler';

interface WeatherError {
  cod: string;
  message: string;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenWeather API key not configured');
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},BR&units=metric&appid=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json() as WeatherError;
      throw new Error(errorData.message || `Weather API error: ${response.status}`);
    }

    const weatherData = await response.json() as WeatherResponse;

    if (!weatherData.main || !weatherData.weather?.[0]) {
      throw new Error('Invalid weather data received');
    }

    return {
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      rainChance: weatherData.rain?.["1h"] || 0
    };
  } catch (error) {
    logError('WeatherService', error);
    throw error;
  }
}