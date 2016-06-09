var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Bat(game, x, y){
  Creature.call(this, game, 'bat', x, y);

  this.setProps();
  this.setAnimations();
}

Bat.prototype = Object.create(Creature.prototype);
Bat.prototype.constructor = Bat;

Bat.prototype.move = function move(){
  this.y += 1;
  this.x = this.facingRight ? this.x + 0.5 : this.x - 0.5;
};

Bat.prototype.diagonalDescend = function diagonalDescend(dx, dy){
  this.y += dy;
  this.x += dx;
};

module.exports = Bat;
  