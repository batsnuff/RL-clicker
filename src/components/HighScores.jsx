import React from 'react';

export default function HighScores({ highScores }) {
  if (highScores.length === 0) return null;

  return (
    <div className="bg-black bg-opacity-60 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 text-center">🏆 Ostatnie Wyniki</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {highScores.map((score, index) => (
          <div key={index} className="bg-gray-800 p-3 rounded text-white text-sm text-center">
            <div className="font-bold">#{index + 1}</div>
            <div>Poziom: {score.level}</div>
            <div>Piętro: {score.floor}</div>
            <div className="text-yellow-400">★{score.prestigeLevel}</div>
            <div className="text-xs text-gray-400">{score.date}</div>
          </div>
        ))}
      </div>
      {highScores.length > 0 && (
        <div className="text-center mt-4">
          <div className="text-yellow-400 font-bold">
            🎯 Najlepszy wynik: Piętro {Math.max(...highScores.map(s => s.floor))}
          </div>
        </div>
      )}
    </div>
  );
}
