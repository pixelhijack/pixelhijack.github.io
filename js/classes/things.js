var Thing = function(game, thingType, x, y, configs){
  Phaser.Sprite.call(this, game, x, y);
}

Thing.prototype = Object.create(Phaser.Sprite.prototype);
Thing.prototype.constructor = Thing;

module.exports = Thing;