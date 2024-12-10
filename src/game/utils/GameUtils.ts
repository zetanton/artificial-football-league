import { Weather } from '../types/weather';

export const calculateSuccessRate = ({
  offensePower,
  defensePower,
  baseSuccessRate,
  weather
}: {
  offensePower: number;
  defensePower: number;
  baseSuccessRate: number;
  weather: Weather;
}): number => {
  let successRate = baseSuccessRate;
  
  // Adjust for offense vs defense ratings (smaller impact)
  const powerDifference = offensePower - defensePower;
  successRate += powerDifference * 0.3;
  
  // Weather effects
  if (weather === 'rain') successRate *= 0.85;
  if (weather === 'snow') successRate *= 0.75;
  if (weather === 'wind') successRate *= 0.9;
  
  // Cap success rate
  return Math.min(85, Math.max(15, successRate));
};

export const calculateFieldPosition = (
  currentPosition: number,
  yards: number,
  possession: 'home' | 'away'
): number => {
  const newPosition = currentPosition + yards;
  
  // Ensure position stays within field bounds
  if (newPosition < 0) return 0;
  if (newPosition > 100) return 100;
  
  return newPosition;
};

export const isTouchdown = (position: number, possession: 'home' | 'away'): boolean => {
  return (possession === 'home' && position >= 100) || 
         (possession === 'away' && position <= 0);
};

export const isSafety = (position: number, possession: 'home' | 'away'): boolean => {
  return (possession === 'home' && position <= 0) || 
         (possession === 'away' && position >= 100);
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};