export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  rain?: {
    "1h"?: number;
  };
}

export interface WeatherData {
  temp: number;
  condition: string;
  rainChance: number;
}

export type WeatherCondition = 
  | "Clear"
  | "Clouds" 
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Fog";