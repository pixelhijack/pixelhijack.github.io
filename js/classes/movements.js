// general behaviour reducers any entity can use
var mixins = {
  /******************************
  *     MOVE LEFT
  ******************************/
  moveLeft: function(overrideAcc){
    this.facingRight = false;
    if(overrideAcc === 0){
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }
    if(this.body.velocity.x > -this.props.maxSpeed){
      this.body.velocity.x -= overrideAcc || this.props.acceleration;
    }
  },
  /******************************
  *     MOVE RIGHT
  ******************************/
  moveRight: function(overrideAcc){
    this.facingRight = true;
    if(overrideAcc === 0){
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }
    if(this.body.velocity.x < this.props.maxSpeed){
        this.body.velocity.x += overrideAcc || this.props.acceleration;
      }
  },
  move: function(overrideAcc){
    this.facingRight ? 
      mixins.moveRight.call(this, overrideAcc) : 
      mixins.moveLeft.call(this, overrideAcc);
  },
  turnIfBlocked: function(){
    if(this.body.blocked.left){ 
      mixins.moveRight.call(this); 
      this.state = 'moving';
    }
    if(this.body.blocked.right){ 
      mixins.moveLeft.call(this); 
      this.state = 'moving';
    }
  },
  hurry: function(){
    this.turnIfBlocked();
    this.move();
    this.state = 'moving';
  },
  jump: function(){
    if(this.body.touching.down || this.body.blocked.down){
      this.body.velocity.y -= this.props.jumping;
    }
  }, 
  turn: function(){
    
  },
  lives: function(){
    return this.props.lives;
  },
  stop: function(slippery){
    this.body.velocity.x /= slippery;
  },
  duck: function(){},
  enter: function(){},
  hit: function(){
    
  },
  hurt: function(force){
    this.props.lives -= 1;
    this.body.velocity.x -= force * 3;
    this.body.velocity.y -= force * 3;
    this.stunnedUntil = this.game.time.now + Math.max(force * 5, 1000);
  },
  die: function(force){
    this.state = 'dead';
    //this.props.collide = false;
    this.body.velocity.x -= force * 3;
    this.body.velocity.y -= force * 3;
    // http://www.html5gamedevs.com/topic/6429-use-phasertime-like-settimeout/
    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.kill, this);
  },
  see: function(){},
  sniff: function(enemy){
    // @enemy: the position of the hero
    // @return: decision = call a behaviour based on sniffing out the approaching enemy
  },
  decide: function(condition, behaviour){
    // @condition: based on decision
    // @behaviour: list of behaviours
    // @return: one behaviour 
  },
  wait: function(){
    this.body.moves = false;
    this.state = 'idle';
  },
  descend: function(){
    this.body.velocity.y += this.props.acceleration;
  },
  ascend: function(){
    this.body.velocity.y -= this.props.acceleration;
  },
  sleep: function(){},
  sentinel: function(){
    // @boundTo: {x1, x2} or {x1, y1, x2, y2} Rectangle
    // @behaviour 'sentinel back & forth': if bound to a zone, stay there
    if(this.boundTo.hasOwnProperty('width')){
      if(this.x < this.boundTo.x){
        this.facingRight = true;
        mixins.move.call(this);
      }
      if(this.x > this.boundTo.x + this.boundTo.width){
        this.facingRight = false;
        mixins.move.call(this);
      }
    }
    // @boundTo: {x, y} Point
    // @behaviour 'hurry somewhere': if bound to a point, head there
    // @behaviour 'wait at': if reached the point, wait there
    if(!this.boundTo.hasOwnProperty('width')){
      if(Phaser.Rectangle.containsPoint(this.getBounds(), this.boundTo)){
        console.info('[movements] %s reached boundTo point', this.key);
        mixins.wait.call(this);
        return false;
      }
    }  
  },
  attack: function(bait, overrideDist){
    var attackDistance = this.props.attack || overrideDist || 50;
    if(Math.abs(bait.x - this.x) < attackDistance){
      this.body.moves = true;
      //this.frenzy();
    }
  }
};

// creature class mixins implementing behaviours should be added here
var behaviours = {
  man: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.jump = mixins.jump;
    this.hurt = mixins.hurt;
    this.stop = mixins.stop;
    this.lives = mixins.lives;
    return this;
  },
  dino: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.move = mixins.move;
    this.jump = mixins.jump;
    this.wait = mixins.wait;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.sentinel = mixins.sentinel;
    this.die = mixins.die;
    return this;
  },
  ptero: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.descend = mixins.descend;
    this.ascend = mixins.ascend;
    return this;
  },
  bear: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.sentinel = mixins.sentinel;
    this.die = mixins.die;
  }, 
  dragonfly: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.die = mixins.die;
  },
  spider: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.sentinel = mixins.sentinel;
    this.die = mixins.die;
  },
  native: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.sentinel = mixins.sentinel;
    this.die = mixins.die;
  }
};

// specific updates of a creature
var updates = {
  dino: function(){
    this.play(this.state + '-' + this.direction());
    if(this.state !== 'dead'){
      this.turnIfBlocked();
      this.move();
      this.sentinel();
      this.x <= 0 ? this.x = this.game.world.width : this.x;
      if(Math.random() < 0.005){ 
        this.facingRight = !this.facingRight;
      }
      if(Math.random() < 0.05){ 
        this.jump(); 
        this.state = 'jumping';
      }
    }
  },
  ptero: function(){
    this.play(this.state + '-' + this.direction());
    this.move();
    this.state = 'moving';
    //this.x = this.x <= this.width * 0.5 ? this.game.world.width - 5 : this.x;
    this.turnIfBlocked();
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
    //this.x = this.x <= this.game.world.width - (this.width * 0.5) ? this.x : 0;
  },
  bear: function(){
    this.play(this.state + '-' + this.direction());
    if(this.state !== 'dead'){
      this.hurry();
      this.sentinel();
    }
  },
  man: function(){
    this.animations.play(this.state + '-' + this.direction());
  }, 
  dragonfly: function(){
    this.animations.play(this.state + '-' + this.direction());
    if(this.state !== 'dead'){
     this.hurry();
    }
  },
  spider: function(){
    this.animations.play(this.state + '-' + this.direction());
    if(this.state !== 'dead'){
      this.hurry();
      this.sentinel();
    }
  },
  native: function(){
    this.animations.play(this.state + '-' + this.direction());
    if(this.state !== 'dead'){
      if(!this.sentinel()){
        this.hurry(); 
      }
    }
  }
};

module.exports = {
  mixins: mixins,
  behaviours: behaviours,
  updates: updates
};

