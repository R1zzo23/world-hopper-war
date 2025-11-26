const locations = {
  'character-select': {
    name: 'Character Select',
    corruption: '',
    storyText: [
      'Make a choice of who you will begin this journey with.',
      'While some will be strong early, others could scale higher later.'
    ], 
    choices: [
      { 
        id: 'link',
        title: '⚔️ Choose Link',
        description: 'Hyrule\'s Chosen One. High attack, sword techniques, item usage',
        type: 'characterSelect',
        destination: 'hyrule-kingdom'
      }, 
      { 
        id: 'mario',
        title: '🔥 Choose Mario',
        description: 'Hero of Mushroom Kingom. Balanced stats, fire-based abilities',
        type: 'characterSelect',
        destination: 'mushroom-kingdom'
      }, 
      { 
        id: 'pikachu',
        title: '⚡️ Choose Pikachu',
        description: 'Electric Dynamo from Kanto. Fast, agile, volatile electric attacks',
        type: 'characterSelect',
        destination: 'kanto'
      }
    ]
  },
  'hyrule-kingdom': {
    name: '🏰 Hyrule Kingdom',
    corruption: 45,
    storyText: [
      'A once-colorful and vibrant kingdom has a distinct darkness falling upon it.',
      'Strange rifts shimmer in the air, and corrupted enemies wander the lands.'
    ],
    choices: [
      {
        id: 'forest-kokiri',
        title: '⚔️ Investigate the Kokiri Forest',
        description: 'Strange sounds echo from the corrupted trees. Battle ahead.',
        type: 'story',
        destination: 'kokiri-forest'
      },
      {
        id: 'hylia-lake',
        title: '✨ Explore Lake Hylia',
        description: 'Hylians have spoken of strange happenings around their lake.',
        type: 'story',
        destination: 'lake-hylia', 
        requirement: 'complete-kokiri-forest'
      },
      {
        id: 'castle-hyrule',
        title: '🏰 Approach Hyrule Castle',
        description: 'The castle gates are guarded by corrupted enemies.',
        type: 'story',
        destination: 'castle-gates',
        requirement: 'complete-kokiri-forest' // Optional: lock until condition met
      }
      // Add more choices...
    ]
  },
  
  'kokiri-forest': {
    name: '🌳 Kokiri Forest',
    corruption: 28,
    storyText: [
      'A lush, green area of Hyrule, the Kokiri Forest has seen darkness seep in.',
      'The Kokiri people are in need of help to restore this outdoor sanctuary.'
    ],
    choices: [
      {
        id: 'house-link',
        title: '⚔️ Rest at Link\'s house',
        description: 'Regain some HP and MP while resting in safety.',
        type: 'rest',
        destination: 'link-house'
      },
      {
        id: 'center-training',
        title: '✨ Kokiri Training Center',
        description: 'Train like a Kokiri to improve one of your skills.',
        type: 'special',
        destination: 'training-center',
        //requirement: 'complete-house-link',
        isCleared: false
      },
      {
        id: 'woods-lost',
        title: '🌳 Explore Lost Woods',
        description: 'What secrets and evil lie in the wood?',
        type: 'battle',
        destination: 'lost-woods', 
        //requirement: 'complete-center-training',
        isCleared: false
      }, 
      {
        id: 'tree-deku',
        title: '🌳 Save the Deku Tree',
        description: 'The elder wood of Kokiri is infected with corruption.',
        type: 'danger',
        destination: 'deku-tree',
        requirement: 'complete-woods-lost', // Optional: lock until condition met
        isCleared: false
      }, 
      {
        id: 'kingdom-hyrule',
        title: '🏰 Explore Hyrule Kingdom',
        description: 'Leave the forest to explore the kingdom.',
        type: 'story',
        destination: 'hyrule-kingdom'
      }
    ]
  }
  // Add all your other locations...
};

