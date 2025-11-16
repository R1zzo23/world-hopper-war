const gameState = {
  currentLocation: 'kokiri-forest',
  corruption: 12,
  playerHP: 100,
  playerMP: 50,
  completedLocations: [], // 'starting-village', 'dark-forest', etc. 
  inventory: []
};

// When page loads, start the game
document.addEventListener('DOMContentLoaded', () => {
  renderLocation(gameState.currentLocation);
});

function selectPartyLeader() {
    document.getElementById('cardContainer').removeAttribute('hidden');
}