// general behaviour reducers any entity can use
var mixins = {
  /******************************
  *     MOVE LEFT
  ******************************/
  moveLeft: function(overrideAcc){
    this.facingRight = false;
    if(this.body.velocity.x > -this.props.maxSpeed){
      this.body.velocity.x -= overrideAcc || this.props.acceleration;
    }
  },
  /******************************
  *     MOVE RIGHT
  ******************************/
  moveRight: function(overrideAcc){
    this.facingRight = true;
    if(this.body.velocity.x < this.props.maxSpeed){
        this.body.velocity.x += overrideAcc || this.props.acceleration;
      }
  },
  move: function(overrideAcc){
    this.facingRight ? 
      mixins.moveRight.call(this, overrideAcc) : 
      mixins.moveLeft.call(this, overrideAcc);
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
  damage: function(severity){
    this.props.lives -= severity;
    this.body.velocity.x -= severity * Math.random() * 20;
  },
  die: function(){
    this.state = 'dead';
    this.body.velocity.y -= Math.random() * 500;
    this.game.time.events.add(Phaser.Timer.SECOND * 1, this.kill, this);
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
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  },
  descend: function(){
    this.body.velocity.y += this.props.acceleration;
  },
  ascend: function(){
    this.body.velocity.y -= this.props.acceleration;
  },
  sleep: function(){},
  sentinel: function(){},
  follow: function(){}
};

// creature class mixins implementing behaviours should be added here
var behaviours = {
  man: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.jump = mixins.jump;
    this.damage = mixins.damage;
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
    this.die = mixins.die;
    return this;
  },
  ptero: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.descend = mixins.descend;
    this.ascend = mixins.ascend;
    return this;
  }
};

// specific updates of a creature
var updates = {
  dino: function(){
    this.play(this.state + '-' + this.direction());
    if(this.state !== 'dead'){
      this.move();
      this.x <= 0 ? this.x = this.game.world.width : this.x;
      if(Math.random() < 0.05){ 
        this.jump(); 
        this.state = 'jumping';
      }
      if(this.body.blocked.left){ 
        this.moveRight(); 
        this.state = 'moving';
      }
      if(this.body.blocked.right){ 
        this.moveLeft(); 
        this.state = 'moving';
      }
    }
  },
  ptero: function(){
    this.play(this.state + '-' + this.direction());
    this.move();
    this.state = 'fly';
    this.x = this.x <= this.width * 0.5 ? this.game.world.width - 5 : this.x;
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
  man: function(){
    
  }
};

module.exports = {
  mixins: mixins,
  behaviours: behaviours,
  updates: updates
};

