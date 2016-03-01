function Creature(game, config){
  Phaser.Sprite.call(this, game, config.x, config.y, config.image);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.props = config.props;
  this.animate = config.animate;
  this.body.collideWorldBounds = true;
  this.body.gravity.y = config.gravity;
}

Creature.prototype = Object.create(Phaser.Sprite.prototype);

Creature.prototype.constructor = Creature;

Creature.prototype.runRight = function(){
  if(this.body.velocity.x < this.props.maxSpeed){
    this.body.velocity.x += this.props.acceleration;
  }
  this.animations.play(this.animate.right);
};

Creature.prototype.runLeft = function(){
  if(this.body.velocity.x > -this.props.maxSpeed){
    this.body.velocity.x -= this.props.acceleration;
  }
  this.animations.play(this.animate.left);
}

Creature.prototype.hit = function(keys){

}
  