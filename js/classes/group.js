var Creature = require('./creature.js');

var Group = function(game, props){
  Phaser.Group.call(this, game);
  this.props = props || {};
};

Group.prototype = Object.create(Phaser.Group.prototype);
Group.prototype.constructor = Group;

module.exports = Group;