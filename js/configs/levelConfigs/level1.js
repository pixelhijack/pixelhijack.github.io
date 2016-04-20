var atlas = require('../assetMap.js');

var level1 = {
  id: 1,
  tileset: 'tileset-level-1',
  tilemap: 'tilemap-level-1',
  tiledJson: '78x23', 
  tilesetImage: 'level-1-transparent',
  backgroundImage: 'bg1seamless',
  width: 78 * 16,
  height: 23 * 16,
  backgroundLayer: 'background-1',
  fixedBackground: true, // this can be false also as seamless background, though it makes the game much slower :(
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: null,
  objectsLayer: 'objects-layer', 
  entryPoint: {
    x: 200, 
    y: 50
  },
  portals: [
    {
      jumpTo: 3,
      x: 1121,
      y: 132
    }  
  ],
  enemies: [
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 130,
        y: 270
      },
      boundTo: {
        x1: 0,
        x2: 200
      }
    },
    {
      type: 'bear',
      number: 1,
      lifespan: 10000,
      revive: 5000,
      origin: {
        x: 90,
        y: 260
      },
      boundTo: {
        x1: 200,
        x2: 400
      }
    },
    {
      type: 'dino',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 682,
        y: 279
      },
      boundTo: {
        x1: 682,
        x2: 788
      }
    },
    {
      type: 'ptero',
      number: 2,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: { }
    },
    {
      type: 'dragonfly',
      number: 2,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 800,
        y: 130
      },
      boundTo: { }
    },
    {
      type: 'spider',
      number: 2,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 44,
        y: 198
      },
      boundTo: {
        x1: 44,
        x2: 102
      }
    },
    {
      type: 'native',
      number: 2,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 470,
        y: 30
      },
      boundTo: {
        x1: 408,
        x2: 534
      }
    }
  ]
};

module.exports = level1;