var atlas = require('./assetMap.js');

var level5 = {
  id: 5,
  tileset: 'tileset-level-5',
  tilemap: 'tilemap-level-5',
  tiledJson: 'L1v4', 
  tilesetImage: 'L1',
  backgroundImage: 'bg3seamless',
  width: 100 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: 'foreground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 274, 
    y: 73
  },
  portals: [
    {
      jumpTo: 4,
      x: 534,
      y: 130
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
        x: 13,
        y: 179
      },
      boundTo: {
        
      }
    },
    {
      type: 'insect',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      movement: 'waitStill',
      reaction: 'attackIfClose',
      origin: {
        x: 248,
        y: 1533
      },
      boundTo: {
        
      },
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 4000,
      revive: 5000,
      movement: 'waitStill',
      reaction: 'attackIfAwakened',
      origin: {
        x: 428,
        y: 1431
      },
      boundTo: {
    
      }
    }
  ]
};

module.exports = level5;