var behaviours = require('./behaviours.js');

var Creature = function(creatureType, game, config){
  Phaser.Sprite.call(this, game, config.x, config.y, config.image);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = config.props;
  this.body.collideWorldBounds = true;
  this.body.gravity.y = config.gravity;
  this.anchor.setTo(0.5, 0.5);
  
  this.facingRight = true;
  
  // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
  behaviours[creatureType].call(Creature.prototype);
};

Creature.prototype = Object.create(Phaser.Sprite.prototype);

Creature.prototype.constructor = Creature;

Creature.prototype.is = function is(state){
  var animation = state + '-' + this.direction();
  this.animations.play(animation);
};

Creature.prototype.direction = function direction(){
  return this.facingRight ? 'right' : 'left';
};

module.exports = Creature;
  