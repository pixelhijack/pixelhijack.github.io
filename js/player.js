function Player(game, config){
  var player;

  player = game.add.sprite(config.x, config.y, config.image);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.gravity.y = config.gravity;
  return player;
}

Player.prototype = {
  preload: function(){
    
  },
  create: function(){

  },
  update: function(keys){
  
  }
}
  