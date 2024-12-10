import React, { useState, useCallback } from 'react';
import Canvas from './game/Canvas';
import TeamSelect from './components/TeamSelect';
import PlaySelector from './components/PlaySelector';
import GameStats from './components/GameStats';
import CoinTossModal from './components/CoinTossModal';
import { Team, PlaybookPlay } from './types/game';
import { GameEngine } from './game/GameEngine';

function App() {
  const [gameMode, setGameMode] = useState<'menu' | 'teamSelect' | 'game' | 'season'>('menu');
  const [selectedTeams, setSelectedTeams] = useState<{ home?: Team; away?: Team }>({});
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [playInProgress, setPlayInProgress] = useState(false);
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [coinTossWinner, setCoinTossWinner] = useState<'home' | 'away'>('home');

  const handleTeamSelect = (team: Team) => {
    if (!selectedTeams.home) {
      setSelectedTeams({ home: team });
    } else if (!selectedTeams.away) {
      setSelectedTeams({ ...selectedTeams, away: team });
      setCoinTossWinner(Math.random() < 0.5 ? 'home' : 'away');
      setShowCoinToss(true);
    }
  };

  const handleCoinTossChoice = (choice: 'receive' | 'defer') => {
    setShowCoinToss(false);
    const engine = new GameEngine(
      selectedTeams.home!,
      selectedTeams.away!,
      choice === 'receive' ? coinTossWinner : (coinTossWinner === 'home' ? 'away' : 'home')
    );
    setGameEngine(engine);
    setGameMode('game');
  };

  const handlePlaySelect = useCallback(async (play: PlaybookPlay) => {
    if (gameEngine && !playInProgress) {
      setPlayInProgress(true);
      await gameEngine.executePlay(play);
      setPlayInProgress(false);
    }
  }, [gameEngine, playInProgress]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Artificial Football League</h1>
        
        {gameMode === 'menu' && (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setGameMode('teamSelect')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-xl font-semibold transition-colors"
            >
              Play Game
            </button>
            <button
              onClick={() => setGameMode('season')}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-xl font-semibold transition-colors"
            >
              Start Season
            </button>
          </div>
        )}

        {gameMode === 'teamSelect' && (
          <div className="grid grid-cols-2 gap-8">
            <TeamSelect
              conference="AFC"
              onSelect={handleTeamSelect}
              excludeTeamId={selectedTeams.home?.id}
            />
            <TeamSelect
              conference="NFC"
              onSelect={handleTeamSelect}
              excludeTeamId={selectedTeams.home?.id}
            />
          </div>
        )}

        {showCoinToss && selectedTeams.home && selectedTeams.away && (
          <CoinTossModal
            winner={coinTossWinner}
            homeTeam={selectedTeams.home.name}
            awayTeam={selectedTeams.away.name}
            onChoice={handleCoinTossChoice}
          />
        )}

        {gameMode === 'game' && gameEngine && (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-2xl font-bold">
              {selectedTeams.home?.city} {selectedTeams.home?.name} vs {selectedTeams.away?.city} {selectedTeams.away?.name}
            </div>
            <Canvas width={800} height={400} gameState={gameEngine.getGameState()} />
            <GameStats gameState={gameEngine.getGameState()} />
            <PlaySelector 
              onSelectPlay={handlePlaySelect} 
              disabled={playInProgress} 
              gameState={gameEngine.getGameState()} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;