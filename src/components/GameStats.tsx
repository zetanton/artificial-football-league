import React from 'react';
import { GameState } from '../types/game';
import { formatTime } from '../game/utils/GameUtils';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const getFieldPosition = () => {
    const position = gameState.ballPosition;
    if (position <= 50) {
      return `Own ${position}`;
    } else {
      return `Opp ${100 - position}`;
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {gameState.score.home} - {gameState.score.away}
          </div>
          <div className="text-sm text-gray-400">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {formatTime(gameState.timeRemaining)}
          </div>
          <div className="text-sm text-gray-400">Q{gameState.quarter}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {gameState.down}&amp;{gameState.yardsToGo}
          </div>
          <div className="text-sm text-gray-400">Down &amp; Distance</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{getFieldPosition()}</div>
          <div className="text-sm text-gray-400">Ball On</div>
        </div>
      </div>
      
      {gameState.playResult && (
        <div className={`mt-4 text-center p-2 rounded ${
          gameState.playResult.type === 'success' ? 'bg-green-900' :
          gameState.playResult.type === 'failure' ? 'bg-red-900' :
          gameState.playResult.type === 'turnover' ? 'bg-yellow-900' :
          'bg-blue-900'
        }`}>
          <div className="text-lg font-bold">{gameState.playResult.text}</div>
        </div>
      )}
      
      <div className="mt-4 text-center text-sm text-gray-400">
        {gameState.possession === 'home' ? gameState.homeTeam.name : gameState.awayTeam.name} has the ball
        {gameState.direction[gameState.possession] === 'right' ? ' → ' : ' ← '}
      </div>
    </div>
  );
};

export default GameStats;