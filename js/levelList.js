var levelList = [
  {
    id: 1,
    tileset: 'tileset-level-1',
    tilemap: 'tilemap-level-1',
    tilesetImageName: 'tileset1',
    width: 78 * 16,
    height: 23 * 16,
    backgroundLayer: 'background-1',
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    objectsLayer: 'objects-layer', 
    enemies: {
      dino: 5,
      ptero: 2,
      bear: 0
    }
  },
  {
    id: 2,
    tileset: 'tileset-level-2',
    tilemap: 'tilemap-level-2',
    tilesetImageName: 'tileset2',
    width: 49 * 16,
    height: 100 * 16,
    backgroundLayer: 'background-2',
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    objectsLayer: null, 
    enemies: {
      dino: 5,
      ptero: 2,
      bear: 0
    }
  }
];

module.exports = levelList;