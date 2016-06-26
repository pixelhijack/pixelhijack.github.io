var atlas = require('../assetMap.js');

var level = {
  id: 'great-abyss',
  name: 'The Great Abyss', 
  tileset: 'tileset-level-great-abyss',
  tilemap: 'tilemap-level-great-abyss',
  tiledJson: 'L1v4', 
  tilesetImage: 'L1',
  backgroundImage: 'bg1seamless',
  width: 100 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: 'foreground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 274, 
    y: 73
  },
  portals: [
    {
      jumpTo: 'downfall-rifts',
      x: 470,
      y: 60
    }  
  ],
  platforms: [
    {
      img: atlas.PLATFORM_BRIDGE,
      behaviour: 'shuttle', // null, fall, moveTo, shuttle
      x: 260,
      y: 1445,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        x: 260,
        y: 572,
        timeout: 10000,
        easing: 'Cubic'
      }
    }  
  ],
  bonus: [
    {
      img: atlas.ALPHABET_W,
      x: 60,
      y: 290
    },
    {
      img: atlas.ALPHABET_E,
      x: 80,
      y: 293
    },
    {
      img: atlas.ALPHABET_L,
      x: 100,
      y: 291
    },
    {
      img: atlas.ALPHABET_C,
      x: 120,
      y: 288
    },
    {
      img: atlas.ALPHABET_O,
      x: 140,
      y: 290
    },
    {
      img: atlas.ALPHABET_M,
      x: 160,
      y: 292
    },
    {
      img: atlas.ALPHABET_E,
      x: 180,
      y: 294
    },
    {
      img: atlas.ALPHABET_T,
      x: 60,
      y: 315
    },
    {
      img: atlas.ALPHABET_O,
      x: 80,
      y: 313
    },
    {
      img: atlas.ALPHABET_T,
      x: 120,
      y: 316
    },
    {
      img: atlas.ALPHABET_H,
      x: 140,
      y: 317
    },
    {
      img: atlas.ALPHABET_E,
      x: 160,
      y: 315
    },
    {
      img: atlas.ALPHABET_A,
      x: 60,
      y: 335
    },
    {
      img: atlas.ALPHABET_B,
      x: 80,
      y: 340
    },
    {
      img: atlas.ALPHABET_Y,
      x: 100,
      y: 340
    },
    {
      img: atlas.ALPHABET_S,
      x: 120,
      y: 345
    },
    {
      img: atlas.ALPHABET_S,
      x: 140,
      y: 340
    },
    {
      img: atlas.ALPHABET_DOT,
      x: 160,
      y: 345
    },
    {
      img: atlas.ALPHABET_DOT,
      x: 170,
      y: 346
    },
    {
      img: atlas.ALPHABET_DOT,
      x: 180,
      y: 345
    },
    {
      img: atlas.PORTAL_SMALL_STOP,
      x: 1531,
      y: 990
    },
    {
      img: atlas.ALPHABET_U,
      x: 1531,
      y: 1015
    },
    {
      img: atlas.ALPHABET_P,
      x: 1545,
      y: 1016
    },
    {
      img: atlas.ALPHABET_EXCLAMATION_MARK,
      x: 1560,
      y: 1017
    },
    {
      img: atlas.ALPHABET_U,
      x: 1531,
      y: 1035
    },
    {
      img: atlas.ALPHABET_P,
      x: 1545,
      y: 1036
    },
    {
      img: atlas.ALPHABET_EXCLAMATION_MARK,
      x: 1560,
      y: 1037
    },
    {
      img: atlas.BONUS_SKULL_BIG,
      x: 277,
      y: 34
    },
    {
      img: atlas.WEAPON_AXE,
      x: 533,
      y: 1278
    }
  ],
  enemies: [
    {
      type: 'dino', 
      number: 1,
      lifespan: Infinity,
      revive: false,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 13,
        y: 179
      },
      boundTo: {
        
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
        x: 248,
        y: 1533
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
        x: 402,
        y: 1377
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 472,
        y: 222
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
        x: 767,
        y: 1300
      },
      boundTo: {
        x1: 767,
        x2: 882
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1000,
        y: 1263
      },
      boundTo: {
        x1: 1000,
        x2: 1060
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1173,
        y: 1212
      },
      boundTo: {
        x1: 1173,
        x2: 1240
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1398,
        y: 1181
      },
      boundTo: {
        x1: 1398,
        x2: 1455
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: 10000,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 842,
        y: 970
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 816,
        y: 967
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
        x: 228,
        y: 853
      },
      boundTo: {
        
      },
    },
    {
      type: 'native',
      number: 1,
      lifespan: 15000,
      revive: 1000,
      origin: {
        x: 1460,
        y: 632
      },
      boundTo: {}
    },
    {
      type: 'native',
      number: 1,
      lifespan: 20000,
      revive: 3000,
      origin: {
        x: 937,
        y: 632
      },
      boundTo: {}
    },
    {
      type: 'native',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      origin: {
        x: 913,
        y: 632
      },
      boundTo: {}
    },
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 253,
        y: 927
      },
      boundTo: {
        x1: 253,
        x2: 750
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 786,
        y: 462
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 891,
        y: 432
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 1088,
        y: 478
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 1200,
        y: 490
      },
      boundTo: {
    
      }
    },
    {
      type: 'bat',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 993,
        y: 488
      },
      boundTo: {
    
      }
    },
    {
      type: 'bug',
      number: 3,
      lifespan: Infinity,
      revive: 1000,
      active: false,
      onClose: 'wakeUp',
      origin: {
        x: 860,
        y: 166
      },
      boundTo: {
        
      }
    },
    {
      type: 'ptero',
      number: 1,
      lifespan: Infinity,
      revive: 5000,
      origin: {
        x: 513,
        y: 93
      },
      boundTo: {
        x1: 513,
        y1: 93,
        x2: 860,
        y2: 100
      }
    }
  ]
};

module.exports = level;