var atlas = require('../assetMap.js');

var level = {
  id: 'level-1',
  name: 'Level 1', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-1', 
  tilesetImage: 'L3_map_bank',
  backgroundImage: 'bg3seamless',
  width: 1120,
  height: 4800,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 20,
    y: 4677
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;