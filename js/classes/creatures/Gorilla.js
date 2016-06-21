var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Gorilla(game, x, y){
  Creature.call(this, game, 'gorilla', x, y);

  this.setProps();
  this.setAnimations();
  
  this.head = this.addChild(this.game.make.sprite(0, 20, 'pre2atlas'));
  this.legs = this.addChild(this.game.make.sprite(0, 0, 'pre2atlas'));
  this.leftArm = this.addChild(this.game.make.sprite(0, 0, 'pre2atlas'));
  this.rightArm = this.addChild(this.game.make.sprite(0, 0, 'pre2atlas'));
  
  this.head.animations.add('idle', [406, 407, 408], 10, true);
}

Gorilla.prototype.update = function update(){
  this.render();
  this.react();
  this.decide();
};

Gorilla.prototype.render = function render(){
  this.state.name = 'idle';
  this.play(this.state.name); 
  this.head.animations.play(this.state.name);
  this.scale.x = this.facingRight ? 1 : -1;
};

Gorilla.prototype = Object.create(Creature.prototype);
Gorilla.prototype.constructor = Gorilla;

module.exports = Gorilla;
  