var Play = require('./play.js');

var settings = {
  level: window.location.hash && window.location.hash.split('#')[1] || 1,
  dimensions: {
    WIDTH: 546,
    HEIGHT: 368, //372,
    blocks: 3
  }, 
  physics: {
    gravity: 500,
    slippery: 1.1, 
    bounce: 0.2,
    parallax: 0.05,
    accelerationMultiplier: 3
  }
};

var game = new Phaser.Game(settings.dimensions.WIDTH, settings.dimensions.HEIGHT, Phaser.AUTO, '');
var PRE2 = { 
  Play: Play.bind(this, game, settings)
};
game.state.add('Play', PRE2.Play);
game.state.start('Play');

