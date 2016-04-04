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
  var reviveTimers = [];

  // populate enemy groups
  groups = levelEnemies.map(function(groupConfig){
    
    // cache groupConfig as the group props for later use
    var group = new Group(game, groupConfig);
    
    for(var i = 1, max = groupConfig.number; i <= max; i++){
      var creature = new Creature(game, groupConfig.type, groupConfig.origin.x, groupConfig.origin.y);
      group.add(creature);
    }
    group.setAll('props.boundTo', groupConfig.boundTo);
    group.setAll('props.move', groupConfig.move);
    group.setAll('lifespan', groupConfig.lifespan);
    return group;
  });
  
  // start timers to recycle revivable enemy groups
  reviveTimers = groups
    .filter(function(group){
      return group.props.revive;
    })
    .map(function(group){
      var revivables = utils.onEvery(group.props.revive, revive.bind(this, group));
      return revivables;
    });
    
  function revive(group){
    var enemyToRevive = group.getFirstDead();
    if(enemyToRevive){
      enemyToRevive.revive(group.props.origin.x, group.props.origin.y);
    }
  }
  
  
  return {
    revive: revive,
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