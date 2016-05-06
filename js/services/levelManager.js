var levelManager = function(game, levelList){
  
  var levelToLoad;
  
  var level = {
    tilemap: null,
    backgroundLayer: null,
    groundLayer: null,
    foregroundLayer: null,
    collisionLayer: null,
    objects: {}, 
    bonus: [],
    portals: [],
    platforms: [],
    entryPoint: {
      x: 200, 
      y: 50
    }
  };
  
  level.preloadAssets = function(id){
    levelToLoad = levelList.find(function(level){
      return level.id === id;
    });
    if(!levelToLoad){
      console.error('PRE2: Couldn\'t find level "%s". Sorry, pal.', id);
      window.location = window.location.href.split('#')[0] + '#hall-of-ages';
      levelToLoad = levelList.find(function(level){
        return level.id === 'hall-of-ages';
      });
    }
    // load background
    game.load.image(levelToLoad.backgroundLayer, 'assets/backgrounds/' + levelToLoad.backgroundImage + '.png');
    // load tileset
    game.load.image(levelToLoad.tileset, 'assets/tilesets/' + levelToLoad.tilesetImage + '.png');
    // load tilemap
    game.load.tilemap(levelToLoad.tilemap, 'levels/' + levelToLoad.tiledJson + '.json', null, Phaser.Tilemap.TILED_JSON);
  };
  
  level.setLevel = function(){
    if(levelToLoad.maxHeight){
      game.scale.setGameSize(game.width, levelToLoad.maxHeight);
    }
    if(levelToLoad.maxWidth){
      game.scale.setGameSize(game.height, levelToLoad.maxWidth);
    }
    level.backgroundLayer = game.add.tileSprite(0, 0, levelToLoad.width, levelToLoad.height, levelToLoad.backgroundLayer);
    level.backgroundLayer.fixedToCamera = levelToLoad.fixedBackground;
    level.tilemap = game.add.tilemap(levelToLoad.tilemap);
    level.tilemap.addTilesetImage(levelToLoad.tilesetImage, levelToLoad.tileset);
    level.groundLayer = level.tilemap.createLayer(levelToLoad.groundLayer);
    level.collisionLayer = level.tilemap.createLayer(levelToLoad.collisionLayer);
    level.collisionLayer.visible = false;
    if(levelToLoad.deathLayer){
      level.deathLayer = level.tilemap.createLayer(levelToLoad.deathLayer);
      level.tilemap.setCollisionBetween(0, 3000, true, levelToLoad.deathLayer);
      level.deathLayer.visible = false;
    }
    if(levelToLoad.foregroundLayer){
      level.foregroundLayer = level.tilemap.createLayer(levelToLoad.foregroundLayer);
    }
    level.tilemap.setCollisionBetween(0, 3000, true, levelToLoad.collisionLayer);
    level.groundLayer.resizeWorld();
    level.enemies = levelToLoad.enemies;
    
    level.entryPoint = levelToLoad.entryPoint;
    
    level.bonus = levelToLoad.bonus || [];
    level.portals = levelToLoad.portals || [];
    level.platforms = levelToLoad.platforms || [];
    
    //level.collisionLayer.debug = true;
    //level.deathLayer.debug = true;
    
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
  };
  return level;
};

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