var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Native(game, x, y){
  Creature.call(this, game, 'native', x, y);

  this.setProps();
  this.setAnimations();
}

Native.prototype = Object.create(Creature.prototype);
Native.prototype.constructor = Native;

Native.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.state = 'moving';
  this.turnIfBlocked();
  this.move();
  this.sentinel();
};

module.exports = Native;
  