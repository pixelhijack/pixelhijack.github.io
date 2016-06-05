var atlas = require('../assetMap.js');

var level = {
  id: 'mosquito-falls',
  tileset: 'tileset-level-mosquito-falls',
  tilemap: 'tilemap-level-mosquito-falls',
  tiledJson: 'L5greenv2', 
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
  parallaxLayer: 'parallax-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 28, 
    y: 206
  },
  portals: [
    {
      jumpTo: 'downfall-rifts',
      x: 1742,
      y: 745
    }
  ],
  platforms: [
    {
      img: atlas.PLATFORM_WOOD,
      behaviour: 'shuttle', // null, fall, moveTo, shuttle
      x: 75,
      y: 243,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 1200,
        y: 243,
        timeout: 20000,
        easing: 'Linear'
      }
    },
    {
      img: atlas.PLATFORM_DEATH,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 514,
      y: 435,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        
      }
    },
    {
      img: atlas.PLATFORM_DEATH,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 1183,
      y: 388,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        
      }
    },
    {
      img: atlas.PLATFORM_DEATH,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 1454,
      y: 310,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        
      }
    },
    {
      img: atlas.PLATFORM_DEATH,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 1539,
      y: 255,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        
      }
    }
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
      type: 'jelly',
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 357,
        y: 419
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'bat',
      active: false,
      number: 1,
      lifespan: 10000,
      revive: 5000,
      origin: {
        x: 211,
        y: 90
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'bat',
      active: false,
      number: 1,
      lifespan: 10000,
      revive: 6000,
      origin: {
        x: 314,
        y: 113
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'tiger', 
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 848,
        y: 391
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'dino', 
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 2175,
        y: 400
      },
      boundTo: {
        x1: 2068,
        x2: 2214
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'native',
      number: 1,
      lifespan: 10000,
      revive: 1000,
      origin: {
        x: 185,
        y: 135
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: 8000,
      revive: 1200,
      origin: {
        x: 504,
        y: 283
      },
      boundTo: {
        x1: 494,
        x2: 645
      }
    },
    {
      type: 'ptero',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 400,
        y: 67
      },
      boundTo: {
        x1: 161,
        x2: 750
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'bat',
      active: false,
      number: 1,
      lifespan: 7000,
      revive: 5000,
      origin: {
        x: 116,
        y: 49
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 1000,
      origin: {
        x: 143,
        y: 226
      },
      boundTo: {
        x1: 183,
        x2: 484
      }
    },
    {
      type: 'frog', 
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1530,
        y: 233
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    }
  ]
};

module.exports = level;