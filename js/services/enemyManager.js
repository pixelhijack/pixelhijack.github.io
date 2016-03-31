var Creature = require('../classes/creature.js');
var Group = require('../classes/group.js');
var util = require('./util.js');

/*  
    ENEMIES API: 
    var enemies = enemyManager(game, level.enemies);
    @Phaser.Group::enemies.global.dino
    @Phaser.Group::enemies.global.bear
    @Phaser.Group::enemies.zone(1).bear
    ...
    
    enemyManager: 
      @levelEnemies: enemies of zones and types from level lists
      @levelZones: zone coordinates from tilemap's object-layers
      -> create phaser group for each zone - type - enemy type
      -> populate group references 
      every zone has:
        @guards: enemies placed in zones once
        @spawns: enemies spawning in the zone, moving away, subsequently
      
*/
var enemyManager = function(game, levelEnemies, levelZones){
  var utils = util(game);
  
  var groups = [];
  
  if(!levelEnemies || !levelEnemies.length){
    return;
  }
  
  // populate enemy groups
  groups = levelEnemies.map(function(groupConfig){
    
    // if levelZones given, override spawning points of enemy defaults
    if(!!levelZones && !!levelZones[groupConfig.id]){
      groupConfig.origin =  utils.centerPointIn(
        levelZones[groupConfig.id].x, 
        levelZones[groupConfig.id].x + levelZones[groupConfig.id].width, 
        levelZones[groupConfig.id].y, 
        levelZones[groupConfig.id].y + levelZones[groupConfig.id].height);
    }
    
    var group = new Group(game, groupConfig, true);
    return group;
  });
  
  return {
    forEachAlive: function(fn){
      groups.forEach(function(group){
        group.forEachAlive(function(creature){
          if(typeof fn === 'function'){
            fn.apply(this, arguments);
          }  
        });
      });
    },
    population: function(){
      var zoo = 0;
      this.forEachAlive(function(){
        zoo++;
      });
      return zoo;
    }
    /*,
    add: function(enemyType, whereX, whereY){ 
      var enemyWaiting = global[enemyType].getFirstDead();
      if(!enemyWaiting){
        var anotherEnemy = new Creature(game, enemyType, whereX, whereY);
        global[enemyType].add(anotherEnemy);
      }
    },
    revive: function(enemyType, whereX, whereY){
      var enemyToRevive = global[enemyType].getFirstDead();
      if(enemyToRevive){
        enemyToRevive.lifespan = enemyToRevive.props.lifespan;
        enemyToRevive.reset(whereX, whereY);
      }
    }*/
  };
};

module.exports = enemyManager;