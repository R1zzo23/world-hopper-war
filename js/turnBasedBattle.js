// ===== STATUS EFFECT CLASS =====
class StatusEffect {
  constructor(name, duration, type, value) {
    this.name = name;
    this.duration = duration; // Turns remaining
    this.type = type; // 'poison', 'burn', 'paralysis', 'sleep', 'buff', 'debuff'
    this.value = value; // Damage per turn or stat modifier
  }

  apply(character) {
    let message = "";
    
    switch(this.type) {
      case 'poison':
      case 'burn':
        const damage = character.takeDamage(this.value, 'status');
        message = `${character.name} took ${damage.damage} damage from ${this.name}!`;
        break;
      case 'paralysis':
        message = `${character.name} is paralyzed!`;
        break;
      case 'sleep':
        message = `${character.name} is asleep!`;
        break;
      case 'regen':
        const heal = character.heal(this.value);
        message = `${character.name} recovered ${heal} HP from ${this.name}!`;
        break;
    }
    
    this.duration--;
    return message;
  }

  canAct() {
    // Some status effects prevent actions
    if (this.type === 'sleep') return Math.random() > 0.7; // 30% chance to wake up
    if (this.type === 'paralysis') return Math.random() > 0.25; // 25% chance to be fully paralyzed
    return true;
  }
}

// ===== CHARACTER CLASS =====
class Character {
  constructor(name, stats, moveList, weaknesses = {}, resistances = {}) {
    this.name = name;
    this.maxHP = stats.maxHP;
    this.currentHP = stats.currentHP || stats.maxHP;
    this.maxMP = stats.maxMP;
    this.currentMP = stats.currentMP || stats.maxMP;
    this.baseStrength = stats.strength;
    this.baseDefense = stats.defense;
    this.baseSpeed = stats.speed;
    this.critRate = stats.critRate || 0.1; // 10% default crit rate
    this.critMultiplier = stats.critMultiplier || 2.0; // 2x damage on crit
    this.moveList = moveList;
    this.weaknesses = weaknesses;
    this.resistances = resistances;
    this.isAlive = true;
    this.statusEffects = [];
    this.statModifiers = {
      strength: 1.0,
      defense: 1.0,
      speed: 1.0
    };
  }

  // Get current stats with modifiers
  get strength() {
    return Math.round(this.baseStrength * this.statModifiers.strength);
  }

  get defense() {
    return Math.round(this.baseDefense * this.statModifiers.defense);
  }

  get speed() {
    return Math.round(this.baseSpeed * this.statModifiers.speed);
  }

  getTypeMultiplier(damageType) {
    let multiplier = 1.0;
    if (this.weaknesses[damageType]) multiplier *= this.weaknesses[damageType];
    if (this.resistances[damageType]) multiplier *= this.resistances[damageType];
    return multiplier;
  }

  takeDamage(amount, damageType = 'physical') {
    const typeMultiplier = this.getTypeMultiplier(damageType);
    const finalDamage = Math.round(amount * typeMultiplier);
    this.currentHP = Math.max(0, this.currentHP - finalDamage);
    
    if (this.currentHP === 0) this.isAlive = false;
    
    return {
      damage: finalDamage,
      multiplier: typeMultiplier,
      effectiveness: this.getEffectivenessText(typeMultiplier)
    };
  }

  heal(amount) {
    const healAmount = Math.min(amount, this.maxHP - this.currentHP);
    this.currentHP += healAmount;
    return healAmount;
  }

  useMP(amount) {
    if (this.currentMP >= amount) {
      this.currentMP -= amount;
      return true;
    }
    return false;
  }

  restoreMP(amount) {
    const restoreAmount = Math.min(amount, this.maxMP - this.currentMP);
    this.currentMP += restoreAmount;
    return restoreAmount;
  }

  getEffectivenessText(multiplier) {
    if (multiplier > 1.2) return "Super effective!";
    if (multiplier < 0.8) return "Not very effective...";
    return "";
  }

  canUseMove(move) {
    return this.currentMP >= move.mpCost && this.isAlive;
  }

  addStatusEffect(effect) {
    // Check if already has this status
    const existing = this.statusEffects.find(e => e.name === effect.name);
    if (existing) {
      existing.duration = Math.max(existing.duration, effect.duration);
    } else {
      this.statusEffects.push(effect);
    }
  }

  applyStatusEffects() {
    const messages = [];
    this.statusEffects = this.statusEffects.filter(effect => {
      if (effect.duration > 0) {
        messages.push(effect.apply(this));
        return effect.duration > 0;
      }
      return false;
    });
    return messages;
  }

  canAct() {
    // Check if any status effect prevents action
    for (let effect of this.statusEffects) {
      if (!effect.canAct()) return false;
    }
    return true;
  }

