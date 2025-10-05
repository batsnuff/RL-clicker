import React from 'react';

export default function CraftingTab({ gameState, gameActions, materialNames, getMaterialTier, craftingRecipes, craftingCategory, setCraftingCategory }) {
  // Filtruj przepisy na podstawie wybranej kategorii i klasy postaci
  const filteredRecipes = craftingRecipes.filter(recipe => {
    if (recipe.type !== craftingCategory) return false;
    if (recipe.type === 'weapon' && recipe.weaponClass) {
      return recipe.weaponClass === gameState.playerClass;
    }
    if (recipe.type === 'armor' && recipe.armorClass) {
      return recipe.armorClass === gameState.playerClass;
    }
    return true;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-6 border-2 border-red-600 animate-darkSoulsRise">
      <h2 className="text-2xl font-bold text-white mb-6 text-center animate-darkSoulsGlow">🔨 Craftowanie</h2>
      
      {/* Kategorie ekwipunku */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setCraftingCategory('weapon')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            craftingCategory === 'weapon'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-darkSoulsPulse border border-red-400'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
          }`}
        >
          ⚔️ Broń
        </button>
        <button
          onClick={() => setCraftingCategory('armor')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            craftingCategory === 'armor'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white animate-darkSoulsPulse border border-blue-400'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
          }`}
        >
          🛡️ Zbroja
        </button>
        <button
          onClick={() => setCraftingCategory('accessory')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            craftingCategory === 'accessory'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-darkSoulsPulse border border-purple-400'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
          }`}
        >
          💍 Akcesoria
        </button>
      </div>
      
      <div className="mb-4 text-center text-white">
        <p>Aktualny tier materiałów: <span className="font-bold text-yellow-400">{materialNames[getMaterialTier(gameState.floor)]}</span></p>
        <p className="text-sm text-gray-400">Każdy stworzony przedmiot otrzymuje losowy bonus!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => {
          const canCraft = Object.entries(recipe.materials).every(([material, amount]) => 
            (gameState.materials[material] || 0) >= amount
          );
          const tierUnlocked = gameState.floor >= (filteredRecipes.indexOf(recipe) * 30);
          
          return (
            <div key={recipe.id} className={`bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise ${!tierUnlocked ? 'opacity-50' : ''}`}>
              <h3 className="font-bold text-white mb-2">
                {recipe.type === 'weapon' && '⚔️ '}
                {recipe.type === 'armor' && '🛡️ '}
                {recipe.type === 'accessory' && '💍 '}
                {recipe.name}
              </h3>
              <div className="text-gray-300 text-sm mb-2">
                {recipe.type === 'weapon' && (
                  <div>
                    Atak: +{recipe.baseDamage}
                    {recipe.baseMana && ` | Mana: +${recipe.baseMana}`}
                    {recipe.baseCritChance && ` | Kryt: +${recipe.baseCritChance}%`}
                  </div>
                )}
                {recipe.type === 'armor' && (
                  <div>
                    Obrona: +{recipe.baseDefense}
                    {recipe.baseMana && ` | Mana: +${recipe.baseMana}`}
                    {recipe.baseCritChance && ` | Kryt: +${recipe.baseCritChance}%`}
                  </div>
                )}
                {recipe.type === 'accessory' && (
                  <div>
                    {recipe.baseMana && `Mana: +${recipe.baseMana}`}
                    {recipe.baseMana && recipe.baseCritChance && ' | '}
                    {recipe.baseCritChance && `Kryt: +${recipe.baseCritChance}%`}
                  </div>
                )}
              </div>
              {!tierUnlocked && (
                <div className="text-red-400 text-sm mb-2">
                  Wymaga piętro {craftingRecipes.indexOf(recipe) * 30}
                </div>
              )}
              <div className="mb-3">
                <div className="text-white text-sm mb-2">Materiały:</div>
                {Object.entries(recipe.materials).map(([material, amount]) => (
                  <div key={material} className={`text-xs ${
                    (gameState.materials[material] || 0) >= amount 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {material === 'wood' && '🪵'} 
                    {material === 'iron' && '⚙️'} 
                    {material === 'steel' && '🔩'}
                    {material === 'mithril' && '🌟'}
                    {material === 'adamant' && '💠'}
                    {material === 'gems' && '💎'}
                    {material === 'essence' && '✨'}
                    {materialNames[material]} {amount} ({gameState.materials[material] || 0})
                  </div>
                ))}
              </div>
              <button
                onClick={() => gameActions.craftItem(recipe)}
                disabled={!canCraft || !tierUnlocked}
                className={`w-full px-4 py-2 rounded text-sm font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  canCraft && tierUnlocked
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white animate-darkSoulsPulse border border-blue-400'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
                }`}
              >
                Wytwórz
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
