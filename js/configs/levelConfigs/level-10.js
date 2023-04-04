var atlas = require('../assetMap.js');

var level = {
  id: 'level-10',
  name: 'Level 10', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-10', 
  tilesetImage: 'L5_green',
  backgroundImage: 'forest',
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
    x: 48, 
    y: 1690
  },
  portals: [
    {
      jumpTo: 'into-the-woods',
      x: 1569,
      y: 139
    }  
  ],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;