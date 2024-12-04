import { WeatherResponse, WeatherData } from '../types/weather';
import { logError } from '../utils/errorHandler';

interface WeatherError {
  cod: string;
  message: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenWeather API key not configured');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await wait(RETRY_DELAY * Math.pow(2, attempt));
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},BR&units=metric&appid=${apiKey}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-cache'
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
      lastError = error as Error;
      if (attempt === MAX_RETRIES - 1) {
        logError('WeatherService', error);
        throw error;
      }
    }
  }

  throw lastError;
}