//#region Variables
var timer;
window.timeTick = 0;
var gameText = document.getElementById('gameText');
var fightBtn = document.getElementById('btnFight');
var fleeBtn = document.getElementById('btnFlee');
var exploreBtn = document.getElementById('btnExplore');
var continueBtn = document.getElementById('btnContinue');
var currentEnemy;

//#endregion

function displayInfo(characterName) {
    const player = new Person(characterName);
}

function updateCharacterInfo(character) {
    //document.getElementById('characterName').innerHTML = character.name;
    document.getElementById('characterCurrentHP').innerHTML = character.currentHP;
    document.getElementById('characterMaxHP').innerHTML = character.maxHP;
    document.getElementById('characterCurrentMP').innerHTML = character.currentMP;
    document.getElementById('characterMaxMP').innerHTML = character.maxMP;
}

function updatePartyRegion(x) {
    document.getElementById('currentRegion').innerHTML = x.currentRegion.name;
    document.getElementById('currentRegionDistortionLevel').innerHTML = x.currentRegion.distortionLevel;
    document.getElementById('currentRegionCorruptionDetected').innerHTML = x.currentRegion.corrupted;
}

function updateAttackList(character) {
    document.getElementById('attackZero').innerHTML = character.moveList[0].name;
    document.getElementById('attackOne').innerHTML = character.moveList[1].name;
    document.getElementById('attackTwo').innerHTML = character.moveList[2].name;
    document.getElementById('attackZeroDescription').innerHTML = character.moveList[0].description;
    document.getElementById('attackOneDescription').innerHTML = character.moveList[1].description;
    document.getElementById('attackTwoDescription').innerHTML = character.moveList[2].description;
}

//#region Game Engine

//timer that acts as the game engine
function startTimer() {
    timer = window.setInterval(function(){
        //timer clicks every second
        advanceTime();
        //add checks for timer related actions
        
    }, 1000); //1000 = 1 second; 10 = .01 seconds
    continueBtn.disabled = true;
}

function pauseTimer() {
    clearInterval(timer);
    continueBtn.disabled = false;
}

function advanceTime() {
    //advance time in universe
    timeTick++;
    
    //Intro flavor text
    if (timeTick == 1) {
        gameText.innerHTML = partyLeader.name + " awakens in " + partyLeader.homeRegion.name
        + ". A strange rift appears...it's Ganondorf? He exclaims to " + partyLeader.name + " that the Nintendo worlds" 
        + " are merging and the most powerful of baddies cannot be stopped!<br /><br />" + gameText.innerHTML;
        pauseTimer();
    }
    if (timeTick == 2) {
        gameText.innerHTML = partyLeader.name + " can't help but wonder why Ganondorf would be in " + partyLeader.homeRegion.name
        + " and what he means about the worlds merging. This cannot be good...<br /><br />" + gameText.innerHTML;
        pauseTimer();
    }
    if (timeTick == 3) {
        gameText.innerHTML = "There's a russling in the bushes. Something jumps out...<br /><br />" + gameText.innerHTML;
        pauseTimer();
    }
    if (timeTick == 4) {
        currentEnemy = enemyList.find((element) => element.regionFound == party.currentRegion);
        gameText.innerHTML = "It's a " + currentEnemy.name + "!<br /><br />" + gameText.innerHTML;
        fightOrFlee(currentEnemy);
    }
    
    

    decreaseTimers();
}

function fightOrFlee(en) {
    pauseTimer();
    fightBtn.disabled = false;
    fleeBtn.disabled = false;
    continueBtn.disabled = true;
}

function fightEnemy() {
    updateEnemyStats(currentEnemy);
    whoAttacksFirst(currentEnemy);
}

function fleeEnemy() {
    console.log(partyLeader.name + " will now flee the " + currentEnemy.name);
}

function decreaseTimers() {
    
}

function openPage(pageName) {
  var i;
  var x = document.getElementsByClassName("page");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(pageName).style.display = "block";
}

//#endregion