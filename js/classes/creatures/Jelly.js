var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Jelly(game, x, y){
  Creature.call(this, game, 'jelly', x, y);

  this.setProps();
  this.setAnimations();
}

Jelly.prototype = Object.create(Creature.prototype);
Jelly.prototype.constructor = Jelly;

module.exports = Jelly;
  