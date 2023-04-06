var atlas = require('../assetMap.js');

var level = {
  id: 'level-14',
  name: 'Level 14', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-14', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'bg3seamless',
  width: 1600,
  height: 1600,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 960,
    y: 2250
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: [
    {
        "type": "dragonfly",
        "number": 1,
        "lifespan": null,
        "revive": false,
        "origin": {
            "x": 306,
            "y": 858
        },
        "boundTo": {
            "x1": 24,
            "x2": 461
        }
    }
  ]
};

module.exports = level;