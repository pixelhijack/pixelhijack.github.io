/* 
  http://upkk670a72a1.pixelhijack.koding.io//index.html
*/

var Play = require('./play.js');

var configs = {
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
    accelerationMultiplier: 5
  }, 
  enemies: {
    dino: 3,
    ptero: 1
  }
};

var game = new Phaser.Game(configs.dimensions.WIDTH, configs.dimensions.HEIGHT, Phaser.AUTO, '');
var PRE2 = { 
  Play: Play.bind(this, game, configs)
};
game.state.add('Play', PRE2.Play);
game.state.start('Play');

