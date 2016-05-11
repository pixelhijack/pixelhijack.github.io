var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Dragonfly(game, x, y){
  Creature.call(this, game, 'dragonfly', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Dragonfly.prototype = Object.create(Creature.prototype);
Dragonfly.prototype.constructor = Dragonfly;

Dragonfly.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.state = 'moving';
  this.move();
  this.sentinel();
};

module.exports = Dragonfly;
  