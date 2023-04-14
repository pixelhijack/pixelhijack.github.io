var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Worm(game, x, y){
  Creature.call(this, game, 'worm', x, y);

  this.setProps();
  this.setAnimations();
}

Worm.prototype = Object.create(Creature.prototype);
Worm.prototype.constructor = Worm;

module.exports = Worm;
  