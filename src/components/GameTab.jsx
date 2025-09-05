import React from 'react';
import { RotateCcw, Star } from 'lucide-react';

export default function GameTab({ gameState, gameActions }) {
  if (gameState.gameOver) {
    return (
      <div className="bg-black bg-opacity-80 rounded-lg p-8 text-center border-2 border-red-600">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over!</h2>
        <p className="text-white mb-4">Twoje statystyki:</p>
        <div className="text-white mb-6">
          <p>Poziom: {gameState.level}</p>
          <p>Piętro: {gameState.floor}</p>
          <p>Prestige: {gameState.prestigeLevel}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={gameActions.resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            <RotateCcw className="inline mr-2" size={16} />
            Nowa Gra
          </button>
          {gameState.level >= 50 && (
            <button
              onClick={gameActions.prestige}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              <Star className="inline mr-2" size={16} />
              Prestige (+{gameState.prestigeBonus}% ataku)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Informacje o grze */}
      <div className="bg-black bg-opacity-60 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Informacje o grze</h3>
        <div className="text-white text-center">
          <p className="mb-2">Element z potworem został przeniesiony między nawigację a status gracza.</p>
          <p className="mb-2">Możesz atakować przeciwnika klikając na niego powyżej.</p>
          <p>Używaj umiejętności specjalnych do walki z silniejszymi przeciwnikami.</p>
        </div>
      </div>
    </>
  );
}
