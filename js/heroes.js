const playerCharacter = {
  name: 'Link',
  icon: 'images/link.jpg', // or use emoji: '🔴'
  maxHP: 100,
  currentHP: 80,
  maxMP: 50,
  currentMP: 45,
  strength: 20,
  defense: 15,
  speed: 12,
  moveList: [/* moves */],
  itemList: []
};

const heroes = {
    'link': {
        name: 'Link',
        characterSelectText: [
        'Hyrule\'s Chosen One',
        'High attack, <span class="greenText">sword</span> techniques, item usage'
        ],
        maxHP: 70,
        currentHP: 25,
        maxMP: 5,
        currentMP: 0,
        strength: 25,
        defense: 15,
        speed: 2,
        homeRegion: "Hyrule Kingdom",
        items: []
    }, 
    'mario': {
        name: 'Mario',
        characterSelectText: [
        'Hero of Mushroom Kingom',
        'Balanced stats, <span class="redText">fire-based</span> abilities'
        ],
        maxHP: 50,
        currentHP: 40,
        maxMP: 15,
        currentMP: 10,
        strength: 15,
        defense: 10,
        speed: 5,
        homeRegion: "Mushroom Kingdom",
        items: []
    }, 
    'pikachu': {
        name: 'Pikachu',
        characterSelectText: [
        'Electric Dynamo from Kanto',
        'Fast, agile, <span class="yellowText">volatile</span> electric attacks'
        ],
        maxHP: 40,
        currentHP: 35,
        maxMP: 30,
        currentMP: 25,
        strength: 10,
        defense: 5,
        speed: 10,
        homeRegion: "Kanto",
        items: []
    }
}

function updateCharacterDisplay(character) {
  // Update name
  document.getElementById('characterName').textContent = character.name;
  
  // Update icon (if using images)
  const iconImg = document.getElementById('characterIcon');
  if (iconImg) {
    iconImg.src = character.icon;
    iconImg.alt = character.name;
  }
  
  // Update HP
  const hpPercent = (character.currentHP / character.maxHP) * 100;
  document.getElementById('hpBar').style.width = `${hpPercent}%`;
  document.getElementById('hpValue').textContent = `${character.currentHP}/${character.maxHP}`;
  
  // Update MP
  const mpPercent = (character.currentMP / character.maxMP) * 100;
  document.getElementById('mpBar').style.width = `${mpPercent}%`;
  document.getElementById('mpValue').textContent = `${character.currentMP}/${character.maxMP}`;
  
  // Update attributes
  document.getElementById('strValue').textContent = character.strength;
  document.getElementById('defValue').textContent = character.defense;
  document.getElementById('spdValue').textContent = character.speed;
}