var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Dino(game, x, y){
  Creature.call(this, game, 'dino', x, y);

  this.setProps();
  this.setAnimations();
}

Dino.prototype = Object.create(Creature.prototype);
Dino.prototype.constructor = Dino;


Dino.prototype.specialMoves = function specialMoves(){
  if(this.props.jumping && Math.random() < 0.05){
    return 'jump';
  }
  if(Math.random() < 0.005){
    return 'turn';
  }
  return 'move';
};

module.exports = Dino;
  