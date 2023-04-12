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
    /*{
      jumpTo: 'level-11',
      x: 1941,
      y: 1899
    },
    
    {
      jumpTo: {
        x: 1124,
        y: 1962
      },
      x: 1670,
      y: 2250
    }*/
  ],
  platforms: [],
  bonus: [
    {
      img: atlas.NUMBER_1,
      x: 1382, 
      y: 2060
    },
    {
      img: atlas.NUMBER_2,
      x: 1727, 
      y: 1910
    },
    {
      img: atlas.NUMBER_3,
      x: 1630, 
      y: 1638
    },
    {
      img: atlas.NUMBER_4,
      x: 958, 
      y: 1560
    },
    {
      img: atlas.NUMBER_5,
      x: 1458, 
      y: 1402
    },
    {
      img: atlas.NUMBER_6,
      x: 1395, 
      y: 1210
    }
  ],
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
    },
    {
      type: 'dino', 
      number: 1,
      lifespan: Infinity,
      revive: false,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 1762,
        y: 1930
      },
      boundTo: {
        x1: 1719,
        x2: 1847
      }
    },
    {
      type: 'dino', 
      number: 1,
      lifespan: Infinity,
      revive: false,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 1636,
        y: 1658
      },
      boundTo: {
        
      }
    },
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 1115,
        y: 1770
      },
      boundTo: {
        x1: 1068,
        x2: 1221
      }
    },
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 1310,
        y: 1770
      },
      boundTo: {
        x1: 1280,
        x2: 1408
      }
    },
  ]
};

module.exports = level;