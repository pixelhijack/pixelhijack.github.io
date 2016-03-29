// general behaviour reducers any entity can use
var movements = {
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
  move: function(){
    if(this.body.velocity.x >= 0){
      movements.moveRight.call(this);
    }else{
      movements.moveLeft.call(this); 
    }
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
  die: function(){},
  
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
  sleep: function(){},
  sentinel: function(){},
  follow: function(){}
};

// creature class mixins implementing behaviours should be added here
var behaviours = {
  man: function(){
    this.moveRight = movements.moveRight;
    this.moveLeft = movements.moveLeft;
    this.jump = movements.jump;
    this.damage = movements.damage;
    this.stop = movements.stop;
    this.lives = movements.lives;
    return this;
  },
  dino: function(){
    this.moveRight = movements.moveRight;
    this.moveLeft = movements.moveLeft;
    this.move = movements.move;
    this.jump = movements.jump;
    this.wait = movements.wait;
    return this;
  },
  ptero: function(){
    this.runRight = movements.moveRight;
    this.runLeft = movements.moveLeft;
    return this;
  }
};

// specific update movements of a creature
var updates = {
  dino: function(){
    this.move();
    this.x <= 0 ? this.x = this.game.world.width : this.x;
    if(Math.random() < 0.05){ 
      this.jump(); 
      this.animations.play('jumping-' + this.direction());
    }
    if(this.body.blocked.left){ 
      this.moveRight(); 
      this.animations.play('moving-right');
    }
    if(this.body.blocked.right){ 
      this.moveLeft(); 
      this.animations.play('moving-left');
    }
  },
  ptero: function(){
    this.x -= 1;
    this.animations.play('fly');
    this.x = this.x <= this.width * 0.5 ? this.game.world.width - 5 : this.x;
  },
  man: function(){
    
  }
};

module.exports = {
  movements: movements,
  behaviours: behaviours,
  updates: updates
};

