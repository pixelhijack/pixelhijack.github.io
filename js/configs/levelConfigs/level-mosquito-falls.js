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
      x: 3030,
      y: 434
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
      img: atlas.ALPHABET_L,
      x: 230,
      y: 135
    },
    {
      img: atlas.ALPHABET_E,
      x: 240,
      y: 135
    },
    {
      img: atlas.ALPHABET_T,
      x: 250,
      y: 135
    },
    {
      img: atlas.ALPHABET_T,
      x: 270,
      y: 135
    },
    {
      img: atlas.ALPHABET_H,
      x: 280,
      y: 135
    },
    {
      img: atlas.ALPHABET_E,
      x: 280,
      y: 135
    },
    {
      img: atlas.ALPHABET_J,
      x: 300,
      y: 135
    },
    {
      img: atlas.ALPHABET_U,
      x: 310,
      y: 135
    },
    {
      img: atlas.ALPHABET_N,
      x: 320,
      y: 135
    },
    {
      img: atlas.ALPHABET_G,
      x: 330,
      y: 135
    },
    {
      img: atlas.ALPHABET_L,
      x: 340,
      y: 135
    },
    {
      img: atlas.ALPHABET_E,
      x: 350,
      y: 135
    },
    {
      img: atlas.ALPHABET_S,
      x: 370,
      y: 135
    },
    {
      img: atlas.ALPHABET_L,
      x: 380,
      y: 135
    },
    {
      img: atlas.ALPHABET_E,
      x: 390,
      y: 135
    },
    {
      img: atlas.ALPHABET_E,
      x: 400,
      y: 135
    },
    {
      img: atlas.ALPHABET_P,
      x: 410,
      y: 135
    },
    {
      img: atlas.BONUS_BIG_BANANA,
      x: 138,
      y: 278
    },
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
      img: atlas.BONUS_SUITCASE,
      x: 442,
      y: 272
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