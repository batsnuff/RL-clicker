import React, { useState, useEffect } from 'react';
import { Sword, Shield, Heart, Zap, RotateCcw, TrendingUp, ShoppingCart, Backpack, Hammer, Star, Play, Pause } from 'lucide-react';
import { createGameActions } from './GameActions';
import ClassSelection from './ClassSelection';
import NameInputModal from './NameInputModal';
import HighScores from './HighScores';
import PlayerStats from './PlayerStats';
import GameTab from './GameTab';
import SkillsTab from './SkillsTab';
import CraftingTab from './CraftingTab';
import MaterialProcessing from './MaterialProcessing';
import LoadingScreen from './LoadingScreen';
import LevelUpNotification from './LevelUpNotification';
import HelpModal from './HelpModal';
import ResetConfirmationModal from './ResetConfirmationModal';
import ExitConfirmationModal from './ExitConfirmationModal';
import OptionsModal from './OptionsModal';

export default function RogueClickerGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [levelUp, setLevelUp] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedClassForName, setSelectedClassForName] = useState(null);
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
    message: 'Witaj w The Darker Clicker! Wybierz swoją ścieżkę...',
    
    // UI
    activeTab: 'game',
    showOptionsModal: false,
    
    // Prestige
    prestigeLevel: 0,
    prestigeBonus: 0, // % bonus do ataku
    
    // Auto-click
    autoClick: false,
    
    // Berserk buff
    berserkActive: false,
    berserkTimeLeft: 0,
    
    // Modal states
    showResetModal: false,
    showExitModal: false,
    
    // Ekwipunek
    inventory: {
      weapon: null,
      armor: null,
      accessory: null
    },
    
    // Pasywne bonusy z ekwipunku (ascend system)
    passiveBonuses: {
      weaponDamage: 0,    // Pasywny bonus ataku z broni
      armorDefense: 0,    // Pasywny bonus obrony z zbroi
      accessoryVampirism: 0, // Pasywny bonus wampiryzmu z akcesoriów
      ascendedWeapons: 0, // Liczba ascended broni
      ascendedArmors: 0, // Liczba ascended zbroi
      ascendedAccessories: 0 // Liczba ascended akcesoriów
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
      skeletonSummon: 0,
      darkStrike: 0,
      // Poziom 14
      lightning: 0,
      regeneration: 0,
      berserker: 0,
      deathCurse: 0,
      hellfire: 0,
      // Poziom 21
      autoClick: 0,
      teleport: 0,
      divine: 0,
      // Nowe skille poziom 21
      berserkRage: 0,
      materialMagnet: 0,
      goldRush: 0,
      experienceBoost: 0,
      criticalMastery: 0,
      healthRegen: 0
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
    warrior: { 
      name: 'Mroczny Rycerz', 
      health: 120, 
      mana: 30, 
      damage: 15, 
      defense: 5,
      description: 'Zbrojny w ciemności, gotowy na walkę z potworami z głębin.',
      quote: '"Ciemność nie jest moim wrogiem - to mój sojusznik."'
    },
    mage: { 
      name: 'Nekromanta', 
      health: 80, 
      mana: 100, 
      damage: 8, 
      defense: 2,
      description: 'Mistrz zaklęć śmierci, przywołujący moc z zaświatów.',
      quote: '"Śmierć to tylko początek nowej mocy."'
    },
    archer: { 
      name: 'Łowca Cieni', 
      health: 100, 
      mana: 50, 
      damage: 12, 
      defense: 3,
      description: 'Zwinny zabójca, polujący w ciemnościach na najgroźniejsze bestie.',
      quote: '"W ciemności widzę wszystko, czego inni nie mogą dostrzec."'
    }
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

    // Losowy wybór potwora z wszystkich dostępnych
    const baseEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    const level = Math.floor((floor + 4) / 5);
    
    // Improved scaling - exponential growth
    const healthMultiplier = Math.pow(1.15, floor - 1); // 15% increase per floor
    const health = Math.floor(baseEnemy.baseHealth * healthMultiplier);
    
    // Scale rewards with floor
    const goldMultiplier = 1 + (floor - 1) * 0.25; // 25% increase per floor
    const expMultiplier = 1 + (floor - 1) * 0.20; // 20% increase per floor
    
    return {
      type: 'enemy',
      name: baseEnemy.name,
      health: health,
      maxHealth: health,
      level: level,
      enemyType: baseEnemy.type,
      reward: {
        gold: Math.floor(baseEnemy.goldReward * goldMultiplier),
        exp: Math.floor(baseEnemy.expReward * expMultiplier),
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

  // Berserk timer countdown
  useEffect(() => {
    if (gameState.berserkActive && gameState.berserkTimeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.berserkTimeLeft - 1;
          if (newTimeLeft <= 0) {
            return {
              ...prev,
              berserkActive: false,
              berserkTimeLeft: 0,
              message: 'Berserk się skończył!'
            };
          }
          return {
            ...prev,
            berserkTimeLeft: newTimeLeft
          };
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState.berserkActive, gameState.berserkTimeLeft]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white relative overflow-hidden p-2 sm:p-4">
      {/* Dark Souls Background Effects */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20 animate-darkSoulsFlicker" />
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
      
      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal 
        isOpen={gameState.showResetModal} 
        onConfirm={gameActions.confirmReset}
        onCancel={gameActions.cancelReset}
      />
      
      {/* Name Input Modal */}
      <NameInputModal 
        isOpen={showNameModal}
        onConfirm={(playerName) => {
          gameActions.selectClass(selectedClassForName, playerName);
          setShowNameModal(false);
          setSelectedClassForName(null);
        }}
        onCancel={() => {
          setShowNameModal(false);
          setSelectedClassForName(null);
        }}
        className={selectedClassForName}
        classData={selectedClassForName ? classes[selectedClassForName] : null}
      />
      
      {/* Options Modal */}
      <OptionsModal 
        isOpen={gameState.showOptionsModal}
        onSaveAndExit={() => {
          gameActions.saveAndExit();
          setGameState(prev => ({ ...prev, showOptionsModal: false }));
        }}
        onNewGame={() => {
          gameActions.resetGame();
          setGameState(prev => ({ ...prev, showOptionsModal: false }));
        }}
        onCancel={() => {
          setGameState(prev => ({ ...prev, showOptionsModal: false }));
        }}
      />
      
      <div className="max-w-6xl mx-auto">
        
        {/* High Scores */}
        {!gameState.playerClass && <HighScores highScores={gameState.highScores} />}
        
        {/* Wybór klasy */}
        {!gameState.playerClass && (
          <>
            <ClassSelection 
              classes={classes} 
              onSelectClass={(className) => {
                setSelectedClassForName(className);
                setShowNameModal(true);
              }} 
            />
            
            {/* Przycisk wczytania gry */}
            <div className="text-center mt-6">
              <button
                onClick={gameActions.loadGame}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 animate-darkSoulsPulse border border-green-400"
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
            <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-lg p-2 sm:p-4 mb-5 border-2 border-red-600 animate-darkSoulsRise">
              {/* Główne przyciski nawigacji - responsywne */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-2 sm:mb-0">
                  {[
                    { id: 'game', name: 'Gra', icon: Sword, shortName: 'Gra' },
                    { id: 'shop', name: 'Sklep', icon: ShoppingCart, shortName: 'Sklep' },
                    { id: 'inventory', name: 'Ekwipunek', icon: Backpack, shortName: 'Ekwip.' },
                    { id: 'skills', name: 'Umiejętności', icon: Zap, shortName: 'Umiej.' },
                    { id: 'craft', name: 'Craft', icon: Hammer, shortName: 'Craft' },
                    { id: 'process', name: 'Przetwarzanie', icon: TrendingUp, shortName: 'Przetw.' }
                  ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setGameState(prev => ({ ...prev, activeTab: tab.id }))}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs sm:text-sm animate-slideIn ${
                        gameState.activeTab === tab.id 
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-darkSoulsPulse border border-red-400' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      }`}
                    >
                      <Icon size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{tab.name}</span>
                      <span className="sm:hidden">{tab.shortName}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Przycisk opcji */}
              <div className="flex justify-center items-center gap-2 mt-2">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showOptionsModal: true }))}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-2 py-1 rounded-lg flex items-center gap-1 transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs animate-slideIn border border-red-400 animate-darkSoulsGlow"
                >
                  <Shield size={12} />
                  <span className="hidden sm:inline">Opcje</span>
                  <span className="sm:hidden">Opcje</span>
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
              <div 
                onClick={gameActions.attackEnemy}
                className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-4 sm:p-8 mb-2 border-2 border-red-600 text-center relative cursor-pointer hover:bg-opacity-90 transition-all duration-200 animate-darkSoulsGlow hover:animate-darkSoulsPulse"
              >
                {/* Przycisk Jak grać? - lewy górny róg */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHelp(true);
                  }}
                  className="absolute top-2 left-2 bg-gray-600 hover:bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors text-sm font-bold z-10"
                  title="Jak grać?"
                >
                  ?
                </button>
                
                <div className="monster-header mb-4">
                  <h3 className="monster-name text-lg sm:text-2xl font-bold text-white">
                    {gameState.enemy.name} (Lv.{gameState.enemy.level})
                  </h3>
                  <div className="floor-info">
                    <h4 className="text-base sm:text-xl font-bold text-yellow-400">
                      Piętro {gameState.floor}
                      {gameState.prestigeLevel > 0 && (
                        <span className="text-red-400 ml-2">[💀{gameState.prestigeLevel}]</span>
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
                
                <div className="text-white text-sm sm:text-lg mb-4">
                  {gameState.autoClick && gameState.skills.autoClick > 0 ? 
                    'Auto-klik aktywny!' : 'Kliknij, aby zaatakować!'}
                </div>

                {/* Animacja walki z potworem */}
                <div className="relative mb-4 h-20 flex items-center justify-center">
                  {/* Drzwi krypty (0%) */}
                  <div className="absolute left-4 text-3xl sm:text-4xl animate-darkSoulsFloat relative">
                    🚪
                    {/* Mroczny efekt wokół drzwi */}
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-30 rounded-full blur-lg animate-darkSoulsFlicker" />
                  </div>
                  
                  {/* Potwór (przesuwa się w zależności od HP) */}
                  <div 
                    className="absolute text-4xl sm:text-6xl transform hover:scale-110 transition-all duration-500 hover:animate-bounce animate-darkSoulsFloat"
                    style={{
                      left: `${20 + (60 - (gameState.enemy.health / gameState.enemy.maxHealth) * 60)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {gameState.enemy.enemyType === 'boss' ? '🐉' : 
                     gameState.enemy.enemyType === 'beast' ? '🐺' :
                     gameState.enemy.enemyType === 'undead' ? '💀' : 
                     gameState.enemy.enemyType === 'basilisk' ? '🦎' :
                     gameState.enemy.enemyType === 'bat' ? '🦇' :
                     gameState.enemy.enemyType === 'snake' ? '🐍' :
                     gameState.enemy.enemyType === 'ghost' ? '👻' : '🐍'}
                    {/* Mroczny efekt wokół potwora */}
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-full blur-xl animate-darkSoulsFlicker" />
                    {/* Efekt "ciągnięcia" w kierunku czaszki */}
                    {gameState.enemy.health < gameState.enemy.maxHealth * 0.5 && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500 text-2xl animate-darkSoulsFloat">
                        ⚡
                      </div>
                    )}
                  </div>
                  
                  {/* Czaszka (100%) */}
                  <div className="absolute right-4 text-3xl sm:text-4xl animate-darkSoulsFloat relative">
                    💀
                    {/* Mroczny efekt wokół czaszki */}
                    <div className="absolute inset-0 bg-red-500 bg-opacity-40 rounded-full blur-lg animate-darkSoulsFlicker" />
                  </div>
                </div>

                {/* Wartość ataku */}
                <div className="text-white text-sm sm:text-base mb-4 font-bold">
                  ⚔️ Atak: {gameState.clickDamage} obrażeń
                </div>

                {/* Umiejętności specjalne */}
                <div 
                  onClick={gameActions.attackEnemy}
                  className="border-t border-red-600 pt-4 cursor-pointer hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-all duration-200 animate-darkSoulsRise"
                >
                  <div className="text-white text-sm sm:text-base mb-2">Umiejętności specjalne:</div>
                  <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                    {gameState.playerClass === 'mage' && gameState.skills.fireball > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gameActions.useSkill('fireball');
                        }}
                        disabled={gameState.mana < 15}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          gameState.mana >= 15 
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white animate-darkSoulsPulse border border-red-400' 
                            : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
                        }`}
                      >
                        🔥 Kula Ognia<br/>
                        <small>({25 * gameState.skills.fireball} DMG, 15 MP)</small>
                      </button>
                    )}
                    {gameState.skills.heal > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gameActions.useSkill('heal');
                        }}
                        disabled={gameState.mana < 10}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          gameState.mana >= 10 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-darkSoulsPulse border border-green-400' 
                            : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
                        }`}
                      >
                        ❤️ Leczenie<br/>
                        <small>(+{30 * gameState.skills.heal} HP, 10 MP)</small>
                      </button>
                    )}
                    {gameState.playerClass === 'archer' && gameState.skills.powerShot > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gameActions.useSkill('powerShot');
                        }}
                        disabled={gameState.mana < 20}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          gameState.mana >= 20 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white animate-pulse' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        🏹 Potężny Strzał<br/>
                        <small>({Math.floor(gameState.clickDamage * (1 + gameState.skills.powerShot * 0.5))} DMG, 20 MP)</small>
                      </button>
                    )}
                    {gameState.skills.lightning > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gameActions.useSkill('lightning');
                        }}
                        disabled={gameState.mana < 25}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          gameState.mana >= 25 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white animate-pulse' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        ⚡ Błyskawica<br/>
                        <small>({35 * gameState.skills.lightning} DMG, 25 MP)</small>
                      </button>
                    )}
                    {gameState.skills.berserker > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gameActions.activateBerserk();
                        }}
                        disabled={gameState.berserkActive}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          !gameState.berserkActive 
                            ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white animate-darkSoulsGlow border border-red-400' 
                            : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
                        }`}
                      >
                        ⚔️ Berserk<br/>
                        <small>({gameState.berserkActive ? `${gameState.berserkTimeLeft}s` : 'Aktywuj'})</small>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Event - tylko w zakładce game */}
            {gameState.activeTab === 'game' && gameState.enemy && gameState.enemy.type === 'event' && (
              <div className="bg-gradient-to-br from-gray-900 via-black to-yellow-900 rounded-lg p-8 mb-5 border-2 border-yellow-600 text-center animate-darkSoulsRise relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameState.enemy.name}
                </h3>
                <div className="text-white mb-6 text-lg">
                  {gameState.enemy.description}
                </div>
                <button
                  onClick={gameActions.handleEvent}
                  className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white px-8 py-4 rounded-lg text-xl font-bold cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg z-20 relative pointer-events-auto"
                >
                  Kontynuuj
                </button>
              </div>
            )}


            {/* Sklep */}
            {gameState.activeTab === 'shop' && (
              <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 rounded-lg p-4 sm:p-6 border-2 border-red-600 animate-darkSoulsRise">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 text-center">🏪 Sklep Mikstur</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {shopItems.map((item, index) => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise" style={{ animationDelay: `${index * 0.1}s` }}>
                      <h3 className="font-bold text-white mb-2 animate-darkSoulsGlow">{item.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">
                        +{item.value} {item.effect === 'health' ? 'HP' : 
                                      item.effect === 'mana' ? 'MP' :
                                      item.effect === 'damage' ? 'Siły' : 'Obrony'}
                      </p>
                      <div className="text-yellow-400 mb-3 font-bold">💰 {item.cost} złota</div>
                      <button
                        onClick={() => gameActions.buyItem(item)}
                        disabled={gameState.gold < item.cost}
                        className={`w-full px-4 py-2 rounded text-sm font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          gameState.gold >= item.cost
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-darkSoulsPulse border border-green-400'
                            : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
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
              <div className="bg-gradient-to-br from-gray-900 via-black to-blue-900 rounded-lg p-4 sm:p-6 border-2 border-blue-600 animate-darkSoulsRise">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 text-center">🎒 Ekwipunek</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise">
                    <h3 className="font-bold text-white mb-3 animate-darkSoulsGlow">⚔️ Broń</h3>
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
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-bold text-white mb-3 animate-darkSoulsGlow">🛡️ Zbroja</h3>
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
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-red-600 animate-darkSoulsRise" style={{ animationDelay: '0.4s' }}>
                    <h3 className="font-bold text-white mb-3 animate-darkSoulsGlow">💍 Akcesoria</h3>
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

            {/* Przetwarzanie Materiałów */}
            {gameState.activeTab === 'process' && (
              <MaterialProcessing 
                gameState={gameState} 
                onProcessMaterials={gameActions.processMaterials}
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
