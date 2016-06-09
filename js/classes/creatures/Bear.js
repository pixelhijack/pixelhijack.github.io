var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Bear(game, x, y){
  Creature.call(this, game, 'bear', x, y);

  this.setProps();
  this.setAnimations();
}

Bear.prototype = Object.create(Creature.prototype);
Bear.prototype.constructor = Bear;

module.exports = Bear;
  