  modifyStat(stat, multiplier, duration) {
    this.statModifiers[stat] *= multiplier;
    // Note: You'd want to track this with a timer to reset after duration
  }
}

// ===== MOVE CLASS =====
class Move {
  constructor(name, type, mpCost, power, damageType, options = {}) {
    this.name = name;
    this.type = type; // 'attack', 'heal', 'buff', 'debuff', 'status'
    this.mpCost = mpCost;
    this.power = power;
    this.damageType = damageType;
    this.targetType = options.targetType || 'single'; // 'single', 'all', 'self'
    this.statusEffect = options.statusEffect || null;
    this.statusChance = options.statusChance || 1.0; // 100% chance by default
    this.statModifier = options.statModifier || null; // {stat: 'strength', multiplier: 1.5}
    this.critRateBonus = options.critRateBonus || 0; // Additional crit chance for this move
  }

  execute(user, targets) {
    // targets should be an array
    if (!Array.isArray(targets)) targets = [targets];
    
    if (!user.canUseMove(this)) {
      return { success: false, message: `${user.name} doesn't have enough MP!` };
    }

    user.useMP(this.mpCost);

    if (this.type === 'attack') {
      return this.executeAttack(user, targets);
    } else if (this.type === 'heal') {
      return this.executeHeal(user, targets);
    } else if (this.type === 'buff' || this.type === 'debuff') {
      return this.executeStatChange(user, targets);
    } else if (this.type === 'status') {
      return this.executeStatus(user, targets);
    }

    return { success: false, message: "Unknown move type!" };
  }

  calculateCrit(user) {
    const critChance = user.critRate + this.critRateBonus;
    return Math.random() < critChance;
  }

  executeAttack(user, targets) {
    const messages = [];
    let totalDamage = 0;
    const results = [];

    messages.push(`${user.name} used ${this.name}!`);

    targets.forEach(target => {
      if (!target.isAlive) return;

      const baseDamage = (user.strength * this.power) - (target.defense / 2);
      let finalDamage = Math.max(1, Math.round(baseDamage));
      
      const isCrit = this.calculateCrit(user);
      if (isCrit) {
        finalDamage = Math.round(finalDamage * user.critMultiplier);
      }
      
      const result = target.takeDamage(finalDamage, this.damageType);
      
      let targetMessage = `${target.name} took ${result.damage} damage!`;
      if (isCrit) targetMessage += " Critical hit!";
      if (result.effectiveness) targetMessage += ` ${result.effectiveness}`;
      
      messages.push(targetMessage);
      totalDamage += result.damage;
      
      // Apply status effect if applicable
      if (this.statusEffect && Math.random() < this.statusChance) {
        target.addStatusEffect(new StatusEffect(
          this.statusEffect.name,
          this.statusEffect.duration,
          this.statusEffect.type,
          this.statusEffect.value
        ));
        messages.push(`${target.name} was inflicted with ${this.statusEffect.name}!`);
      }

      results.push({ target: target.name, damage: result.damage, isCrit });
    });

    return {
      success: true,
      message: messages.join(' '),
      totalDamage,
      results
    };
  }

  executeHeal(user, targets) {
    const messages = [];
    let totalHealing = 0;

    messages.push(`${user.name} used ${this.name}!`);

    targets.forEach(target => {
      const healAmount = target.heal(this.power);
      messages.push(`${target.name} recovered ${healAmount} HP!`);
      totalHealing += healAmount;
    });

    return {
      success: true,
      message: messages.join(' '),
      totalHealing
    };
  }

  executeStatChange(user, targets) {
    const messages = [];
    messages.push(`${user.name} used ${this.name}!`);

    targets.forEach(target => {
      if (this.statModifier) {
        target.modifyStat(this.statModifier.stat, this.statModifier.multiplier);
        const changeText = this.statModifier.multiplier > 1 ? 'increased' : 'decreased';
        messages.push(`${target.name}'s ${this.statModifier.stat} ${changeText}!`);
      }
    });

    return {
      success: true,
      message: messages.join(' ')
    };
  }

  executeStatus(user, targets) {
    const messages = [];
    messages.push(`${user.name} used ${this.name}!`);

    targets.forEach(target => {
      if (this.statusEffect && Math.random() < this.statusChance) {
        target.addStatusEffect(new StatusEffect(
          this.statusEffect.name,
          this.statusEffect.duration,
          this.statusEffect.type,
          this.statusEffect.value
        ));
        messages.push(`${target.name} was inflicted with ${this.statusEffect.name}!`);
      } else {
        messages.push(`${target.name} resisted!`);
      }
    });

    return {
      success: true,
      message: messages.join(' ')
    };
  }
}

