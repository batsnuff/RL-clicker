import React from 'react';
import { Heart, Zap, TrendingUp, Sword, Shield } from 'lucide-react';

export default function PlayerStats({ gameState, onToggleAutoClick, classes }) {
  // Calculate total stats including equipment bonuses and prestige
  const getTotalStats = () => {
    let totalDamage = gameState.clickDamage;
    let totalDefense = gameState.defense;
    let totalMaxHealth = gameState.maxHealth;
    let totalMaxMana = gameState.maxMana;
    let totalCritChance = gameState.critChance;

    // Apply prestige bonuses
    if (gameState.prestigeLevel > 0) {
      totalDamage = Math.floor(totalDamage * (1 + gameState.prestigeBonus / 100));
      totalDefense += gameState.prestigeLevel;
      totalMaxHealth += gameState.prestigeLevel * 20;
      totalMaxMana += gameState.prestigeLevel * 10;
    }

    // Add weapon bonuses
    if (gameState.inventory.weapon) {
      totalDamage += gameState.inventory.weapon.damage || 0;
      // Bonus z ulepszeń broni (atak w skali 5 ulepszeń)
      if (gameState.inventory.weapon.upgradeLevel > 0) {
        totalDamage += gameState.inventory.weapon.upgradeLevel * 5;
      }
      if (gameState.inventory.weapon.bonus) {
        if (gameState.inventory.weapon.bonus.damage) {
          totalDamage += gameState.inventory.weapon.bonus.damage;
        }
        if (gameState.inventory.weapon.bonus.critChance) {
          totalCritChance += gameState.inventory.weapon.bonus.critChance;
        }
        if (gameState.inventory.weapon.bonus.health) {
          totalMaxHealth += gameState.inventory.weapon.bonus.health;
        }
        if (gameState.inventory.weapon.bonus.mana) {
          totalMaxMana += gameState.inventory.weapon.bonus.mana;
        }
      }
    }
    
    // Pasywne bonusy z ascended broni
    if (gameState.passiveBonuses && gameState.passiveBonuses.weaponDamage > 0) {
      totalDamage += gameState.passiveBonuses.weaponDamage;
    }

    // Add armor bonuses
    if (gameState.inventory.armor) {
      totalDefense += gameState.inventory.armor.defense || 0;
      // Bonus z ulepszeń zbroi (obrona w skali 5 ulepszeń)
      if (gameState.inventory.armor.upgradeLevel > 0) {
        totalDefense += gameState.inventory.armor.upgradeLevel * 5;
      }
      if (gameState.inventory.armor.bonus) {
        if (gameState.inventory.armor.bonus.defense) {
          totalDefense += gameState.inventory.armor.bonus.defense;
        }
        if (gameState.inventory.armor.bonus.health) {
          totalMaxHealth += gameState.inventory.armor.bonus.health;
        }
        if (gameState.inventory.armor.bonus.mana) {
          totalMaxMana += gameState.inventory.armor.bonus.mana;
        }
      }
    }
    
    // Pasywne bonusy z ascended zbroi
    if (gameState.passiveBonuses && gameState.passiveBonuses.armorDefense > 0) {
      totalDefense += gameState.passiveBonuses.armorDefense;
    }

    // Add accessory bonuses
    if (gameState.inventory.accessory) {
      if (gameState.inventory.accessory.mana) {
        totalMaxMana += gameState.inventory.accessory.mana;
      }
      if (gameState.inventory.accessory.critChance) {
        totalCritChance += gameState.inventory.accessory.critChance;
      }
      // Note: Wampiryzm (HP w skali 5 ulepszeń) jest efektem bojowym, nie statystyką
      // Vampirism healing = 10% of damage + (upgradeLevel * 5) HP per attack
    }

    return {
      damage: totalDamage,
      defense: totalDefense,
      maxHealth: totalMaxHealth,
      maxMana: totalMaxMana,
      critChance: totalCritChance
    };
  };

  const totalStats = getTotalStats();

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-6 mb-6">
      {/* Nazwa postaci i klasa */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">{gameState.playerName}</h3>
        <p className="text-sm text-gray-300">{gameState.playerClass && classes[gameState.playerClass]?.name}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-yellow-400" size={16} />
          <span>
            {gameState.level} level
            {gameState.prestigeLevel > 0 && (
              <span className="text-red-400"> {gameState.prestigeLevel}💀</span>
            )}
            / szczelina {gameState.floor}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="text-red-400" size={16} />
          <span>{gameState.health}/{totalStats.maxHealth}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="text-blue-400" size={16} />
          <span>{gameState.mana}/{totalStats.maxMana}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">💰</span>
          <span>{gameState.gold}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sword className="text-orange-400" size={16} />
          <span>{totalStats.damage}{gameState.prestigeBonus > 0 && <span className="text-green-400">+{gameState.prestigeBonus}%</span>}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-gray-400" size={16} />
          <span>{totalStats.defense}</span>
        </div>
      </div>
      
      {/* Auto-click status */}
      {gameState.skills.autoClick > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-white text-sm">
            🤖 Auto-klik: {gameState.autoClick ? 'WŁĄCZONY' : 'WYŁĄCZONY'}
          </div>
          <button
            onClick={onToggleAutoClick}
            className={`px-3 py-1 rounded text-xs ${
              gameState.autoClick 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {gameState.autoClick ? '⏸️' : '▶️'}
          </button>
        </div>
      )}
      
      {/* Pasek doświadczenia */}
      <div className="mt-4">
        <div className="flex justify-between text-white text-xs mb-1">
          <span>Doświadczenie</span>
          <span>{gameState.experience}/{Math.min(gameState.experienceToNext, 10000)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((gameState.experience / gameState.experienceToNext) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Materiały */}
      <div className="mt-4">
        <div className="text-white text-sm mb-2">Materiały:</div>
        <div className="grid grid-cols-7 gap-2 text-white text-xs">
          <div>🪵 {gameState.materials.wood || 0}</div>
          <div>⚙️ {gameState.materials.iron || 0}</div>
          <div>🔩 {gameState.materials.steel || 0}</div>
          <div>🌟 {gameState.materials.mithril || 0}</div>
          <div>💠 {gameState.materials.adamant || 0}</div>
          <div>💎 {gameState.materials.gems || 0}</div>
          <div>✨ {gameState.materials.essence || 0}</div>
        </div>
      </div>

      {/* Pasywne bonusy z ascended ekwipunku */}
      {gameState.passiveBonuses && (
        (gameState.passiveBonuses.weaponDamage > 0 || 
         gameState.passiveBonuses.armorDefense > 0 || 
         gameState.passiveBonuses.accessoryVampirism > 0) && (
          <div className="mt-4">
            <div className="text-white text-sm mb-2">🌟 Pasywne bonusy (Ascend):</div>
            <div className="grid grid-cols-3 gap-2 text-white text-xs">
              {gameState.passiveBonuses.weaponDamage > 0 && (
                <div className="bg-red-900 bg-opacity-50 p-2 rounded">
                  ⚔️ +{gameState.passiveBonuses.weaponDamage} ataku
                </div>
              )}
              {gameState.passiveBonuses.armorDefense > 0 && (
                <div className="bg-blue-900 bg-opacity-50 p-2 rounded">
                  🛡️ +{gameState.passiveBonuses.armorDefense} obrony
                </div>
              )}
              {gameState.passiveBonuses.accessoryVampirism > 0 && (
                <div className="bg-purple-900 bg-opacity-50 p-2 rounded">
                  🩸 +{gameState.passiveBonuses.accessoryVampirism} wampiryzmu
                </div>
              )}
            </div>
            <div className="text-gray-400 text-xs mt-2">
              Ascended: {gameState.passiveBonuses.ascendedWeapons} broni, {gameState.passiveBonuses.ascendedArmors} zbroi, {gameState.passiveBonuses.ascendedAccessories} akcesoriów
            </div>
          </div>
        )
      )}
    </div>
  );
}
