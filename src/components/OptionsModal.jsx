import React from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

export default function OptionsModal({ isOpen, onSaveAndExit, onNewGame, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-2xl p-8 max-w-md mx-4 border-4 border-red-600 animate-darkSoulsRise">
        <div className="relative">
          {/* Przycisk zamknięcia */}
          <button
            onClick={onCancel}
            className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-red-400"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            {/* Tytuł */}
            <h2 className="text-3xl font-bold text-white mb-6 animate-darkSoulsGlow">Opcje Gry</h2>
            
            {/* Opcje */}
            <div className="space-y-4">
              {/* Zapisz i eksploruj */}
              <button
                onClick={onSaveAndExit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-green-400 flex items-center justify-center gap-3"
              >
                <Save size={20} />
                <span>Zapisz i eksploruj</span>
              </button>
              
              {/* Nowa gra */}
              <button
                onClick={onNewGame}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-red-400 flex items-center justify-center gap-3"
              >
                <RotateCcw size={20} />
                <span>Nowa gra?</span>
              </button>
            </div>
            
            {/* Opis */}
            <div className="mt-6 text-gray-400 text-sm">
              <p>Wybierz opcję aby kontynuować</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
