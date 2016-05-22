var creatureConfigs = require('../../configs/creatureConfigs.js');

var Creature = function(game, creatureType, x, y){
  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.creatureType = creatureType;

  this.state = {
    name: 'spawn', 
    until: this.game.time.now
  };
  
  this.body.collideWorldBounds = true;
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  
  this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
  this._debugText.visible = false;

  this.facingRight = Math.random() < 0.5 ? true : false;
  
  // every creature makes noises: an observable phaser channel to subscribe for:
  this.noise = new Phaser.Signal();
};

Creature.prototype = Object.create(Phaser.Sprite.prototype);
Creature.prototype.constructor = Creature;

Creature.prototype.setAnimations = function setAnimations(){
  creatureConfigs[this.creatureType].animations.forEach(function(anim){
    anim.frames = anim.frames.map(function(frameNumber){
      return frameNumber.toString();
    });
    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
  }.bind(this));
};

Creature.prototype.setId = function setId(creatureType, x, y, enemyGroupIterator){
  // @creatureId: creatureType-x-y-enemyGroupIterator
  this.creatureId = creatureType + '-' + x + '-' + y + '-' + enemyGroupIterator;
};

Creature.prototype.setProps = function setProps(){
  this.props = creatureConfigs[this.creatureType] || creatureConfigs.creatureDefaults;
  
  this.body.gravity.y = creatureConfigs[this.creatureType].gravity;
  this.body.mass = creatureConfigs[this.creatureType].mass;
  this.anchor.setTo(creatureConfigs[this.creatureType].correctedAnchor.x, creatureConfigs[this.creatureType].correctedAnchor.y);

  /*
    @this.lifespan: the actual, used by Phaser
    @this.props.lifespan: the abstract from creature & level configs
  */
  this.lifespan = this.props.lifespan;
};

Creature.prototype.setState = function setState(state, until){
  this.state = {
    name: state,
    until: this.game.time.now + (until || 0)
  };
};

Creature.prototype.nextAction = function nextAction(){
  // if dead can't do anything else :)
  if(this.state.name === 'die'){
    return 'die';
  }
  // lock states for a time like stunned for 2 sec
  if(this.state.until > this.game.time.now){
    return this.state.name;
  }
  // fall state to prevent active:false idles stop in the middle of air
  if(this.props.jumping && !this.isGrounded() && this.body.velocity.y > 0){
    return 'fall';
  }
  // bored guys...
  if(!this.props.active){
    return 'idle';
  }
  // boundTo {x1, x2} or {x1, y1, x2, y2} Rectangle
  if(this.boundTo.hasOwnProperty('width')){
    if(this.x < this.boundTo.x){
      this.facingRight = true;
    }
    if(this.x > this.boundTo.x + this.boundTo.width){
      this.facingRight = false;
    }
    return 'move';
  }
  // boundTo {x, y} Point
  if(!this.boundTo.hasOwnProperty('width') && 
      Object.keys(this.boundTo).length &&
      !Phaser.Rectangle.containsPoint(this.getBounds(), this.boundTo)){
    if((this.x < this.boundTo.x && !this.facingRight) || 
       (this.x > this.boundTo.x && this.facingRight)){
      return 'turn';
    }
  }
  // prevent stick to some wall or edge
  if(this.body.blocked.left || this.body.blocked.right){
    return 'turn';
  }
  // sometimes do other things like jump or turn
  if(this.props.jumping && Math.random() < 0.05){
    return 'jump';
  }
  if(Math.random() < 0.005){
    return 'turn';
  }
  return 'move';
};

Creature.prototype.render = function render(){
  this.play(this.state.name); 
  this.scale.x = this.facingRight ? 1 : -1;
};

Creature.prototype.react = function react(){
  if(this.state.name && this[this.state.name]){
    this[this.state.name]();
  }
};

Creature.prototype.decide = function decide(){
  this.state.name = this.nextAction();
};

Creature.prototype.update = function update(){
  this.render();
  this.react();
  this.decide();
};

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
  this._debugText.setText(toDebug || '');
};

Creature.prototype.listen = function listen(subject, reaction){
  // subscribe a creature to man's noises: man.noise.add(creature.onEnemyMovements, creature);
  subject.noise.add(reaction, this);
};

