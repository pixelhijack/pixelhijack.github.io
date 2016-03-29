var Creature = require('../classes/creature.js');
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
  // init enemy pools
  var zones = {};
  
  // init enemy groups
  if(!levelEnemies || !levelEnemies.length){
    return;
  }
  levelEnemies.forEach(function(zone){
    zones[zone.id] = {};
    zones[zone.id].guard = {};
    zone.guard.forEach(function(guardingCreature){
      zones[zone.id].guard[guardingCreature.type] = game.add.group();
    });
    zones[zone.id].spawn = {};
    zone.spawn.forEach(function(spawningCreature){
      zones[zone.id].spawn[spawningCreature.type] = game.add.group();  
    });
  });
  
  // populate enemy groups
  levelEnemies.forEach(function(zone){
    zone.guard.forEach(function(group){
      for(var i = 0, max = group.number;i<max;i++){
        // if no levelZones defined in Tiled tilemap OR levelZones are defined but missing the ID in the levelList level definition put at random point
        var point = !!levelZones && (levelZones && !!levelZones[zone.id]) ?
          utils.randomPointIn(levelZones[zone.id].x, 
                              levelZones[zone.id].x + levelZones[zone.id].width, 
                              levelZones[zone.id].y, 
                              levelZones[zone.id].y + levelZones[zone.id].height) :
          utils.randomWorldPoint();
        var creature = new Creature(game, group.type, point.x, point.y, zone.id);
        creature.lifespan = group.lifespan; 
        //if(levelZones[zone.id]) utils.debugZone(levelZones[zone.id].x, levelZones[zone.id].y, levelZones[zone.id].width, levelZones[zone.id].height);
        zones[zone.id].guard[group.type].add(creature);
      }
    });
    zone.spawn.forEach(function(group){
      for(var i = 0, max = group.number;i<max;i++){
        // put the creature in the zone if there is one in objects-layer, else put anywhere
        var point = !!levelZones && (levelZones && !!levelZones[zone.id]) ?
          utils.centerPointIn(levelZones[zone.id].x, 
                              levelZones[zone.id].x + levelZones[zone.id].width, 
                              levelZones[zone.id].y, 
                              levelZones[zone.id].y + levelZones[zone.id].height) :
          utils.randomWorldPoint();
        var creature = new Creature(game, group.type, point.x, point.y, zone.id);
        creature.lifespan = group.lifespan; 
        zones[zone.id].spawn[group.type].add(creature);
      }
    });
  });
  
  return {
    zones: zones,
    global: zones.global,
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
      for(var zone in zones){
        // close your eyes please
        if(typeof fn === 'function'){
          for(var creatureType in zones[zone]['guard']){
            zones[zone]['guard'][creatureType].forEachAlive(function(creature){
              fn.apply(this, arguments);  
            });
          }
          for(var creatureType in zones[zone]['spawn']){
            zones[zone]['spawn'][creatureType].forEachAlive(function(creature){
              fn.apply(this, arguments);  
            });
          }
        }  
      }  
    },
    population: function(){
      var allAnimal = 0;
      this.forEachAlive(function(){
        allAnimal++;
      });
      return allAnimal;
    }
  };
};

module.exports = enemyManager;