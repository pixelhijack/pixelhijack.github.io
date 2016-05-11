var creature = {
  dino: require('./Dino.js'),
  bear: require('./Bear.js'),
  native: require('./Native.js'),
  turtle: require('./Turtle.js'),
  insect: require('./Insect.js'),
  bug: require('./Bug.js'),
  frog: require('./Frog.js'),
  tiger: require('./Tiger.js'),
  spider: require('./Spider.js'),
  ptero: require('./Ptero.js'),
  parrot: require('./Parrot.js'),
  dragonfly: require('./Dragonfly.js'),
  bat: require('./Bat.js'),
  man: require('./Man.js')
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