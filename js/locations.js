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
        destination: 'kokiri-forest'
      }, 
      { 
        id: 'mario',
        title: '🔥 Choose Mario',
        description: 'Hero of Mushroom Kingom. Balanced stats, fire-based abilities',
        type: 'characterSelect',
        destination: 'kokiri-forest'
      }, 
      { 
        id: 'pikachu',
        title: '⚡️ Choose Pikachu',
        description: 'Electric Dynamo from Kanto. Fast, agile, volatile electric attacks',
        type: 'characterSelect',
        destination: 'kokiri-forest'
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
        destination: 'lake-hylia'
      },
      {
        id: 'castle-hyrule',
        title: '🏰 Approach Hyrule Castle',
        description: 'The castle gates are guarded by corrupted enemies.',
        type: 'story',
        destination: 'castle-gates',
        requirement: 'complete-forest-kokiri' // Optional: lock until condition met
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
        type: 'story',
        destination: 'training-center'
      },
      {
        id: 'woods-lost',
        title: '🌳 Explore Lost Woods',
        description: 'What secrets and evil lie in the wood?',
        type: 'battle',
        destination: 'lost-woods'
      }, 
      {
        id: 'tree-deku',
        title: '🌳 Save the Deku Tree',
        description: 'The elder wood of Kokiri is infected with corruption.',
        type: 'danger',
        destination: 'deku-tree',
        requirement: 'complete-woods-lost' // Optional: lock until condition met
      }
    ]
  }
  // Add all your other locations...
};

function renderLocation(locationId) {
  const location = locations[locationId];
  
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
    button.addEventListener('click', () => handleChoice(choice));
    
    container.appendChild(button);
  });
}

function handleChoice(choice) {
  // Different actions based on choice type
  
  if (choice.type === 'battle') {
    // Start a battle
    startBattle(choice.destination);
  } 
  else if (choice.type === 'shop') {
    // Open shop
    openShop();
  }
  else if (choice.type === 'rest') {
    // Restore HP/MP
    restAtInn();
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