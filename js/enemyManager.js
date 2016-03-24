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
          //of[enemy].add(new Creature(enemy, game, Math.random() * game.width, game.height / 2));      
        }
      }    
    },
    add: function(){ },
    population: function(){ }
  };
};

function Dino(game, x, y){
  var dino = new Creature('dino', game, {
    image: 'dino',
    x: x, 
    y: y, 
    gravity: 500,
    bounce: 0.2,
    props: {
      jumping: 400,
      maxSpeed: 300,
      acceleration: 20
    }
  }); 
  dino.animations.add('moving-right', [0,1,2,3], 10, true);
  dino.animations.add('moving-left', [8,9,10,11], 10, true);
  dino.animations.add('jumping-right', [0,1,2,3,4], 10, true);
  dino.animations.add('jumping-left', [7,8,9,10,11], 10, true);
  
  return dino;
}

module.exports = enemyManager;