import React, { useState } from 'react';
import ClassConfirmation from './ClassConfirmation';

export default function ClassSelection({ classes, onSelectClass }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [playerName, setPlayerName] = useState('');
  
  // Mapowanie klas do ikon
  const classIcons = {
    warrior: '⚔️',
    mage: '🔮',
    archer: '🏹'
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
  };

  const handleConfirm = () => {
    onSelectClass(selectedClass, playerName);
    setSelectedClass(null);
    setPlayerName('');
  };

  const handleCancel = () => {
    setSelectedClass(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-8 mb-6 text-center border-2 border-red-600 animate-darkSoulsRise">
        <h2 className="text-2xl font-bold text-white mb-6 animate-darkSoulsGlow">Wybierz Klasę Postaci</h2>
        
        {/* Pole na nazwę postaci */}
        <div className="mb-6">
          <label className="block text-white text-lg mb-2">Nazwa Postaci:</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Wpisz nazwę swojej postaci..."
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-red-600 focus:border-red-500 focus:outline-none w-full max-w-md transition-all duration-200 animate-darkSoulsRise"
            maxLength={20}
          />
          <p className="text-gray-400 text-sm mt-1">Maksymalnie 20 znaków</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(classes).map(([key, classData]) => (
            <button
              key={key}
              onClick={() => handleClassClick(key)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-lg border border-red-600 transition-all duration-200 transform hover:scale-105 hover:border-red-400 animate-darkSoulsRise hover:animate-darkSoulsGlow"
            >
              <div className="text-6xl mb-4">{classIcons[key]}</div>
              <p className="text-sm opacity-90">HP: {classData.health} | MP: {classData.mana}</p>
              <p className="text-sm opacity-90">Atak: {classData.damage} | Obrona: {classData.defense}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Potwierdzenie wyboru klasy */}
      {selectedClass && (
        <ClassConfirmation
          selectedClass={selectedClass}
          classData={classes[selectedClass]}
          playerName={playerName}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
