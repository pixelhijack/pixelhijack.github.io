var Thing = function(game, frameName, x, y, configs){
  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.frameName = frameName;
  this.anchor.setTo(0.5, 0.5);
  game.add.existing(this);
  
  
  this.update = function(){
  
  };
};

Thing.prototype = Object.create(Phaser.Sprite.prototype);
Thing.prototype.constructor = Thing;

module.exports = Thing;