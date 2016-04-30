var atlas = require('../assetMap.js');

var level = {
  id: 'hall-of-ages',
  tileset: 'tileset-level-hall-of-ages',
  tilemap: 'tilemap-level-hall-of-ages',
  tiledJson: 'L8v1', 
  tilesetImage: 'L8',
  backgroundImage: 'cave',
  width: 300 * 16,
  height: 20 * 16,
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
      jumpTo: 'great-abyss',
      x: 817,
      y: 268
    },
    {
      jumpTo: 'downfall-rifts',
      x: 1371,
      y: 270
    }
  ],
  platforms: [
     
  ],
  bonus: [
    {
      img: atlas.ALPHABET_W,
      x: 60,
      y: 290
    }
  ],
  enemies: [

  ]
};

module.exports = level;