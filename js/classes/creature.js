var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');

var Creature = function(game, creatureType, x, y, origin){
  Phaser.Sprite.call(this, game, x, y, (creatureType || creatureConfigs[creatureType].image));
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = creatureConfigs[creatureType] || creatureConfigs['creatureDefaults'];
  this.state = '';
  this.body.collideWorldBounds = true;
  this.body.gravity.y = creatureConfigs[creatureType].gravity;
  this.body.mass = creatureConfigs[creatureType].mass;
  this.anchor.setTo(0.5, 0.5);
  
  this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
  this._debugText.visible = false;
  
  this.origin = origin;
  /*  @boundTo
    {x, y}            - a point
    {x, x}            - a section
    {x1, y1, x2, y2}  - an exact zone
  */
  this.boundTo = { };
  this.lifespan = creatureConfigs[creatureType].lifespan;
  this.stunnedUntil = 0;

  this.facingRight = Math.random() < 0.5 ? true : false;
  
  creatureConfigs[creatureType].animations.forEach(function(anim){
    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
  }.bind(this));
  
  // apply creature 'class' by extend the object with behavioural mixins
  movements.behaviours[creatureType].call(Creature.prototype);
  // apply the creature's own update to be called
  this.update = movements.updates[creatureType].bind(this);
};

Creature.prototype = Object.create(Phaser.Sprite.prototype);

Creature.prototype.constructor = Creature;

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
  