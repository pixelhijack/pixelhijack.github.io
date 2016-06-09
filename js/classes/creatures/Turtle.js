var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Turtle(game, x, y){
  Creature.call(this, game, 'turtle', x, y);

  this.setProps();
  this.setAnimations();
}

Turtle.prototype = Object.create(Creature.prototype);
Turtle.prototype.constructor = Turtle;

module.exports = Turtle;
  