var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Frog(game, x, y){
  Creature.call(this, game, 'frog', x, y);

  this.setProps();
  this.setAnimations();
}

Frog.prototype = Object.create(Creature.prototype);
Frog.prototype.constructor = Frog;

module.exports = Frog;
  