var Thing = require('../classes/things.js');
var Group = require('../classes/group.js');

var thingManager = function(game, thingList){
  
  var things = {
    bonus: new Group(game),
    portals: new Group(game),
    platforms: new Group(game)
  };
  
  thingList.forEach(function(thingConfig){
    var thing = new Thing(game, thingConfig.img, thingConfig.x, thingConfig.y);
    things.bonus.add(thing);
  });
  
  return things;
};

module.exports = thingManager;