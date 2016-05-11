var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');
var Creature = require('./Creature.js');

function Dino(game, x, y){
  Creature.call(this, game, 'dino', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Dino.prototype = Object.create(Creature.prototype);
Dino.prototype.constructor = Dino;

Dino.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.turnIfBlocked();
  this.move();
  this.sentinel();
  if(Math.random() < 0.005){ 
    this.facingRight = !this.facingRight;
  }
  if(Math.random() < 0.05){ 
    this.jump(); 
    this.state = 'jumping';
  }
};

module.exports = Dino;
  