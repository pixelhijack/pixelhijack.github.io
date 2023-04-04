var atlas = require('../assetMap.js');

var level = {
  id: 'level-8',
  name: 'Level 8', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-8', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'bg1seamless',
  width: 100 * 16,
  height: 100 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  foregroundLayer: 'foreground-layer',
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