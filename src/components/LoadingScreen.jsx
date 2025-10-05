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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* Dark Souls Background Effects */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20 animate-darkSoulsFlicker" />
      
      <div className="text-center relative z-10">
        {/* Tytuł gry z animacją */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-darkSoulsGlow">
            ⚔️ The Darker Clicker ⚔️
          </h1>
          <div className="text-2xl text-red-300 animate-darkSoulsFloat">
            Wkraczasz w mroczne głębiny...
          </div>
        </div>

        {/* Pasek ładowania */}
        <div className="w-80 mx-auto mb-8">
          <div className="bg-gray-800 rounded-full h-4 mb-4 overflow-hidden border border-red-600">
            <div 
              className="bg-gradient-to-r from-red-600 to-orange-500 h-4 rounded-full transition-all duration-300 ease-out animate-darkSoulsPulse"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-red-400 text-lg font-bold animate-darkSoulsFlicker">
            {loadingProgress}%
          </div>
        </div>

        {/* Tekst ładowania */}
        <div className="text-white text-xl mb-8 min-h-[2rem] animate-darkSoulsFloat">
          {loadingText}
        </div>

        {/* Animowane elementy */}
        <div className="flex justify-center space-x-4 text-4xl">
          <span className="animate-darkSoulsFloat">⚔️</span>
          <span className="animate-darkSoulsFloat" style={{ animationDelay: '0.5s' }}>🛡️</span>
          <span className="animate-darkSoulsFlicker">🔥</span>
          <span className="animate-darkSoulsFloat" style={{ animationDelay: '1s' }}>💀</span>
        </div>
        
        {/* Mroczny cytat */}
        <div className="mt-8 text-gray-400 text-sm">
          <p className="animate-darkSoulsFloat" style={{ animationDelay: '1.5s' }}>
            "Ciemność nie jest moim wrogiem - to mój sojusznik."
          </p>
        </div>
      </div>
    </div>
  );
}
