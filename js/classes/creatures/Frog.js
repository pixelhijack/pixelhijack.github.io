var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Frog(game, x, y){
  Creature.call(this, game, 'frog', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Frog.prototype = Object.create(Creature.prototype);
Frog.prototype.constructor = Frog;

Frog.prototype.defaultUpdate = function defaultUpdate(){
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

module.exports = Frog;
  