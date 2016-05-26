var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Ptero(game, x, y){
  Creature.call(this, game, 'ptero', x, y);

  this.setProps();
  this.setAnimations();
}

Ptero.prototype = Object.create(Creature.prototype);
Ptero.prototype.constructor = Ptero;

Ptero.prototype.specialMoves = function specialMoves(){
  if(Math.random() < 0.005){
    return 'turn';
  }
  if(Math.random() < 0.05){
    this.setState('descend', 50);
    return 'descend';
  }
  if(Math.random() < 0.05){
    this.setState('ascend', 100);
    return 'ascend';
  }
  if(Math.random() < 0.05){
    this.setState('move', 500);
    return 'move';
  }
  return 'move';
};

Ptero.prototype.ascend = function ascend(){
  this.body.velocity.y -= this.props.acceleration;
};

Ptero.prototype.descend = function descend(){
  this.body.velocity.y += this.props.acceleration;
};

module.exports = Ptero;
  