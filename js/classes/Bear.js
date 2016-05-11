var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');
var Creature = require('./Creature.js');

function Bear(game, x, y){
  Creature.call(this, game, 'bear', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Bear.prototype = Object.create(Creature.prototype);
Bear.prototype.constructor = Bear;

Bear.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.state = 'moving';
  this.turnIfBlocked();
  this.move();
  this.sentinel();
};

module.exports = Bear;
  