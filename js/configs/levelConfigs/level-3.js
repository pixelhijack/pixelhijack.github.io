var atlas = require('../assetMap.js');

var level = {
  id: 'level-3',
  name: 'Level 3', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-3', 
  tilesetImage: 'L2_L14_L9_L10_hued_bank',
  backgroundImage: 'volcano',
  width: 768,
  height: 416,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 55,
    y: 144
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;