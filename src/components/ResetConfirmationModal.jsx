import React from 'react';
import { AlertTriangle, X, RotateCcw } from 'lucide-react';

export default function ResetConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 max-w-md mx-4 transform animate-slideInFromTop">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Potwierdzenie Resetu</h2>
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
          <p className="text-white text-lg mb-3">
            Czy na pewno chcesz zresetować grę?
          </p>
          <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4">
            <p className="text-red-200 text-sm">
              ⚠️ <strong>UWAGA:</strong> Wszystkie postępy zostaną utracone:
            </p>
            <ul className="text-red-200 text-sm mt-2 ml-4 space-y-1">
              <li>• Poziom i doświadczenie</li>
              <li>• Złoto i materiały</li>
              <li>• Ekwipunek</li>
              <li>• Umiejętności</li>
              <li>• Piętro i postęp</li>
            </ul>
            <p className="text-yellow-300 text-sm mt-2 font-bold">
              High scores zostaną zachowane!
            </p>
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
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Resetuj Grę
          </button>
        </div>
      </div>
    </div>
  );
}
