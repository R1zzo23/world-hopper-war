var playableCharacters = [];
var mushroomKingdom;
var kanto;
var hyrule;
var party;
var enemyList = [];
//var attackButtons = document.getElementsByClassName('attackMoveBtns');
var attackButtons = document.querySelectorAll('button.attackMoveBtns');
// this game needs work

const gameState = {
  currentLocation: 'hyrule-kingdom',
  corruption: 12,
  playerHP: 100,
  playerMP: 50,
  completedLocations: [], // 'starting-village', 'dark-forest', etc. 
  inventory: []
};

function gameStart() {
    createInitialRegions();
    createStartingCharacters();
    createStartingAttacks();
    createEnemies();
    pauseTimer();
}

function selectPartyLeader(x) {
    partyLeader = playableCharacters[x - 1];
    party = new Party(partyLeader);
    updateCharacterInfo(partyLeader);
    updateAttackList(partyLeader);
    updatePartyRegion(party);

    if (x == 1)
        document.getElementById('activeCharacter').innerHTML = '<button type="button" class="btn btn-success btn-partyLeaderSelect">Link</button>';
    else if (x == 2)
        document.getElementById('activeCharacter').innerHTML = '<button type="button" class="btn btn-danger btn-partyLeaderSelect">Mario</button>';
    else
        document.getElementById('activeCharacter').innerHTML = '<button type="button" class="btn btn-warning btn-partyLeaderSelect">Pikachu</button>';

    //Removes character selection rows after choosing party leader
    document.getElementById('characterSelectHeader').remove();
    document.getElementById('characterSelectButtons').remove();

    //Shows character info and region info sections after party leader chosen
    document.getElementById('characterInfo').removeAttribute('hidden');
    document.getElementById('actionButtons').removeAttribute('hidden');
    //document.getElementById('tabBar').removeAttribute('hidden');
    //document.getElementById('openedPage').removeAttribute('hidden');
    /*document.querySelectorAll('button.attackMoveBtns').forEach(elem => {
        elem.disabled = true;
    });*/
    attackButtons.forEach(e => {
        e.disabled = true;
    });
    startTimer();
}