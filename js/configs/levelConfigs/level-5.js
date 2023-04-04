var atlas = require('../assetMap.js');

var level = {
  id: 'level-5',
  name: 'Level 5', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-5', 
  tilesetImage: 'L1',
  backgroundImage: 'bg3seamless',
  width: 1600,
  height: 1600,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  foregroundLayer: 'foreground-layer',
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