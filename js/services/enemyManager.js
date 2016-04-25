var Creature = require('../classes/creature.js');
var Group = require('../classes/group.js');
var movements = require('../classes/movements.js');
var util = require('./util.js');


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
      creature.creatureId = groupConfig.type + '-' + groupConfig.origin.x + '-' + groupConfig.origin.y + '-' + i;
      // override general creature-specific updates
      if(groupConfig.movement){
         creature.update = movements.updates[groupConfig.movement];
      }
      if(groupConfig.reaction){
        creature.reaction = groupConfig.reaction;
      }
      group.add(creature);
    }
    //group.setAll('props.boundTo', groupConfig.boundTo); 
    group.setAll('boundTo', groupConfig.boundTo);
    group.setAll('props.move', groupConfig.move);
    group.setAll('props.lifespan', groupConfig.lifespan); // gotta override the abstract class & instance lifespan too!!
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
      //console.info('[enemyManager] reviving a %s', enemyToRevive.creatureType, enemyToRevive);
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
  };
};

module.exports = enemyManager;