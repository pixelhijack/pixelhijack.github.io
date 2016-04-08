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
    lifespan: Infinity,
    animations: [], 
    boundTo : {
      x1: 1000,
      x2: 1200
    },
    correctedAnchor: {
      x: 0.5,
      y: 0.5
    }
  },
  man: {
    maxSpeed: 200,
    lives: 8, 
    lifespan: Infinity,
    animations: [
      { name: 'moving', frames: [11,'03','05',14,20], fps: 10, loop: false }, 
      { name: 'hitting', frames: [22,24,28,31,34], fps: 10, loop: false }, 
      { name: 'stopping', frames: [42,45,49,52], fps: 10, loop: false }, 
      { name: 'jumping', frames: [16,41,47,50,50,50,50,50,50,50,50,13,50,13,50,13], fps: 10, loop: false }, 
      { name: 'idle', frames: [25,25,25,25,25,25,25,25,27,27,27,27,25,25,25,25,25,25,25,25,30,25,25,25,25,25,25,25,25,27,30,27,30,35,36,25,25,25,25,25,25,25,25,'07','07','07','07','02','02'], fps: 10, loop: true }, 
      { name: 'hurt', frames: [19], fps: 10, loop: true },
      { name: 'dead', frames: [19], fps: 10, loop: false }
    ],
    correctedAnchor: {
      x: 0.5,
      y: 0.8
    }
  },
  dino: {
    mass: 1.5,
    jumping: 300,
    maxSpeed: 50,
    acceleration: 5, 
    animations: [
      { name: 'moving', frames: [360,361,364,367], fps: 10, loop: true },
      { name: 'jumping', frames: [360,361,364,367,369], fps: 10, loop: true },
      { name: 'dead', frames: [371], fps: 10, loop: true }
    ]
  },
  bear: {
    mass: 1.2,
    maxSpeed: 75,
    acceleration: 15, 
    animations: [
      { name: 'moving', frames: [320,321,324], fps: 10, loop: true },
      { name: 'spawn', frames: [366,363,358,317], fps: 10, loop: false },
      { name: 'dead', frames: [328], fps: 10, loop: true }
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
    maxSpeed: 50,
    acceleration: 50, 
    animations: [
      { name: 'moving', frames: [403,404,405,403,404,405,405,405,405,405,405,403,404,405,403,404,405,405,405,405,405,405,405], fps: 12, loop: true },
      { name: 'descend', frames: [405], fps: 12, loop: true },
      { name: 'ascend', frames: [403,404,405], fps: 20, loop: true },
      { name: 'dead', frames: [471], fps: 10, loop: true },
    ]
  }, 
  dragonfly: {
    mass: 0.5,
    gravity: 0,
    bounce: 0.1,
    jumping: 0,
    collide: false,
    maxSpeed: 50,
    acceleration: 10, 
    animations: [
      { name: 'moving', frames: [337,338], fps: 12, loop: true },
      { name: 'turn', frames: [339,340], fps: 12, loop: true },
      { name: 'dead', frames: [342], fps: 12, loop: true }
    ]
  },
  spider: {
    mass: 0.3,
    jumping: 0,
    collide: true,
    bounce: 0.3,
    maxSpeed: 50,
    acceleration: 10,
    animations: [
      { name: 'spawn', frames: [365,368,370,372], fps: 10, loop: false },
      { name: 'moving', frames: [299,302,305,309], fps: 10, loop: true },
      { name: 'climbing', frames: [319], fps: 10, loop: true },
      { name: 'waiting', frames: [332,335,372], fps: 10, loop: true },
      { name: 'dead', frames: [322], fps: 10, loop: false }
    ]
  },
  native: {
    maxSpeed: 100,
    acceleration: 20,
    animations: [
      { name: 'moving', frames: [373,376,378], fps: 10, loop: true },
      { name: 'dead', frames: [380], fps: 10, loop: false }
    ]
  },
  parrot: {
    mass: 0.5,
    gravity: 0,
    bounce: 0.1,
    jumping: 0,
    collide: false,
    maxSpeed: 100,
    acceleration: 10,
    animations: [
      { name: 'moving', frames: [394,397,398], fps: 10, loop: true },
      { name: 'dead', frames: [400], fps: 10, loop: false }
    ]
  },
  frog: {
    mass: 1,
    collide: true,
    bounce: 1.5,
    jumping: 500,
    maxSpeed: 80,
    acceleration: 40, 
    animations: [
      { name: 'moving', frames: [325,327,331,325], fps: 10, loop: false },
      { name: 'jumping', frames: [325,327,331,325], fps: 10, loop: false },
      { name: 'dead', frames: [334], fps: 10, loop: true }
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