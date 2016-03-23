var levelManager = function(game, levelList){
  
  var level = {
    tilemap: null,
    backgroundLayer: null,
    groundLayer: null,
    collisionLayer: null,
    objectsLayer: null
  };
  
  return function setLevel(id){
    var levelToLoad = levelList.find(function(level){
      return level.id === id;
    });
    if(!levelToLoad){
      throw new TypeError('PRE2: Couldn\'t find this level. Sorry, pal.');
    }
    level.backgroundLayer = game.add.tileSprite(0, 0, levelToLoad.width, levelToLoad.height, levelToLoad.backgroundLayer);
    level.tilemap = game.add.tilemap(levelToLoad.tilemap);
    level.tilemap.addTilesetImage(levelToLoad.tilesetImageName, levelToLoad.tileset);
    level.groundLayer = level.tilemap.createLayer(levelToLoad.groundLayer);
    level.collisionLayer = level.tilemap.createLayer(levelToLoad.collisionLayer);
    level.collisionLayer.visible = false;
    level.tilemap.setCollisionBetween(1, 200, true, levelToLoad.collisionLayer);
    level.groundLayer.resizeWorld();
    level.enemies = levelToLoad.enemies;
    
    return level;
  };
}

// find polyfill...
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

module.exports = levelManager;