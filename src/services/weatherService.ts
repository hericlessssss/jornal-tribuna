import { WeatherResponse, WeatherData } from '../types/weather';
import { logError } from '../utils/errorHandler';

interface WeatherError {
  cod: string;
  message: string;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  // Verifica se a chave da API está configurada
  if (!apiKey) {
    throw new Error('OpenWeather API key not configured');
  }

  try {
    // Corrigir URL da API do OpenWeather para garantir que a requisição seja feita corretamente
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},BR&units=metric&appid=${apiKey}`, 
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    // Se a resposta não for OK, tenta capturar o erro da API
    if (!response.ok) {
      const errorData = await response.json() as WeatherError;
      throw new Error(errorData.message || `Weather API error: ${response.status}`);
    }

    // Obtém os dados do clima
    const weatherData = await response.json() as WeatherResponse;

    // Verifica se os dados recebidos são válidos
    if (!weatherData.main || !weatherData.weather?.[0]) {
      throw new Error('Invalid weather data received');
    }

    // Retorna os dados formatados de forma simples
    return {
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      rainChance: weatherData.rain?.["1h"] || 0
    };
  } catch (error) {
    // Se ocorrer algum erro, registra e lança novamente
    logError('WeatherService', error);
    throw error;
  }
}
