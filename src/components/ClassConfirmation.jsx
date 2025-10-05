import React from 'react';

export default function ClassConfirmation({ selectedClass, classData, onConfirm, onCancel }) {
  const classIcons = {
    warrior: '⚔️',
    mage: '🔮',
    archer: '🏹'
  };

  const classDescriptions = {
    warrior: 'Zbrojny w ciemności, gotowy na walkę z potworami z głębin. Mistrz walki wręcz z wysoką wytrzymałością.',
    mage: 'Mistrz zaklęć śmierci, przywołujący moc z zaświatów. Potężny nekromanta z ogromną mocą magiczną.',
    archer: 'Zwinny zabójca, polujący w ciemnościach na najgroźniejsze bestie. Łowca cieni z precyzyjnymi atakami.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-2xl p-8 max-w-md mx-4 border-4 border-red-600 animate-darkSoulsRise">
        <div className="text-center">
          {/* Tytuł */}
          <h2 className="text-3xl font-bold text-white mb-6 animate-darkSoulsGlow">Potwierdź Wybór Klasy</h2>
          
          
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
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 border border-gray-500"
            >
              Anuluj
            </button>
            <button
              onClick={onConfirm}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-green-400"
            >
              Potwierdź
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
