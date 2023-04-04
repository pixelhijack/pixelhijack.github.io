var atlas = require('../assetMap.js');

var level = {
  id: 'level-9',
  name: 'Level 9', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-9', 
  tilesetImage: 'L5_green',
  backgroundImage: 'volcano',
  width: 100 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 274,
    y: 73
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;