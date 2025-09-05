import React, { useState, useEffect } from 'react';
import { Sword, Shield, Heart, Zap, RotateCcw, TrendingUp, ShoppingCart, Backpack, Hammer, Star, Play, Pause } from 'lucide-react';
import { createGameActions } from './GameActions';
import ClassSelection from './ClassSelection';
import HighScores from './HighScores';
import PlayerStats from './PlayerStats';
import GameTab from './GameTab';
import SkillsTab from './SkillsTab';
import CraftingTab from './CraftingTab';
import LoadingScreen from './LoadingScreen';
import LevelUpNotification from './LevelUpNotification';
import HelpModal from './HelpModal';

export default function RogueClickerGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [levelUp, setLevelUp] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [craftingCategory, setCraftingCategory] = useState('weapon');
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
    playerName: '',
    
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
    warrior: { name: 'Kontestator', health: 120, mana: 30, damage: 15, defense: 5 },
    mage: { name: 'Augur', health: 80, mana: 100, damage: 8, defense: 2 },
    archer: { name: 'Husarz', health: 100, mana: 50, damage: 12, defense: 3 }
  };

  const enemies = [
    { name: 'Goblin', baseHealth: 40, goldReward: 5, expReward: 10, type: 'normal' },
    { name: 'Orc', baseHealth: 70, goldReward: 8, expReward: 15, type: 'normal' },
    { name: 'Dark Wolf', baseHealth: 60, goldReward: 10, expReward: 12, type: 'beast' },
    { name: 'Skeleton', baseHealth: 80, goldReward: 12, expReward: 18, type: 'undead' },
    { name: 'Troll Boss', baseHealth: 200, goldReward: 50, expReward: 100, type: 'boss' },
    { name: 'Dragon', baseHealth: 400, goldReward: 100, expReward: 200, type: 'boss' }
  ];

  const shopItems = [
    { id: 'health_potion', name: 'Mikstura Zdrowia', cost: 20, type: 'consumable', effect: 'health', value: 50 },
    { id: 'mana_potion', name: 'Mikstura Many', cost: 15, type: 'consumable', effect: 'mana', value: 30 },
    { id: 'strength_potion', name: 'Mikstura Siły', cost: 100, type: 'consumable', effect: 'damage', value: 5 },
    { id: 'defense_potion', name: 'Mikstura Obrony', cost: 100, type: 'consumable', effect: 'defense', value: 3 }
  ];

  const events = [
    { id: 'treasure', name: 'Skarbiec!', description: 'Znalazłeś skrzynię ze skarbem!', reward: { gold: 50 } },
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
    adamant: 'Adamant',
    gems: 'Klejnoty',
    essence: 'Esencja'
  };

  const craftingRecipes = [
    // BROŃE - MIECZE (Wojownik)
    {
      id: 'wooden_sword',
      name: 'Drewniany Miecz',
      type: 'weapon',
      weaponClass: 'warrior',
      tier: 'wood',
      materials: { wood: 5 },
      baseDamage: 8
    },
    {
      id: 'iron_sword',
      name: 'Żelazny Miecz', 
      type: 'weapon',
      weaponClass: 'warrior',
      tier: 'iron',
      materials: { iron: 3, wood: 2 },
      baseDamage: 15
    },
    {
      id: 'steel_sword',
      name: 'Stalowy Miecz',
      type: 'weapon',
      weaponClass: 'warrior',
      tier: 'steel', 
      materials: { steel: 3, iron: 2 },
      baseDamage: 25
    },
    {
      id: 'mithril_sword',
      name: 'Mithrilowy Miecz',
      type: 'weapon',
      weaponClass: 'warrior',
      tier: 'mithril',
      materials: { mithril: 2, steel: 3 },
      baseDamage: 40
    },
    {
      id: 'adamant_sword',
      name: 'Adamantowy Miecz',
      type: 'weapon',
      weaponClass: 'warrior',
      tier: 'adamant',
      materials: { adamant: 2, mithril: 2 },
      baseDamage: 60
    },
    
    // BROŃE - RÓŻDŻKI (Mag)
    {
      id: 'wooden_wand',
      name: 'Drewniana Różdżka',
      type: 'weapon',
      weaponClass: 'mage',
      tier: 'wood',
      materials: { wood: 5, gems: 1 },
      baseDamage: 6,
      baseMana: 5
    },
    {
      id: 'iron_wand',
      name: 'Żelazna Różdżka', 
      type: 'weapon',
      weaponClass: 'mage',
      tier: 'iron',
      materials: { iron: 3, wood: 2, gems: 1 },
      baseDamage: 12,
      baseMana: 10
    },
    {
      id: 'steel_wand',
      name: 'Stalowa Różdżka',
      type: 'weapon',
      weaponClass: 'mage',
      tier: 'steel', 
      materials: { steel: 3, iron: 2, gems: 2 },
      baseDamage: 20,
      baseMana: 18
    },
    {
      id: 'mithril_wand',
      name: 'Mithrilowa Różdżka',
      type: 'weapon',
      weaponClass: 'mage',
      tier: 'mithril',
      materials: { mithril: 2, steel: 3, gems: 3 },
      baseDamage: 32,
      baseMana: 30
    },
    {
      id: 'adamant_wand',
      name: 'Adamantowa Różdżka',
      type: 'weapon',
      weaponClass: 'mage',
      tier: 'adamant',
      materials: { adamant: 2, mithril: 2, gems: 4 },
      baseDamage: 50,
      baseMana: 45
    },
    
    // BROŃE - ŁUKI (Łucznik)
    {
      id: 'wooden_bow',
      name: 'Drewniany Łuk',
      type: 'weapon',
      weaponClass: 'archer',
      tier: 'wood',
      materials: { wood: 6 },
      baseDamage: 7,
      baseCritChance: 3
    },
    {
      id: 'iron_bow',
      name: 'Żelazny Łuk', 
      type: 'weapon',
      weaponClass: 'archer',
      tier: 'iron',
      materials: { iron: 4, wood: 3 },
      baseDamage: 14,
      baseCritChance: 5
    },
    {
      id: 'steel_bow',
      name: 'Stalowy Łuk',
      type: 'weapon',
      weaponClass: 'archer',
      tier: 'steel', 
      materials: { steel: 4, iron: 3 },
      baseDamage: 22,
      baseCritChance: 8
    },
    {
      id: 'mithril_bow',
      name: 'Mithrilowy Łuk',
      type: 'weapon',
      weaponClass: 'archer',
      tier: 'mithril',
      materials: { mithril: 3, steel: 4 },
      baseDamage: 35,
      baseCritChance: 12
    },
    {
      id: 'adamant_bow',
      name: 'Adamantowy Łuk',
      type: 'weapon',
      weaponClass: 'archer',
      tier: 'adamant',
      materials: { adamant: 3, mithril: 3 },
      baseDamage: 55,
      baseCritChance: 18
    },
    
    // ZBROJE - CIĘŻKIE (Kontestator)
    {
      id: 'leather_armor',
      name: 'Skórzana Zbroja',
      type: 'armor',
      armorClass: 'warrior',
      tier: 'wood',
      materials: { wood: 8 },
      baseDefense: 5
    },
    {
      id: 'chain_armor',
      name: 'Kolczuga',
      type: 'armor',
      armorClass: 'warrior',
      tier: 'iron',
      materials: { iron: 5, wood: 3 },
      baseDefense: 12
    },
    {
      id: 'plate_armor',
      name: 'Płytowa Zbroja',
      type: 'armor',
      armorClass: 'warrior',
      tier: 'steel',
      materials: { steel: 5, iron: 3 },
      baseDefense: 20
    },
    {
      id: 'mithril_armor',
      name: 'Mithrilowa Zbroja',
      type: 'armor',
      armorClass: 'warrior',
      tier: 'mithril',
      materials: { mithril: 3, steel: 4 },
      baseDefense: 32
    },
    {
      id: 'adamant_armor',
      name: 'Adamantowa Zbroja',
      type: 'armor',
      armorClass: 'warrior',
      tier: 'adamant',
      materials: { adamant: 3, mithril: 3 },
      baseDefense: 50
    },
    
    // ZBROJE - LEKKIE (Husarz)
    {
      id: 'leather_vest',
      name: 'Skórzana Kamizelka',
      type: 'armor',
      armorClass: 'archer',
      tier: 'wood',
      materials: { wood: 6 },
      baseDefense: 3,
      baseCritChance: 2
    },
    {
      id: 'studded_leather',
      name: 'Skórzana Zbroja z Gwoździami',
      type: 'armor',
      armorClass: 'archer',
      tier: 'iron',
      materials: { iron: 3, wood: 4 },
      baseDefense: 8,
      baseCritChance: 4
    },
    {
      id: 'scale_armor',
      name: 'Zbroja Łuskowa',
      type: 'armor',
      armorClass: 'archer',
      tier: 'steel',
      materials: { steel: 4, iron: 2 },
      baseDefense: 14,
      baseCritChance: 6
    },
    {
      id: 'mithril_vest',
      name: 'Mithrilowa Kamizelka',
      type: 'armor',
      armorClass: 'archer',
      tier: 'mithril',
      materials: { mithril: 2, steel: 3 },
      baseDefense: 22,
      baseCritChance: 8
    },
    {
      id: 'adamant_vest',
      name: 'Adamantowa Kamizelka',
      type: 'armor',
      armorClass: 'archer',
      tier: 'adamant',
      materials: { adamant: 2, mithril: 2 },
      baseDefense: 35,
      baseCritChance: 12
    },
    
    // ZBROJE - SZATY (Augur)
    {
      id: 'cloth_robes',
      name: 'Szaty Płócienne',
      type: 'armor',
      armorClass: 'mage',
      tier: 'wood',
      materials: { wood: 4, gems: 1 },
      baseDefense: 2,
      baseMana: 8
    },
    {
      id: 'silk_robes',
      name: 'Szaty Jedwabne',
      type: 'armor',
      armorClass: 'mage',
      tier: 'iron',
      materials: { iron: 2, wood: 3, gems: 1 },
      baseDefense: 5,
      baseMana: 15
    },
    {
      id: 'enchanted_robes',
      name: 'Zaklęte Szaty',
      type: 'armor',
      armorClass: 'mage',
      tier: 'steel',
      materials: { steel: 3, iron: 2, gems: 2 },
      baseDefense: 9,
      baseMana: 25
    },
    {
      id: 'mithril_robes',
      name: 'Mithrilowe Szaty',
      type: 'armor',
      armorClass: 'mage',
      tier: 'mithril',
      materials: { mithril: 2, steel: 2, gems: 3 },
      baseDefense: 15,
      baseMana: 40
    },
    {
      id: 'adamant_robes',
      name: 'Adamantowe Szaty',
      type: 'armor',
      armorClass: 'mage',
      tier: 'adamant',
      materials: { adamant: 2, mithril: 2, gems: 4 },
      baseDefense: 24,
      baseMana: 60
    },
    
    // AKCESORIA
    {
      id: 'wooden_ring',
      name: 'Drewniany Pierścień',
      type: 'accessory',
      tier: 'wood',
      materials: { wood: 3, gems: 1 },
      baseMana: 10,
      baseCritChance: 2
    },
    {
      id: 'iron_amulet',
      name: 'Żelazny Amulet',
      type: 'accessory',
      tier: 'iron',
      materials: { iron: 2, gems: 2 },
      baseMana: 20,
      baseCritChance: 4
    },
    {
      id: 'steel_bracelet',
      name: 'Stalowa Bransoleta',
      type: 'accessory',
      tier: 'steel',
      materials: { steel: 2, gems: 3 },
      baseMana: 35,
      baseCritChance: 6
    },
    {
      id: 'mithril_crown',
      name: 'Mithrilowa Korona',
      type: 'accessory',
      tier: 'mithril',
      materials: { mithril: 2, gems: 4 },
      baseMana: 55,
      baseCritChance: 8
    },
    {
      id: 'adamant_orb',
      name: 'Adamantowa Kula',
      type: 'accessory',
      tier: 'adamant',
      materials: { adamant: 2, gems: 5 },
      baseMana: 80,
      baseCritChance: 12
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
    generateEnemy, generateMaterialReward, calculatePrestigeBonus, saveHighScore,
    setLevelUp
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

  // Obsługa zakończenia ładowania
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Obsługa zakończenia level up
  const handleLevelUpClose = () => {
    setLevelUp(null);
  };

  // Pokazuj ekran ładowania
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Level Up Notification */}
      <LevelUpNotification 
        levelUp={levelUp} 
        onClose={handleLevelUpClose} 
      />
      
      {/* Help Modal */}
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
      
      <div className="max-w-6xl mx-auto">
        
        {/* High Scores */}
        {!gameState.playerClass && <HighScores highScores={gameState.highScores} />}
        
        {/* Wybór klasy */}
        {!gameState.playerClass && (
          <>
            <ClassSelection 
              classes={classes} 
              onSelectClass={gameActions.selectClass} 
            />
            
            {/* Przycisk wczytania gry */}
            <div className="text-center mt-6">
              <button
                onClick={gameActions.loadGame}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                <Shield className="inline mr-2" size={16} />
                Wczytaj zapisaną grę
              </button>
            </div>
          </>
        )}

        {gameState.playerClass && (
          <>
            {/* Nawigacja */}
            <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-5">
              <div className="flex justify-between items-center">
                {/* Przycisk Reset - skrajnie po lewej */}
                <button
                  onClick={gameActions.resetGame}
                  className="bg-red-600 hover:bg-red-700 text-white px-1 py-0.5 rounded-lg flex items-center gap-0.5 transition-colors text-xs"
                >
                  <RotateCcw size={8} />
                  Reset Gry
                </button>

                {/* Główne przyciski nawigacji - po środku */}
                <div className="flex gap-3">
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
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
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

                {/* Przycisk Zapisz i wyjdź - skrajnie po prawej */}
                <button
                  onClick={gameActions.saveAndExit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-0.5 rounded-lg flex items-center gap-0.5 transition-colors text-xs"
                >
                  <Shield size={8} />
                  Zapisz i wyjdź
                </button>
              </div>
            </div>

            {/* Statystyki gracza */}
            <PlayerStats 
              gameState={gameState} 
              onToggleAutoClick={gameActions.toggleAutoClick}
              classes={classes}
            />

            {/* Walka z przeciwnikiem - tylko w zakładce game */}
            {gameState.activeTab === 'game' && gameState.enemy && gameState.enemy.type === 'enemy' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-8 mb-2 border-2 border-red-500 text-center relative">
                {/* Przycisk Jak grać? - lewy górny róg */}
                <button
                  onClick={() => setShowHelp(true)}
                  className="absolute top-2 left-2 bg-gray-600 hover:bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
                  title="Jak grać?"
                >
                  ?
                </button>
                
                <div className="monster-header mb-4">
                  <h3 className="monster-name text-2xl font-bold text-white">
                    {gameState.enemy.name} (Lv.{gameState.enemy.level})
                  </h3>
                  <div className="floor-info">
                    <h4 className="text-xl font-bold text-yellow-400">
                      Piętro {gameState.floor}
                      {gameState.prestigeLevel > 0 && (
                        <span className="text-yellow-300 ml-2">★{gameState.prestigeLevel}</span>
                      )}
                    </h4>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-white mb-2">
                    HP: {gameState.enemy.health}/{gameState.enemy.maxHealth}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-6">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-400 h-6 rounded-full transition-all duration-300"
                      style={{ width: `${(gameState.enemy.health / gameState.enemy.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-white text-lg mb-4">
                  {gameState.autoClick && gameState.skills.autoClick > 0 ? 
                    'Auto-klik aktywny!' : 'Kliknij, aby zaatakować!'}
                </div>

                {/* Normalny atak */}
                <button
                  onClick={gameActions.attackEnemy}
                  disabled={gameState.gameOver}
                  className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-200 hover:animate-bounce cursor-pointer"
                >
                  {gameState.enemy.enemyType === 'boss' ? '👹' : 
                   gameState.enemy.enemyType === 'beast' ? '🐺' :
                   gameState.enemy.enemyType === 'undead' ? '💀' : '👹'}
                </button>

                <div className="text-white mb-4">
                  ⚔️ Normalny Atak ({gameState.clickDamage} obrażeń)
                </div>

                {/* Umiejętności specjalne */}
                <div className="border-t border-gray-600 pt-4">
                  <div className="text-white mb-2">Umiejętności specjalne:</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {gameState.playerClass === 'mage' && gameState.skills.fireball > 0 && (
                      <button
                        onClick={() => gameActions.useSkill('fireball')}
                        disabled={gameState.mana < 15}
                        className={`px-3 py-2 rounded text-sm ${
                          gameState.mana >= 15 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        🔥 Kula Ognia<br/>
                        <small>({25 * gameState.skills.fireball} DMG, 15 MP)</small>
                      </button>
                    )}
                    {gameState.skills.heal > 0 && (
                      <button
                        onClick={() => gameActions.useSkill('heal')}
                        disabled={gameState.mana < 10}
                        className={`px-3 py-2 rounded text-sm ${
                          gameState.mana >= 10 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        ❤️ Leczenie<br/>
                        <small>(+{30 * gameState.skills.heal} HP, 10 MP)</small>
                      </button>
                    )}
                    {gameState.playerClass === 'archer' && gameState.skills.powerShot > 0 && (
                      <button
                        onClick={() => gameActions.useSkill('powerShot')}
                        disabled={gameState.mana < 20}
                        className={`px-3 py-2 rounded text-sm ${
                          gameState.mana >= 20 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        🏹 Potężny Strzał<br/>
                        <small>({Math.floor(gameState.clickDamage * (1 + gameState.skills.powerShot * 0.5))} DMG, 20 MP)</small>
                      </button>
                    )}
                    {gameState.skills.lightning > 0 && (
                      <button
                        onClick={() => gameActions.useSkill('lightning')}
                        disabled={gameState.mana < 25}
                        className={`px-3 py-2 rounded text-sm ${
                          gameState.mana >= 25 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        ⚡ Błyskawica<br/>
                        <small>({35 * gameState.skills.lightning} DMG, 25 MP)</small>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Event - tylko w zakładce game */}
            {gameState.activeTab === 'game' && gameState.enemy && gameState.enemy.type === 'event' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-8 mb-5 border-2 border-yellow-500 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameState.enemy.name}
                </h3>
                <div className="text-white mb-4">
                  {gameState.enemy.description}
                </div>
                <button
                  onClick={gameActions.handleEvent}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-lg font-bold"
                >
                  Kontynuuj
                </button>
              </div>
            )}


            {/* Sklep */}
            {gameState.activeTab === 'shop' && (
              <div className="bg-black bg-opacity-60 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-5 text-center">🏪 Sklep Mikstur</h2>
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
                <h2 className="text-2xl font-bold text-white mb-5 text-center">🎒 Ekwipunek</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-3">⚔️ Broń</h3>
                    {gameState.inventory.weapon ? (
                      <div className="text-white">
                        <p className="font-bold">{gameState.inventory.weapon.name}</p>
                        <p className="text-sm text-gray-300">Atak: +{gameState.inventory.weapon.damage}</p>
                        {gameState.inventory.weapon.mana && (
                          <p className="text-sm text-blue-400">Mana: +{gameState.inventory.weapon.mana}</p>
                        )}
                        {gameState.inventory.weapon.critChance && (
                          <p className="text-sm text-yellow-400">Kryt: +{gameState.inventory.weapon.critChance}%</p>
                        )}
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
                        {gameState.inventory.armor.mana && (
                          <p className="text-sm text-blue-400">Mana: +{gameState.inventory.armor.mana}</p>
                        )}
                        {gameState.inventory.armor.critChance && (
                          <p className="text-sm text-yellow-400">Kryt: +{gameState.inventory.armor.critChance}%</p>
                        )}
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

            {/* Umiejętności */}
            {gameState.activeTab === 'skills' && (
              <SkillsTab gameState={gameState} gameActions={gameActions} />
            )}

            {/* Craftowanie */}
            {gameState.activeTab === 'craft' && (
              <CraftingTab 
                gameState={gameState} 
                gameActions={gameActions} 
                materialNames={materialNames}
                getMaterialTier={getMaterialTier}
                craftingRecipes={craftingRecipes}
                craftingCategory={craftingCategory}
                setCraftingCategory={setCraftingCategory}
              />
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

          </>
        )}
      </div>
    </div>
  );
}
