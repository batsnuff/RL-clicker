import React from 'react';

export default function SkillsTab({ gameState, gameActions }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-6 border-2 border-red-600 animate-darkSoulsRise">
      <h2 className="text-2xl font-bold text-white mb-6 text-center animate-darkSoulsGlow">⚡ Umiejętności</h2>
      
      {/* Poziom 1 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">📘 Poziom 1 - Podstawowe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise">
            <h4 className="font-bold text-white mb-2 animate-darkSoulsGlow">❤️ Leczenie</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.heal}</p>
            <p className="text-gray-300 text-sm mb-3">
              Leczy {30 * (gameState.skills.heal + 1)} HP za 10 MP
            </p>
            <div className="text-yellow-400 mb-3 font-bold">💰 {(gameState.skills.heal + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('heal')}
              disabled={gameState.gold < (gameState.skills.heal + 1) * 50}
              className={`w-full px-4 py-2 rounded text-sm font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                gameState.gold >= (gameState.skills.heal + 1) * 50
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-darkSoulsPulse border border-green-400'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
              }`}
            >
              Ulepsz
            </button>
          </div>

          {gameState.playerClass === 'mage' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise">
              <h4 className="font-bold text-white mb-2 animate-darkSoulsGlow">🔥 Kula Ognia</h4>
              <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.fireball}</p>
              <p className="text-gray-300 text-sm mb-3">
                Zadaje {25 * (gameState.skills.fireball + 1)} obrażeń za 15 MP
              </p>
              <div className="text-yellow-400 mb-3">💰 {(gameState.skills.fireball + 1) * 50} złota</div>
              <button
                onClick={() => gameActions.upgradeSkill('fireball')}
                disabled={gameState.gold < (gameState.skills.fireball + 1) * 50}
              className={`w-full px-4 py-2 rounded text-sm font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                gameState.gold >= (gameState.skills.fireball + 1) * 50
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white animate-darkSoulsPulse border border-red-400'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
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
              className={`w-full px-4 py-2 rounded text-sm font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                gameState.gold >= (gameState.skills.criticalStrike + 1) * 50
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white animate-darkSoulsPulse border border-orange-400'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
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
              <h4 className="font-bold text-white mb-2 animate-darkSoulsGlow">🏹 Potężny Strzał</h4>
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
              Aktywuje berserk na {10 + (gameState.skills.berserker * 5)} sekund z +{50 + (gameState.skills.berserker * 25)}% obrażeń
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
        <h3 className="text-lg font-bold text-white mb-4">📕 Poziom 21 - Użyteczne</h3>
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
            <h4 className="font-bold text-white mb-2">⚔️ Berserk Rage</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.berserkRage}</p>
            <p className="text-gray-300 text-sm mb-3">
              Berserk trwa +{2 * (gameState.skills.berserkRage + 1)} sekund dłużej
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.berserkRage + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('berserkRage')}
              disabled={gameState.gold < (gameState.skills.berserkRage + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.berserkRage + 1) * 50 && gameState.level >= 21
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">🧲 Magnes Materiałów</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.materialMagnet}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{20 * (gameState.skills.materialMagnet + 1)}% więcej materiałów z przeciwników
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.materialMagnet + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('materialMagnet')}
              disabled={gameState.gold < (gameState.skills.materialMagnet + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.materialMagnet + 1) * 50 && gameState.level >= 21
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">💰 Gorączka Złota</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.goldRush}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{15 * (gameState.skills.goldRush + 1)}% więcej złota z przeciwników
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.goldRush + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('goldRush')}
              disabled={gameState.gold < (gameState.skills.goldRush + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.goldRush + 1) * 50 && gameState.level >= 21
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">📈 Boost Doświadczenia</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.experienceBoost}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{10 * (gameState.skills.experienceBoost + 1)}% więcej doświadczenia
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.experienceBoost + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('experienceBoost')}
              disabled={gameState.gold < (gameState.skills.experienceBoost + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.experienceBoost + 1) * 50 && gameState.level >= 21
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">🎯 Mistrzostwo Krytyków</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.criticalMastery}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{3 * (gameState.skills.criticalMastery + 1)}% szansy na krytyk
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.criticalMastery + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('criticalMastery')}
              disabled={gameState.gold < (gameState.skills.criticalMastery + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.criticalMastery + 1) * 50 && gameState.level >= 21
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gameState.level < 21 ? 'Poziom 21' : 'Ulepsz'}
            </button>
          </div>

          <div className={`bg-gray-800 p-4 rounded-lg ${gameState.level < 21 ? 'opacity-50' : ''}`}>
            <h4 className="font-bold text-white mb-2">💚 Regeneracja Zdrowia</h4>
            <p className="text-gray-300 text-sm mb-2">Poziom: {gameState.skills.healthRegen}</p>
            <p className="text-gray-300 text-sm mb-3">
              +{1 * (gameState.skills.healthRegen + 1)} HP regeneracji co rundę
            </p>
            <div className="text-yellow-400 mb-3">💰 {(gameState.skills.healthRegen + 1) * 50} złota</div>
            <button
              onClick={() => gameActions.upgradeSkill('healthRegen')}
              disabled={gameState.gold < (gameState.skills.healthRegen + 1) * 50 || gameState.level < 21}
              className={`w-full px-4 py-2 rounded text-sm font-bold ${
                gameState.gold >= (gameState.skills.healthRegen + 1) * 50 && gameState.level >= 21
                  ? 'bg-green-600 hover:bg-green-700 text-white'
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
