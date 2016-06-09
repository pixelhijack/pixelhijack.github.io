var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Insect(game, x, y){
  Creature.call(this, game, 'insect', x, y);

  this.setProps();
  this.setAnimations();
}

Insect.prototype = Object.create(Creature.prototype);
Insect.prototype.constructor = Insect;

module.exports = Insect;
  