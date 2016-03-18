var Zone = function(zoneType, game, config){
  Phaser.Sprite.call(this, game, config.x, config.y, config.image);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.width = config.width;
  this.height = config.height;
  this.visible = false;
};

Zone.prototype = Object.create(Phaser.Sprite.prototype);

Zone.prototype.constructor = Zone;

module.exports = Zone;
  