var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');
var Creature = require('./Creature.js');

function Bug(game, x, y){
  Creature.call(this, game, 'bug', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Bug.prototype = Object.create(Creature.prototype);
Bug.prototype.constructor = Bug;

Bug.prototype.defaultUpdate = function defaultUpdate(){
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

module.exports = Bug;
  