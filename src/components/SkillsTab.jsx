import React from 'react';

export default function SkillsTab({ gameState, gameActions }) {
  return (
    <div className="bg-black bg-opacity-60 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">⚡ Umiejętności</h2>
      
      {/* Poziom 1 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">📘 Poziom 1 - Podstawowe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-2">❤️ Leczenie</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.heal}</p>
            <p className="text-gray-300 text-sm mb-3">
              Leczy {30 * (gameState.skills.heal + 1)} HP za 10 MP
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.heal + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('heal')}
              disabled={gameState.gold < (gameState.skills.heal + 1) * 50}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.heal + 1) * 50
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Ulepsz
            </button>
          </div>

          {gameState.playerClass === 'mage' && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-bold text-white mb-2">🔥 Kula Ognia</h4>
              <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.fireball}</p>
              <p className="text-gray-300 text-sm mb-3">
                Zadaje {25 * (gameState.skills.fireball + 1)} obrażeń za 15 MP
              </p>
              <div className="text-yellow-400 mb-3">💰 {(gameState.skills.fireball + 1) * 50} złota</div>
              <button
                onClick={() => gameActions.upgradeSkill('fireball')}
                disabled={gameState.gold < (gameState.skills.fireball + 1) * 50}
                className={`w-full px-4 py-2 rounded text-sm font-bold ${
                  gameState.gold >= (gameState.skills.fireball + 1) * 50
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Ulepsz
              </button>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-2">💥 Krytyczne Trafienie</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.criticalStrike}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{2 * (gameState.skills.criticalStrike + 1)}% szansy na krytyk
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.criticalStrike + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('criticalStrike')}
              disabled={gameState.gold < (gameState.skills.criticalStrike + 1) * 50}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.criticalStrike + 1) * 50
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Ulepsz
            </button>
          </div>
        </div>
      </div>

      {/* Poziom 7 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">📗 Poziom 7 - Zaawansowane</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 7 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">🛡️ Pancerz</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.armor}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{3 * (gameState.skills.armor + 1)} obrony pasywnie
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.armor + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('armor')}
              disabled={gameState.gold < (gameState.skills.armor + 1) * 50 || gameState.level < 7}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.armor + 1) * 50 && gameState.level >= 7
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 7 ? 'Poziom 7' : 'Ulepsz'}
            </button>
          </div>

          {gameState.playerClass === 'archer' && (
            <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 7 ? 'opacity-50' : ''}`}>
              <h4 className="font-bold text-white mb-2">🏹 Potężny Strzał</h4>
              <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.powerShot}</p>
              <p className="text-gray-300 text-sm mb-3">
                Zwiększa obrażenia o {50 * (gameState.skills.powerShot + 1)}% za 20 MP
              </p>
              <div className="text-yellow-400 mb-3">💰 {(gameState.skills.powerShot + 1) * 50} złota</div>
              <button
                onClick={() => gameActions.upgradeSkill('powerShot')}
                disabled={gameState.gold < (gameState.skills.powerShot + 1) * 50 || gameState.level < 7}
                className={`w-full px-4 py-2 rounded text-sm font-bold ${
                  gameState.gold >= (gameState.skills.powerShot + 1) * 50 && gameState.level >= 7
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {gameState.level < 7 ? 'Poziom 7' : 'Ulepsz'}
              </button>
            </div>
          )}

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 7 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">🔮 Mana Tarcza</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.manaShield}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{5 * (gameState.skills.manaShield + 1)} maksymalnej many
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.manaShield + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('manaShield')}
              disabled={gameState.gold < (gameState.skills.manaShield + 1) * 50 || gameState.level < 7}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.manaShield + 1) * 50 && gameState.level >= 7
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 7 ? 'Poziom 7' : 'Ulepsz'}
            </button>
          </div>
        </div>
      </div>

      {/* Poziom 14 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">📙 Poziom 14 - Eksperckie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 14 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">⚡ Błyskawica</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.lightning}</p>
            <p className="text-gray-300 text-sm mb-3">
              Zadaje {35 * (gameState.skills.lightning + 1)} obrażeń za 25 MP
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.lightning + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('lightning')}
              disabled={gameState.gold < (gameState.skills.lightning + 1) * 50 || gameState.level < 14}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.lightning + 1) * 50 && gameState.level >= 14
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 14 ? 'Poziom 14' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 14 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">💚 Regeneracja</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.regeneration}</p>
            <p className="text-gray-300 text-sm mb-3">
              Odzyskuje {2 * (gameState.skills.regeneration + 1)} HP/rundę
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.regeneration + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('regeneration')}
              disabled={gameState.gold < (gameState.skills.regeneration + 1) * 50 || gameState.level < 14}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.regeneration + 1) * 50 && gameState.level >= 14
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 14 ? 'Poziom 14' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 14 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">⚔️ Berserker</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.berserker}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{10 * (gameState.skills.berserker + 1)}% obrażeń przy mniej niż 30% HP
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.berserker + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('berserker')}
              disabled={gameState.gold < (gameState.skills.berserker + 1) * 50 || gameState.level < 14}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.berserker + 1) * 50 && gameState.level >= 14
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 14 ? 'Poziom 14' : 'Ulepsz'}
            </button>
          </div>
        </div>
      </div>

      {/* Poziom 21 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">📕 Poziom 21 - Mistrzowskie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">🤖 Auto-Klik</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.autoClick}</p>
            <p className="text-gray-300 text-sm mb-3">
              Automatyczne ataki co {2 - (gameState.skills.autoClick + 1) * 0.2}s
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.autoClick + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('autoClick')}
              disabled={gameState.gold < (gameState.skills.autoClick + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.autoClick + 1) * 50 && gameState.level >= 21
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">🌀 Teleport</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.teleport}</p>
            <p className="text-gray-300 text-sm mb-3">
              Omija {gameState.skills.teleport + 1} przeciwników
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.teleport + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('teleport')}
              disabled={gameState.gold < (gameState.skills.teleport + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.teleport + 1) * 50 && gameState.level >= 21
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">✨ Boska Moc</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.divine}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{5 * (gameState.skills.divine + 1)}% do wszystkich statystyk
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.divine + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('divine')}
              disabled={gameState.gold < (gameState.skills.divine + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.divine + 1) * 50 && gameState.level >= 21
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
