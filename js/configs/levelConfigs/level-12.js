var atlas = require('../assetMap.js');

var level = {
  id: 'level-12',
  name: 'The Fire Forest', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-12', 
  tilesetImage: 'L5_bank',
  backgroundImage: 'forest-fire',
  width: 100 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 77,
    y: 250
  },
  portals: [],
  platforms: [],
  bonus: [
    {
        img: atlas.BONUS_FRIDGE,
        x: 107,
        y: 339
    }
  ],
  enemies: [
    {
        "type": "native",
        "number": 1,
        "lifespan": null,
        "revive": false,
        "origin": {
            "x": 450,
            "y": 266
        },
        "boundTo": {
            "x1": 338,
            "x2": 516
        }
    }, {
        "type": "native",
        "number": 1,
        "lifespan": null,
        "revive": false,
        "origin": {
            "x": 744,
            "y": 202
        },
        "boundTo": {
            "x1": 740,
            "x2": 857
        }
    }, {
        "type": "native",
        "number": 1,
        "lifespan": null,
        "revive": false,
        "origin": {
            "x": 781,
            "y": 122
        },
        "boundTo": {
            "x1": 780,
            "x2": 864
        }
    }, {
        "type": "dragonfly",
        "number": 1,
        "lifespan": null,
        "revive": false,
        "origin": {
            "x": 408,
            "y": 122
        },
        "boundTo": {
            "x1": 300,
            "x2": 614
        }
    }
  ]
};

module.exports = level;