import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NameInputModal({ isOpen, onConfirm, onCancel, className, classData }) {
  const [playerName, setPlayerName] = useState('');

  const handleConfirm = () => {
    // Sprawdź czy nazwa nie jest pusta lub tylko białe znaki
    const trimmedName = playerName.trim();
    
    // Jeśli nazwa jest pusta lub za krótka, użyj domyślnej nazwy
    let finalName = trimmedName;
    if (trimmedName === '' || trimmedName.length < 2) {
      finalName = 'bezimienny Pomiot';
    }
    
    onConfirm(finalName);
    setPlayerName('');
  };

  const handleCancel = () => {
    onCancel();
    setPlayerName('');
  };

  if (!isOpen) return null;

  const classIcons = {
    warrior: '⚔️',
    mage: '🔮',
    archer: '🏹'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-2xl p-8 max-w-md mx-4 border-4 border-red-600 animate-darkSoulsRise">
        <div className="relative">
          {/* Przycisk zamknięcia */}
          <button
            onClick={handleCancel}
            className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-red-400"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            {/* Tytuł */}
            <h2 className="text-3xl font-bold text-white mb-6 animate-darkSoulsGlow">Wprowadź Nazwę Postaci</h2>
            
            {/* Ikona klasy */}
            <div className="text-6xl mb-4 animate-darkSoulsFloat">{classIcons[className]}</div>
            <h3 className="text-xl font-bold text-red-400 mb-4">{classData.name}</h3>
            
            {/* Pole na nazwę */}
            <div className="mb-6">
              <label className="block text-white text-lg mb-2">Nazwa Postaci:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder='Jak Cie wołają? Ja bezimiennych "Przydupas"'
                className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-red-600 focus:border-red-500 focus:outline-none w-full transition-all duration-200 animate-darkSoulsRise"
                maxLength={20}
                autoFocus
              />
              <p className="text-gray-400 text-sm mt-2">Maksymalnie 20 znaków</p>
            </div>
            
            {/* Przyciski */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 border border-gray-500"
              >
                Anuluj
              </button>
              <button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-green-400"
              >
                Potwierdź
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
