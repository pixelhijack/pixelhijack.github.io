var atlas = require('../assetMap.js');

var level = {
  id: 'hall-of-ages',
  tileset: 'tileset-level-hall-of-ages',
  tilemap: 'tilemap-level-hall-of-ages',
  tiledJson: 'L8v1', 
  tilesetImage: 'L8',
  backgroundImage: 'cave',
  width: 300 * 16,
  height: 20 * 16,
  maxHeight: 20 * 16,
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
      jumpTo: 'green-hell',
      x: 855,
      y: 275
    },
    {
      jumpTo: 'into-the-woods',
      x: 4464,
      y: 260
    },
    {
      jumpTo: 'great-abyss',
      x: 4771,
      y: 74
    },
    {
      jumpTo: 'downfall-rifts',
      x: 3690,
      y: 255
    }
  ],
  platforms: [
     {
      img: atlas.PLATFORM_ICE,
      behaviour: 'shuttle', // null, fall, moveTo, shuttle
      x: 1225,
      y: 172,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 1415,
        y: 172,
        timeout: 5000,
        easing: 'Cubic'
      }
    },
    {
      img: atlas.PLATFORM_ICE,
      behaviour: 'shuttle', // null, fall, moveTo, shuttle
      x: 3675,
      y: 172,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 3920,
        y: 172,
        timeout: 5000,
        easing: 'Cubic'
      }
    } 
  ],
  bonus: [
    {
      img: atlas.ALPHABET_H,
      x: 280,
      y: 115
    },
    {
      img: atlas.ALPHABET_A,
      x: 300,
      y: 115
    },
    {
      img: atlas.ALPHABET_L,
      x: 320,
      y: 115
    },
    {
      img: atlas.ALPHABET_L,
      x: 340,
      y: 115
    },
    {
      img: atlas.ALPHABET_O,
      x: 380,
      y: 115
    },
    {
      img: atlas.ALPHABET_F,
      x: 400,
      y: 115
    },
    {
      img: atlas.ALPHABET_A,
      x: 440,
      y: 115
    },
    {
      img: atlas.ALPHABET_G,
      x: 460,
      y: 115
    },
    {
      img: atlas.ALPHABET_E,
      x: 480,
      y: 115
    },
    {
      img: atlas.ALPHABET_S,
      x: 500,
      y: 115
    }
  ],
  enemies: [
    {
      type: 'insect',
      number: 1,
      lifespan: Infinity,
      revive: 1000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 321,
        y: 220
      },
      boundTo: {
        
      },
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 438,
        y: 217
      },
      boundTo: {
        x1: 438,
        x2: 558
      }
    },
    {
      type: 'insect',
      number: 1,
      lifespan: Infinity,
      revive: 1000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 711,
        y: 138
      },
      boundTo: {
        
      },
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 861,
        y: 3
      },
      boundTo: {
    
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
        x: 1172,
        y: 99
      },
      boundTo: {
        
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1450,
        y: 227
      },
      boundTo: {
        x1: 1450,
        x2: 1623
      }
    },
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1707,
        y: 222
      },
      boundTo: {
        x1: 1707,
        x2: 1880
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1968,
        y: 227
      },
      boundTo: {
        x1: 1968,
        x2: 2137
      }
    },
    {
      type: 'native', 
      number: 3,
      lifespan: 10000,
      revive: 1000,
      origin: {
        x: 2815,
        y: 220
      },
      boundTo: {
        x: 2175,
        y: 300
      }
    },
    {
      type: 'insect',
      number: 1,
      lifespan: Infinity,
      revive: false,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3083,
        y: 105
      },
      boundTo: {
        
      },
    },
    {
      type: 'bug',
      number: 1,
      lifespan: Infinity,
      revive: false,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3090,
        y: 105
      },
      boundTo: {
        
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 5000,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3221,
        y: 3
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 5000,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3321,
        y: 3
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 5000,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3451,
        y: 3
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 5000,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3612,
        y: 3
      },
      boundTo: {
    
      }
    },
    {
      type: 'frog',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 3838,
        y: 253
      },
      boundTo: {
        
      },
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 4302,
        y: 101
      },
      boundTo: {
        x1: 4302,
        x2: 4560
      }
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 4328,
        y: 70
      },
      boundTo: {
        x1: 4328,
        x2: 4720
      }
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 4410,
        y: 50
      },
      boundTo: {
        x1: 4410,
        x2: 4783
      }
    }
  ]
};

module.exports = level;