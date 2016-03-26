var Creature = require('./creature.js');
var util = require('./util.js');

/*  
    ENEMIES API: 
    var enemies = enemyManager(game, level.enemies);
    @Phaser.Group::enemies.global.dino
    @Phaser.Group::enemies.global.bear
    @Phaser.Group::enemies.zone(1).bear
    ...
*/
var enemyManager = function(game, levelEnemies){
  var utils = util(game);
  // init enemy pools
  var global = {};
  
  return {
    global: global,
    initLevelEnemies: function(){
      levelEnemies.global.forEach(function(creatureType){
        global[creatureType.type] = game.add.group();
      });
      for(var enemyType in global){
        var toAdd = levelEnemies.global.find(function(creature){ 
          return creature.type === enemyType;
        });
        if(toAdd && toAdd.number){
          for(var i = 0, max = toAdd.number;i<max;i++){
            var randomPoint = utils.randomWorldPoint();
            this.add(enemyType, randomPoint.x, randomPoint.y);
          } 
        }
      }    
    },
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
    },
    forEachAlive: function(fn, args){
      for(var enemyType in global){
        // close your eyes please
        if(typeof fn === 'function'){
          global[enemyType].forEachAlive(function(creature){
            // should check if Creature really has the method...
            fn.apply(creature, args);  
          });
        }  
      }  
    },
    population: function(){
      var allAnimal = 0;
      for(var enemyGroup in global){
        allAnimal += global[enemyGroup].children.filter(function(enemy){ return enemy.alive; }).length;
      }
      return allAnimal;
    }
  };
};

module.exports = enemyManager;