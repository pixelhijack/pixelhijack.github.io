var Creature = require('./creature.js');
var levelManager = require('./levelManager.js');
var enemyManager = require('./enemyManager.js');
var levelList = require('./levelList.js');


// Play game state
function Play(game, settings){
  /*
    import {SETTINGS}:
      inputs
        keys
        pointers
    internal {GAME}
      game menu
        lives
        hearts
        score
        bonus
    export {MODELS}: 
      man
      enemies
  */ 
  
  var man;
  
  var keys; 
  
  var weapon = {
    sprite: null,
    animRight: null,
    animLeft: null
  };
  var lives = {
    up: null,
    hearts: []
  };
  var menu = {
    lives: null,
    hearts: null,
    score: null,
    bonus: null
  }
  var levels = levelManager(game, levelList);
  var level;
  
  var enemies;
  
  var events = { };

  // public methods for Phaser
  this.preload = preload;
  this.create = create;
  this.update = update;
  
  /*=============
  *   PRELOAD
  =============*/
  function preload(){
  
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    game.load.spritesheet('lives', './assets/lives.png', 38, 24);
    game.load.spritesheet('dino', './assets/dino.png', 42, 36);
    game.load.spritesheet('ptero', './assets/pterodactylus.png', 62, 50);
    game.load.spritesheet('man', './assets/man.png', 32, 36);
    game.load.spritesheet('club', './assets/clubs-96x72.png', 96, 36);
    
    game.load.image('background-1', './assets/bg1seamless.png');
    game.load.image('background-2', './assets/bg3seamless.jpg');
    
    game.load.image('tileset-level-1', './assets/level-1-transparent.png');
    game.load.image('tileset-level-2', './assets/tilesets/tileset2.png');
    game.load.image('tileset-level-3', './assets/tilesets/tileset1_2.png');
    
    game.load.tilemap('tilemap-level-1', './levels/78x23.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('tilemap-level-2', './levels/49x100-old.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('tilemap-level-3', './levels/49x100.json', null, Phaser.Tilemap.TILED_JSON);
  
    console.log("PHASER preloaded");
  }
  
  function initWorld(){
    game.world.setBounds(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }
  
  function loadLevel(){
    level = levels(settings.level);
  }
  
  function loadEnemies(){
    enemies = enemyManager(game, level.enemies);
    enemies.initLevelEnemies();
    enemies.of.dino.forEachAlive(function(dino){ 
      dino.moveRight();
    });
  }
  
  function addHero(){
    man = new Creature(game, 'man', 200, 50);
    
    weapon.sprite = game.add.sprite(man.body.x, man.body.y, 'club');
    weapon.sprite.anchor.setTo(0.5, 0.5);
    weapon.sprite.visible = false;
    weapon.animRight = weapon.sprite.animations.add('club-hit-right', [0,1,2,3,4], 10, false);
    weapon.animLeft = weapon.sprite.animations.add('club-hit-left', [9,8,7,6,5], 10, false);
    weapon.animRight.onComplete.add(toggleVivibility, this);
    weapon.animLeft.onComplete.add(toggleVivibility, this);
    
    game.camera.follow(man);
    game.add.existing(man);
  }
  
  function renderMenu(){
    // UPs
    menu.lives = game.add.sprite(20, 20, 'lives');
    menu.lives.fixedToCamera = true;
    menu.lives.frame = 0;
    // hearts
    var hearts = man.lives();
    menu.hearts = game.add.group();
    for(var i=0;i<hearts;i++){
      var heart = game.add.sprite(60 + i*20, 20, 'lives');
      heart.fixedToCamera = true;
      heart.frame = 1;
      menu.hearts.add(heart);
    }
  }
  
  function setInputs(){
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
  }
  
  function onEvery(tickerInterval, callback){
    // 'callback' called on every 'tickerInterval' seconds
    var ticker = game.time.events.loop(Phaser.Timer.SECOND * tickerInterval, callback, this);
    ticker.timer.start();
  }
  
  /*=============
  *   CREATE
  =============*/
  // disclaimer: worst shameful imperative style antipattern, should be replaced with reducers, mediators, events etc:
  function create(){
    // for fps debugging:
    game.time.advancedTiming = true;
    
    initWorld();
    loadLevel();
    loadEnemies();
    addHero();
    renderMenu();
    setInputs();
    
    events.somethingHappened = new Phaser.Signal();
    events.somethingHappened.add(onSomethingHappened, this);
    
    onEvery(10, function(){
      //game.debug.text('Elapsed: ' + Math.floor(game.time.totalElapsedSeconds()), 32, 64);
      enemies.revive('dino', Math.random() * settings.dimensions.WIDTH, Math.random() * settings.dimensions.HEIGHT);
      enemies.revive('dino', Math.random() * settings.dimensions.WIDTH, Math.random() * settings.dimensions.HEIGHT);
    });
    
    console.log("PHASER created");
  }
  
  function onSomethingHappened(evt, whereItHappn){
    console.log('something just happened in Pre2 World!', whereItHappn);
  }
  
  function setParallax(){
    level.backgroundLayer.x = -(game.camera.x * settings.physics.parallax);
  }
  
  function collisions(){
    game.physics.arcade.collide(man, level.collisionLayer);
    game.physics.arcade.collide(enemies.of.dino, level.collisionLayer);
    //collisionLayer.debug = true;
    game.physics.arcade.collide(man, enemies.of.dino, onEnemyCollision, onProcess, this);
    game.physics.arcade.collide(man, enemies.of.ptero, onEnemyCollision, onProcess, this);
    
    // hit'n kill enemy: collision should calculated on weapon sprite
    game.physics.arcade.collide(weapon.sprite, enemies.of.dino, function(weaponSprite, enemy){
      if(man.state === 'hitting'){
        enemy.kill();
      }
    }, null, this);
  }
  
  function moveDinos(){
    enemies.of.dino.forEachAlive(function(dino){
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
  }
  
  function movePteros(){
    enemies.of.ptero.forEachAlive(function(ptero){
      ptero.x -= 1;
      ptero.animations.play('fly');
      ptero.x = ptero.x <= ptero.width/2 ? game.world.width - 5 : ptero.x;
    });
  }
  
  function moveHero(){
    // weapon sprite should be always in sync with the man sprite
    weapon.sprite.x = man.x;
    weapon.sprite.y = man.y;
    
    if(!keys.left.isDown && 
      !keys.right.isDown && 
      !keys.up.isDown && 
      !keys.down.isDown && 
      !keys.space.isDown &&
      man.isGrounded()){
        man.state = 'idle';
    }
    if(keys.left.isDown) {
      man.moveLeft();
      man.state = man.isGrounded() ? 'moving' : 'jumping';
    }
    else if(keys.right.isDown) {
      man.moveRight();
      man.state = man.isGrounded() ? 'moving' : 'jumping';
    }
    else{
      // slowing down / slippery rate: 10% after stopped moving
      man.stop(settings.physics.slippery);
      //man.animations.play('man-stop-left');
    }
    if(keys.up.isDown || game.input.pointer1.isDown) {
        man.jump();
        if(!man.isGrounded()){
          man.state = 'jumping';
        }
    }
    else if(keys.down.isDown) {
        // man.duck();
        events.somethingHappened.dispatch(this, man.x);
    }
    if(keys.space.isDown) {
      man.state = 'hitting';
      man.stop(settings.physics.slippery);
      weapon.sprite.visible = true;
      weapon.sprite.animations.play('club-hit-' + man.direction());
    }
  }
  
  function debug(){
    game.debug.text('LIVES: ' + man.lives(), 32, 96);
    game.debug.pointer(game.input.pointer1);
    game.debug.body(weapon.sprite);
    game.physics.enable(weapon.sprite, Phaser.Physics.ARCADE);
  }
  
  /*=============
  *   UPDATE
  =============*/
  // disclaimer: worst shameful imperative style antipattern, should be replaced with reducers, mediators, events etc:
  function update(){
    // show FPS on bottom left corner
    game.debug.text(game.time.fps, 5, game.height - 5);
    
    // debug sprites
    enemies.of.dino.forEachAlive(function(dino){
      dino.debug(dino.lifespan / 1000 | 0);
    });
    enemies.of.ptero.forEachAlive(function(ptero){
      ptero.debug(ptero.lifespan / 1000 | 0);
    });
    
    setParallax();
    collisions();
    moveDinos();
    movePteros();
    moveHero();
    //enemies.forEachAlive(Creature.checkIfShouldDie);
    //debug();
    man.animations.play(man.state + '-' + man.direction());

    console.log("PHASER updated");
  }
  
  function onEnemyCollision(hero, enemy){
    if(man.body.touching.down && enemy.body.touching.up){
      if(man.state === 'hitting'){
        enemy.kill();
      }
      return;
    }
    if(man.state === 'hitting'){
      enemy.kill();
    }else{
      man.damage(1);
      renderMenu();
      if(man.lives() <= 0){
        man.kill();
        // restart while keep caches: 
        game.state.start('Play', true, false);
      }  
    }
  }
  
  function onProcess(){
    
  }
  
  function toggleVivibility(sprite){
    sprite.visible = !sprite.visible;
  }
}

module.exports = Play;