// ===== AI CLASS =====
class BattleAI {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty; // 'easy', 'normal', 'hard'
  }

  chooseMove(aiCharacter, opponents, allies) {
    const usableMoves = aiCharacter.moveList.filter(move => 
      aiCharacter.canUseMove(move)
    );

    if (usableMoves.length === 0) {
      return { moveIndex: 0, targets: [opponents[0]] }; // Default to first move
    }

    // Calculate scores for each move
    const moveScores = usableMoves.map(move => ({
      move,
      score: this.evaluateMove(move, aiCharacter, opponents, allies)
    }));

    // Sort by score
    moveScores.sort((a, b) => b.score - a.score);

    // Choose move based on difficulty
    let chosenMove;
    if (this.difficulty === 'easy') {
      // Random move
      chosenMove = usableMoves[Math.floor(Math.random() * usableMoves.length)];
    } else if (this.difficulty === 'normal') {
      // 70% best move, 30% random
      chosenMove = Math.random() < 0.7 ? moveScores[0].move : usableMoves[Math.floor(Math.random() * usableMoves.length)];
    } else {
      // Always best move
      chosenMove = moveScores[0].move;
    }

    // Choose targets
    const targets = this.chooseTargets(chosenMove, aiCharacter, opponents, allies);
    const moveIndex = aiCharacter.moveList.indexOf(chosenMove);

    return { moveIndex, targets };
  }

  evaluateMove(move, user, opponents, allies) {
    let score = 0;

    if (move.type === 'attack') {
      opponents.forEach(opponent => {
        if (!opponent.isAlive) return;
        
        // Base damage potential
        const baseDamage = (user.strength * move.power) - (opponent.defense / 2);
        score += baseDamage;

        // Type effectiveness bonus
        const typeMultiplier = opponent.getTypeMultiplier(move.damageType);
        score *= typeMultiplier;

        // Prioritize low HP targets
        const hpPercent = opponent.currentHP / opponent.maxHP;
        if (hpPercent < 0.3) score *= 1.5;

        // Multi-target moves get bonus
        if (move.targetType === 'all') score *= 1.3;

        // Status effect moves get bonus
        if (move.statusEffect) score += 20;
      });
    } else if (move.type === 'heal') {
      // Prioritize healing if low HP
      const selfHpPercent = user.currentHP / user.maxHP;
      if (selfHpPercent < 0.4) {
        score += 100;
      } else if (selfHpPercent < 0.7) {
        score += 50;
      }
    } else if (move.type === 'buff') {
      // Buffs are good early in battle
      score += 40;
    }

    return score;
  }

  chooseTargets(move, user, opponents, allies) {
    if (move.targetType === 'all') {
      return move.type === 'heal' ? allies : opponents.filter(o => o.isAlive);
    } else if (move.targetType === 'self') {
      return [user];
    } else {
      // Single target - choose weakest opponent or lowest HP ally
      if (move.type === 'heal') {
        return [allies.reduce((weakest, ally) => 
          ally.currentHP < weakest.currentHP ? ally : weakest
        )];
      } else {
        const aliveOpponents = opponents.filter(o => o.isAlive);
        // Target lowest HP opponent
        return [aliveOpponents.reduce((weakest, opp) => 
          opp.currentHP < weakest.currentHP ? opp : weakest
        )];
      }
    }
  }
}

// ===== BATTLE CLASS =====
class Battle {
  constructor(team1, team2) {
    this.team1 = Array.isArray(team1) ? team1 : [team1];
    this.team2 = Array.isArray(team2) ? team2 : [team2];
    this.turnCount = 0;
    this.battleLog = [];
    this.isActive = true;
    this.ai = new BattleAI('normal');
  }

  getAllCharacters() {
    return [...this.team1, ...this.team2];
  }

  getTurnOrder() {
    const allChars = this.getAllCharacters().filter(c => c.isAlive);
    return allChars.sort((a, b) => b.speed - a.speed);
  }

  executeTurn(attacker, moveIndex, targets = null) {
    if (!this.isActive) {
      return { success: false, message: "Battle is already over!" };
    }

    // Apply status effects at start of turn
    const statusMessages = attacker.applyStatusEffects();
    statusMessages.forEach(msg => this.battleLog.push(msg));

    // Check if character can act
    if (!attacker.canAct()) {
      const msg = `${attacker.name} cannot move!`;
      this.battleLog.push(msg);
      return { success: true, message: msg, skipped: true };
    }

    const move = attacker.moveList[moveIndex];
    if (!move) {
      return { success: false, message: "Invalid move!" };
    }

    // Determine targets if not provided
    if (!targets) {
      const opponents = this.team1.includes(attacker) ? this.team2 : this.team1;
      targets = move.targetType === 'all' ? opponents.filter(o => o.isAlive) : [opponents.find(o => o.isAlive)];
    }

    const result = move.execute(attacker, targets);
    this.battleLog.push(result.message);

    // Check if battle is over
    const team1Alive = this.team1.some(c => c.isAlive);
    const team2Alive = this.team2.some(c => c.isAlive);

    if (!team1Alive || !team2Alive) {
      this.isActive = false;
      const winner = team1Alive ? 'Team 1' : 'Team 2';
      const winMessage = `${winner} wins the battle!`;
      this.battleLog.push(winMessage);
      result.battleOver = true;
      result.winner = winner;
    }

    return result;
  }

