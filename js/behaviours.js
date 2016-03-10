var mixins = {
  /******************************
  *     MOVE LEFT
  ******************************/
  moveLeft: function(){
    if(this.body.velocity.x > -this.props.maxSpeed){
      this.body.velocity.x -= this.props.acceleration;
    }
    this.animations.play(this.animate.left);
  },
  /******************************
  *     MOVE RIGHT
  ******************************/
  moveRight: function(){
    if(this.body.velocity.x < this.props.maxSpeed){
        this.body.velocity.x += this.props.acceleration;
      }
      this.animations.play(this.animate.right);
  },
  move: function(){
    if(this.body.velocity.x >= 0){
      mixins.moveRight.bind(this);
    }else{
     mixins.moveLeft.bind(this); 
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
  duck: function(){},
  enter: function(){},
  hit: function(){},
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
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    this.jump = mixins.jump;
    this.damage = mixins.damage;
    this.lives = mixins.lives;
    return this;
  },
  dino: function(){
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    this.move = mixins.move;
    this.jump = mixins.jump;
    this.wait = mixins.wait;
    return this;
  },
  ptero: function(){
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    return this;
  }
};

module.exports = behaviours;

