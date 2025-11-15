var enemyName = document.getElementById('enemyName');
var enemyCurrentHP = document.getElementById('enemyCurrentHP');
var enemyMaxHP = document.getElementById('enemyMaxHP');

function updateEnemyStats(en) {
    enemyName.innerHTML = en.name;
    enemyCurrentHP.innerHTML = en.currentHP;
    enemyMaxHP.innerHTML = en.maxHP;
}

function whoAttacksFirst(en) {
    if (party.partyLeader.speed >= en.speed) {
        enableAttackButtons();
    }
    else {
        enemyAttack(en);
    }
}

function performAttack(att) {
    let attack = party.activeCharacter.moveList[att];

    if (checkMP(attack, party.activeCharacter)) {
        //random for damage between min & max
        let damage = Math.round(Math.random() * (attack.maxDamage - attack.minDamage + 1) + attack.minDamage);

        let realDamage = factorDefenseInDamage(currentEnemy, damage);

        party.activeCharacter.currentMP -= attack.mpNeeded;
        updateCharacterInfo(party.activeCharacter);

        disableAttackButtons();
        dealDamage(realDamage, currentEnemy);
    }
    else {
        gameText.innerHTML = "Not enough MP to perform that attack!<br /><br />" + gameText.innerHTML;
    }
}

function checkMP(att, p) {
    if (p.currentMP >= att.mpNeeded)
        return true;
    else return false;
}

function dealDamage(damage, e) {
    e.currentHP -= damage;
    //check if dead
    if (e.currentHP <= 0) {
        gameText.innerHTML = "The " + e.name + " has been destroyed!<br /><br />" + gameText.innerHTML;
        if (!party.completedFirstBattle) {
            gameText.innerHTML = "Hmmm, that didn't seem so weird for " + party.currentRegion.name + "...<br /><br />" + gameText.innerHTML;
        }
        disableAttackButtons();
        disableFightFleeButtons();
    }
    else {
        gameText.innerHTML = e.name + " has taken " + damage + " damage!<br /><br />" + gameText.innerHTML;
        
        //enemyAttack(e);
        if (e instanceof Enemy) {
        disableAttackButtons();
        updateEnemyStats(e)
        enemyAttack(e);
        }
        else {
            enableAttackButtons();
        }
    }
    updateCharacterInfo(party.partyLeader);
}

function enemyAttack(e) {
    let attack = e.moveList[0];
    let damage = Math.round(Math.random() * (attack.maxDamage - attack.minDamage + 1) + attack.minDamage);
    let finalDamage = factorDefenseInDamage(party.partyLeader, damage);
    dealDamage(finalDamage, party.partyLeader);
    updateCharacterInfo(party.partyLeader);
    enableAttackButtons();
}

function disableAttackButtons() {
    attackButtons.forEach(e => {
            e.disabled = true;
        });
}

function enableAttackButtons() {
    attackButtons.forEach(e => {
            e.disabled = false;
        });
}

function disableFightFleeButtons() {
    //document.getElementById('btnFight').disabled = true;
    //document.getElementById('btnFlee').disabled = true;
    fightBtn.disabled = true;
    fleeBtn.disabled = true;
}

function enableFlightFleeButtons() {
    //document.getElementById('btnFight').disabled = false;
    //document.getElementById('btnFlee').disabled = false;
    fightBtn.disabled = false;
    fleeBtn.disabled = false;
}

function factorDefenseInDamage(target, damage) {
    var finalDamage;
    if (target.defense > damage * 2)
        finalDamage = Math.round(damage / 2);
    else if (target.defense > damage)
        finalDamage = damage - (target.defense - damage);
    else if (target.defense * 2 < damage)
        finalDamage = Math.round(damage * 1.2);
    else if (target.defense <= damage)
        finalDamage = damage;

    return finalDamage;
}