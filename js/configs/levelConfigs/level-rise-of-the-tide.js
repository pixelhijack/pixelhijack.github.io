var atlas = require('../assetMap.js');

var level = {
  id: 'rise-of-the-tide',
  name: 'Rise of the Tide',
  tileset: 'tileset-level-rise-of-the-tide',
  tilemap: 'tilemap-level-rise-of-the-tide',
  tiledJson: 'L3v1', 
  tilesetImage: 'L3_map_bank',
  backgroundImage: 'bg3seamless',
  width: 70 * 16,
  height: 300 * 16,
  backgroundLayer: 'background-2',
  fixedBackground: true,
  groundLayer: 'ground-layer',
  foregroundLayer: null,
  collisionLayer: 'collision-layer',
  deathLayer: 'death-layer',
  parallaxLayer: null,
  objectsLayer: null, 
  entryPoint: {
    x: 20, 
    y: 4677
  },
  portals: [
    {
      jumpTo: 'stairway-from-heaven',
      x: 347,
      y: 4009
    }
  ],
  platforms: [
    
  ],
  bonus: [
    
  ],
  enemies: [
    {
      type: 'bear',
      number: 1,
      lifespan: 20000,
      revive: 1000,
      origin: {
        x: 440,
        y: 4630
      },
      boundTo: {
        x1: 20,
        x2: 246
      }
    },
    {
      type: 'native',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 421,
        y: 4469
      },
      boundTo: {
        x1: 421,
        x2: 521
      }
    },
    {
      type: 'tiger',
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 675,
        y: 4469
      },
      boundTo: { },
      onClose: 'follow',
      onLeave: 'wait'
    },
    {
      type: 'ptero',
      active: false,
      number: 1,
      lifespan: Infinity,
      revive: false,
      origin: {
        x: 896,
        y: 4393
      },
      onClose: 'follow',
      onLeave: 'wait'
    }
  ]
};

module.exports = level;