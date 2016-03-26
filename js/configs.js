//var _ = require('lodash');

var configs = {
  creatureDefaults: {
    gravity: 500,
    bounce: 0.2,
    jumping: 300,
    maxSpeed: 200,
    acceleration: 10, 
    lives: 1, 
    lifespan: 10000,
    animations: []
  },
  man: {
    maxSpeed: 200,
    lives: 3, 
    lifespan: Infinity,
    animations: [
      { name: 'moving-left', frames: [0,1,2,3,4,5], fps: 10, loop: false }, 
      { name: 'moving-right', frames: [6,7,8,9,10,11], fps: 10, loop: false }, 
      { name: 'hitting-right', frames: [12,13,14,15,16], fps: 10, loop: false }, 
      { name: 'hitting-left', frames: [18,19,20,21,22], fps: 10, loop: false }, 
      { name: 'stopping-right', frames: [24,25,26,27], fps: 10, loop: false }, 
      { name: 'stopping-left', frames: [30,31,32,33], fps: 10, loop: false }, 
      { name: 'jumping-right', frames: [36,37,38,39], fps: 10, loop: false }, 
      { name: 'jumping-left', frames: [42,43,44,45], fps: 10, loop: false }, 
      { name: 'idle-right', frames: [48,49,50,51], fps: 10, loop: false }, 
      { name: 'idle-left', frames: [54,55,56,57], fps: 10, loop: false }  
    ]
  },
  dino: {
    jumping: 400,
    maxSpeed: 50,
    acceleration: 5, 
    animations: [
      { name: 'moving-right', frames: [0,1,2,3], fps: 10, loop: true },
      { name: 'moving-left', frames: [8,9,10,11], fps: 10, loop: true },
      { name: 'jumping-right', frames: [0,1,2,3,4], fps: 10, loop: true },
      { name: 'jumping-left', frames: [7,8,9,10,11], fps: 10, loop: true }
    ]
  },
  bear: {
    acceleration: 15, 
    animations: [] 
  },
  'super-bear': {
    acceleration: 30,
    maxSpeed: 400,
    image: 'super-bear-sprite-ref', // override sprite (creature name by default)
    animations: []
  },
  ptero: {
    gravity: 0,
    bounce: 0.1,
    jumping: 0,
    maxSpeed: 100,
    acceleration: 50, 
    animations: [
      { name: 'fly', frames: [3,4,5], fps: 10, loop: true }
    ]
  }, 
  gorilla: {
    // grim level bosses with lots of lifes!!
    lives: 10, 
    animations: []
  },
  lollipop: {
    // objects also...? 
    animations: []
  }
};

for(var creature in configs){
  //configs[creature] = _.merge({}, configs.creatureDefaults, configs[creature]);  
  var defaults = configs['creatureDefaults'];
  for(var prop in defaults){
    if(configs[creature][prop] == undefined){
      configs[creature][prop] = defaults[prop];
    }
  }  
}

module.exports = configs;