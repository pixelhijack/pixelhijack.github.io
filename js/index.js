var Menu = require('./gamestates/menu.js');
var Play = require('./gamestates/play.js');

var globalSettings = {
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
    accelerationMultiplier: 3 // for mobile. 5 = speed up for slower device, 1 = same speed as desktop
  }
};

var game = new Phaser.Game(globalSettings.dimensions.WIDTH, globalSettings.dimensions.HEIGHT, Phaser.AUTO, '');
var PRE2 = { 
  Play: Play.bind(this, game, globalSettings)
};
game.state.add('Play', PRE2.Play);
game.state.start('Play', true, true, { levelNumber: globalSettings.level });

