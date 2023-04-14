var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Penguin(game, x, y){
  Creature.call(this, game, 'penguin', x, y);

  this.setProps();
  this.setAnimations();
}

Penguin.prototype = Object.create(Creature.prototype);
Penguin.prototype.constructor = Penguin;

module.exports = Penguin;
  