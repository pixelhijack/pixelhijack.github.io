var Thing = require('../classes/things.js');
var Group = require('../classes/group.js');
var thingManager = function(game, thingList){
  
  var things = {
    bonuses: new Group(game),
    portals: new Group(game),
    platforms: new Group(game)
  };
  
  thingList.forEach(function(thingConfig){
    var thing = new Thing(game, thingConfig.img, thingConfig.x, thingConfig.y);
    things.portals.add(thing);
  });
  
  return things;
};

module.exports = thingManager;