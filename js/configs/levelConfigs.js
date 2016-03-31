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
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 1,
        type: 'bear', // 1-2 bears constantly run through the view
        number: 2,
        lifespan: 10000,
        revive: 5000,
        move: true,
        origin: {
          x: 100,
          y: 100
        },
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        id: 2,
        type: 'spider', // spiders coming from a cave frequently
        number: 3,
        lifespan: Infinity,
        revive: 10000,
        move: true,
        origin: {
          x: 100,
          y: 100
        },
        boundTo: {
          x: 568,
          y: 734
        }
      },
      {
        id: 3,
        type: 'dino', // a guard dino standing waiting
        number: 1,
        lifespan: Infinity,
        revive: true,
        move: 200,  // attacks if man distance is 200
        origin: {
          x: 100,
          y: 100
        },
        boundTo: {
          x1: 568,  // stays between x1 x2 zone
          x2: 734
        }
      }
    ]
  }
];

module.exports = levelConfigs;