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
  move: function(){
    if(this.body.velocity.x >= 0){
      mixins.moveRight.call(this);
    }else{
      mixins.moveLeft.call(this); 
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

var behaviours = {
  man: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.jump = mixins.jump;
    this.damage = mixins.damage;
    this.stop = mixins.stop;
    this.lives = mixins.lives;
    this.update = function(){
      
    };
    return this;
  },
  dino: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.move = mixins.move;
    this.jump = mixins.jump;
    this.wait = mixins.wait;
    this.update = function(game){
      this.move();
      this.x <= 0 ? this.x = game.world.width : this.x;
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
    };
    return this;
  },
  ptero: function(){
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    this.update = function(game){
      this.x -= 1;
      this.animations.play('fly');
      this.x = this.x <= this.width/2 ? game.world.width - 5 : this.x;
    };
    return this;
  }
};

module.exports = behaviours;

