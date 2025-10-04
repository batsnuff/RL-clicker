// Game action functions for RogueClickerGame

export const createGameActions = (setGameState, gameState, classes, enemies, events, shopItems, craftingRecipes, materialNames, getMaterialTier, generateRandomBonus, generateEnemy, generateMaterialReward, calculatePrestigeBonus, saveHighScore, setLevelUp) => {
  
  // Wybór klasy
  const selectClass = (className, playerName = '') => {
    const selectedClassData = classes[className];
    setGameState(prev => ({
      ...prev,
      playerClass: className,
      playerName: playerName || `Gracz ${className}`,
      maxHealth: selectedClassData.health + (prev.prestigeLevel * 20),
      health: selectedClassData.health + (prev.prestigeLevel * 20),
      maxMana: selectedClassData.mana + (prev.prestigeLevel * 10),
      mana: selectedClassData.mana + (prev.prestigeLevel * 10),
      clickDamage: selectedClassData.damage + (prev.prestigeLevel * 5) + Math.floor(selectedClassData.damage * prev.prestigeBonus / 100),
      defense: selectedClassData.defense + prev.prestigeLevel,
      enemy: generateEnemy(1),
      message: ''
    }));
  };

  // Obliczanie obrażeń
  const calculateDamage = () => {
    let damage = gameState.clickDamage;
    
    // Bonus z ekwipunku
    if (gameState.inventory.weapon) damage += gameState.inventory.weapon.damage || 0;
    if (gameState.inventory.weapon && gameState.inventory.weapon.bonus && gameState.inventory.weapon.bonus.type === 'damage') {
      damage += gameState.inventory.weapon.bonus.value;
    }
    
    // Krytyczne trafienie
    let critChance = gameState.critChance;
    if (gameState.inventory.accessory && gameState.inventory.accessory.critChance) {
      critChance += gameState.inventory.accessory.critChance;
    }
    if (gameState.inventory.weapon && gameState.inventory.weapon.bonus && gameState.inventory.weapon.bonus.type === 'critChance') {
      critChance += gameState.inventory.weapon.bonus.value;
    }
    
    if (Math.random() * 100 < critChance) {
      damage *= 2;
      return { damage, critical: true };
    }
    
    return { damage, critical: false };
  };

  // Atak na przeciwnika
  const attackEnemy = () => {
    if (gameState.gameOver || !gameState.enemy || gameState.enemy.type === 'event') return;
    
    setGameState(prev => {
      const { damage, critical } = calculateDamage();
      const newEnemyHealth = prev.enemy.health - damage;
      
      if (newEnemyHealth <= 0) {
        // Przeciwnik pokonany
        const newGold = prev.gold + prev.enemy.reward.gold;
        let newExp = prev.experience + prev.enemy.reward.exp;
        const newFloor = prev.floor + 1;
        
        // Dodanie materiałów
        const newMaterials = { ...prev.materials };
        Object.keys(prev.enemy.reward.materials).forEach(material => {
          newMaterials[material] = (newMaterials[material] || 0) + prev.enemy.reward.materials[material];
        });
        
        // Sprawdzenie awansu
        let newLevel = prev.level;
        let expToNext = prev.experienceToNext;
        let newMaxHealth = prev.maxHealth;
        let newHealth = prev.health;
        let newClickDamage = prev.clickDamage;
        let newMaxMana = prev.maxMana;
        let newMana = prev.mana;
        
        // Śledzenie level up
        let levelUpData = null;
        const originalLevel = prev.level;
        
        while (newExp >= expToNext) {
          newExp -= expToNext;
          newLevel++;
          expToNext = Math.min(10000, newLevel * 120); // Maksimum 10000 exp needed
          newMaxHealth += 20;
          newMaxMana += 10;
          newHealth = Math.min(newHealth + 15, newMaxHealth);
          newMana = Math.min(newMana + 10, newMaxMana);
          newClickDamage += 5;
        }
        
        // Jeśli był level up, ustaw dane do powiadomienia
        if (newLevel > originalLevel) {
          levelUpData = {
            newLevel: newLevel,
            statGains: {
              health: 15,
              mana: 10,
              damage: 5,
              maxHealth: 20
            }
          };
        }
        
        // Regeneracja HP co 10 pięter
        let regenMessage = '';
        if (newFloor % 10 === 0) {
          const regenAmount = Math.floor(newMaxHealth * 0.3);
          newHealth = Math.min(newMaxHealth, newHealth + regenAmount);
          regenMessage = ` 🌟 Regeneracja! +${regenAmount} HP!`;
        }
        
        const newState = {
          ...prev,
          gold: newGold,
          experience: newExp,
          level: newLevel,
          maxHealth: newMaxHealth,
          health: newHealth,
          maxMana: newMaxMana,
          mana: newMana,
          clickDamage: newClickDamage,
          experienceToNext: expToNext,
          floor: newFloor,
          materials: newMaterials,
          enemy: generateEnemy(newFloor),
          message: `Pokonałeś ${prev.enemy.name}! ${critical ? 'KRYTYCZNE TRAFIENIE! ' : ''}+${prev.enemy.reward.gold} złota, +${prev.enemy.reward.exp} exp.${regenMessage}`
        };
        
        // Jeśli był level up, pokaż powiadomienie
        if (levelUpData) {
          setTimeout(() => setLevelUp(levelUpData), 100);
        }
        
        return newState;
      } else {
        // Przeciwnik kontratakuje
        let enemyDamage = Math.max(1, Math.floor(prev.enemy.level * (Math.random() * 2 + 1)));
        
        // Obrona
        let totalDefense = prev.defense;
        if (prev.inventory.armor) totalDefense += prev.inventory.armor.defense || 0;
        if (prev.inventory.armor && prev.inventory.armor.bonus && prev.inventory.armor.bonus.type === 'defense') {
          totalDefense += prev.inventory.armor.bonus.value;
        }
        
        enemyDamage = Math.max(1, enemyDamage - totalDefense);
        const newPlayerHealth = Math.max(0, prev.health - enemyDamage);
        
        if (newPlayerHealth <= 0) {
          saveHighScore(prev.level, prev.floor, prev.prestigeLevel);
          return {
            ...prev,
            health: 0,
            gameOver: true,
            autoClick: false,
            message: `Zostałeś pokonany przez ${prev.enemy.name}! Osiągnąłeś poziom ${prev.level} i piętro ${prev.floor}.`
          };
        }
        
        return {
          ...prev,
          enemy: { ...prev.enemy, health: newEnemyHealth },
          health: newPlayerHealth,
          message: `${critical ? 'KRYT! ' : ''}Zadajesz ${damage} obrażeń! ${prev.enemy.name} kontratakuje za ${enemyDamage} obrażeń.`
        };
      }
    });
  };

  // Użycie umiejętności
  const useSkill = (skillName) => {
    if (gameState.gameOver) return;
    
    setGameState(prev => {
      const skillLevel = prev.skills[skillName];
      if (skillLevel === 0) return prev;
      
      let manaCost = 0;
      let newHealth = prev.health;
      let newMana = prev.mana;
      let newEnemy = prev.enemy;
      let message = prev.message;
      
      switch(skillName) {
        case 'fireball':
          manaCost = 15;
          if (newMana >= manaCost && newEnemy && newEnemy.type === 'enemy') {
            const damage = skillLevel * 25;
            newEnemy = { ...newEnemy, health: Math.max(0, newEnemy.health - damage) };
            newMana -= manaCost;
            message = `Rzucasz Kulę Ognia za ${damage} obrażeń!`;
          }
          break;
          
        case 'heal':
          manaCost = 10;
          if (newMana >= manaCost) {
            const healAmount = skillLevel * 30;
            newHealth = Math.min(prev.maxHealth, newHealth + healAmount);
            newMana -= manaCost;
            message = `Leczysz się o ${healAmount} HP!`;
          }
          break;
          
        case 'powerShot':
          manaCost = 20;
          if (newMana >= manaCost && newEnemy && newEnemy.type === 'enemy') {
            const damage = Math.floor(prev.clickDamage * (1 + skillLevel * 0.5));
            newEnemy = { ...newEnemy, health: Math.max(0, newEnemy.health - damage) };
            newMana -= manaCost;
            message = `Potężny Strzał za ${damage} obrażeń!`;
          }
          break;
          
        case 'lightning':
          manaCost = 25;
          if (newMana >= manaCost && newEnemy && newEnemy.type === 'enemy') {
            const damage = skillLevel * 35;
            newEnemy = { ...newEnemy, health: Math.max(0, newEnemy.health - damage) };
            newMana -= manaCost;
            message = `Błyskawica za ${damage} obrażeń!`;
          }
          break;
      }
      
      if (prev.mana < manaCost) {
        message = 'Niewystarczająco many!';
      }
      
      return {
        ...prev,
        health: newHealth,
        mana: newMana,
        enemy: newEnemy,
        message: message
      };
    });
  };

  // Toggle auto-click
  const toggleAutoClick = () => {
    setGameState(prev => ({
      ...prev,
      autoClick: !prev.autoClick,
      message: !prev.autoClick ? 'Auto-klik WŁĄCZONY!' : 'Auto-klik WYŁĄCZONY!'
    }));
  };

  // Obsługa eventów
  const handleEvent = () => {
    if (!gameState.enemy || gameState.enemy.type !== 'event') return;
    
    setGameState(prev => {
      const event = prev.enemy;
      let newGold = prev.gold;
      let newHealth = prev.health;
      let message = event.description;
      
      if (event.reward) {
        newGold += event.reward.gold || 0;
        message += ` Otrzymujesz ${event.reward.gold} złota!`;
      }
      
      if (event.damage) {
        newHealth = Math.max(1, newHealth - event.damage);
        message += ` Tracisz ${event.damage} HP!`;
      }
      
      if (event.heal) {
        newHealth = Math.min(prev.maxHealth, newHealth + event.heal);
        message += ` Odzyskujesz ${event.heal} HP!`;
      }
      
      return {
        ...prev,
        gold: newGold,
        health: newHealth,
        floor: prev.floor + 1,
        enemy: generateEnemy(prev.floor + 1),
        message: message
      };
    });
  };

  // Kupowanie przedmiotów
  const buyItem = (item) => {
    if (gameState.gold < item.cost) return;
    
    setGameState(prev => {
      let newState = { ...prev, gold: prev.gold - item.cost };
      
      switch(item.effect) {
        case 'health':
          newState.health = Math.min(prev.maxHealth, prev.health + item.value);
          newState.message = `Wypiłeś ${item.name}! +${item.value} HP`;
          break;
        case 'mana':
          newState.mana = Math.min(prev.maxMana, prev.mana + item.value);
          newState.message = `Wypiłeś ${item.name}! +${item.value} MP`;
          break;
        case 'damage':
          newState.clickDamage = prev.clickDamage + item.value;
          newState.message = `Wypiłeś ${item.name}! +${item.value} Siły`;
          break;
        case 'defense':
          newState.defense = prev.defense + item.value;
          newState.message = `Wypiłeś ${item.name}! +${item.value} Obrony`;
          break;
      }
      
      return newState;
    });
  };

  // Ulepszanie umiejętności
  const upgradeSkill = (skillName) => {
    const cost = (gameState.skills[skillName] + 1) * 50;
    if (gameState.gold < cost) return;
    
    // Sprawdź czy można ulepszyć (wymagania poziomu)
    const skillRequirements = {
      fireball: 1, heal: 1, criticalStrike: 1,
      armor: 7, powerShot: 7, manaShield: 7,
      lightning: 14, regeneration: 14, berserker: 14,
      autoClick: 21, teleport: 21, divine: 21
    };
    
    if (gameState.level < skillRequirements[skillName]) return;
    
    setGameState(prev => ({
      ...prev,
      gold: prev.gold - cost,
      skills: {
        ...prev.skills,
        [skillName]: prev.skills[skillName] + 1
      },
      message: `Ulepszyłeś umiejętność ${skillName}!`
    }));
  };

  // Craftowanie
  const craftItem = (recipe) => {
    // Sprawdź czy masz wystarczająco materiałów
    for (const [material, amount] of Object.entries(recipe.materials)) {
      if ((gameState.materials[material] || 0) < amount) {
        setGameState(prev => ({...prev, message: 'Niewystarczająco materiałów!'}));
        return;
      }
    }
    
    setGameState(prev => {
      const newMaterials = { ...prev.materials };
      const newInventory = { ...prev.inventory };
      
      // Usuń materiały
      for (const [material, amount] of Object.entries(recipe.materials)) {
        newMaterials[material] -= amount;
      }
      
      // Wygeneruj bonus
      const bonus = generateRandomBonus();
      
      // Dodaj przedmiot w zależności od typu
      const craftedItem = {
        id: recipe.id,
        name: `${recipe.name} ${bonus.name}`,
        bonus: bonus
      };
      
      // Dodaj właściwości w zależności od typu
      if (recipe.type === 'weapon') {
        craftedItem.damage = recipe.baseDamage;
        if (recipe.baseMana) craftedItem.mana = recipe.baseMana;
        if (recipe.baseCritChance) craftedItem.critChance = recipe.baseCritChance;
        newInventory.weapon = craftedItem;
      } else if (recipe.type === 'armor') {
        craftedItem.defense = recipe.baseDefense;
        if (recipe.baseMana) craftedItem.mana = recipe.baseMana;
        if (recipe.baseCritChance) craftedItem.critChance = recipe.baseCritChance;
        newInventory.armor = craftedItem;
      } else if (recipe.type === 'accessory') {
        craftedItem.mana = recipe.baseMana;
        craftedItem.critChance = recipe.baseCritChance;
        newInventory.accessory = craftedItem;
      }
      
      return {
        ...prev,
        materials: newMaterials,
        inventory: newInventory,
        message: `Wytworzyłeś ${craftedItem.name} z bonusem +${bonus.value} ${bonus.name}!`
      };
    });
  };

  // Prestige
  const prestige = () => {
    if (gameState.level < 50) return;
    
    const newPrestigeBonus = calculatePrestigeBonus(gameState.floor);
    
    setGameState(prev => ({
      ...prev,
      level: 1,
      health: classes[prev.playerClass].health + (prev.prestigeLevel + 1) * 20,
      maxHealth: classes[prev.playerClass].health + (prev.prestigeLevel + 1) * 20,
      mana: classes[prev.playerClass].mana + (prev.prestigeLevel + 1) * 10,
      maxMana: classes[prev.playerClass].mana + (prev.prestigeLevel + 1) * 10,
      gold: 0,
      experience: 0,
      experienceToNext: 100,
      clickDamage: classes[prev.playerClass].damage + (prev.prestigeLevel + 1) * 5 + Math.floor(classes[prev.playerClass].damage * newPrestigeBonus / 100),
      defense: classes[prev.playerClass].defense + (prev.prestigeLevel + 1),
      floor: 1,
      enemy: generateEnemy(1),
      gameOver: false,
      prestigeLevel: prev.prestigeLevel + 1,
      prestigeBonus: newPrestigeBonus,
      autoClick: false,
      inventory: { weapon: null, armor: null, accessory: null },
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0 },
      materials: { wood: 0, iron: 0, steel: 0, mithril: 0, adamant: 0, gems: 0, essence: 0 },
      message: `Prestige! Zaczynasz od nowa z bonusami! +${newPrestigeBonus}% ataku!`,
      activeTab: 'game'
    }));
  };

  // Zapisywanie gry do localStorage
  const saveGame = () => {
    try {
      const saveData = {
        ...gameState,
        saveDate: new Date().toISOString(),
        version: '1.0.0'
      };
      localStorage.setItem('rogueClickerSave', JSON.stringify(saveData));
      setGameState(prev => ({ ...prev, message: 'Gra została zapisana!' }));
      return true;
    } catch (error) {
      console.error('Błąd zapisywania gry:', error);
      setGameState(prev => ({ ...prev, message: 'Błąd zapisywania gry!' }));
      return false;
    }
  };

  // Wczytywanie gry z localStorage
  const loadGame = () => {
    try {
      const saveData = localStorage.getItem('rogueClickerSave');
      if (saveData) {
        const parsedData = JSON.parse(saveData);
        // Sprawdź czy zapis jest kompatybilny
        if (parsedData.version === '1.0.0') {
          setGameState(prev => ({
            ...prev,
            ...parsedData,
            message: 'Gra została wczytana!'
          }));
          return true;
        } else {
          setGameState(prev => ({ ...prev, message: 'Zapis nie jest kompatybilny!' }));
          return false;
        }
      } else {
        setGameState(prev => ({ ...prev, message: 'Brak zapisanego pliku!' }));
        return false;
      }
    } catch (error) {
      console.error('Błąd wczytywania gry:', error);
      setGameState(prev => ({ ...prev, message: 'Błąd wczytywania gry!' }));
      return false;
    }
  };

  // Zapisz i wyjdź
  const saveAndExit = () => {
    if (saveGame()) {
      setGameState(prev => ({ ...prev, message: 'Gra zapisana! Możesz bezpiecznie zamknąć przeglądarkę.' }));
    }
  };

  // Przetwarzanie materiałów
  const processMaterials = (conversionType, material, quantity) => {
    if (quantity <= 0 || !gameState.materials[material] || gameState.materials[material] < quantity) {
      setGameState(prev => ({ ...prev, message: 'Niewystarczająco materiałów!' }));
      return;
    }

    setGameState(prev => {
      const newMaterials = { ...prev.materials };
      let newGold = prev.gold;
      let message = '';

      if (conversionType === 'upgrade') {
        // Ulepszanie materiałów
        const materialTiers = ['wood', 'iron', 'steel', 'mithril', 'adamant'];
        const currentTierIndex = materialTiers.indexOf(material);
        
        if (currentTierIndex === -1 || currentTierIndex === materialTiers.length - 1) {
          return { ...prev, message: 'Nie można ulepszyć tego materiału!' };
        }

        const nextTier = materialTiers[currentTierIndex + 1];
        const conversionRates = {
          wood: { iron: 3, steel: 8, mithril: 20, adamant: 50 },
          iron: { steel: 3, mithril: 8, adamant: 20 },
          steel: { mithril: 3, adamant: 8 },
          mithril: { adamant: 3 }
        };

        const rate = conversionRates[material][nextTier];
        const maxUpgrades = Math.floor(quantity / rate);
        
        if (maxUpgrades === 0) {
          return { ...prev, message: 'Niewystarczająco materiałów do ulepszenia!' };
        }

        const materialsUsed = maxUpgrades * rate;
        newMaterials[material] -= materialsUsed;
        newMaterials[nextTier] = (newMaterials[nextTier] || 0) + maxUpgrades;
        
        message = `Ulepszono ${materialsUsed} ${materialNames[material]} na ${maxUpgrades} ${materialNames[nextTier]}!`;
      } else if (conversionType === 'gold') {
        // Konwersja na złoto
        const goldRates = {
          wood: 2,
          iron: 5,
          steel: 12,
          mithril: 30,
          adamant: 75,
          gems: 15,
          essence: 50
        };

        const goldGained = quantity * goldRates[material];
        newMaterials[material] -= quantity;
        newGold += goldGained;
        
        message = `Zamieniono ${quantity} ${materialNames[material]} na ${goldGained} złota!`;
      }

      return {
        ...prev,
        materials: newMaterials,
        gold: newGold,
        message: message
      };
    });
  };

  // Reset gry
  const resetGame = () => {
    setGameState(prev => ({
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
      playerClass: null,
      enemy: null,
      floor: 1,
      gameOver: false,
      message: 'Witaj w Rogue Clicker! Wybierz klasę postaci.',
      activeTab: 'game',
      prestigeLevel: 0,
      prestigeBonus: 0,
      autoClick: false,
      inventory: { weapon: null, armor: null, accessory: null },
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0 },
      materials: { wood: 0, iron: 0, steel: 0, mithril: 0, adamant: 0, gems: 0, essence: 0 },
      highScores: prev.highScores // Zachowaj high scores
    }));
  };

  return {
    selectClass,
    attackEnemy,
    useSkill,
    toggleAutoClick,
    handleEvent,
    buyItem,
    upgradeSkill,
    craftItem,
    processMaterials,
    prestige,
    resetGame,
    saveGame,
    loadGame,
    saveAndExit
  };
};
