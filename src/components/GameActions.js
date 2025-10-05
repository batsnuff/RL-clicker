// Game action functions for RogueClickerGame

export const createGameActions = (setGameState, gameState, classes, enemies, events, shopItems, craftingRecipes, materialNames, getMaterialTier, generateRandomBonus, generateEnemy, generateMaterialReward, calculatePrestigeBonus, saveHighScore, setLevelUp) => {
  
  // Wybór klasy
  const selectClass = (className, playerName = '') => {
    const selectedClassData = classes[className];
    
    // Ustaw umiejętności na podstawie klasy
    let initialSkills = { 
      // Podstawowe - resetowane
      fireball: 0, heal: 0, criticalStrike: 0, 
      // Poziom 7 - resetowane
      armor: 0, powerShot: 0, manaShield: 0, skeletonSummon: 0, darkStrike: 0,
      // Poziom 14 - resetowane
      lightning: 0, regeneration: 0, berserker: 0, deathCurse: 0, hellfire: 0,
      // Poziom 21 - ZACHOWANE (użyteczne)
      autoClick: gameState.skills.autoClick, teleport: 0, divine: 0,
      berserkRage: gameState.skills.berserkRage, materialMagnet: gameState.skills.materialMagnet, 
      goldRush: gameState.skills.goldRush, experienceBoost: gameState.skills.experienceBoost, 
      criticalMastery: gameState.skills.criticalMastery, healthRegen: gameState.skills.healthRegen
    };
    
    // Nekromanta zaczyna z umiejętnością leczenia
    if (className === 'mage') {
      initialSkills.heal = 1;
    }
    
    setGameState(prev => ({
      ...prev,
      playerClass: className,
      playerName: playerName || 'bezimienny Pomiot',
      maxHealth: selectedClassData.health + (prev.prestigeLevel * 20),
      health: selectedClassData.health + (prev.prestigeLevel * 20),
      maxMana: selectedClassData.mana + (prev.prestigeLevel * 10),
      mana: selectedClassData.mana + (prev.prestigeLevel * 10),
      clickDamage: selectedClassData.damage + (prev.prestigeLevel * 5) + Math.floor(selectedClassData.damage * prev.prestigeBonus / 100),
      defense: selectedClassData.defense + prev.prestigeLevel,
      skills: initialSkills,
      enemy: generateEnemy(1),
      message: className === 'mage' ? 'Nekromanta zaczyna z umiejętnością leczenia!' : ''
    }));
  };

  // Obliczanie obrażeń
  const calculateDamage = (state = gameState) => {
    let damage = state.clickDamage;
    
    // Bonus z prestige
    if (state.prestigeLevel > 0) {
      damage = Math.floor(damage * (1 + state.prestigeBonus / 100));
    }
    
    // Bonus z ekwipunku
    if (state.inventory.weapon) {
      damage += state.inventory.weapon.damage || 0;
      // Bonus z ulepszeń broni (atak w skali 5 ulepszeń)
      if (state.inventory.weapon.upgradeLevel > 0) {
        damage += state.inventory.weapon.upgradeLevel * 5;
      }
    }
    if (state.inventory.weapon && state.inventory.weapon.bonus && state.inventory.weapon.bonus.damage) {
      damage += state.inventory.weapon.bonus.damage;
    }
    
    // Pasywne bonusy z ascended broni
    if (state.passiveBonuses && state.passiveBonuses.weaponDamage > 0) {
      damage += state.passiveBonuses.weaponDamage;
    }
    
    // Bonus z berserk
    if (state.berserkActive) {
      const berserkBonus = 50 + (state.skills.berserker * 25); // 50% + 25% per level
      damage = Math.floor(damage * (1 + berserkBonus / 100));
    }
    
    // Krytyczne trafienie
    let critChance = state.critChance;
    if (state.inventory.accessory && state.inventory.accessory.critChance) {
      critChance += state.inventory.accessory.critChance;
    }
    if (state.inventory.weapon && state.inventory.weapon.bonus && state.inventory.weapon.bonus.critChance) {
      critChance += state.inventory.weapon.bonus.critChance;
    }
    // Bonus z criticalMastery
    if (state.skills.criticalMastery > 0) {
      critChance += state.skills.criticalMastery * 3;
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
      const { damage, critical } = calculateDamage(prev);
      const newEnemyHealth = prev.enemy.health - damage;
      
      // Wampiryzm z akcesoriów (HP w skali 5 ulepszeń)
      let vampirismHeal = 0;
      if (prev.inventory.accessory && prev.inventory.accessory.upgradeLevel > 0) {
        vampirismHeal = Math.floor(damage * 0.1) + (prev.inventory.accessory.upgradeLevel * 5); // 10% of damage + 5 per upgrade
      }
      
      // Pasywne bonusy wampiryzmu z ascended akcesoriów
      if (prev.passiveBonuses && prev.passiveBonuses.accessoryVampirism > 0) {
        vampirismHeal += prev.passiveBonuses.accessoryVampirism;
      }
      
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
        
        // Regeneracja ze skilla healthRegen (teraz regeneruje manę)
        if (prev.skills.healthRegen > 0) {
          const manaRegenAmount = prev.skills.healthRegen;
          newMana = Math.min(newMaxMana, newMana + manaRegenAmount);
          if (manaRegenAmount > 0) {
            regenMessage += ` 💙 +${manaRegenAmount} MP (regen)!`;
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
        if (prev.inventory.armor) {
          totalDefense += prev.inventory.armor.defense || 0;
          // Bonus z ulepszeń zbroi (obrona w skali 5 ulepszeń)
          if (prev.inventory.armor.upgradeLevel > 0) {
            totalDefense += prev.inventory.armor.upgradeLevel * 5;
          }
        }
        if (prev.inventory.armor && prev.inventory.armor.bonus && prev.inventory.armor.bonus.defense) {
          totalDefense += prev.inventory.armor.bonus.defense;
        }
        
        // Pasywne bonusy z ascended zbroi
        if (prev.passiveBonuses && prev.passiveBonuses.armorDefense > 0) {
          totalDefense += prev.passiveBonuses.armorDefense;
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
        
        // Apply vampirism healing
        let finalHealth = newPlayerHealth;
        if (vampirismHeal > 0) {
          finalHealth = Math.min(prev.maxHealth, newPlayerHealth + vampirismHeal);
        }
        
        return {
          ...prev,
          enemy: { ...prev.enemy, health: newEnemyHealth },
          health: finalHealth,
          message: `${critical ? 'KRYT! ' : ''}Zadajesz ${damage} obrażeń! ${prev.enemy.name} kontratakuje za ${enemyDamage} obrażeń.${vampirismHeal > 0 ? ` Wampiryzm: +${vampirismHeal} HP!` : ''}`
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
          
        case 'skeletonSummon':
          manaCost = 25;
          if (newMana >= manaCost) {
            const skeletons = 1 + skillLevel;
            newMana -= manaCost;
            message = `Przywołujesz ${skeletons} szkieletów do walki!`;
          }
          break;
          
        case 'darkStrike':
          manaCost = 20;
          if (newMana >= manaCost && newEnemy && newEnemy.type === 'enemy') {
            const damage = skillLevel * 40;
            newEnemy = { ...newEnemy, health: Math.max(0, newEnemy.health - damage) };
            newMana -= manaCost;
            message = `Mroczny Cios za ${damage} obrażeń!`;
          }
          break;
          
        case 'deathCurse':
          manaCost = 30;
          if (newMana >= manaCost && newEnemy && newEnemy.type === 'enemy') {
            const damage = skillLevel * 45;
            newEnemy = { ...newEnemy, health: Math.max(0, newEnemy.health - damage) };
            newMana -= manaCost;
            message = `Klątwa Śmierci za ${damage} obrażeń!`;
          }
          break;
          
        case 'hellfire':
          manaCost = 30;
          if (newMana >= manaCost && newEnemy && newEnemy.type === 'enemy') {
            const damage = skillLevel * 50;
            newEnemy = { ...newEnemy, health: Math.max(0, newEnemy.health - damage) };
            newMana -= manaCost;
            message = `Płomienie Piekła za ${damage} obrażeń!`;
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
    console.log('[handleEvent] Called with gameState.enemy:', gameState.enemy);
    if (!gameState.enemy || gameState.enemy.type !== 'event') {
      console.log('[handleEvent] Early return - not an event');
      return;
    }
    
    setGameState(prev => {
      console.log('[handleEvent] Processing event:', prev.enemy);
      const event = prev.enemy;
      let newGold = prev.gold;
      let newHealth = prev.health;
      let message = event.description;
      
      if (event.reward) {
        newGold += event.reward.gold || 0;
        message += ` Otrzymujesz ${event.reward.gold} złota!`;
      }
      
      if (event.damage) {
        newHealth = newHealth - event.damage;
        message += ` Tracisz ${event.damage} HP!`;
        
        // Sprawdź czy gracz przeżył
        if (newHealth <= 0) {
          saveHighScore(prev.level, prev.floor, prev.prestigeLevel);
          return {
            ...prev,
            health: 0,
            gameOver: true,
            autoClick: false,
            message: `Zginąłeś w pułapce! Osiągnąłeś poziom ${prev.level} i piętro ${prev.floor}.`
          };
        }
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
      armor: 7, powerShot: 7, manaShield: 7, skeletonSummon: 7, darkStrike: 7,
      lightning: 14, regeneration: 14, berserker: 14, deathCurse: 14, hellfire: 14,
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
      
      if (existingItem && existingItem.id === recipe.id && existingItem.upgradeLevel < 6) {
        // Upgrade istniejącego przedmiotu (max level 6, potem ascend)
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
      } else if (existingItem && existingItem.id === recipe.id && existingItem.upgradeLevel === 6) {
        // Ascend - poziom 7 to ascend, daje pasywny bonus
        const newPassiveBonuses = { ...prev.passiveBonuses };
        
        if (recipe.type === 'weapon') {
          newPassiveBonuses.weaponDamage += 25; // Pasywny bonus ataku
          newPassiveBonuses.ascendedWeapons += 1;
        } else if (recipe.type === 'armor') {
          newPassiveBonuses.armorDefense += 25; // Pasywny bonus obrony
          newPassiveBonuses.ascendedArmors += 1;
        } else if (recipe.type === 'accessory') {
          newPassiveBonuses.accessoryVampirism += 15; // Pasywny bonus wampiryzmu
          newPassiveBonuses.ascendedAccessories += 1;
        }
        
        // Usuń przedmiot z ekwipunku po ascend
        newInventory[recipe.type] = null;
        
        return {
          ...prev,
          materials: newMaterials,
          inventory: newInventory,
          passiveBonuses: newPassiveBonuses,
          message: `🌟 ASCEND! ${recipe.name} został ascended! Otrzymujesz pasywny bonus!`
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
      skills: { 
        // Podstawowe - resetowane
        fireball: 0, heal: 0, criticalStrike: 0, 
        // Poziom 7 - resetowane
        armor: 0, powerShot: 0, manaShield: 0, skeletonSummon: 0, darkStrike: 0,
        // Poziom 14 - resetowane
        lightning: 0, regeneration: 0, berserker: 0, deathCurse: 0, hellfire: 0,
        // Poziom 21 - ZACHOWANE po prestige (użyteczne)
        autoClick: prev.skills.autoClick, teleport: 0, divine: 0,
        berserkRage: prev.skills.berserkRage, materialMagnet: prev.skills.materialMagnet, 
        goldRush: prev.skills.goldRush, experienceBoost: prev.skills.experienceBoost, 
        criticalMastery: prev.skills.criticalMastery, healthRegen: prev.skills.healthRegen
      },
      passiveBonuses: prev.passiveBonuses, // Zachowaj pasywne bonusy po prestige
      materials: { wood: 0, iron: 0, steel: 0, mithril: 0, adamant: 0, gems: 0, essence: 0 },
      message: `Prestige! Zaczynasz od nowa z bonusami! +${newPrestigeBonus}% ataku! Zachowane umiejętności użyteczne!`,
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

  // Reset gry - teraz bezpośrednio resetuje grę
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
      playerName: '',
      enemy: null,
      floor: 1,
      gameOver: false,
      message: 'Witaj w The Darker Clicker! Wybierz swoją ścieżkę...',
      activeTab: 'game',
      showOptionsModal: false,
      prestigeLevel: 0,
      prestigeBonus: 0,
      autoClick: false,
      berserkActive: false,
      berserkTimeLeft: 0,
      inventory: { weapon: null, armor: null, accessory: null },
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0, berserkRage: 0, materialMagnet: 0, goldRush: 0, experienceBoost: 0, criticalMastery: 0, healthRegen: 0, skeletonSummon: 0, darkStrike: 0, deathCurse: 0, hellfire: 0 },
      passiveBonuses: { weaponDamage: 0, armorDefense: 0, accessoryVampirism: 0, ascendedWeapons: 0, ascendedArmors: 0, ascendedAccessories: 0 },
      materials: { wood: 0, iron: 0, steel: 0, mithril: 0, adamant: 0, gems: 0, essence: 0 },
      highScores: prev.highScores, // Zachowaj high scores
      showResetModal: false
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
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0, berserkRage: 0, materialMagnet: 0, goldRush: 0, experienceBoost: 0, criticalMastery: 0, healthRegen: 0, skeletonSummon: 0, darkStrike: 0, deathCurse: 0, hellfire: 0 },
      passiveBonuses: { weaponDamage: 0, armorDefense: 0, accessoryVampirism: 0, ascendedWeapons: 0, ascendedArmors: 0, ascendedAccessories: 0 },
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
      skills: { fireball: 0, heal: 0, criticalStrike: 0, armor: 0, powerShot: 0, manaShield: 0, lightning: 0, regeneration: 0, berserker: 0, autoClick: 0, teleport: 0, divine: 0, berserkRage: 0, materialMagnet: 0, goldRush: 0, experienceBoost: 0, criticalMastery: 0, healthRegen: 0, skeletonSummon: 0, darkStrike: 0, deathCurse: 0, hellfire: 0 },
      passiveBonuses: { weaponDamage: 0, armorDefense: 0, accessoryVampirism: 0, ascendedWeapons: 0, ascendedArmors: 0, ascendedAccessories: 0 },
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
