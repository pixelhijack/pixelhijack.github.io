var configs = {
  creatureDefaults: {
    gravity: 500,
    bounce: 0.2,
    jumping: 300,
    maxSpeed: 300,
    acceleration: 10, 
    lives: 1
  },
  man: {
    gravity: 500,
    bounce: 0.2,
    jumping: 300,
    maxSpeed: 200,
    acceleration: 10,
    lives: 3
  },
  dino: {
    gravity: 500,
    bounce: 0.2,
    jumping: 400,
    maxSpeed: 300,
    acceleration: 20, 
    lives: 1
  },
  bear: {
    gravity: 500,
    bounce: 0.2,
    jumping: 300,
    maxSpeed: 200,
    acceleration: 10, 
    lives: 1
  },
  ptero: {
    gravity: 0,
    bounce: 0.1,
    jumping: 0,
    maxSpeed: 100,
    acceleration: 50, 
    lives: 1
  }, 
  gorilla: {
    // grim level bosses with lots of lifes!!
  },
  lollipop: {
    // objects also...?
  }
};

module.exports = configs;