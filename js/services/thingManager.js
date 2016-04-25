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
  
  thingsToLoad.bonus.forEach(function(bonusConfig){
    var bonus = new Thing(game, bonusConfig.img, bonusConfig.x, bonusConfig.y);
    things.bonus.add(bonus);
  });
  
  thingsToLoad.portals.forEach(function(portalConfig){
    var portal = new Portal(game, portalConfig.jumpTo, portalConfig.x, portalConfig.y);
    things.portals.add(portal);
  });
  
  thingsToLoad.platforms.forEach(function(platformConfig){
    var platform = new Platform(game, platformConfig.img, platformConfig.x, platformConfig.y, platformConfig);
    things.platforms.add(platform);
  });
  
  return things;
};

module.exports = thingManager;