function renderLocation(locationId) {
  const location = locations[locationId];
  console.log(gameState.completedLocations);
  // Update location header
  document.querySelector('.current-location').textContent = location.name;
  document.querySelector('.corruption-badge').textContent = `⚠️ ${location.corruption}% Corrupted`;
  
  // Update story text
  const storyContainer = document.querySelector('.story-text');
  storyContainer.innerHTML = ''; // Clear previous text
  
  location.storyText.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    storyContainer.appendChild(p);
  });
  
  // Render choices
  renderChoices(location.choices);
}

function renderChoices(choices) {
  const container = document.querySelector('.choices-container');
  container.innerHTML = ''; // Clear old choices
  
  choices.forEach(choice => {
    // Check if choice is locked
    const isLocked = choice.requirement && !checkRequirement(choice.requirement);
    const isCleared = choice.isCleared;
    
    if (isLocked) return; // Skip locked choices (or render them disabled)
    
    // Create button
    const button = document.createElement('button');
    button.className = `choice-btn ${choice.type}`;
    
    // Add title
    const title = document.createElement('div');
    title.className = 'choice-title';
    title.textContent = choice.title;
    
    // Add description
    const description = document.createElement('div');
    description.className = 'choice-description';
    description.textContent = choice.description;
    
    // Add icon
    const icon = document.createElement('span');
    icon.className = 'choice-icon';
    icon.textContent = '→';
    
    // Assemble button
    button.appendChild(title);
    button.appendChild(description);
    button.appendChild(icon);
    
    // Add click handler
    if (choice.isCleared != true)
      button.addEventListener('click', () => handleChoice(choice));
    
    container.appendChild(button);
  });
}

function handleChoice(choice) {
  // Different actions based on choice type
  
  if (choice.type === 'battle') {
    // Start a battle
    //startBattle(choice.destination);
    gameState.completedLocations.push(choice.id);
    console.log("Completed the " + choice.id);
    console.log(gameState.completedLocations);
    if (choice.isCleared == false) {
      choice.isCleared = true;
      console.log("Cleared " + choice.id);
    }
      
    gameState.completedLocations.push('kokiri-forest');
    renderLocation('kokiri-forest');

  } 
  else if (choice.type === 'shop') {
    // Open shop
    openShop();
  }
  else if (choice.type === 'rest') {
    // Restore HP/MP
    restAtInn();
  }
  else if (choice.type === 'characterSelect') {
    console.log("setting character to " + choice.id);
    playerCharacter.name = heroes[choice.id].name;
    playerCharacter.icon = heroes[choice.id].icon;
    playerCharacter.maxHP = heroes[choice.id].maxHP;
    playerCharacter.currentHP = heroes[choice.id].currentHP;
    playerCharacter.maxMP = heroes[choice.id].maxMP;
    playerCharacter.currentMP = heroes[choice.id].currentMP;
    playerCharacter.strength = heroes[choice.id].strength;
    playerCharacter.defense = heroes[choice.id].defense;
    playerCharacter.speed = heroes[choice.id].speed;
    playerCharacter.moveList = heroes[choice.id].moveList;
    playerCharacter.itemList = heroes[choice.id].itemList;
    console.log(playerCharacter);
    updateCharacterDisplay(playerCharacter);
  }
  else {
    // Default: navigate to new location
    gameState.currentLocation = choice.destination;
    renderLocation(choice.destination);
  }
}

// Check if a requirement is met
function checkRequirement(requirement) {
  // Example: 'complete-forest' checks if forest is completed
  if (requirement.startsWith('complete-')) {
    const locationId = requirement.replace('complete-', '');
    return gameState.completedLocations.includes(locationId);
  }
  
  // Add other requirement types as needed
  return true;
}

// Start the battle system
function startBattle(enemyLocation) {
  // Hide exploration UI
  document.querySelector('.game-container').style.display = 'none';
  
  // Show battle UI (you'll create this separately)
  // initializeBattle(enemyLocation);
  
  console.log('Battle started at:', enemyLocation);
}

// Return from battle to exploration
function returnToExploration(won) {
  if (won) {
    gameState.completedLocations.push(gameState.currentLocation);
  }
  
  // Show exploration UI again
  document.querySelector('.game-container').style.display = 'block';
  
  // Re-render current location (choices may have changed)
  renderLocation(gameState.currentLocation);
}