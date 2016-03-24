var Creature = require('./creature.js');

/*  
    ENEMIES API: 
    var enemies = enemyManager(game, level.enemies);
    @Phaser.Group::enemies.of.dino
    @Phaser.Group::enemies.of.bear
    ...
*/
var enemyManager = function(game, levelEnemies){
  // init enemy pools
  var of = {};
  
  for(var enemy in levelEnemies){
    of[enemy] = game.add.group();
  }
  
  return {
    of: of,
    initLevelEnemies: function(){ 
      for(var enemy in of){
        for(var i = 0, max = levelEnemies[enemy];i<max;i++){
          // of.dino.add(new Creature('dino', game, 126, 45)) =>
          of[enemy].add(new Creature(game, enemy, Math.random() * game.width, game.height / 2));
        }
      }    
    },
    add: function(){ },
    population: function(){ }
  };
};

module.exports = enemyManager;