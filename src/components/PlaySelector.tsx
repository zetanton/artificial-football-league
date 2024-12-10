import React from 'react';
import { PlaybookPlay, GameState } from '../types/game';
import { plays, defensivePlays } from '../data/playbook';

interface PlaySelectorProps {
  onSelectPlay: (play: PlaybookPlay) => void;
  disabled?: boolean;
  gameState: GameState;
}

const PlaySelector: React.FC<PlaySelectorProps> = ({ onSelectPlay, disabled, gameState }) => {
  const isOnOffense = gameState.possession === 'home';
  const showSpecialTeams = gameState.down === 4 || 
    (gameState.possession === 'home' ? gameState.ballPosition >= 65 : gameState.ballPosition <= 35);

  // Filter plays based on whether we're on offense or defense
  const availablePlays = isOnOffense ? plays.filter(play => {
    if (showSpecialTeams && (play.type === 'punt' || play.type === 'fieldGoal')) {
      return true;
    }
    return play.type === 'run' || play.type === 'pass';
  }) : defensivePlays;

  const runningPlays = availablePlays.filter(play => play.type === 'run');
  const passingPlays = availablePlays.filter(play => play.type === 'pass');
  const specialTeamsPlays = availablePlays.filter(play => 
    play.type === 'punt' || play.type === 'fieldGoal'
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {isOnOffense ? (
        <>
          <div>
            <h3 className="text-xl font-bold mb-4">Running Plays</h3>
            <div className="space-y-2">
              {runningPlays.map(play => (
                <button
                  key={play.id}
                  onClick={() => onSelectPlay(play)}
                  disabled={disabled || gameState.specialTeams}
                  className={`w-full p-2 rounded transition-colors ${
                    disabled || gameState.specialTeams
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {play.name} ({play.formation})
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Passing Plays</h3>
            <div className="space-y-2">
              {passingPlays.map(play => (
                <button
                  key={play.id}
                  onClick={() => onSelectPlay(play)}
                  disabled={disabled || gameState.specialTeams}
                  className={`w-full p-2 rounded transition-colors ${
                    disabled || gameState.specialTeams
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {play.name} ({play.formation})
                </button>
              ))}
            </div>
          </div>
          {showSpecialTeams && (
            <div>
              <h3 className="text-xl font-bold mb-4">Special Teams</h3>
              <div className="space-y-2">
                {specialTeamsPlays.map(play => (
                  <button
                    key={play.id}
                    onClick={() => onSelectPlay(play)}
                    disabled={disabled}
                    className={`w-full p-2 rounded transition-colors ${
                      disabled
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {play.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="col-span-3">
          <h3 className="text-xl font-bold mb-4">Defensive Plays</h3>
          <div className="grid grid-cols-3 gap-4">
            {defensivePlays.map(play => (
              <button
                key={play.id}
                onClick={() => onSelectPlay(play)}
                disabled={disabled}
                className={`p-2 rounded transition-colors ${
                  disabled
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {play.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaySelector;