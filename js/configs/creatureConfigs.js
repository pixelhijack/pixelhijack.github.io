//var _ = require('lodash');

var creatureConfigs = {
  creatureDefaults: {
    gravity: 500,
    bounce: 0.2,
    mass: 1,
    jumping: 300,
    maxSpeed: 100,
    acceleration: 10,
    collide: true,
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
      { name: 'stopping-left', frames: [30,31,32,33,33,33,33,33,33,33,33,33,33,33], fps: 10, loop: false }, 
      { name: 'jumping-right', frames: [36,37,38,39,39,39,39,39,39,39,39,39,39,39], fps: 10, loop: false }, 
      { name: 'jumping-left', frames: [42,43,44,45], fps: 10, loop: false }, 
      { name: 'idle-right', frames: [48,49,50,51], fps: 10, loop: false }, 
      { name: 'idle-left', frames: [54,55,56,57], fps: 10, loop: false },
      { name: 'hurt-right', frames: [61], fps: 10, loop: true },
      { name: 'hurt-left', frames: [60], fps: 10, loop: true },
      { name: 'dead-right', frames: [61], fps: 10, loop: false },
      { name: 'dead-left', frames: [60], fps: 10, loop: false }
    ]
  },
  dino: {
    mass: 1.5,
    jumping: 300,
    maxSpeed: 50,
    acceleration: 5, 
    animations: [
      { name: 'moving-right', frames: [0,1,2,3], fps: 10, loop: true },
      { name: 'moving-left', frames: [8,9,10,11], fps: 10, loop: true },
      { name: 'jumping-right', frames: [0,1,2,3,4], fps: 10, loop: true },
      { name: 'jumping-left', frames: [7,8,9,10,11], fps: 10, loop: true },
      { name: 'dead-right', frames: [5], fps: 10, loop: true },
      { name: 'dead-left', frames: [6], fps: 10, loop: true }
    ]
  },
  bear: {
    mass: 1.2,
    acceleration: 15, 
    animations: [
      { name: 'moving-right', frames: [4,5,6], fps: 10, loop: true },
      { name: 'moving-left', frames: [11,10,9], fps: 10, loop: true },
      { name: 'spawn-right', frames: [0,1,2,3], fps: 10, loop: false },
      { name: 'spawn-left', frames: [15,14,13,12], fps: 10, loop: false },
      { name: 'dead-right', frames: [7], fps: 10, loop: true },
      { name: 'dead-left', frames: [8], fps: 10, loop: true }
    ] 
  },
  'super-bear': {
    acceleration: 30,
    maxSpeed: 200,
    image: 'super-bear-sprite-ref', // override sprite (creature name by default)
    animations: []
  },
  ptero: {
    mass: 0.5,
    gravity: 0,
    bounce: 0.1,
    jumping: 0,
    collide: false,
    maxSpeed: 100,
    acceleration: 50, 
    animations: [
      { name: 'fly-left', frames: [3,3,3,3,3,4,5,3,4,5,3,3,3,3,3,4,5,3,4,5], fps: 12, loop: true },
      { name: 'fly-right', frames: [0,1,2,0,1,2,2,2,2,2,2,0,1,2,0,1,2,2,2,2,2,2,2], fps: 12, loop: true },
      { name: 'descend-left', frames: [3], fps: 12, loop: true },
      { name: 'descend-right', frames: [2], fps: 12, loop: true },
      { name: 'ascend-left', frames: [3,4,5], fps: 20, loop: true },
      { name: 'ascend-right', frames: [0,1,2], fps: 20, loop: true }
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

for(var creature in creatureConfigs){
  //creatureConfigs[creature] = _.merge({}, configs.creatureDefaults, configs[creature]);  
  var defaults = creatureConfigs['creatureDefaults'];
  for(var prop in defaults){
    if(creatureConfigs[creature][prop] === undefined){
      creatureConfigs[creature][prop] = defaults[prop];
    }
  }  
}

module.exports = creatureConfigs;