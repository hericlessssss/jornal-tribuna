import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Loader2, CloudFog } from 'lucide-react';
import { fetchWeatherData } from '../services/weatherService';
import type { WeatherData, WeatherCondition } from '../types/weather';

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const getWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherData('Unai');
        setWeather(data);
        setRetryCount(0);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao carregar previsão');
        console.error('Erro ao buscar dados do clima:', error);
        
        if (retryCount < 3) {
          const timeout = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, timeout);
        }
      } finally {
        setLoading(false);
      }
    };

    getWeather();
    
    const interval = setInterval(() => {
      if (retryCount < 3) {
        getWeather();
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [retryCount]);

  const getWeatherIcon = (condition: WeatherCondition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-500" title="Céu limpo" />;
      case 'clouds':
        return <CloudSun className="w-5 h-5 text-gray-500" title="Nublado" />;
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return <CloudRain className="w-5 h-5 text-blue-500" title="Chuva" />;
      case 'mist':
      case 'fog':
        return <CloudFog className="w-5 h-5 text-gray-400" title="Neblina" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-500" title="Tempo nublado" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1">
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-sm text-gray-400">Carregando...</span>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm bg-gray-50 px-3 py-1 rounded-full" title="Previsão do tempo para Unaí">
      {getWeatherIcon(weather.condition as WeatherCondition)}
      <span className="font-medium">{weather.temp}°C</span>
      {weather.rainChance > 0 && (
        <span className="text-blue-500 text-xs">
          {weather.rainChance}mm/h
        </span>
      )}
    </div>
  );
};

export default WeatherWidget;