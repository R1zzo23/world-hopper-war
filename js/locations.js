const locations = {
  'hyrule-kingdom': {
    name: '🏰 Hyrule Kingdom',
    corruption: 45,
    storyText: [
      'A once-colorful and vibrant kingdom has a distinct darkness falling upon it.',
      'Strange rifts shimmer in the air, and corrupted enemies wander the streets.'
    ],
    choices: [
      {
        id: 'forest-north',
        title: '⚔️ Investigate the Northern Forest',
        description: 'Strange sounds echo from the corrupted trees. Battle ahead.',
        type: 'battle',
        destination: 'northern-forest'
      },
      {
        id: 'shop',
        title: '✨ Visit the Item Shop',
        description: 'Stock up on potions and equipment.',
        type: 'shop',
        destination: 'item-shop'
      },
      {
        id: 'castle',
        title: '🏰 Approach Peach\'s Castle',
        description: 'The castle gates are guarded by corrupted enemies.',
        type: 'battle',
        destination: 'castle-gates',
        requirement: 'complete-forest' // Optional: lock until condition met
      }
      // Add more choices...
    ]
  },
  
  'northern-forest': {
    name: '🌳 Northern Forest',
    corruption: 60,
    storyText: ['A dark forest description...'],
    choices: [/* more choices */]
  }
  // Add all your other locations...
};