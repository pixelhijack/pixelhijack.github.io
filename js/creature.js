var configs = require('./configs.js');
var behaviours = require('./behaviours.js');

var Creature = function(game, creatureType, x, y){
  Phaser.Sprite.call(this, game, x, y, (creatureType || configs[creatureType].image));
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = configs[creatureType] || configs['creatureDefaults'];
  this._state = '';
  this.body.collideWorldBounds = true;
  this.body.gravity.y = this.props.gravity;
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

Creature.prototype.isGrounded = function isGrounded(){
  return this.body.touching.down || this.body.blocked.down;
};

module.exports = Creature;
  