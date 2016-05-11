var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');
var Creature = require('./Creature.js');

function Ptero(game, x, y){
  Creature.call(this, game, 'ptero', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Ptero.prototype = Object.create(Creature.prototype);
Ptero.prototype.constructor = Ptero;

Ptero.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.move();
  this.state = 'moving';
  this.turnIfBlocked();
  if(Math.random() < 0.01){
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
      this.state = 'descend';
      this.descend();
    }, this);
  }
  if(Math.random() < 0.01){
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
      this.state = 'ascend';
      this.ascend();
    }, this);
  }
};

Ptero.prototype.ascend = function ascend(){
  this.body.velocity.y -= this.props.acceleration;
};

Ptero.prototype.descend = function descend(){
  this.body.velocity.y += this.props.acceleration;
};

module.exports = Ptero;
  