import React from 'react';

export default function ClassConfirmation({ selectedClass, classData, playerName, onConfirm, onCancel }) {
  const classIcons = {
    warrior: '⚔️',
    mage: '🔮',
    archer: '🏹'
  };

  const classDescriptions = {
    warrior: 'Silny wojownik specjalizujący się w walce wręcz. Ma wysokie HP i obronę, ale niską manę.',
    mage: 'Potężny mag używający zaklęć. Ma wysoką manę i umiejętności magiczne, ale niskie HP.',
    archer: 'Zwinny łucznik atakujący z dystansu. Zbalansowane statystyki i umiejętności strzeleckie.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gradient-to-b from-blue-900 to-purple-900 rounded-2xl p-8 max-w-md mx-4 border-4 border-yellow-400">
        <div className="text-center">
          {/* Tytuł */}
          <h2 className="text-3xl font-bold text-white mb-6">Potwierdź Wybór Klasy</h2>
          
          {/* Nazwa postaci */}
          {playerName && (
            <div className="mb-4">
              <p className="text-lg text-gray-300">Nazwa postaci:</p>
              <p className="text-2xl font-bold text-cyan-400">{playerName}</p>
            </div>
          )}
          
          {/* Ikona i nazwa klasy */}
          <div className="text-8xl mb-4">{classIcons[selectedClass]}</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">{classData.name}</h3>
          
          {/* Opis klasy */}
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">
            {classDescriptions[selectedClass]}
          </p>
          
          {/* Statystyki */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-bold text-white mb-3">Statystyki:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-red-400">❤️ HP:</span>
                <span className="text-white font-bold">{classData.health}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">💙 Mana:</span>
                <span className="text-white font-bold">{classData.mana}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">⚔️ Atak:</span>
                <span className="text-white font-bold">{classData.damage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">🛡️ Obrona:</span>
                <span className="text-white font-bold">{classData.defense}</span>
              </div>
            </div>
          </div>
          
          {/* Pytanie potwierdzenia */}
          <p className="text-white mb-6 font-semibold">
            Czy na pewno chcesz wybrać tę klasę?
          </p>
          
          {/* Przyciski */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Potwierdź
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
