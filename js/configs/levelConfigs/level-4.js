var atlas = require('../assetMap.js');

var level = {
  id: 'level-4',
  name: 'Level 4', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-4', 
  tilesetImage: 'L8',
  backgroundImage: 'cave',
  width: 4800,
  height: 320,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 147,
    y: 187
  },
  portals: [],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;