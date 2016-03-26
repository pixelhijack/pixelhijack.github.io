var levelList = [
  {
    id: 1,
    tileset: 'tileset-level-1',
    tilemap: 'tilemap-level-1',
    tilesetImageName: 'tileset1',
    width: 78 * 16,
    height: 23 * 16,
    backgroundLayer: 'background-1',
    fixedBackground: true, // this can be false also as seamless background, though it makes the game much slower :(
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    deathLayer: null,
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
    fixedBackground: true,
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    deathLayer: null,
    objectsLayer: null, 
    enemies: {
      dino: 5,
      ptero: 2,
      bear: 0
    }
  },
  {
    id: 3,
    tileset: 'tileset-level-3',
    tilemap: 'tilemap-level-3',
    tilesetImageName: 'tileset1_2',
    width: 49 * 16,
    height: 100 * 16,
    backgroundLayer: 'background-2',
    fixedBackground: true,
    groundLayer: 'foreground-layer',
    collisionLayer: 'collision-layer',
    deathLayer: 'death-layer',
    objectsLayer: 'objects-layer', 
    enemies: {
      dino: 5,
      ptero: 2,
      bear: 0
    }
  }
];

module.exports = levelList;