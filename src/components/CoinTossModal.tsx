import React from 'react';

interface CoinTossModalProps {
  winner: 'home' | 'away';
  homeTeam: string;
  awayTeam: string;
  onChoice: (choice: 'receive' | 'defer') => void;
}

const CoinTossModal: React.FC<CoinTossModalProps> = ({
  winner,
  homeTeam,
  awayTeam,
  onChoice
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Coin Toss</h2>
        <p className="text-center mb-6">
          {winner === 'home' ? homeTeam : awayTeam} won the toss!
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onChoice('receive')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
          >
            Receive
          </button>
          <button
            onClick={() => onChoice('defer')}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
          >
            Defer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinTossModal;