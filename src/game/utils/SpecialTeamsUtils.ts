import { Weather } from '../types/weather';

export const calculatePuntDistance = (
  specialTeamsRating: number,
  weather: Weather,
  ballPosition: number
): number => {
  // Base distance between 35-55 yards
  let baseDistance = Math.floor(Math.random() * 20) + 35;
  
  // Adjust for special teams rating (80 is considered average)
  baseDistance += (specialTeamsRating - 80) / 2;
  
  // Weather effects
  if (weather === 'wind') baseDistance *= 0.9;
  if (weather === 'rain') baseDistance *= 0.95;
  if (weather === 'snow') baseDistance *= 0.85;
  
  // Don't punt through the end zone
  const maxDistance = 100 - ballPosition;
  return Math.min(baseDistance, maxDistance);
};

export const calculateFieldGoalDistance = (
  ballPosition: number,
  possession: 'home' | 'away'
): number => {
  return possession === 'home' ? 
    100 - ballPosition : 
    ballPosition;
};

export const calculateFieldGoalProbability = (
  distance: number,
  specialTeamsRating: number,
  weather: Weather
): number => {
  // Base probability starts at 95% for very short kicks and decreases with distance
  let probability = Math.max(10, 95 - (distance - 20) * 2);
  
  // Adjust for special teams rating
  probability += (specialTeamsRating - 80) / 2;
  
  // Weather effects
  if (weather === 'wind') probability *= 0.9;
  if (weather === 'rain') probability *= 0.95;
  if (weather === 'snow') probability *= 0.85;
  
  return Math.min(95, Math.max(5, probability));
};

export const calculateReturnYards = (
  specialTeamsRating: number,
  weather: Weather
): number => {
  let baseReturn = Math.floor(Math.random() * 15);
  
  // Adjust for special teams rating
  baseReturn += (specialTeamsRating - 80) / 3;
  
  // Weather effects
  if (weather === 'rain') baseReturn *= 0.9;
  if (weather === 'snow') baseReturn *= 0.8;
  
  return Math.max(0, Math.floor(baseReturn));
};