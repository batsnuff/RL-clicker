import React from 'react';
import { AlertTriangle, X, RotateCcw, Shield } from 'lucide-react';

export default function ExitConfirmationModal({ isOpen, onAbandon, onSave, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 max-w-md mx-4 transform animate-slideInFromTop">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-blue-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Wyjście z Gry</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-white text-lg mb-4">
            Co chcesz zrobić z postępem gry?
          </p>
          <div className="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-2">
              Wybierz jedną z opcji:
            </p>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• <strong>Porzuć</strong> - wyjście bez zapisywania</li>
              <li>• <strong>Zapisz</strong> - zapisanie i wyjście</li>
              <li>• <strong>Anuluj</strong> - powrót do gry</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Anuluj
          </button>
          <button
            onClick={onAbandon}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Porzuć
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
