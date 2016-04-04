var levelConfigs = [
  {
    id: 1,
    tileset: 'tileset-level-1',
    tilemap: 'tilemap-level-1',
    tilesetImageName: 'tileset1',
    width: 78 * 16,
    height: 23 * 16,
    backgroundLayer: 'background-1',
    fixedBackground: true, // this can be false also as seamless background, though it makes the game much slower :(
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    deathLayer: null,
    objectsLayer: 'objects-layer', 
    enemies: [
      {
        type: 'bear',
        number: 1,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 130,
          y: 270
        },
        boundTo: {
          x1: 0,
          x2: 200
        }
      },
      {
        type: 'bear',
        number: 1,
        lifespan: 10000,
        revive: 5000,
        move: true,
        origin: {
          x: 90,
          y: 260
        },
        boundTo: {
          x1: 200,
          x2: 400
        }
      },
      {
        type: 'dino',
        number: 1,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 682,
          y: 279
        },
        boundTo: {
          x1: 682,
          x2: 788
        }
      },
      {
        type: 'ptero',
        number: 2,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: { }
      },
      {
        type: 'dragonfly',
        number: 2,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 800,
          y: 130
        },
        boundTo: { }
      },
      {
        type: 'spider',
        number: 2,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 44,
          y: 198
        },
        boundTo: {
          x1: 44,
          x2: 102
        }
      },
      {
        type: 'native',
        number: 2,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 470,
          y: 30
        },
        boundTo: {
          x1: 408,
          x2: 534
        }
      }
    ]
  },
  {
    id: 2,
    tileset: 'tileset-level-2',
    tilemap: 'tilemap-level-2',
    tilesetImageName: 'tileset2',
    width: 49 * 16,
    height: 100 * 16,
    backgroundLayer: 'background-2',
    fixedBackground: true,
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    deathLayer: null,
    objectsLayer: null, 
    enemies: [
      {
        type: 'bear',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        type: 'dino',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        type: 'ptero',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        type: 'dragonfly',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        type: 'spider',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        type: 'native',
        number: 2,
        lifespan: Infinity,
        revive: 5000,
        move: true,
        origin: {
          x: 200,
          y: 200
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      }
    ]
  },
  {
    id: 3,
    tileset: 'tileset-level-3',
    tilemap: 'tilemap-level-3',
    tilesetImageName: 'tileset1_2',
    width: 49 * 16,
    height: 100 * 16,
    backgroundLayer: 'background-2',
    fixedBackground: true,
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    deathLayer: 'death-layer',
    objectsLayer: 'objects-layer', 
    enemies: [
      {
        type: 'bear', // 1-2 bears constantly run through the view
        number: 1,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 344,
          y: 277
        },
        boundTo: {
          x1: 344,
          x2: 404
        }
      },
      {
        type: 'native',
        number: 1,
        lifespan: Infinity,
        revive: false,
        move: true,
        origin: {
          x: 10,
          y: 10
        },
        boundTo: {
          x: 101,
          y: 158
        }
      },
      {
        type: 'spider', // spiders coming from a cave frequently
        number: 1,
        lifespan: 10000,
        revive: 10000,
        move: true,
        origin: {
          x: 10,
          y: 10
        },
        boundTo: {
          x1: Infinity,
          x2: Infinity
        }
      },
      {
        type: 'dino', // a guard dino standing waiting
        number: 1,
        lifespan: 8000,
        revive: 5000,
        move: 200,  // attacks if man distance is 200
        origin: {
          x: 94,
          y: 156
        },
        boundTo: {
          x1: 8,  // stays between x1 x2 zone
          x2: 94
        }
      }
    ]
  }
];

module.exports = levelConfigs;