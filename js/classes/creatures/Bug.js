var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Bug(game, x, y){
  Creature.call(this, game, 'bug', x, y);

  this.setProps();
  this.setAnimations();
}

Bug.prototype = Object.create(Creature.prototype);
Bug.prototype.constructor = Bug;

module.exports = Bug;
  