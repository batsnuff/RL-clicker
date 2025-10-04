import React, { useState } from 'react';
import { ArrowRight, Coins, Zap, RotateCcw } from 'lucide-react';

export default function MaterialProcessing({ gameState, onProcessMaterials }) {
  const [selectedConversion, setSelectedConversion] = useState('upgrade');
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

  // Conversion rates - better than 1:1
  const conversionRates = {
    upgrade: {
      wood: { iron: 3, steel: 8, mithril: 20, adamant: 50 },
      iron: { steel: 3, mithril: 8, adamant: 20 },
      steel: { mithril: 3, adamant: 8 },
      mithril: { adamant: 3 }
    },
    gold: {
      wood: 2,
      iron: 5,
      steel: 12,
      mithril: 30,
      adamant: 75,
      gems: 15,
      essence: 50
    }
  };

  const getAvailableMaterials = () => {
    return Object.entries(gameState.materials)
      .filter(([material, amount]) => amount > 0)
      .map(([material, amount]) => ({ material, amount }));
  };

  const getUpgradeOptions = (material) => {
    if (selectedConversion !== 'upgrade') return [];
    const tierIndex = materialTiers.indexOf(material);
    if (tierIndex === -1 || tierIndex === materialTiers.length - 1) return [];
    
    return materialTiers.slice(tierIndex + 1).map(nextTier => ({
      material: nextTier,
      rate: conversionRates.upgrade[material][nextTier],
      name: materialNames[nextTier]
    }));
  };

  const getMaxQuantity = () => {
    if (selectedConversion === 'upgrade') {
      const upgradeOptions = getUpgradeOptions(selectedMaterial);
      if (upgradeOptions.length === 0) return 0;
      return Math.floor(gameState.materials[selectedMaterial] / upgradeOptions[0].rate);
    } else {
      return gameState.materials[selectedMaterial] || 0;
    }
  };

  const handleProcess = () => {
    if (quantity <= 0 || quantity > getMaxQuantity()) return;
    
    onProcessMaterials(selectedConversion, selectedMaterial, quantity);
    setQuantity(1);
  };

  const availableMaterials = getAvailableMaterials();
  const upgradeOptions = getUpgradeOptions(selectedMaterial);
  const maxQuantity = getMaxQuantity();

  return (
    <div className="bg-black bg-opacity-60 rounded-lg p-4 sm:p-6 animate-slideIn">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 text-center flex items-center justify-center gap-2">
        <Zap className="w-6 h-6 text-yellow-400" />
        Przetwarzanie Materiałów
      </h2>

      {/* Conversion Type Selection */}
      <div className="mb-6">
        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => setSelectedConversion('upgrade')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedConversion === 'upgrade'
                ? 'bg-purple-600 text-white animate-glow'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ArrowRight className="inline w-4 h-4 mr-2" />
            Ulepsz Materiały
          </button>
          <button
            onClick={() => setSelectedConversion('gold')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedConversion === 'gold'
                ? 'bg-yellow-600 text-white animate-glow'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Coins className="inline w-4 h-4 mr-2" />
            Zamień na Złoto
          </button>
        </div>
      </div>

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
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
            >
              {availableMaterials.map(({ material, amount }) => (
                <option key={material} value={material}>
                  {materialNames[material]} ({amount})
                </option>
              ))}
            </select>
          </div>

          {/* Upgrade Options Display */}
          {selectedConversion === 'upgrade' && upgradeOptions.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Opcje ulepszenia:</h3>
              <div className="space-y-2">
                {upgradeOptions.map(({ material, rate, name }) => (
                  <div key={material} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {rate} {materialNames[selectedMaterial]} → 1 {name}
                    </span>
                    <span className="text-green-400 font-bold">
                      {Math.floor(gameState.materials[selectedMaterial] / rate)} możliwych
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gold Conversion Display */}
          {selectedConversion === 'gold' && (
            <div className="bg-gray-800 p-4 rounded-lg">
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
          )}

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
                ? selectedConversion === 'upgrade'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white animate-pulse'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white animate-pulse'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedConversion === 'upgrade' ? (
              <>
                <ArrowRight className="inline w-5 h-5 mr-2" />
                Ulepsz {quantity} {materialNames[selectedMaterial]}
              </>
            ) : (
              <>
                <Coins className="inline w-5 h-5 mr-2" />
                Zamień na {quantity * conversionRates.gold[selectedMaterial]} złota
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
