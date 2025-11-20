const gameState = {
  currentLocation: 'character-select',
  corruption: 12,
  playerHP: 100,
  playerMP: 50,
  completedLocations: [], // 'starting-village', 'dark-forest', etc. 
  inventory: []
};

// When page loads, start the game
document.addEventListener('DOMContentLoaded', () => {
  updateCharacterDisplay(playerCharacter);
  renderLocation(gameState.currentLocation);
});

