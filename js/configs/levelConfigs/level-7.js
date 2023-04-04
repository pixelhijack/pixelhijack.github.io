var atlas = require('../assetMap.js');

var level = {
  id: 'level-7',
  name: 'Level 7', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-7', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'forest-green',
  width: 768,
  height: 416,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  parallaxLayer: 'parallax-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 28,
    y: 206
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;