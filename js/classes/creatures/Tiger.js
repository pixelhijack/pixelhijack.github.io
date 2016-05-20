var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Tiger(game, x, y){
  Creature.call(this, game, 'tiger', x, y);

  this.setProps();
  this.setAnimations();
}

Tiger.prototype = Object.create(Creature.prototype);
Tiger.prototype.constructor = Tiger;

Tiger.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  if(Math.random() < 0.005){ 
    this.jump(); 
    this.state = 'jumping';
  }else{
    this.turnIfBlocked();
    this.move();
  }
};

module.exports = Tiger;
  