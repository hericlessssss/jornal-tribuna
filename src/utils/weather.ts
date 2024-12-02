export const WEATHER_CONDITIONS = {
  CLEAR: 'clear',
  CLOUDS: 'clouds',
  RAIN: 'rain',
  DRIZZLE: 'drizzle',
  THUNDERSTORM: 'thunderstorm',
} as const;

export const WEATHER_UPDATE_INTERVAL = 300000; // 5 minutes in milliseconds

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatRainfall = (amount: number): string => {
  return `${amount}mm/h`;
};