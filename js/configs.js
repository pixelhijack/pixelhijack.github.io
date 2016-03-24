var _ = require('lodash');

var configs = {
  creatureDefaults: {
    gravity: 500,
    bounce: 0.2,
    jumping: 300,
    maxSpeed: 200,
    acceleration: 10, 
    lives: 1
  },
  man: {
    maxSpeed: 200,
    lives: 3
  },
  dino: {
    jumping: 400,
    maxSpeed: 300,
    acceleration: 20
  },
  bear: {
    acceleration: 15 
  },
  'super-bear': {
    acceleration: 30,
    maxSpeed: 400,
    image: 'super-bear-sprite-ref' // override sprite (creature name by default)
  },
  ptero: {
    gravity: 0,
    bounce: 0.1,
    jumping: 0,
    maxSpeed: 100,
    acceleration: 50
  }, 
  gorilla: {
    // grim level bosses with lots of lifes!!
    lives: 10
  },
  lollipop: {
    // objects also...?
  }
};

for(var creature in configs){
  configs[creature] = _.merge({}, configs.creatureDefaults, configs[creature]);  
}

module.exports = configs;