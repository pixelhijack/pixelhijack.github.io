var behaviours = require('./behaviours.js');

var Creature = function(creatureType, game, config){
  Phaser.Sprite.call(this, game, config.x, config.y, config.image);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = config.props;
  this._state = config.state || '';
  this.body.collideWorldBounds = true;
  this.body.gravity.y = config.gravity;
  this.anchor.setTo(0.5, 0.5);
  
  this.facingRight = true;
  
  // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
  behaviours[creatureType].call(Creature.prototype);
};

Creature.prototype = Object.create(Phaser.Sprite.prototype);

Creature.prototype.constructor = Creature;

Object.defineProperty(Creature.prototype, 'state', {
    get: function() { return this._state; }, 
    set: function(value) {
        if (value !== this._state)
        {
            this._state = value;
        }
    }
});

Creature.prototype.direction = function direction(){
  return this.facingRight ? 'right' : 'left';
};

module.exports = Creature;
  