var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Parrot(game, x, y){
  Creature.call(this, game, 'parrot', x, y);

  this.setProps();
  this.setAnimations();
}

Parrot.prototype = Object.create(Creature.prototype);
Parrot.prototype.constructor = Parrot;

module.exports = Parrot;
  