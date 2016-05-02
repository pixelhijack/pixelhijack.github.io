var atlas = require('../assetMap.js');

var level = {
  id: 'into-the-woods',
  tileset: 'tileset-level-into-the-woods',
  tilemap: 'tilemap-level-into-the-woods',
  tiledJson: 'L5v1', 
  tilesetImage: 'L5',
  backgroundImage: 'forest-orange',
  width: 55 * 16,
  height: 33 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: null,
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 147, 
    y: 187
  },
  portals: [
    {
      jumpTo: 'hall-of-ages',
      x: 397,
      y: 432
    }
  ],
  platforms: [
    
  ],
  bonus: [
    
  ],
  enemies: [
    
  ]
};

module.exports = level;