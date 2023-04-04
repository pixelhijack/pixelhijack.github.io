var atlas = require('../assetMap.js');

var level = {
  id: 'level-2',
  name: 'Level 2', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-2', 
  tilesetImage: 'L2_bank',
  backgroundImage: 'bg3seamless',
  width: 100 * 16,
  height: 50 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  foregroundLayer: 'foreground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 23,
    y: 364
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;