var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Dragonfly(game, x, y){
  Creature.call(this, game, 'dragonfly', x, y);

  this.setProps();
  this.setAnimations();
}

Dragonfly.prototype = Object.create(Creature.prototype);
Dragonfly.prototype.constructor = Dragonfly;

module.exports = Dragonfly;
  