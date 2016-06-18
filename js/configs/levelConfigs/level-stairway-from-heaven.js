var atlas = require('../assetMap.js');

var level = {
  id: 'stairway-from-heaven',
  tileset: 'tileset-level-stairway-from-heaven',
  tilemap: 'tilemap-level-stairway-from-heaven',
  tiledJson: 'L5L14L9v1', 
  tilesetImage: 'L2_L14_L9_L10_hued_bank',
  backgroundImage: 'volcano',
  width: 48 * 16,
  height: 26 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: null,
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  parallaxLayer: 'parallax-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 55, 
    y: 144
  },
  portals: [
    {
      jumpTo: 'downfall-rifts',
      x: 3030,
      y: 434
    }
  ],
  platforms: [
    
  ],
  bonus: [
    
  ],
  enemies: [
    {
      type: 'dino', 
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 100,
        y: 338
      },
      boundTo: {
        x1: 2068,
        x2: 2214
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'ptero',
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: 6000,
      origin: {
        x: 595,
        y: 204
      },
      onClose: 'follow',
      onLeave: 'wait'
    },
    {
      type: 'ptero',
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: 6000,
      origin: {
        x: 605,
        y: 210
      },
      onClose: 'follow',
      onLeave: 'wait'
    }
  ]
};

module.exports = level;