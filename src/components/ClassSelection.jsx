import React, { useState } from 'react';
import ClassConfirmation from './ClassConfirmation';

export default function ClassSelection({ classes, onSelectClass }) {
  const [selectedClass, setSelectedClass] = useState(null);
  
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
    onSelectClass(selectedClass);
    setSelectedClass(null);
  };

  const handleCancel = () => {
    setSelectedClass(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-8 mb-6 text-center border-2 border-red-600 animate-darkSoulsRise">
        <h2 className="text-2xl font-bold text-white mb-6 animate-darkSoulsGlow">Wybierz Klasę Postaci</h2>
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(classes).map(([key, classData]) => (
            <button
              key={key}
              onClick={() => handleClassClick(key)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-lg border border-red-600 transition-all duration-200 transform hover:scale-105 hover:border-red-400 animate-darkSoulsRise hover:animate-darkSoulsGlow"
            >
              <div className="text-6xl mb-4 animate-darkSoulsFloat">{classIcons[key]}</div>
              <h3 className="text-lg font-bold text-red-400 mb-2 animate-darkSoulsGlow">{classData.name}</h3>
              <p className="text-xs text-gray-300 mb-3 italic">"{classData.quote}"</p>
              <p className="text-xs text-gray-400 mb-3">{classData.description}</p>
              <div className="text-xs text-gray-300 space-y-1">
                <p>❤️ HP: {classData.health}</p>
                <p>💙 MP: {classData.mana}</p>
                <p>⚔️ Atak: {classData.damage}</p>
                <p>🛡️ Obrona: {classData.defense}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Potwierdzenie wyboru klasy */}
      {selectedClass && (
        <ClassConfirmation
          selectedClass={selectedClass}
          classData={classes[selectedClass]}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
