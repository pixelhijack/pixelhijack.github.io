var Creature = require('./creature.js');

var Group = function(game, props, autopopulate){
  Phaser.Group.call(this, game);
  this.props = props || {};
  if(autopopulate){
    this.populate();
  }
};

Group.prototype = Object.create(Phaser.Group.prototype);
Group.prototype.constructor = Group;

Group.prototype.populate = function populate(){
  for(var i = 1, max = this.props.number; i <= max; i++){
    var creature = new Creature(this.game, this.props.type, this.props.origin.x, this.props.origin.y);
    creature.props.boundTo = this.props.boundTo;
    this.add(creature);
  }  
};

module.exports = Group;