var atlas = require('../assetMap.js');

var level = {
  id: 'green-hell',
  tileset: 'tileset-level-green-hell',
  tilemap: 'tilemap-level-green-hell',
  tiledJson: 'L5greenv1', 
  tilesetImage: 'L5_green',
  backgroundImage: 'forest-green',
  width: 48 * 16,
  height: 26 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: null,
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 749, 
    y: 87
  },
  portals: [
    
  ],
  bonus: [
    {
      img: atlas.WEAPON_AXE,
      x: 675,
      y: 99
    },
    {
      img: atlas.BONUS_PINEAPPLE,
      x: 573,
      y: 52
    },
    {
      img: atlas.BONUS_SOITCASE,
      x: 397,
      y: 116
    }
  ],
  enemies: [
    {
      type: 'dino', 
      number: 1,
      lifespan: Infinity,
      revive: false,
      movement: 'waitStill',
      reaction: 'attackIfClose',
      origin: {
        x: 520,
        y: 199
      },
      boundTo: {
        
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: 10000,
      revive: 1000,
      origin: {
        x: 328,
        y: 69
      },
      boundTo: {
        x1: Infinity,
        x2: Infinity
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: 8000,
      revive: 1200,
      origin: {
        x: 536,
        y: 88
      },
      boundTo: {
        x1: Infinity,
        x2: Infinity
      }
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 161,
        y: 221
      },
      boundTo: {
        x1: 161,
        x2: 750
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      movement: 'waitStill',
      reaction: 'attackIfAwakened',
      origin: {
        x: 116,
        y: 49
      },
      boundTo: {
    
      }
    }
  ]
};

module.exports = level;