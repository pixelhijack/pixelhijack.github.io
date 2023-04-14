var Thing = require('../classes/things.js');
var Portal = require('../classes/portal.js');
var Platform = require('../classes/platform.js');
var Group = require('../classes/group.js');

var thingManager = function(game, thingsToLoad){
  
  var things = {
    bonus: new Group(game),
    portals: new Group(game),
    platforms: new Group(game)
  };
  
  thingsToLoad.bonus.forEach(function(bonusConfig, i){
    var bonus = new Thing(game, bonusConfig.img, bonusConfig.x, bonusConfig.y);
    things.bonus.add(bonus);
    // level-test.js: 
    if(bonusConfig.debug){
      game.add.text(bonusConfig.x, bonusConfig.y - 20 - (i % 2) * 10, bonusConfig.debug, { 
        font: "9px Courier" 
      });
    }
  });
  
  thingsToLoad.portals.forEach(function({ jumpTo , x, y }){
    var portal = new Portal({ 
      game, jumpTo, x, y
    });
    things.portals.add(portal);
  });
  
  thingsToLoad.platforms.forEach(function(platformConfig){
    var platform = new Platform(game, platformConfig.img, platformConfig.x, platformConfig.y, platformConfig);
    things.platforms.add(platform);
  });
  
  return things;
};

module.exports = thingManager;