var atlas = require('../assetMap.js');

var level3 = {
  id: 3,
  tileset: 'tileset-level-3',
  tilemap: 'tilemap-level-3',
  tiledJson: '49x100', 
  tilesetImage: 'tileset1_2',
  backgroundImage: 'bg3seamless',
  width: 49 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: 'objects-layer', 
  entryPoint: {
    x: 285, 
    y: 206
  },
  portals: [
    {
      jumpTo: 4,
      x: 761,
      y: 1290
    }  
  ],
  enemies: [
    {
      type: 'bear', // 1-2 bears constantly run through the view
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 344,
        y: 277
      },
      boundTo: {
        x1: 344,
        x2: 404
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 10,
        y: 10
      },
      boundTo: {
        x: 101,
        y: 158
      }
    },
    {
      type: 'spider', // spiders coming from a cave frequently
      number: 1,
      lifespan: 10000,
      revive: 10000,
      origin: {
        x: 10,
        y: 10
      },
      boundTo: {
        x1: Infinity,
        x2: Infinity
      }
    },
    {
      type: 'dino', // a guard dino standing waiting
      number: 1,
      lifespan: 8000,
      revive: 5000,
      origin: {
        x: 94,
        y: 156
      },
      boundTo: {
        x1: 8,  // stays between x1 x2 zone
        x2: 94
      }
    }
  ]
};

module.exports = level3;