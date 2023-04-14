var atlas = require('../assetMap.js');

var level = {
  id: 'level-test',
  name: 'Level test', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-test', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'bg3seamless',
  width: 1600,
  height: 1600,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 78,
    y: 650
  },
  portals: [],
  platforms: [],
  bonus: Object.keys(atlas).map((key, i) => ({
    // '01', '02', '09'...10,11,12...?
    img: atlas[key],
    x: 78 + i * 50, 
    y: 620,
    debug: `${i}:${key}`
  })),
  enemies: [
    {
        type: 'penguin',
        number: 1,
        lifespan: Infinity,
        revive: 10000,
        origin: {
          x: 150,
          y: 650
        },
        boundTo: {
          x1: 200,
          x2: 300
        }
    },
    {
        type: 'gargoyle',
        number: 1,
        lifespan: Infinity,
        revive: 10000,
        origin: {
          x: 250,
          y: 400
        },
        boundTo: {
          x1: 300,
          x2: 400
        }
    },
    {
        type: 'worm',
        number: 1,
        lifespan: Infinity,
        revive: 10000,
        origin: {
          x: 350,
          y: 650
        },
        boundTo: {
          x1: 300,
          x2: 500
        }
      }
  ]
};

module.exports = level;