  executeAITurn(aiCharacter) {
    const opponents = this.team1.includes(aiCharacter) ? this.team2 : this.team1;
    const allies = this.team1.includes(aiCharacter) ? this.team1 : this.team2;
    
    const decision = this.ai.chooseMove(aiCharacter, opponents, allies);
    return this.executeTurn(aiCharacter, decision.moveIndex, decision.targets);
  }

  getStatus() {
    return {
      turnCount: this.turnCount,
      team1: this.team1.map(c => ({
        name: c.name,
        hp: `${c.currentHP}/${c.maxHP}`,
        mp: `${c.currentMP}/${c.maxMP}`,
        isAlive: c.isAlive,
        statusEffects: c.statusEffects.map(e => e.name)
      })),
      team2: this.team2.map(c => ({
        name: c.name,
        hp: `${c.currentHP}/${c.maxHP}`,
        mp: `${c.currentMP}/${c.maxMP}`,
        isAlive: c.isAlive,
        statusEffects: c.statusEffects.map(e => e.name)
      })),
      isActive: this.isActive
    };
  }
}

// ===== EXAMPLE USAGE =====

// Create moves with new features
const firePunch = new Move("Fire Punch", "attack", 10, 1.5, "fire", {
  statusEffect: { name: 'Burn', duration: 3, type: 'burn', value: 5 },
  statusChance: 0.3
});

const iceBeam = new Move("Ice Beam", "attack", 15, 1.8, "ice", {
  statusEffect: { name: 'Freeze', duration: 2, type: 'paralysis', value: 0 },
  statusChance: 0.2
});

const thunderbolt = new Move("Thunderbolt", "attack", 12, 1.6, "electric", {
  statusEffect: { name: 'Paralysis', duration: 3, type: 'paralysis', value: 0 },
  statusChance: 0.4,
  critRateBonus: 0.1
});

const earthquake = new Move("Earthquake", "attack", 20, 1.4, "ground", {
  targetType: 'all'
});

const powerUp = new Move("Power Up", "buff", 15, 0, "none", {
  targetType: 'self',
  statModifier: { stat: 'strength', multiplier: 1.5 }
});

const heal = new Move("Heal", "heal", 20, 30, "none");

// Create characters
const hero = new Character(
  "Fire Knight",
  { maxHP: 120, maxMP: 60, strength: 22, defense: 18, speed: 14, critRate: 0.15 },
  [firePunch, earthquake, heal, powerUp],
  { ice: 1.5, water: 1.3 },
  { fire: 0.5 }
);

const enemy1 = new Character(
  "Ice Mage",
  { maxHP: 100, maxMP: 70, strength: 20, defense: 14, speed: 16, critRate: 0.12 },
  [iceBeam, thunderbolt, heal],
  { fire: 1.5 },
  { ice: 0.5, water: 0.7 }
);

const enemy2 = new Character(
  "Thunder Beast",
  { maxHP: 90, maxMP: 50, strength: 24, defense: 12, speed: 18, critRate: 0.2 },
  [thunderbolt, earthquake],
  { ground: 1.5 },
  { electric: 0.3 }
);

// Start battle (1 vs 2)
const battle = new Battle([hero], [enemy1, enemy2]);

console.log("=== BATTLE START ===");
console.log(battle.getStatus());
console.log("\n");

// Simulate turns
for (let i = 0; i < 5 && battle.isActive; i++) {
  console.log(`--- Turn ${i + 1} ---`);
  const turnOrder = battle.getTurnOrder();
  
  for (let character of turnOrder) {
    if (!battle.isActive) break;
    
    // Player character uses move 0, AI enemies make decisions
    if (character === hero) {
      const result = battle.executeTurn(character, 0);
      console.log(result.message);
    } else {
      const result = battle.executeAITurn(character);
      console.log(result.message);
    }
    console.log("\n");
  }
  
  console.log(battle.getStatus());
  console.log("\n");
}

console.log("=== BATTLE LOG ===");
battle.battleLog.forEach((log, index) => {
  console.log(`${index + 1}. ${log}`);
});