var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Man(game, x, y){
  Creature.call(this, game, 'man', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Man.prototype = Object.create(Creature.prototype);
Man.prototype.constructor = Man;

Man.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'die'){
    return;
  }
};

module.exports = Man;
  