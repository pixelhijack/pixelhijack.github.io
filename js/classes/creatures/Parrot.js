var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Parrot(game, x, y){
  Creature.call(this, game, 'parrot', x, y);

  this.setProps();
  this.setAnimations();
  this.state = 'spawn';
}

Parrot.prototype = Object.create(Creature.prototype);
Parrot.prototype.constructor = Parrot;

Parrot.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.state = 'moving';
  this.move();
  this.sentinel();
};

module.exports = Parrot;
  