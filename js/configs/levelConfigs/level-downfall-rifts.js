var atlas = require('../assetMap.js');

var level = {
  id: 'downfall-rifts',
  tileset: 'tileset-level-downfall-rifts',
  tilemap: 'tilemap-level-downfall-rifts',
  tiledJson: 'L2v1', 
  tilesetImage: 'L2_bank',
  backgroundImage: 'bg3seamless',
  width: 100 * 16,
  height: 50 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  foregroundLayer: 'foreground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 23, 
    y: 364
  },
  portals: [
    {
      jumpTo: 'into-the-woods',
      x: 1569,
      y: 139
    }  
  ],
  platforms: [],
  bonus: [
    {
      img: atlas.ALPHABET_Z,
      x: 448,
      y: 196
    },
    {
      img: atlas.ALPHABET_O,
      x: 458,
      y: 193
    },
    {
      img: atlas.ALPHABET_O,
      x: 468,
      y: 195
    },
    {
      img: atlas.ALPHABET_EXCLAMATION_MARK,
      x: 478,
      y: 196
    },
    {
      img: atlas.BONUS_BIG_MCDONALDS,
      x: 86,
      y: 250
    },
    {
      img: atlas.BONUS_BIG_BANANA,
      x: 147,
      y: 216
    },
    {
      img: atlas.BONUS_BIG_ICECREAM,
      x: 209,
      y: 250
    },
    {
      img: atlas.BONUS_CHICKEN,
      x: 984,
      y: 237
    }
  ],
  enemies: [
    {
      type: 'spider', 
      number: 1,
      lifespan: 40000,
      revive: 5000,
      origin: {
        x: 513,
        y: 225
      },
      boundTo: {
        x1: 0,
        x2: 0
      }
    },
    {
      type: 'spider', 
      number: 1,
      lifespan: 40000,
      revive: 10000,
      origin: {
        x: 1,
        y: 1
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    },
    {
      type: 'spider', 
      number: 1,
      lifespan: 10000,
      revive: 10000,
      origin: {
        x: 436,
        y: 555
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    },
    {
      type: 'spider', 
      number: 1,
      lifespan: 10000,
      revive: 10000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 611,
        y: 496
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    },
    {
      type: 'dino', 
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 925,
        y: 300
      },
      boundTo: {
        x1: 0,  
        x2: 925
      }
    }, 
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1400,
        y: 178
      },
      boundTo: {
        x1: 1400,
        x2: 1535
      }
    },
    {
      type: 'ptero',
      number: 2,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 1130,
        y: 216
      },
      boundTo: {
        x: Infinity,
        y: Infinity
      }
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 56,
        y: 364
      },
      boundTo: {
        x1: 56,
        x2: 1200
      }
    },
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 1037,
        y: 532
      },
      boundTo: {
        x1: 1037,
        x2: 1358
      }
    },
    {
      type: 'parrot',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 1204,
        y: 216
      },
      boundTo: {
        x1: 1204,
        x2: 1532
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
        x: 55,
        y: 663
      },
      boundTo: {
        
      },
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 4000,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 307,
        y: 541
      },
      boundTo: {
    
      }
    },
    {
      type: 'turtle',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 764,
        y: 301
      },
      boundTo: {
        x1: 764,
        x2: 1003
      }
    },
    {
      type: 'insect',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 533,
        y: 311
      },
      boundTo: {
        
      },
    },
    {
      type: 'bug',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 533,
        y: 311
      },
      boundTo: {
        
      }
    }
  ]
};

module.exports = level;