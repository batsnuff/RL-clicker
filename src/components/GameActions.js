// Game action functions for RogueClickerGame

export const createGameActions = (setGameState, gameState, classes, enemies, events, shopItems, craftingRecipes, materialNames, getMaterialTier, generateRandomBonus, generateEnemy, generateMaterialReward, calculatePrestigeBonus, saveHighScore, setLevelUp) => {
  
  // Wybór klasy
  const selectClass = (className, playerName = '') => {
    const selectedClassData = classes[className];
    setGameState(prev => ({
      ...prev,
      playerClass: className,
      playerName: playerName || 'Przydupas',
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
    
    // Bonus z prestige
    if (gameState.prestigeLevel > 0) {
      damage = Math.floor(damage * (1 + gameState.prestigeBonus / 100));
    }
    
    // Bonus z ekwipunku
    if (gameState.inventory.weapon) damage += gameState.inventory.weapon.damage || 0;
    if (gameState.inventory.weapon && gameState.inventory.weapon.bonus && gameState.inventory.weapon.bonus.damage) {
      damage += gameState.inventory.weapon.bonus.damage;
    }
    
    // Bonus z berserk
    if (gameState.berserkActive) {
      const berserkBonus = 50 + (gameState.skills.berserker * 25); // 50% + 25% per level
      damage = Math.floor(damage * (1 + berserkBonus / 100));
    }
    
    // Krytyczne trafienie
    let critChance = gameState.critChance;
    if (gameState.inventory.accessory && gameState.inventory.accessory.critChance) {
      critChance += gameState.inventory.accessory.critChance;
    }
    if (gameState.inventory.weapon && gameState.inventory.weapon.bonus && gameState.inventory.weapon.bonus.critChance) {
      critChance += gameState.inventory.weapon.bonus.critChance;
    }
    // Bonus z criticalMastery
    if (gameState.skills.criticalMastery > 0) {
      critChance += gameState.skills.criticalMastery * 3;
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
        let goldMultiplier = 1;
        let expMultiplier = 1;
        let materialMultiplier = 1;
        
        // Bonusy ze skili
        if (prev.skills.goldRush > 0) {
          goldMultiplier += prev.skills.goldRush * 0.15; // 15% per level
        }
        if (prev.skills.experienceBoost > 0) {
          expMultiplier += prev.skills.experienceBoost * 0.10; // 10% per level
        }
        if (prev.skills.materialMagnet > 0) {
          materialMultiplier += prev.skills.materialMagnet * 0.20; // 20% per level
        }
        
        const newGold = prev.gold + Math.floor(prev.enemy.reward.gold * goldMultiplier);
        let newExp = prev.experience + Math.floor(prev.enemy.reward.exp * expMultiplier);
        const newFloor = prev.floor + 1;
        
        // Dodanie materiałów z bonusem
        const newMaterials = { ...prev.materials };
        Object.keys(prev.enemy.reward.materials).forEach(material => {
          const baseAmount = prev.enemy.reward.materials[material];
          const bonusAmount = Math.floor(baseAmount * materialMultiplier);
          newMaterials[material] = (newMaterials[material] || 0) + bonusAmount;
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
        
        // Regeneracja ze skilla healthRegen
        if (prev.skills.healthRegen > 0) {
          const healthRegenAmount = prev.skills.healthRegen;
          newHealth = Math.min(newMaxHealth, newHealth + healthRegenAmount);
          if (healthRegenAmount > 0) {
            regenMessage += ` 💚 +${healthRegenAmount} HP (regen)!`;
          }
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
        // Przeciwnik kontratakuje - improved scaling
        const baseDamage = Math.max(1, Math.floor(prev.enemy.level * (Math.random() * 2 + 1)));
        const floorMultiplier = 1 + (prev.floor - 1) * 0.05; // 5% increase per floor
        let enemyDamage = Math.floor(baseDamage * floorMultiplier);
        
        // Obrona
        let totalDefense = prev.defense;
        if (prev.inventory.armor) totalDefense += prev.inventory.armor.defense || 0;
        if (prev.inventory.armor && prev.inventory.armor.bonus && prev.inventory.armor.bonus.defense) {
          totalDefense += prev.inventory.armor.bonus.defense;
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

  // Aktywacja berserk
  const activateBerserk = () => {
    if (gameState.gameOver || gameState.skills.berserker === 0) return;
    
    setGameState(prev => {
      if (prev.berserkActive) {
        return { ...prev, message: 'Berserk już aktywny!' };
      }
      
      const duration = 10 + (prev.skills.berserker * 5) + (prev.skills.berserkRage * 2); // 10 + 5*level + 2*rage sekund
      return {
        ...prev,
        berserkActive: true,
        berserkTimeLeft: duration,
        message: `Berserk aktywowany na ${duration} sekund!`
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
      autoClick: 21, teleport: 21, divine: 21,
      berserkRage: 21, materialMagnet: 21, goldRush: 21,
      experienceBoost: 21, criticalMastery: 21, healthRegen: 21
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
      
      // Sprawdź czy to upgrade istniejącego przedmiotu
      const existingItem = newInventory[recipe.type];
      let craftedItem;
      
      if (existingItem && existingItem.id === recipe.id && existingItem.upgradeLevel < 5) {
        // Upgrade istniejącego przedmiotu
        const upgradeLevel = (existingItem.upgradeLevel || 0) + 1;
        const randomBonus = generateRandomBonus();
        
        craftedItem = {
          ...existingItem,
          upgradeLevel: upgradeLevel,
          name: `${recipe.name} +${upgradeLevel}`,
          bonus: {
            ...existingItem.bonus,
            [randomBonus.type]: (existingItem.bonus[randomBonus.type] || 0) + randomBonus.value
          }
        };
        
        // Dodaj właściwości w zależności od typu
        if (recipe.type === 'weapon') {
          craftedItem.damage = recipe.baseDamage + Math.floor(upgradeLevel * 2);
          if (recipe.baseMana) craftedItem.mana = recipe.baseMana + Math.floor(upgradeLevel * 1);
          if (recipe.baseCritChance) craftedItem.critChance = recipe.baseCritChance + Math.floor(upgradeLevel * 0.5);
        } else if (recipe.type === 'armor') {
          craftedItem.defense = recipe.baseDefense + Math.floor(upgradeLevel * 2);
          if (recipe.baseMana) craftedItem.mana = recipe.baseMana + Math.floor(upgradeLevel * 1);
          if (recipe.baseCritChance) craftedItem.critChance = recipe.baseCritChance + Math.floor(upgradeLevel * 0.5);
        } else if (recipe.type === 'accessory') {
          if (recipe.baseMana) craftedItem.mana = recipe.baseMana + Math.floor(upgradeLevel * 2);
          if (recipe.baseCritChance) craftedItem.critChance = recipe.baseCritChance + Math.floor(upgradeLevel * 1);
        }
        
        newInventory[recipe.type] = craftedItem;
        
        return {
          ...prev,
          materials: newMaterials,
          inventory: newInventory,
          message: `Ulepszyłeś ${craftedItem.name}! +${randomBonus.value} ${randomBonus.name}!`
        };
      } else {
        // Nowy przedmiot
        const bonus = generateRandomBonus();
        
        craftedItem = {
          id: recipe.id,
          name: recipe.name,
          upgradeLevel: 0,
          bonus: { [bonus.type]: bonus.value }
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
      }
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
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0, berserkRage: 0, materialMagnet: 0, goldRush: 0, experienceBoost: 0, criticalMastery: 0, healthRegen: 0 },
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

  // Przetwarzanie materiałów na złoto
  const processMaterials = (conversionType, material, quantity) => {
    if (quantity <= 0 || !gameState.materials[material] || gameState.materials[material] < quantity) {
      setGameState(prev => ({ ...prev, message: 'Niewystarczająco materiałów!' }));
      return;
    }

    setGameState(prev => {
      const newMaterials = { ...prev.materials };
      let newGold = prev.gold;
      let message = '';

      // Konwersja na złoto z lepszymi kursami
      const goldRates = {
        wood: 5,      // Increased from 2
        iron: 12,     // Increased from 5
        steel: 30,    // Increased from 12
        mithril: 75,  // Increased from 30
        adamant: 200, // Increased from 75
        gems: 40,     // Increased from 15
        essence: 150  // Increased from 50
      };

      const goldGained = quantity * goldRates[material];
      newMaterials[material] -= quantity;
      newGold += goldGained;
      
      message = `Zamieniono ${quantity} ${materialNames[material]} na ${goldGained} złota!`;

      return {
        ...prev,
        materials: newMaterials,
        gold: newGold,
        message: message
      };
    });
  };

  // Reset gry - teraz tylko ustawia flagę do pokazania modala
  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      showResetModal: true
    }));
  };

  // Potwierdzenie resetu
  const confirmReset = () => {
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
      berserkActive: false,
      berserkTimeLeft: 0,
      inventory: { weapon: null, armor: null, accessory: null },
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0, berserkRage: 0, materialMagnet: 0, goldRush: 0, experienceBoost: 0, criticalMastery: 0, healthRegen: 0 },
      materials: { wood: 0, iron: 0, steel: 0, mithril: 0, adamant: 0, gems: 0, essence: 0 },
      highScores: prev.highScores, // Zachowaj high scores
      showResetModal: false
    }));
  };

  // Anulowanie resetu
  const cancelReset = () => {
    setGameState(prev => ({
      ...prev,
      showResetModal: false
    }));
  };

  // Pokazanie modala wyjścia
  const showExitModal = () => {
    setGameState(prev => ({
      ...prev,
      showExitModal: true
    }));
  };

  // Powrót do gry
  const returnToGame = () => {
    setGameState(prev => ({
      ...prev,
      showExitModal: false
    }));
  };

  // Porzucenie gry (wyjście bez zapisu)
  const abandonGame = () => {
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
      berserkActive: false,
      berserkTimeLeft: 0,
      inventory: { weapon: null, armor: null, accessory: null },
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0, berserkRage: 0, materialMagnet: 0, goldRush: 0, experienceBoost: 0, criticalMastery: 0, healthRegen: 0 },
      materials: { wood: 0, iron: 0, steel: 0, mithril: 0, adamant: 0, gems: 0, essence: 0 },
      highScores: prev.highScores, // Zachowaj high scores
      showExitModal: false
    }));
  };

  return {
    selectClass,
    attackEnemy,
    useSkill,
    activateBerserk,
    toggleAutoClick,
    handleEvent,
    buyItem,
    upgradeSkill,
    craftItem,
    processMaterials,
    prestige,
    resetGame,
    confirmReset,
    cancelReset,
    showExitModal,
    returnToGame,
    abandonGame,
    saveGame,
    loadGame,
    saveAndExit
  };
};
