var creatureConfigs = require('../configs/creatureConfigs.js');
var movements = require('./movements.js');

var Creature = function(game, creatureType, x, y){
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

  /*
    @this.lifespan: the actual, used by Phaser
    @this.props.lifespan: the abstract from creature & level configs
  */
  this.lifespan = this.props.lifespan;
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

  /*  @boundTo
    {x, y}            - a point
    {x1, x2}          - a section
    {x1, y1, x2, y2}  - an exact zone
  */
Object.defineProperty(Creature.prototype, 'boundTo', {
    get: function() { return this._boundTo; }, 
    set: function(bounds) {
      // {x, y}
      if(bounds.hasOwnProperty('x') && 
        bounds.hasOwnProperty('y')){
          this._boundTo = new Phaser.Point(bounds.x, bounds.y);
      }
      // {x1, x2}
      else if(bounds.hasOwnProperty('x1') && 
              bounds.hasOwnProperty('x2') &&
              !bounds.hasOwnProperty('y1') &&
              !bounds.hasOwnProperty('y2')){
          this._boundTo = new Phaser.Rectangle(bounds.x1, 0, bounds.x2 - bounds.x1, this.game.height);
      }
      // {x1, y1, x2, y2}
      else if(bounds.hasOwnProperty('x1') && 
              bounds.hasOwnProperty('x2') &&
              bounds.hasOwnProperty('y1') &&
              bounds.hasOwnProperty('y2')){
          this._boundTo = new Phaser.Rectangle(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
      // default: bound to the whole world
      } else {
        this._boundTo = new Phaser.Point(0, 0, this.game.width, this.game.height);
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
Creature.prototype.revive = function revive(x, y){
  this.lifespan = this.props.lifespan;
  this.state = 'moving';
  this.reset(x, y);
};

module.exports = Creature;
  