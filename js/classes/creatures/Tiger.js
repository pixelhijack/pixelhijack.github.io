var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Tiger(game, x, y){
  Creature.call(this, game, 'tiger', x, y);

  this.setProps();
  this.setAnimations();
}

Tiger.prototype = Object.create(Creature.prototype);
Tiger.prototype.constructor = Tiger;

module.exports = Tiger;
  