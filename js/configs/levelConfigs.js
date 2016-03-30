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
        id: 'global',
        guard: [],
        spawn: [
          { type: 'dino', number: 3, lifespan: Infinity },
          { type: 'ptero', number: 2, lifespan: Infinity  },
          { type: 'bear', number: 2, lifespan: Infinity  }
        ]
      }, {
        id: 1,
        guard: [],
        spawn: []
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
        id: 'global',
        guard: [],
        spawn: [
          { type: 'dino', number: 3, lifespan: Infinity },
          { type: 'ptero', number: 2, lifespan: Infinity  },
          { type: 'bear', number: 0, lifespan: Infinity  }
        ]
      }, {
        id: 1,
        guard: [],
        spawn: []
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
        id: 'global',
        guard: [],
        spawn: [
          { type: 'dino', number: 0, lifespan: Infinity },
          { type: 'ptero', number: 0, lifespan: Infinity },
          { type: 'bear', number: 0, lifespan: Infinity }
        ]
      }, {
        id: 1,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: []
      }, {
        id: 2,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: []
      }, {
        id: 3,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: [
          { type: 'dino', number: 0, lifespan: 10000 },
          { type: 'ptero', number: 0, lifespan: 30000 },
          { type: 'bear', number: 0, lifespan: 20000 }
        ]
      }, {
        id: 4,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: []
      }, {
        id: 5,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: []
      }, {
        id: 6,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: []
      }, {
        id: 7,
        guard: [
          { type: 'dino', number: 1, lifespan: Infinity }
        ],
        spawn: []
      }
    ]
  }
];

module.exports = levelConfigs;