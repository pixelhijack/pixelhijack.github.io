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
  jump: function(){}, 
  duck: function(){},
  enter: function(){},
  hit: function(){},
  damage: function(){},
  die: function(){},
  
  sniff: function(enemy){
    // @enemy: the position of the hero
    // @return: decision = call a behaviour based on sniffing out the approaching enemy
  },
  wait: function(){},
  sentinel: function(){},
  follow: function(){}
};

var behaviours = {
  man: function(){
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    return this;
  },
  dino: function(){
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    return this;
  },
  ptero: function(){
    this.runRight = mixins.moveRight;
    this.runLeft = mixins.moveLeft;
    return this;
  }
};

module.exports = behaviours;

