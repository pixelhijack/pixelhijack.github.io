var atlas = require('../assetMap.js');

var level = {
  id: 'level-14',
  name: 'Level 14', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-14', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'bg3seamless',
  width: 1600,
  height: 1600,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 960,
    y: 2250
  },
  portals: [
    {
      jumpTo: 'level-11',
      x: 1941,
      y: 1899
    }
  ],
  platforms: [],
  bonus: [],
  enemies: [
    {
        type: 'dragonfly',
        number: 1,
        lifespan: Infinity,
        revive: 5000,
        origin: {
          x: 1083,
          y: 2128
        },
        boundTo: {
          x1: 966,
          x2: 1210
        }
    },
    {
        type: 'insect',
        number: 1,
        lifespan: Infinity,
        revive: 1000,
        active: false,
        onClose: 'follow',
        origin: {
          x: 1570,
          y: 2186
        },
        boundTo: {},
    },
    {
        type: 'ptero',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        origin: {
          x: 1488,
          y: 2010
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      }
  ]
};

module.exports = level;