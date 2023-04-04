var atlas = require('../assetMap.js');

var level = {
  id: 'level-6',
  name: 'Level 6', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-6', 
  tilesetImage: 'L5_green',
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