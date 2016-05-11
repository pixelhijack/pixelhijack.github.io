var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');
var Creature = require('./Creature.js');

function Insect(game, x, y){
  Creature.call(this, game, 'insect', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Insect.prototype = Object.create(Creature.prototype);
Insect.prototype.constructor = Insect;

Insect.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.turnIfBlocked();
  this.move();
  if(Math.random() < 0.005){ 
    this.facingRight = !this.facingRight;
  }
  if(Math.random() < 0.05){ 
    this.jump(); 
    this.state = 'jumping';
  }
};

module.exports = Insect;
  