/* 
  http://upkk670a72a1.pixelhijack.koding.io//index.html
*/

var Creature = require('./creature.js');

var man;
var dinos;
var ptero;
var keys; 
var platforms;
var weapon;
var lives = {
  up: null,
  hearts: []
};
var tilemap;
var groundLayer, 
  collisionLayer, 
  objectsLayer;

var settings = {
  dimensions: {
    WIDTH: 546,
    HEIGHT: 368, //372,
    blocks: 3
  }, 
  physics: {
    gravity: 500,
    slippery: 1.1, 
    bounce: 0.2,
    parallax: 0.05,
    accelerationMultiplier: 5
  }, 
  enemies: {
    dino: 3,
    ptero: 1
  }
};

// game states wrapper
var PRE2 = function(){};
// Play game state
PRE2.Play = function(){};

PRE2.Play.prototype = { 
  /*=============
  *   PRELOAD
  =============*/
  preload: function(){
  
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    console.log("PHASER preloaded");
    
    game.load.image('stand', './assets/man-standing.png');
    game.load.spritesheet('lives', './assets/lives.png', 38, 24);
    game.load.spritesheet('dino', './assets/dino.png', 42, 36);
    game.load.spritesheet('pterodactylus', './assets/pterodactylus.png', 62, 50);
    game.load.spritesheet('man', './assets/man.png', 32, 36);
    game.load.spritesheet('club', './assets/clubs-96x72.png', 96, 36);
    game.load.image('platform-1', './assets/99.png');
    game.load.image('platform-2', './assets/platform-2.png');
    game.load.image('background', './assets/bg1seamless.png');
    
    game.load.image('tiles', './assets/level-1-transparent.png');
    game.load.tilemap('tilemap', './js/78x23.json', null, Phaser.Tilemap.TILED_JSON);
  }, 
  initWorld: function(){
    game.world.setBounds(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  loadLevel: function(){
    game.farBackground = game.add.tileSprite(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT, 'background');
    tilemap = game.add.tilemap('tilemap');
    tilemap.addTilesetImage('tileset1', 'tiles');
    groundLayer = tilemap.createLayer('foreground-layer');
    collisionLayer = tilemap.createLayer('collision-layer');
    collisionLayer.visible = false;
    tilemap.setCollisionBetween(1, 200, true, 'collision-layer');
    groundLayer.resizeWorld();
  },
  addHero: function(){
    man = new Creature('man', game, {
      image: 'man',
      x: 200, 
      y: 50, 
      gravity: settings.physics.gravity,
      bounce: settings.physics.bounce,
      props: {
        jumping: 300,
        maxSpeed: 200,
        acceleration: 10,
        lives: 3
      }
    });
    
    man.animations.add('moving-left', [0,1,2,3,4,5], 10, false);
    man.animations.add('moving-right', [6,7,8,9,10,11], 10, false);
    man.animations.add('hitting-right', [12,13,14,15,16], 10, false);
    man.animations.add('hitting-left', [18,19,20,21,22], 10, false);
    man.animations.add('stopping-right', [24,25,26,27], 10, false);
    man.animations.add('stopping-left', [30,31,32,33], 10, false);
    man.animations.add('jumping-right', [36,37,38,39], 10, false);
    man.animations.add('jumping-left', [42,43,44,45], 10, false);
    man.animations.add('idle-left', [48,49,50,51], 10, false);
    man.animations.add('idle-left', [54,55,56,57], 10, false);
    
    weapon = game.add.sprite(man.body.x, man.body.y, 'club');
    weapon.animations.add('club-hit-right', [0,1,2,3,4], 10, false);
    weapon.animations.add('club-hit-left', [9,8,7,6,5], 10, false);
    weapon.anchor.setTo(0.5, 0.5);
    
    lives.up = game.add.sprite(20, 20, 'lives');
    lives.up.frame = 0;
    
    var heartSprites = man.lives();
    while(heartSprites--){
      var heart = game.add.sprite(60 + heartSprites*20, 20, 'lives');
      heart.frame = 1;  
      lives.hearts.push(heart);
    }
    
    game.camera.follow(man);
    game.add.existing(man);
    
  },
  addDinos: function(){
    dinos = game.add.group();
    for(var i = 0, max = settings.enemies.dino;i<max;i++){
      var dino = new Creature('dino', game, {
        image: 'dino',
        x: Math.random() * settings.dimensions.WIDTH, 
        y: settings.dimensions.HEIGHT / 2, 
        gravity: settings.physics.gravity,
        bounce: settings.physics.bounce,
        props: {
          jumping: 400,
          maxSpeed: 300,
          acceleration: 20
        }
      }); 
      dino.animations.add('moving-right', [0,1,2,3], 10, true);
      dino.animations.add('moving-left', [8,9,10,11], 10, true);
      dino.animations.add('jumping-right', [0,1,2,3,4], 10, true);
      dino.animations.add('jumping-left', [7,8,9,10,11], 10, true);
      dino.moveRight();
      dinos.add(dino);
    }
  },
  addPtero: function(){
    ptero = new Creature('ptero', game, {
      image: 'pterodactylus',
      x: 0, 
      y: 100, 
      gravity: 0,
      bounce: 0
    });
    
    ptero.animations.add('fly', [3,4,5], 10, true);
    
    game.add.existing(ptero);
  
  },
  setInputs: function(){
    keys = game.input.keyboard.createCursorKeys();
    keys.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    game.input.addPointer();
  
    window.addEventListener("deviceorientation", function orientation(event){
      var tilt = window.innerHeight > window.innerWidth ? event.gamma : event.beta;
      man.state = 'moving';
      tilt >= 0 ? 
        man.moveRight(tilt * settings.physics.accelerationMultiplier) :
        man.moveLeft(-tilt * settings.physics.accelerationMultiplier);
    }, false);
  },
  /*=============
  *   CREATE
  =============*/
  create: function(){
    this.initWorld();
    this.loadLevel();
    this.addHero();
    this.addDinos();
    this.addPtero();
    this.setInputs();
    
    console.log("PHASER created");
  }, 
  setParallax: function(){
    game.farBackground.x = -(this.camera.x * settings.physics.parallax);
  },
  collisions: function(){
    game.physics.arcade.collide(man, collisionLayer);
    game.physics.arcade.collide(dinos, collisionLayer);
    //collisionLayer.debug = true;
    game.physics.arcade.collide(man, dinos, this.onEnemyCollision, this.onProcess, this);
    game.physics.arcade.collide(man, ptero, this.onEnemyCollision, this.onProcess, this);
  },
  moveDinos: function(){
    dinos.forEachAlive(function(dino){
      dino.move();
      dino.x <= 0 ? dino.x = game.world.width : dino.x;
      if(Math.random() < 0.05){ 
        dino.jump(); 
        dino.animations.play('jumping-' + dino.direction());
      }
      if(dino.body.blocked.left){ 
        dino.moveRight(); 
        dino.animations.play('moving-right');
      }
      if(dino.body.blocked.right){ 
        dino.moveLeft(); 
        dino.animations.play('moving-left');
      }
    });
  },
  movePtero: function(){
    ptero.x -= 1;
    ptero.animations.play('fly');
    ptero.x <= 0 ? ptero.x = game.world.width : ptero.x;
  },
  moveHero: function(){
    if(!keys.left.isDown && 
      !keys.right.isDown && 
      !keys.up.isDown && 
      !keys.down.isDown && 
      !keys.space.isDown ){
        man.state = 'idle';
    }
    if(keys.left.isDown) {
      man.moveLeft();
      man.state = 'moving';
    }
    else if(keys.right.isDown) {
      man.moveRight();
      man.state = 'moving';
    }
    else{
      // slowing down / slippery rate: 10% after stopped moving
      man.stop(settings.physics.slippery);
      //man.animations.play('man-stop-left');
    }
    if(keys.up.isDown || game.input.pointer1.isDown) {
        man.jump();
        if(!man.body.touching.down || !man.body.blocked.down){
          man.state = 'jumping';
        }
    }
    else if(keys.down.isDown) {
        // man.duck();
    }
    if(keys.space.isDown) {
      man.state = 'hitting';
      weapon.visible = true;
      weapon.x = man.x;
      weapon.y = man.y;
      weapon.animations.play('club-hit-' + man.direction());
    }else{
      weapon.visible = false;
    }
  },
  /*=============
  *   UPDATE
  =============*/
  update: function(){
    this.setParallax();
    this.collisions();
    this.moveDinos();
    this.movePtero();
    this.moveHero();
    man.animations.play(man.state + '-' + man.direction());
    
    
    game.debug.text('LIVES: ' + man.lives(), 32, 96);
    
    game.debug.pointer(game.input.pointer1);
  game.debug.body(weapon)
    console.log("PHASER updated");
  },
  onEnemyCollision: function(hero, enemy){
    if(man.body.touching.down && enemy.body.touching.up){
      return;
    }
    if(man.state === 'hitting'){
      enemy.kill();
    }else{
      man.damage(1);
      lives.hearts = lives.hearts.map(function(heart, i){
        heart.visible = i <= man.lives()-1 ? true : false;
        return heart;
      });
      if(man.lives() <= 0){
        man.kill();
        // restart while keep caches: 
        game.state.start('Play', true, false);
      }  
    }
  },
  onProcess: function(){
    
  }
};


var game = new Phaser.Game(settings.dimensions.WIDTH, settings.dimensions.HEIGHT, Phaser.AUTO, '');
game.state.add('Play', PRE2.Play);
game.state.start('Play');
