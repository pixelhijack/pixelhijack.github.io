var atlas = require('./assetMap.js');

var level2 = {
  id: 2,
  tileset: 'tileset-level-2',
  tilemap: 'tilemap-level-2',
  tiledJson: '49x100-old', 
  tilesetImage: 'tileset2',
  backgroundImage: 'bg3seamless',
  width: 49 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: null,
  objectsLayer: null, 
  entryPoint: {
    x: 200, 
    y: 50
  },
  enemies: [
    {
      type: 'bear',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    },
    {
      type: 'dino',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    },
    {
      type: 'ptero',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    },
    {
      type: 'dragonfly',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    },
    {
      type: 'spider',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    },
    {
      type: 'native',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 200,
        y: 200
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    }
  ]
};

module.exports = level2;