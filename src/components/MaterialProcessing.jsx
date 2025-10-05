import React, { useState } from 'react';
import { ArrowRight, Coins, Zap, RotateCcw } from 'lucide-react';

export default function MaterialProcessing({ gameState, onProcessMaterials }) {
  const [selectedMaterial, setSelectedMaterial] = useState('wood');
  const [quantity, setQuantity] = useState(1);

  const materialNames = {
    wood: 'Drewno',
    iron: 'Żelazo', 
    steel: 'Stal',
    mithril: 'Mithril',
    adamant: 'Adamant',
    gems: 'Klejnoty',
    essence: 'Esencja'
  };

  const materialTiers = ['wood', 'iron', 'steel', 'mithril', 'adamant'];

  // Conversion rates - only gold exchange with better rates
  const conversionRates = {
    gold: {
      wood: 5,      // Increased from 2
      iron: 12,     // Increased from 5
      steel: 30,    // Increased from 12
      mithril: 75,  // Increased from 30
      adamant: 200, // Increased from 75
      gems: 40,     // Increased from 15
      essence: 150  // Increased from 50
    }
  };

  const getAvailableMaterials = () => {
    return Object.entries(gameState.materials)
      .filter(([material, amount]) => amount > 0)
      .map(([material, amount]) => ({ material, amount }));
  };

  const getMaxQuantity = () => {
    return gameState.materials[selectedMaterial] || 0;
  };

  const handleProcess = () => {
    if (quantity <= 0 || quantity > getMaxQuantity()) return;
    
    onProcessMaterials('gold', selectedMaterial, quantity);
    setQuantity(1);
  };

  const availableMaterials = getAvailableMaterials();
  const maxQuantity = getMaxQuantity();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-4 sm:p-6 border-2 border-red-600 animate-darkSoulsRise">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 text-center flex items-center justify-center gap-2 animate-darkSoulsGlow">
        <Coins className="w-6 h-6 text-yellow-400 animate-darkSoulsFloat" />
        Wymiana Materiałów na Złoto
      </h2>

      {availableMaterials.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <RotateCcw className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p>Brak materiałów do przetworzenia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Material Selection */}
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Wybierz materiał:
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-red-600 focus:border-red-500 focus:outline-none transition-all duration-200 animate-darkSoulsRise"
            >
              {availableMaterials.map(({ material, amount }) => (
                <option key={material} value={material}>
                  {materialNames[material]} ({amount})
                </option>
              ))}
            </select>
          </div>

          {/* Gold Conversion Display */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise">
            <h3 className="text-white font-bold mb-2">Konwersja na złoto:</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">
                1 {materialNames[selectedMaterial]} → {conversionRates.gold[selectedMaterial]} złota
              </span>
              <span className="text-yellow-400 font-bold">
                {gameState.materials[selectedMaterial] * conversionRates.gold[selectedMaterial]} złota możliwe
              </span>
            </div>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Ilość ({maxQuantity} dostępne):
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                className="flex-1 bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
              />
              <button
                onClick={() => setQuantity(Math.max(1, Math.floor(maxQuantity / 2)))}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200"
              >
                Połowa
              </button>
              <button
                onClick={() => setQuantity(maxQuantity)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200"
              >
                Wszystko
              </button>
            </div>
          </div>

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={maxQuantity === 0 || quantity <= 0}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              maxQuantity > 0 && quantity > 0
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white animate-darkSoulsPulse border border-yellow-400'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
            }`}
          >
            <Coins className="inline w-5 h-5 mr-2" />
            Zamień na {quantity * conversionRates.gold[selectedMaterial]} złota
          </button>
        </div>
      )}
    </div>
  );
}
