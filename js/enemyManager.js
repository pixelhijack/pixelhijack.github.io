var Creature = require('./creature.js');
var util = require('./util.js');

/*  
    ENEMIES API: 
    var enemies = enemyManager(game, level.enemies);
    @Phaser.Group::enemies.of.dino
    @Phaser.Group::enemies.of.bear
    ...
*/
var enemyManager = function(game, levelEnemies){
  var utils = util(game);
  // init enemy pools
  var of = {};
  
  for(var enemy in levelEnemies){
    of[enemy] = game.add.group();
  }
  
  return {
    of: of,
    initLevelEnemies: function(){ 
      for(var enemyType in of){
        for(var i = 0, max = levelEnemies[enemyType];i<max;i++){
          // of.dino.add(new Creature('dino', game, 126, 45)) =>
          var randomPoint = utils.randomWorldPoint();
          this.add(enemyType, randomPoint.x, randomPoint.y);
        }
      }    
    },
    add: function(enemyType, whereX, whereY){ 
      var enemyWaiting = of[enemyType].getFirstDead();
      if(!enemyWaiting){
        var anotherEnemy = new Creature(game, enemyType, whereX, whereY);
        of[enemyType].add(anotherEnemy);
      }
    },
    revive: function(enemyType, whereX, whereY){
      var enemyToRevive = of[enemyType].getFirstDead();
      if(enemyToRevive){
        enemyToRevive.revive();
        enemyToRevive.reset(whereX, whereY);
      }
    },
    forEachAlive: function(fn, args){
      for(var enemyType in of){
        // close your eyes please
        if(typeof fn === 'function'){
          of[enemyType].forEachAlive(function(creature){
            // should check if Creature really has the method...
            fn.apply(creature, args);  
          });
        }  
      }  
    },
    population: function(){
      var allAnimal = 0;
      for(var enemyGroup in of){
        allAnimal += of[enemyGroup].children.filter(function(enemy){ return enemy.alive; }).length;
      }
      return allAnimal;
    }
  };
};

module.exports = enemyManager;