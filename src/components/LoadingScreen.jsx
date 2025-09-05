import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onLoadingComplete }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const loadingMessages = [
    'Ładowanie świata...',
    'Przygotowywanie przeciwników...',
    'Inicjalizacja magii...',
    'Sprawdzanie ekwipunku...',
    'Gotowy do walki!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = Math.floor(loadingProgress / 20);
        return loadingMessages[Math.min(currentIndex, loadingMessages.length - 1)];
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [loadingProgress, onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        {/* Tytuł gry z animacją */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse">
            🗡️ Rogue Clicker RPG 🛡️
          </h1>
          <div className="text-2xl text-gray-300 animate-bounce">
            Przygotuj się na przygodę!
          </div>
        </div>

        {/* Pasek ładowania */}
        <div className="w-80 mx-auto mb-8">
          <div className="bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-white text-lg font-semibold">
            {loadingProgress}%
          </div>
        </div>

        {/* Tekst ładowania */}
        <div className="text-white text-xl mb-8 min-h-[2rem]">
          {loadingText}
        </div>

        {/* Animowane elementy */}
        <div className="flex justify-center space-x-4 text-4xl">
          <span className="animate-spin">⚔️</span>
          <span className="animate-bounce">🛡️</span>
          <span className="animate-pulse">✨</span>
          <span className="animate-spin" style={{ animationDirection: 'reverse' }}>🔮</span>
        </div>
      </div>
    </div>
  );
}
