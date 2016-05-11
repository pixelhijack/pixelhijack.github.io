var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');
var Creature = require('./Creature.js');

function Turtle(game, x, y){
  Creature.call(this, game, 'turtle', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Turtle.prototype = Object.create(Creature.prototype);
Turtle.prototype.constructor = Turtle;

Turtle.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.state = 'moving';
  this.turnIfBlocked();
  this.move();
  this.sentinel();
};

module.exports = Turtle;
  