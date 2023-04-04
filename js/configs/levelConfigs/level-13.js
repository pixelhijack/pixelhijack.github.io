var atlas = require('../assetMap.js');

var level = {
  id: 'level-13',
  name: 'Level 13', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-13', 
  tilesetImage: 'L9_L10_map_bank',
  backgroundImage: 'forest-fire',
  width: 1600,
  height: 1600,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  foregroundLayer: 'foreground-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 67,
    y: 858
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