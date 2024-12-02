import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  rainChance: number;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Unai,BR&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          rainChance: data.rain ? data.rain['1h'] : 0
        });
      } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000); // Atualiza a cada hora

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="animate-pulse w-24 h-8 bg-gray-200 rounded"></div>;
  }

  if (!weather) {
    return null;
  }

  const getWeatherIcon = () => {
    switch (weather.condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'clouds':
        return <CloudSun className="w-5 h-5 text-gray-500" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {getWeatherIcon()}
      <span className="font-medium">{weather.temp}°C</span>
      {weather.rainChance > 0 && (
        <span className="text-blue-500">
          {weather.rainChance}mm/h
        </span>
      )}
    </div>
  );
};

export default WeatherWidget;