Creature.prototype.shout = function shout(eventType){
  this.noise.dispatch({ 
    who: this.creatureType, 
    event: eventType, 
    x: this.x | 0, 
    y: this.y | 0, 
    args: Array.prototype.slice.call(arguments, 1)[0] });
};

Creature.prototype.onEnemyMovements = function onEnemyMovements(evt){
  if(!(this.onMove || this.onClose || this.onLeave)){
    return;
  }
  this.onMove && this.onMove.call(this, evt);
  if(Math.abs(this.x - evt.x) < this.props.sense){
    this.onClose && this.onClose.call(this, evt);
  } else {
    this.onLeave && this.onLeave.call(this, evt);
  }
};

Creature.prototype.revive = function revive(x, y){
  this.lifespan = this.props.lifespan;
  this.state.name = 'spawn';
  this.reset(x, y);
};

Creature.prototype.health = function health(eventType){
  return this.props.lives;
};

Creature.prototype.move = function move(){
  this.facingRight ? 
      this.moveRight() : 
      this.moveLeft();
};

Creature.prototype.moveLeft = function moveLeft(overrideAcc){
  if(this.body.velocity.x > -this.props.maxSpeed){
    this.body.velocity.x -= overrideAcc || this.props.acceleration;
  }
};

Creature.prototype.moveRight = function moveRight(overrideAcc){
  if(this.body.velocity.x < this.props.maxSpeed){
    this.body.velocity.x += overrideAcc || this.props.acceleration;
  }
};

Creature.prototype.turn = function turn(){
  this.facingRight = !this.facingRight;
  this.move();
};

Creature.prototype.wakeUp = function wakeUp(){
  this.props.active = true;
};
Creature.prototype.wait = function wait(){
  this.props.active = false;
};
Creature.prototype.follow = function follow(evt){
  this.props.active = true;
  this.boundTo = {
    x: evt.x,
    y: evt.y
  };
};

Creature.prototype.idle = function idle(){
  this.body.velocity.x = 0;
};

Creature.prototype.jump = function jump(){
  if(this.props.jumping && (this.body.touching.down || this.body.blocked.down)){
    this.body.velocity.y -= this.props.jumping;
  }
};

Creature.prototype.stop = function stop(slippery){
  this.body.velocity.x /= (slippery || 1.1);
};

Creature.prototype.hurt = function hurt(force){
  this.setState('stun', 1500);
  this.props.lives -= 1;
  this.body.velocity.x += force * 3;
  this.body.velocity.y += force * 3;
};

Creature.prototype.die = function die(force){
  this.setState('die', 2000);
  //this.props.collide = false;
  this.body.velocity.x -= force * 3;
  this.body.velocity.y -= force * 3;
  // http://www.html5gamedevs.com/topic/6429-use-phasertime-like-settimeout/
  this.game.time.events.add(Phaser.Timer.SECOND * 2, this.kill, this);
};

Creature.prototype.sentinel = function sentinel(){
  // @boundTo: {x1, x2} or {x1, y1, x2, y2} Rectangle
  // @behaviour 'sentinel back & forth': if bound to a zone, stay there
  if(this.boundTo.hasOwnProperty('width')){
    if(this.x < this.boundTo.x){
      this.facingRight = true;
      this.move();
    }
    if(this.x > this.boundTo.x + this.boundTo.width){
      this.facingRight = false;
      this.move();
    }
  }
  // @boundTo: {x, y} Point
  // @behaviour 'hurry somewhere': if bound to a point, head there
  // @behaviour 'wait at': if reached the point, wait there
  if(!this.boundTo.hasOwnProperty('width')){
    if(Phaser.Rectangle.containsPoint(this.getBounds(), this.boundTo)){
      //console.info('[movements] %s reached boundTo point', this.key);
      this.wait();
      return false;
    }
  }  
};

Creature.prototype.attackIfClose = function attackIfClose(evt){
  if(Math.abs(this.x - evt.x) < this.props.sense){
    //this.update = this.defaultUpdate;
  } else {
    //this.update = this.waitStill;
  }
};

Creature.prototype.attackIfAwakened = function attackIfAwakened(evt){
  if(Math.abs(this.x - evt.x) < this.props.sense){
    this.update = this.defaultUpdate;
  }
};

module.exports = Creature;
  