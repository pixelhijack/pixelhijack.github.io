var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Ptero(game, x, y){
  Creature.call(this, game, 'ptero', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Ptero.prototype = Object.create(Creature.prototype);
Ptero.prototype.constructor = Ptero;

Creature.prototype.update = function update(){
  this.react();
  this.state = this.nextAction();
};

Ptero.prototype.nextAction = function nextAction(){
  if(this.state === 'die'){
    return 'die';
  } else {
    if(this.boundTo.hasOwnProperty('width')){
      if(this.x < this.boundTo.x){
        this.facingRight = true;
      }
      if(this.x > this.boundTo.x + this.boundTo.width){
        this.facingRight = false;
      }
      return 'move';
    } else {
      if(this.body.blocked.left || this.body.blocked.right){
        return 'turn';
      } else {
        if(Math.random() < 0.005){
          return 'turn';
        }
        if(Math.random() < 0.05){
          return 'descend';
        }
        if(Math.random() < 0.05){
          return 'ascend';
        }
        return 'move';
      }
    }
  }
};

Ptero.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'die'){
    return;
  }
  this.move();
  this.state = 'move';
  if(this.body.blocked.left || this.body.blocked.right){
    this.turn();
  }
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
  