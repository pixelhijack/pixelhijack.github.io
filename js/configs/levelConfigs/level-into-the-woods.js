var atlas = require('../assetMap.js');

var level = {
  id: 'into-the-woods',
  tileset: 'tileset-level-into-the-woods',
  tilemap: 'tilemap-level-into-the-woods',
  tiledJson: 'L5v1', 
  tilesetImage: 'L5',
  backgroundImage: 'forest-pink',
  width: 55 * 16,
  height: 33 * 16,
  maxHeight: 350,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: null,
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 147, 
    y: 187
  },
  portals: [
    {
      jumpTo: 'hall-of-ages',
      x: 397,
      y: 432
    }
  ],
  platforms: [
    {
      img: atlas.PLATFORM_WOOD,
      behaviour: 'shuttle', // null, fall, moveTo, shuttle
      x: 706,
      y: 214,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 177,
        y: 214,
        timeout: 10000,
        easing: 'Cubic'
      }
    },
    {
      img: atlas.PLATFORM_WOOD,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 626,
      y: 386,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 177,
        y: 214,
        timeout: 10000,
        easing: 'Cubic'
      }
    },
    {
      img: atlas.PLATFORM_WOOD,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 232,
      y: 273,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 177,
        y: 214,
        timeout: 10000,
        easing: 'Cubic'
      }
    },
    {
      img: atlas.PLATFORM_WOOD,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 684,
      y: 298,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 177,
        y: 214,
        timeout: 10000,
        easing: 'Cubic'
      }
    }
  ],
  bonus: [
    
  ],
  enemies: [
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 321,
        y: 248
      },
      boundTo: {
        x1: 321,
        x2: 518
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 400,
        y: 113
      },
      boundTo: {
        x1: 400,
        x2: 523
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 736,
        y: 112
      },
      boundTo: {
        x1: 736,
        x2: 862
      }
    },
    {
      type: 'ptero',
      number: 1,
      lifespan: Infinity,
      revive: 1000,
      origin: {
        x: 864,
        y: 4
      },
      boundTo: {

      }
    }
  ]
};

module.exports = level;