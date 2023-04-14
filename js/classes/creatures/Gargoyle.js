var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Gargoyle(game, x, y){
  Creature.call(this, game, 'gargoyle', x, y);

  this.setProps();
  this.setAnimations();
}

Gargoyle.prototype = Object.create(Creature.prototype);
Gargoyle.prototype.constructor = Gargoyle;

Gargoyle.prototype.move = function move(){
  this.y += 1;
  this.x = this.facingRight ? this.x + 0.5 : this.x - 0.5;
};

Gargoyle.prototype.diagonalDescend = function diagonalDescend(dx, dy){
  this.y += dy;
  this.x += dx;
};

module.exports = Gargoyle;
  