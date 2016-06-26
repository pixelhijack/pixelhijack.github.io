var atlas = require('../assetMap.js');

var level = {
  id: 'stairway-from-heaven',
  name: 'Stairway From Heaven',
  tileset: 'tileset-level-stairway-from-heaven',
  tilemap: 'tilemap-level-stairway-from-heaven',
  tiledJson: 'L5L14L9v1', 
  tilesetImage: 'L2_L14_L9_L10_hued_bank',
  backgroundImage: 'volcano',
  width: 48 * 16,
  height: 26 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: null,
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  parallaxLayer: null,
  objectsLayer: null, 
  entryPoint: {
    x: 55, 
    y: 144
  },
  portals: [
    {
      jumpTo: 'downfall-rifts',
      x: 297,
      y: 1455
    }
  ],
  platforms: [
    {
      img: atlas.PLATFORM_BRIDGE,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 357,
      y: 742,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        
      }
    },
    {
      img: atlas.PLATFORM_BRIDGE,
      behaviour: 'fall', // null, fall, moveTo, shuttle
      x: 397,
      y: 685,
      fallTimeout: 1000,
      restoreTimeout: 2000,
      moveTo: {
        
      }
    }
  ],
  bonus: [
    {
      img: atlas.BONUS_BIG_BANANA,
      x: 245,
      y: 586
    },
    {
      img: atlas.WEAPON_AXE,
      x: 150,
      y: 631
    },
    {
      img: atlas.BONUS_PINEAPPLE,
      x: 73,
      y: 598
    }
  ],
  enemies: [
    {
      type: 'dino', 
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 100,
        y: 338
      },
      boundTo: {
        x1: 2068,
        x2: 2214
      },
      onClose: 'wakeUp',
      onLeave: 'wait'
    },
    {
      type: 'ptero',
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: 6000,
      origin: {
        x: 595,
        y: 204
      },
      onClose: 'follow',
      onLeave: 'wait'
    },
    {
      type: 'ptero',
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: 6000,
      origin: {
        x: 605,
        y: 210
      },
      onClose: 'follow',
      onLeave: 'wait'
    }, 
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 795,
        y: 413
      },
      boundTo: {
        x1: 795,
        x2: 905
      }
    },
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1047,
        y: 319
      },
      boundTo: {
        x1: 1047,
        x2: 1328
      }
    }, 
    {
      type: 'bear',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1328,
        y: 319
      },
      boundTo: {
        x1: 1047,
        x2: 1328
      }
    }, 
    {
      type: 'insect',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 1236,
        y: 704
      },
      boundTo: { },
      onClose: 'follow',
      onLeave: 'wait'
    }, 
    {
      type: 'native',
      number: 1,
      lifespan: 20000,
      revive: 10000,
      origin: {
        x: 999,
        y: 584
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    }, 
    {
      type: 'bug',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 999,
        y: 904
      },
      boundTo: { },
      onClose: 'follow',
      onLeave: 'wait'
    },
    {
      type: 'spider',
      number: 1,
      lifespan: 20000,
      revive: 5000,
      origin: {
        x: 753,
        y: 711
      },
      boundTo: { }
    }, 
    {
      type: 'tiger',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 424,
        y: 790
      },
      boundTo: { },
      onClose: 'follow',
      onLeave: 'wait'
    }, 
    {
      type: 'dragonfly',
      number: 1,
      lifespan: Infinity,
      revive: 10000,
      origin: {
        x: 420,
        y: 902
      },
      boundTo: {
        x1: 132,
        x2: 420
      }
    }, 
    {
      type: 'bear',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      origin: {
        x: 585,
        y: 973
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    }, 
    {
      type: 'bear',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      origin: {
        x: 870,
        y: 1071
      },
      boundTo: {
        x1: 0,
        x2: Infinity
      }
    }, 
    {
      type: 'frog',
      number: 1,
      lifespan: 100000,
      revive: 10000,
      origin: {
        x: 172,
        y: 1572
      },
      boundTo: { },
      onClose: 'follow',
      onLeave: 'wait'
    }
  ]
};

module.exports = level;