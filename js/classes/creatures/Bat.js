var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Bat(game, x, y){
  Creature.call(this, game, 'bat', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Bat.prototype = Object.create(Creature.prototype);
Bat.prototype.constructor = Bat;

Bat.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.state = 'moving';
  this.diagonalDescend(0.5, 1);
};

Bat.prototype.diagonalDescend = function diagonalDescend(dx, dy){
  this.y += dy;
  this.x += dx;
};

module.exports = Bat;
  