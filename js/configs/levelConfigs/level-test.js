var atlas = require('../assetMap.js');

var level = {
  id: 'level-test',
  name: 'Level test', 
  tileset: 'tileset-level',
  tilemap: 'tilemap-level',
  tiledJson: 'level-test', 
  tilesetImage: 'L1_bank',
  backgroundImage: 'bg3seamless',
  width: 1600,
  height: 1600,
  backgroundLayer: 'background-2',
  fixedBackground: true, 
  groundLayer: 'ground-layer',
  collisionLayer: 'collision-layer',
  objectsLayer: null, 
  entryPoint: {
    x: 78,
    y: 650
  },
  portals: [],
  platforms: [],
  bonus: Object.keys(atlas).map((key, i) => ({
    // '01', '02', '09'...10,11,12...
    img: i > 10 ? atlas[key] : atlas['0' + key],
    x: 78 + i * 30, 
    y: 620
  })),
  enemies: []
};

module.exports = level;