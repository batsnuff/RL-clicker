import React, { useState, useEffect } from 'react';
import { Sword, Shield, Heart, Zap, RotateCcw, TrendingUp, ShoppingCart, Backpack, Hammer, Star, Play, Pause } from 'lucide-react';
import { createGameActions } from './GameActions';
import ClassSelection from './ClassSelection';
import HighScores from './HighScores';
import PlayerStats from './PlayerStats';
import GameTab from './GameTab';

export default function RogueClickerGame() {
  const [gameState, setGameState] = useState({
    // Statystyki gracza
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    gold: 50,
    experience: 0,
    experienceToNext: 100,
    clickDamage: 10,
    defense: 0,
    critChance: 5,
    
    // Klasa postaci
    playerClass: null,
    
    // Aktualny przeciwnik
    enemy: null,
    
    // Stan gry
    floor: 1,
    gameOver: false,
    message: 'Witaj w Rogue Clicker! Wybierz klasę postaci.',
    
    // UI
    activeTab: 'game',
    
    // Prestige
    prestigeLevel: 0,
    prestigeBonus: 0, // % bonus do ataku
    
    // Auto-click
    autoClick: false,
    
    // Ekwipunek
    inventory: {
      weapon: null,
      armor: null,
      accessory: null
    },
    
    // Umiejętności
    skills: {
      // Podstawowe
      fireball: 0,
      heal: 0,
      criticalStrike: 0,
      // Poziom 7
      armor: 0,
      powerShot: 0,
      manaShield: 0,
      // Poziom 14
      lightning: 0,
      regeneration: 0,
      berserker: 0,
      // Poziom 21
      autoClick: 0,
      teleport: 0,
      divine: 0
    },
    
    // Materiały
    materials: {
      wood: 0,
      iron: 0,
      steel: 0,
      mithril: 0,
      adamant: 0,
      gems: 0,
      essence: 0
    },
    
    // High scores
    highScores: []
  });

  // Game data
  const classes = {
    warrior: { name: 'Wojownik', health: 120, mana: 30, damage: 15, defense: 5 },
    mage: { name: 'Mag', health: 80, mana: 100, damage: 8, defense: 2 },
    archer: { name: 'Łucznik', health: 100, mana: 50, damage: 12, defense: 3 }
  };

  const enemies = [
    { name: 'Goblin', baseHealth: 40, goldReward: 25, expReward: 10, type: 'normal' },
    { name: 'Orc', baseHealth: 70, goldReward: 40, expReward: 15, type: 'normal' },
    { name: 'Dark Wolf', baseHealth: 60, goldReward: 35, expReward: 12, type: 'beast' },
    { name: 'Skeleton', baseHealth: 80, goldReward: 50, expReward: 18, type: 'undead' },
    { name: 'Basilisk', baseHealth: 120, goldReward: 80, expReward: 30, type: 'basilisk' },
    { name: 'Bat', baseHealth: 30, goldReward: 20, expReward: 8, type: 'bat' },
    { name: 'Snake', baseHealth: 45, goldReward: 30, expReward: 12, type: 'snake' },
    { name: 'Ghost', baseHealth: 100, goldReward: 70, expReward: 25, type: 'ghost' },
    { name: 'Troll Boss', baseHealth: 200, goldReward: 200, expReward: 100, type: 'boss' },
    { name: 'Dragon', baseHealth: 400, goldReward: 400, expReward: 200, type: 'boss' }
  ];

  const shopItems = [
    { id: 'health_potion', name: 'Mikstura Zdrowia', cost: 20, type: 'consumable', effect: 'health', value: 50 },
    { id: 'mana_potion', name: 'Mikstura Many', cost: 15, type: 'consumable', effect: 'mana', value: 30 },
    { id: 'strength_potion', name: 'Mikstura Siły', cost: 100, type: 'consumable', effect: 'damage', value: 5 },
    { id: 'defense_potion', name: 'Mikstura Obrony', cost: 100, type: 'consumable', effect: 'defense', value: 3 }
  ];

  const events = [
    { id: 'treasure', name: 'Skarbiec!', description: 'Znalazłeś skrzynię ze skarbem!', reward: { gold: 150 } },
    { id: 'trap', name: 'Pułapka!', description: 'Wpadłeś w pułapkę!', damage: 20 },
    { id: 'merchant', name: 'Handlarz', description: 'Spotkałeś wędrownego handlarza!', discount: 20 },
    { id: 'healing_fountain', name: 'Źródło Uzdrowienia', description: 'Znajujesz magiczne źródło!', heal: 50 }
  ];

  // Materiały tier zależne od stage'a
  const getMaterialTier = (floor) => {
    if (floor < 30) return 'wood';
    if (floor < 60) return 'iron';
    if (floor < 90) return 'steel';
    if (floor < 120) return 'mithril';
    return 'adamant';
  };

  const materialNames = {
    wood: 'Drewno',
    iron: 'Żelazo', 
    steel: 'Stal',
    mithril: 'Mithril',
    adamant: 'Adamant'
  };

  const craftingRecipes = [
    {
      id: 'wooden_sword',
      name: 'Drewniany Miecz',
      tier: 'wood',
      materials: { wood: 5 },
      baseDamage: 8
    },
    {
      id: 'iron_sword',
      name: 'Żelazny Miecz', 
      tier: 'iron',
      materials: { iron: 3, wood: 2 },
      baseDamage: 15
    },
    {
      id: 'steel_sword',
      name: 'Stalowy Miecz',
      tier: 'steel', 
      materials: { steel: 3, iron: 2 },
      baseDamage: 25
    },
    {
      id: 'mithril_sword',
      name: 'Mithrilowy Miecz',
      tier: 'mithril',
      materials: { mithril: 2, steel: 3 },
      baseDamage: 40
    },
    {
      id: 'adamant_sword',
      name: 'Adamantowy Miecz',
      tier: 'adamant',
      materials: { adamant: 2, mithril: 2 },
      baseDamage: 60
    }
  ];

  // Generowanie losowego bonusu dla craftowanego itemu
  const generateRandomBonus = () => {
    const bonuses = [
      { name: 'Krytyka', type: 'critChance', value: Math.floor(Math.random() * 5) + 3 },
      { name: 'Siły', type: 'damage', value: Math.floor(Math.random() * 8) + 5 },
      { name: 'Obrony', type: 'defense', value: Math.floor(Math.random() * 6) + 3 },
      { name: 'Many', type: 'mana', value: Math.floor(Math.random() * 15) + 10 },
      { name: 'Zdrowia', type: 'health', value: Math.floor(Math.random() * 20) + 15 }
    ];
    
    return bonuses[Math.floor(Math.random() * bonuses.length)];
  };

  // Generowanie nowego przeciwnika
  const generateEnemy = (floor) => {
    // Losowy event co 5 piętro
    if (floor % 5 === 0 && Math.random() < 0.3) {
      const event = events[Math.floor(Math.random() * events.length)];
      return { type: 'event', ...event };
    }

    const enemyIndex = Math.min(Math.floor((floor - 1) / 5), enemies.length - 1);
    const baseEnemy = enemies[enemyIndex];
    const level = Math.floor((floor + 4) / 5);
    
    const health = baseEnemy.baseHealth + (level - 1) * 30;
    
    return {
      type: 'enemy',
      name: baseEnemy.name,
      health: health,
      maxHealth: health,
      level: level,
      enemyType: baseEnemy.type,
      reward: {
        gold: baseEnemy.goldReward + (level - 1) * 3,
        exp: baseEnemy.expReward + (level - 1) * 8,
        materials: generateMaterialReward(floor)
      }
    };
  };

  const generateMaterialReward = (floor) => {
    const materials = {};
    const tier = getMaterialTier(floor);
    
    // Główny materiał tego tieru
    if (Math.random() < 0.4) materials[tier] = Math.floor(Math.random() * 3) + 1;
    
    // Poprzedni tier (łatwiejszy do zdobycia)
    if (tier !== 'wood') {
      const prevTiers = ['wood', 'iron', 'steel', 'mithril'];
      const prevTier = prevTiers[prevTiers.indexOf(tier) - 1];
      if (Math.random() < 0.6) materials[prevTier] = Math.floor(Math.random() * 2) + 1;
    }
    
    // Specjalne materiały
    if (Math.random() < 0.1) materials.gems = 1;
    if (Math.random() < 0.05) materials.essence = 1;
    
    return materials;
  };

  // Obliczanie prestige bonus
  const calculatePrestigeBonus = (floor) => {
    if (floor >= 100) return 25;
    if (floor >= 75) return 20;
    if (floor >= 50) return 15;
    return 0;
  };

  // Zapisanie high score
  const saveHighScore = (level, floor, prestigeLevel) => {
    const score = { level, floor, prestigeLevel, date: new Date().toLocaleDateString() };
    setGameState(prev => {
      const newScores = [...prev.highScores, score]
        .sort((a, b) => b.floor - a.floor)
        .slice(0, 5);
      return { ...prev, highScores: newScores };
    });
  };

  // Create game actions
  const gameActions = createGameActions(
    setGameState, gameState, classes, enemies, events, shopItems, 
    craftingRecipes, materialNames, getMaterialTier, generateRandomBonus, 
    generateEnemy, generateMaterialReward, calculatePrestigeBonus, saveHighScore
  );

  // Auto-click effect
  useEffect(() => {
    if (gameState.autoClick && gameState.skills.autoClick > 0 && gameState.enemy && gameState.enemy.type === 'enemy') {
      const interval = setInterval(() => {
        gameActions.attackEnemy();
      }, 2000 - (gameState.skills.autoClick * 200)); // Szybszy co poziom
      
      return () => clearInterval(interval);
    }
  }, [gameState.autoClick, gameState.skills.autoClick, gameState.enemy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🗡️ Rogue Clicker RPG 🛡️
        </h1>
        
        {/* High Scores */}
        {!gameState.playerClass && <HighScores highScores={gameState.highScores} />}
        
        {/* Wybór klasy */}
        {!gameState.playerClass && (
          <ClassSelection 
            classes={classes} 
            onSelectClass={gameActions.selectClass} 
          />
        )}

        {gameState.playerClass && (
          <>
            {/* Nawigacja */}
            <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { id: 'game', name: 'Gra', icon: Sword },
                  { id: 'shop', name: 'Sklep', icon: ShoppingCart },
                  { id: 'inventory', name: 'Ekwipunek', icon: Backpack },
                  { id: 'skills', name: 'Umiejętności', icon: Zap },
                  { id: 'craft', name: 'Craft', icon: Hammer }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setGameState(prev => ({ ...prev, activeTab: tab.id }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        gameState.activeTab === tab.id 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statystyki gracza */}
            <PlayerStats 
              gameState={gameState} 
              onToggleAutoClick={gameActions.toggleAutoClick} 
            />

            {/* Komunikaty */}
            <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
              <div className="text-white text-center">{gameState.message}</div>
            </div>

            {/* Zawartość zakładek */}
            {gameState.activeTab === 'game' && (
              <GameTab gameState={gameState} gameActions={gameActions} />
            )}

            {/* Sklep */}
            {gameState.activeTab === 'shop' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">🏪 Sklep Mikstur</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {shopItems.map(item => (
                    <div key={item.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                      <h3 className="font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">
                        +{item.value} {item.effect === 'health' ? 'HP' : 
                                      item.effect === 'mana' ? 'MP' :
                                      item.effect === 'damage' ? 'Siły' : 'Obrony'}
                      </p>
                      <div className="text-yellow-400 mb-3">💰 {item.cost} złota</div>
                      <button
                        onClick={() => gameActions.buyItem(item)}
                        disabled={gameState.gold < item.cost}
                        className={`w-full px-4 py-2 rounded text-sm font-bold ${
                          gameState.gold >= item.cost
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Kup
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ekwipunek */}
            {gameState.activeTab === 'inventory' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">🎒 Ekwipunek</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-3">⚔️ Broń</h3>
                    {gameState.inventory.weapon ? (
                      <div className="text-white">
                        <p className="font-bold">{gameState.inventory.weapon.name}</p>
                        <p className="text-sm text-gray-300">Atak: +{gameState.inventory.weapon.damage}</p>
                        {gameState.inventory.weapon.bonus && (
                          <p className="text-sm text-green-400">
                            Bonus: +{gameState.inventory.weapon.bonus.value} {gameState.inventory.weapon.bonus.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400">Brak</p>
                    )}
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-3">🛡️ Zbroja</h3>
                    {gameState.inventory.armor ? (
                      <div className="text-white">
                        <p className="font-bold">{gameState.inventory.armor.name}</p>
                        <p className="text-sm text-gray-300">Obrona: +{gameState.inventory.armor.defense}</p>
                        {gameState.inventory.armor.bonus && (
                          <p className="text-sm text-green-400">
                            Bonus: +{gameState.inventory.armor.bonus.value} {gameState.inventory.armor.bonus.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400">Brak</p>
                    )}
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-3">💍 Akcesoria</h3>
                    {gameState.inventory.accessory ? (
                      <div className="text-white">
                        <p className="font-bold">{gameState.inventory.accessory.name}</p>
                        <p className="text-sm text-gray-300">
                          {gameState.inventory.accessory.mana && `Mana: +${gameState.inventory.accessory.mana}`}
                          {gameState.inventory.accessory.critChance && ` Kryt: +${gameState.inventory.accessory.critChance}%`}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400">Brak</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Umiejętności - Simplified version */}
            {gameState.activeTab === 'skills' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">⚡ Umiejętności</h2>
                <div className="text-white text-center">
                  <p>System umiejętności w trakcie implementacji...</p>
                  <p className="text-sm text-gray-400 mt-2">Wkrótce dostępne!</p>
                </div>
              </div>
            )}

            {/* Craftowanie - Simplified version */}
            {gameState.activeTab === 'craft' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">🔨 Craftowanie</h2>
                <div className="text-white text-center">
                  <p>System craftowania w trakcie implementacji...</p>
                  <p className="text-sm text-gray-400 mt-2">Wkrótce dostępne!</p>
                </div>
              </div>
            )}

            {/* Prestige button */}
            {gameState.level >= 50 && !gameState.gameOver && (
              <div className="bg-black bg-opacity-60 rounded-lg p-6 mt-6 text-center border-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">⭐ Prestige Dostępne!</h2>
                <p className="text-white mb-4">
                  Zacznij od nowa z bonusami +{gameState.prestigeLevel + 1} do wszystkich statystyk!
                </p>
                <p className="text-green-400 mb-4">
                  Bonus do ataku: +{calculatePrestigeBonus(gameState.floor)}% (na podstawie piętra {gameState.floor})
                </p>
                <button
                  onClick={gameActions.prestige}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-bold text-lg"
                >
                  <Star className="inline mr-2" size={20} />
                  Prestige ({gameState.prestigeLevel + 1}) +{calculatePrestigeBonus(gameState.floor)}% ATK
                </button>
              </div>
            )}

            {/* Reset button */}
            <div className="text-center mt-6">
              <button
                onClick={gameActions.resetGame}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                <RotateCcw className="inline mr-2" size={16} />
                Reset Gry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
