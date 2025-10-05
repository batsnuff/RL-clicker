import React, { useState, useEffect } from 'react';

export default function LevelUpNotification({ levelUp, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (levelUp) {
      setIsVisible(true);
      setAnimationClass('animate-slideInFromTop');
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setAnimationClass('animate-fadeOut');
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [levelUp, onClose]);

  if (!isVisible || !levelUp) return null;

  const { newLevel, statGains } = levelUp;

  const handleClose = () => {
    setAnimationClass('animate-fadeOut');
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div 
        className={`bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 shadow-2xl border-4 border-yellow-300 transform ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {/* Tytuł Level Up */}
          <div className="text-6xl mb-4 animate-pulse">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-2 text-shadow-lg">
            LEVEL UP!
          </h2>
          <div className="text-3xl font-bold text-yellow-900 mb-6">
            Poziom {newLevel}
          </div>

          {/* Statystyki */}
          <div className="bg-yellow-100 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold text-yellow-900 mb-3">Nowe statystyki:</h3>
            <div className="grid grid-cols-2 gap-2 text-lg">
              <div className="flex justify-between">
                <span className="text-yellow-800">❤️ HP:</span>
                <span className="font-bold text-green-600">+{statGains.health}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-800">💙 Mana:</span>
                <span className="font-bold text-blue-600">+{statGains.mana}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-800">⚔️ Atak:</span>
                <span className="font-bold text-red-600">+{statGains.damage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-800">🛡️ Max HP:</span>
                <span className="font-bold text-green-600">+{statGains.maxHealth}</span>
              </div>
            </div>
          </div>

          {/* Przycisk zamknięcia */}
          <button
            onClick={handleClose}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Kontynuuj
          </button>
        </div>
      </div>
    </div>
  );
}
