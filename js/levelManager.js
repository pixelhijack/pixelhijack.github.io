var levelManager = function(game, levelList){
  
  var level = {
    tilemap: null,
    backgroundLayer: null,
    groundLayer: null,
    collisionLayer: null,
    objects: {}
  };
  
  return function setLevel(id){
    var levelToLoad = levelList.find(function(level){
      return level.id === +id;
    });
    if(!levelToLoad){
      throw new TypeError('PRE2: Couldn\'t find this level. Sorry, pal.');
    }
    level.backgroundLayer = game.add.tileSprite(0, 0, levelToLoad.width, levelToLoad.height, levelToLoad.backgroundLayer);
    level.backgroundLayer.fixedToCamera = levelToLoad.fixedBackground;
    level.tilemap = game.add.tilemap(levelToLoad.tilemap);
    level.tilemap.addTilesetImage(levelToLoad.tilesetImageName, levelToLoad.tileset);
    level.groundLayer = level.tilemap.createLayer(levelToLoad.groundLayer);
    level.collisionLayer = level.tilemap.createLayer(levelToLoad.collisionLayer);
    level.collisionLayer.visible = false;
    level.tilemap.setCollisionBetween(1, 200, true, level.collisionLayer);
    level.groundLayer.resizeWorld();
    level.enemies = levelToLoad.enemies;
    
    //level.groundLayer.debug = true;
    
    //  parse level json provided objects if given
    if(levelToLoad.objectsLayer){
      
      level.objects.all = level.tilemap.objects[levelToLoad.objectsLayer];
      // restrucuture as group by object type:
      var objTypes = level.tilemap.objects[levelToLoad.objectsLayer]
        .map(function(obj){
          return obj.type || '';
        })
        .reduce(function(types, type){
          if(types.indexOf(type) < 0){
            types.push(type);
          }
          return types;
        }, [])
        .forEach(function(type){
          level.objects[type] = level.tilemap.objects[levelToLoad.objectsLayer]
            .filter(function(obj){
              return obj.type === type;
            });
        });
    }
    
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