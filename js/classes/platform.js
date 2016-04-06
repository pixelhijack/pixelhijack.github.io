var Platform = function(game, thingType, x, y, configs){
  Phaser.Sprite.call(this, game, x, y);
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

module.exports = Platform;