/* 
  http://upkk670a72a1.pixelhijack.koding.io//index.html
*/

var Creature = require('./creature.js');

var man;
var dino;
var ptero;
var keys;
var platforms;
var lives = {
  up: null,
  hearts: []
};

var settings = {
  dimensions: {
    WIDTH: 546,
    HEIGHT: 372,
    blocks: 5
  }, 
  physics: {
    gravity: 500,
    jumping: 300,
    maxSpeed: 200,
    acceleration: 10,
    slippery: 1.1, 
    bounce: 0.2
  }
};

var game = new Phaser.Game(settings.dimensions.WIDTH, settings.dimensions.HEIGHT, Phaser.AUTO, '', { 
  preload: preload, 
  create: create, 
  update: update 
});

function preload(){
  
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  
  game.stage.backgroundColor = '#eee';
  
  console.log("PHASER preloaded");
  
  game.load.image('stand', './assets/man-standing.png');
  game.load.spritesheet('lives', './assets/lives.png', 38, 24);
  game.load.spritesheet('dino', './assets/dino.png', 42, 36);
  game.load.spritesheet('pterodactylus', './assets/pterodactylus.png', 62, 50);
  game.load.spritesheet('run', './assets/run.png', 42, 36);
  game.load.image('platform-1', './assets/99.png');
  game.load.image('platform-2', './assets/platform-2.png');
  game.load.image('background', './assets/bg1seamless.png');
  game.load.spritesheet('wall', './assets/tileset1.png', 16, 16, 3);
  game.load.spritesheet('void', './assets/tileset1.png', 16, 16, 1);
}

function create(){
  game.farBackground = game.add.tileSprite(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT, 'background');
  game.world.setBounds(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT);
  
  game.physics.startSystem(Phaser.Physics.ARCADE);
  
  //game.farBackground = game.add.tileSprite(0, 0, settings.dimensions.WIDTH, settings.dimensions.HEIGHT, 'background');
  game.farBackground.x = -(this.camera.x * 0.7);
  
  man = new Creature('man', game, {
    image: 'run',
    x: 200, 
    y: 50, 
    gravity: settings.physics.gravity,
    bounce: settings.physics.bounce,
    props: {
      jumping: 300,
      maxSpeed: 200,
      acceleration: 10,
      lives: 3
    },
    animate: {
      right: 'man-right',
      left: 'man-left'
    }
  });
  
  man.animations.add('man-left', [0,1,2,3,4,5], 10, false);
  man.animations.add('man-right', [6,7,8,9,10,11], 10, false);
  
  lives.up = game.add.sprite(20, 20, 'lives');
  lives.up.frame = 0;
  
  var heartSprites = man.lives();
  while(heartSprites--){
    var heart = game.add.sprite(60 + heartSprites*20, 20, 'lives');
    heart.frame = 1;  
    lives.hearts.push(heart);
  }
  
  game.camera.follow(man);
  
  dino = new Creature('dino', game, {
    image: 'dino',
    x: 300, 
    y: 300, 
    gravity: settings.physics.gravity,
    bounce: settings.physics.bounce,
    props: {
      jumping: 400,
      maxSpeed: 300,
      acceleration: 20
    },
    animate: {
      right: 'dino-right',
      left: 'dino-left'
    }
  });
  
  dino.animations.add('dino-right', [0,1,2,3], 10, false);
  dino.animations.add('dino-left', [8,9,10,11], 10, false);
  
  ptero = new Creature('ptero', game, {
    image: 'pterodactylus',
    x: 0, 
    y: 100, 
    gravity: 0,
    bounce: 0,
    animate: {
      right: 'fly',
      left: 'fly'
    }
  });
  
  ptero.animations.add('fly', [3,4,5], 10, true);

  game.add.existing(dino);
  game.add.existing(man);
  game.add.existing(ptero);

  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  
  for(var i = 0; i < 50; i++){
    var platform = platforms.create(Math.random() * settings.dimensions.WIDTH * settings.dimensions.blocks  | 0, 
      Math.random() * settings.dimensions.HEIGHT | 0, 
      'platform-1', './assets/99.png');
    var platform2 = platforms.create(Math.random() * settings.dimensions.WIDTH * settings.dimensions.blocks | 0, 
      Math.random() * settings.dimensions.HEIGHT | 0, 
      'platform-2', './assets/platform-2.png');
    platform.body.bounce.set(0);
    platform.body.immovable = true;
    platform2.body.bounce.set(0);
    platform2.body.immovable = true;
  }
  
  keys = game.input.keyboard.createCursorKeys();

  console.log("PHASER created");
}

function update(){
  
  game.physics.arcade.collide(man, platforms);
  //game.physics.arcade.collide(man, dino);
  game.physics.arcade.collide(dino, platforms);
  
  game.physics.arcade.collide(man, dino, collisionCallback, processCallback, this);
  
  ptero.x -= 1;
  ptero.animations.play('fly');
  ptero.x <= 0 ? ptero.x = game.world.width : ptero.x;
  
  dino.move();
  dino.x <= 0 ? dino.x = game.world.width : dino.x;
  if(Math.random() < 0.05){ dino.jump(); }
  if(dino.body.blocked.left){ dino.runRight(); }
  if(dino.body.blocked.right){ dino.runLeft(); }
  
  if(keys.left.isDown) {
    man.runLeft();
  }
  else if(keys.right.isDown) {
    man.runRight();
    /*
    if(man.body.velocity.x < settings.physics.maxSpeed){
        man.body.velocity.x += settings.physics.acceleration;
      }
    */  
    //man.animations.play('right');
  }
  else{
    // slowing down / slippery rate: 10% after stopped moving
    man.body.velocity.x /= settings.physics.slippery;
  }
  if(keys.up.isDown) {
      man.jump();
  }
  else if(keys.down.isDown) {
      man.body.velocity.y += 1;
  }
  
  game.debug.text('LIVES: ' + man.lives(), 32, 96);

  console.log("PHASER updated");
}

function processCallback(){
  
}
function collisionCallback(){
  man.damage(1);
  console.log('DIE!', man.lives());
  game.debug.text('You died!!4!: ' + man.lives(), 32, 96);
  lives.hearts = lives.hearts.map(function(heart, i){
    heart.visible = i <= man.lives()-1 ? true : false;
    return heart;
  });
}
