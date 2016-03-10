var behaviours = require('./behaviours.js');

var Creature = function(creatureType, game, config){
  Phaser.Sprite.call(this, game, config.x, config.y, config.image);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = config.props;
  this.animate = config.animate;
  this.body.collideWorldBounds = true;
  this.body.gravity.y = config.gravity;
  
  // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
  behaviours[creatureType].call(Creature.prototype);
};

Creature.prototype = Object.create(Phaser.Sprite.prototype);

Creature.prototype.constructor = Creature;


module.exports = Creature;
  