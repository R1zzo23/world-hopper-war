function createStartingCharacters () {
    var Link = new Person("Link");
    var Mario = new Person("Mario");
    var Pikachu = new Person("Pikachu");

    playableCharacters.push(Link);
    playableCharacters.push(Mario);
    playableCharacters.push(Pikachu);
}

function createEnemies() {
    var goomba = new Enemy("Goomba", 30, 6, 5, 2, mushroomKingdom, enemyType.Normal);
    goomba.addAttack(new Attack("Goomba Bump", -2, 2, 0, attackType.Basic, "A shoulder bump from a creature with no shoulders."));
    enemyList.push(goomba);
    var rocketMeowth = new Enemy("Rocket Meowth", 22, 8, 8, 8, kanto, enemyType.Normal);
    rocketMeowth.addAttack(new Attack("Scratch", -3, -1, 0, attackType.Basic, "Deals quick, light damage to targeted enemy."));
    enemyList.push(rocketMeowth);
    var bokoblin = new Enemy("Bokoblin", 55, 5, 4, 3, hyrule, enemyType.Normal);
    bokoblin.addAttack(new Attack("Club Smash", -4, 4, 0, attackType.Basic, "Wild flail from a wooden club."));
    enemyList.push(bokoblin);
}

function createStartingAttacks() {
    // Link's starting moves
    var swordAttack = new Attack("Sword Attack", -4, 4, 0, attackType.Basic, "Kokiri Sword delivers slash to targeted enemy.");
    var spinAttack = new Attack("Spin Attack", 5, 13, 5, attackType.Special, "Powerful attack that can hit multiple enemies.");
    var shieldSlam = new Attack("Shield Bash", -20, -5, 5, attackType.Special, "Hylian shield bashes target and provides heightened defense next attack.");
    // add moves to Link
    playableCharacters[0].addAttack(swordAttack);
    playableCharacters[0].addAttack(spinAttack);
    playableCharacters[0].addAttack(shieldSlam);
    // Mario's starting moves
    var jumpPunch = new Attack("Jump Punch", -1, 3, 0, attackType.Basic, "Classic uppercut to deal blow to a targeted enemy.");
    var fireball = new Attack("Fireball", 2, 6, 5, attackType.Special, "Bouncing ball of flame to singe a single target.");
    var slide = new Attack("Slide", -15, -15, 0, attackType.Special, "Takes position to slide away from next attack.");
    // add moves to Mario
    playableCharacters[1].addAttack(jumpPunch);
    playableCharacters[1].addAttack(fireball);
    playableCharacters[1].addAttack(slide);
    // Pikachu's starting moves
    var scratch = new Attack("Scratch", -3, -1, 0, attackType.Basic, "Deals quick, light damage to targeted enemy.");
    var tailWhip = new Attack("Tail Whip", -10, -10, 1, attackType.Special, "Lowers defense of targeted enemy for rest of battle.");
    var thunderShock = new Attack("Thunder Shock", 15, 25, 5, attackType.Special, "Electric surge to shock targeted enemy.");
    // add moves to Pikachu
    playableCharacters[2].addAttack(scratch);
    playableCharacters[2].addAttack(tailWhip);
    playableCharacters[2].addAttack(thunderShock);
}