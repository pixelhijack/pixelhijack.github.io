var atlas = require('../assetMap.js');

var level = {
  id: 'level-11',
  name: 'The Original Level 1', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-11', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'bg3seamless',
  width: 100 * 16,
  height: 50 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 78,
    y: 650
  },
  portals: [
    {
      jumpTo: 'level-10',
      x: 4000,
      y: 477
    }
  ],
  platforms: [],
  bonus: [],
  enemies: []
};

module.exports = level;