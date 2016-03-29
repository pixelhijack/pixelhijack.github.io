var configs = require('./configs.js');
var mixins = require('./mixins.js');

var Creature = function(game, creatureType, x, y, origin){
  Phaser.Sprite.call(this, game, x, y, (creatureType || configs[creatureType].image));
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = configs[creatureType] || configs['creatureDefaults'];
  this._state = '';
  this.body.collideWorldBounds = true;
  this.body.gravity.y = this.props.gravity;
  this.anchor.setTo(0.5, 0.5);
  
  this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
  this._debugText.visible = false;
  
  this.origin = origin;
  this.lifespan = this.props.lifespan;

  this.facingRight = true;
  
  configs[creatureType].animations.forEach(function(anim){
    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
  }.bind(this));
  
  // apply creature 'class' by extend the object with behavioural mixins
  mixins.behaviours[creatureType].call(Creature.prototype);
  // apply the creature's own update to be called
  this.update = mixins.updates[creatureType].bind(this);
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

// use in update()
Creature.prototype.debug = function debug(toDebug){
  this._debugText.visible = true;
  this._debugText.setText(toDebug);
};

/*==========================================
  FIXME!! 
http://www.html5gamedevs.com/topic/9158-sprite-lifespan-problem/
==========================================*/
Creature.prototype.revive = function revive(){
  this.lifespan = this.props.lifespan;
};

module.exports = Creature;
  