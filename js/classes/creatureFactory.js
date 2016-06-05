var creature = {
  dino: require('./creatures/Dino.js'),
  bear: require('./creatures/Bear.js'),
  native: require('./creatures/Native.js'),
  turtle: require('./creatures/Turtle.js'),
  insect: require('./creatures/Insect.js'),
  bug: require('./creatures/Bug.js'),
  frog: require('./creatures/Frog.js'),
  tiger: require('./creatures/Tiger.js'),
  spider: require('./creatures/Spider.js'),
  ptero: require('./creatures/Ptero.js'),
  parrot: require('./creatures/Parrot.js'),
  dragonfly: require('./creatures/Dragonfly.js'),
  bat: require('./creatures/Bat.js'),
  jelly: require('./creatures/Jelly.js'),
  man: require('./creatures/Man.js')
};

function creatureFactory(){
  return {
    create: function(game, creatureType, x, y){
      if(!creature[creatureType]){
        console.error('We don\'t have this animal in the zoo: ', creatureType);
        return;
      }
      return new creature[creatureType](game, x, y);
    }
  };
}

module.exports = creatureFactory;