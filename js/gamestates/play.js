var Creature = require('../classes/creature.js');
var levelManager = require('../services/levelManager.js');
var enemyManager = require('../services/enemyManager.js');
var menuManager = require('../services/menuManager.js');
var levelConfigs = require('../configs/levelConfigs.js');
var util = require('../services/util.js');


// Play game state
function Play(game, settings){

  var man;
  
  var keys; 
  
  var weapon = {
    sprite: null,
    animRight: null,
    animLeft: null
  };
  var menu;
  var levels = levelManager(game, levelConfigs);
  var level;
  
  var enemies;
  
  var utils = util(game);
  
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
    game.load.spritesheet('bear', './assets/bears.png', 44, 44);
    game.load.spritesheet('dragonfly', './assets/dragonflies.png', 36, 22);
    game.load.spritesheet('spider', './assets/spiders.png', 32, 26);
    game.load.spritesheet('native', './assets/natives.png', 28, 32);
    game.load.spritesheet('man', './assets/man.png', 32, 36);
    game.load.spritesheet('club', './assets/clubs-96x72.png', 96, 36);
    
    game.load.image('background-1', './assets/bg1seamless.png');
    game.load.image('background-2', './assets/bg3seamless.jpg');
    
    game.load.image('tileset-level-1', './assets/level-1-transparent.png');
    game.load.image('tileset-level-2', './assets/tilesets/tileset2.png');
    game.load.image('tileset-level-3', './assets/tilesets/tileset1_2.png');
    game.load.image('tileset-level-4', './assets/tilesets/L2_bank.png');
    
    game.load.tilemap('tilemap-level-1', './levels/78x23.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('tilemap-level-2', './levels/49x100-old.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('tilemap-level-3', './levels/49x100.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('tilemap-level-4', './levels/L2v1.json', null, Phaser.Tilemap.TILED_JSON);
  
    console.info('[play] PHASER preloaded');
  }
  
  function initWorld(){
    game.world.setBounds(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }
  
  function loadLevel(){
    level = levels(settings.level);
  }
  
  function loadEnemies(){
    enemies = enemyManager(game, level.enemies, level.objects.zone);
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
    
    // subscribe enemies on man's actions:
    enemies.forEachAlive(function(creature){
      creature.listen(man, creature.onEnemyMovements);
    });
    
    game.camera.follow(man);
    game.add.existing(man);
  }
  
  function renderMenu(){
    menu = menuManager(game, man);
    // subscribe menu modul on man's actions:
    menu.listen(man, menu.update);
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
    
    var aTimer = utils.onEvery(10000, function(){
      //game.debug.text('Elapsed: ' + Math.floor(game.time.totalElapsedSeconds()), 32, 64);
      console.info('[play][Timers] Elapsed: ' + Math.floor(game.time.totalElapsedSeconds()));
    });
    
    console.info('[play] PHASER created');
  }
  
  function onSomethingHappened(evt, whereItHappn){
    console.info('[play][Events] something just happened in Pre2 World!', whereItHappn);
  }
  
  function setParallax(){
    level.backgroundLayer.x = -(game.camera.x * settings.physics.parallax);
  }
  
  function collisions(){
    game.physics.arcade.collide(man, level.collisionLayer);
    
    enemies.forEachAlive(function(enemy){
      if(enemy.props.collide && enemy.state !== 'dead'){
        game.physics.arcade.collide(enemy, level.collisionLayer);
      }
      if(enemy.inCamera && enemy.state !== 'dead' && man.state !== 'hurt'){
        game.physics.arcade.collide(man, enemy, onEnemyCollision, onProcess, this);
      }
    });
    
    if(level.deathLayer){
      game.physics.arcade.collide(man, level.deathLayer, function(){
        weapon.sprite.kill();
        man.kill();
        game.state.start('Play', true, false);
      });
    }
    
    /* hit'n kill enemy: collision should calculated on weapon sprite
    game.physics.arcade.collide(weapon.sprite, enemies.global.spawn.dino, function(weaponSprite, enemy){
      if(man.state === 'hitting'){
        enemy.kill();
      }
    }, null, this);
    */
  }
  
  function moveHero(){
    // weapon sprite should be always in sync with the man sprite
    weapon.sprite.x = man.x;
    weapon.sprite.y = man.y;

    if(man.stunnedUntil > game.time.now){
      keys.enabled = false;
      man.state = 'hurt';
      return;
    } else {
      keys.enabled = true;
    }
    
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
    game.debug.text(enemies.population(), 5, game.height - 15);
    
    // debug sprites
    enemies.forEachAlive(function(creature){
      creature.debug((creature.lifespan / 1000 | 0));
    });
    man.debug(man.props.lives +' '+ man.state);
    
    setParallax();
    collisions();
    moveHero();
    
    if(game.input.activePointer.leftButton.isDown){
      game.debug.pointer(game.input.activePointer);
      console.info('[play][Events] clicked at', game.input.activePointer.worldX | 0, game.input.activePointer.worldY | 0);
    }
    
    console.info('[play] PHASER updated');
  }
  
  function onEnemyCollision(hero, enemy){
    var enemyMomentum = enemy.body.velocity.x * enemy.body.mass,
        heroMomentum = man.body.velocity.x * man.body.mass;
    // jumping on top of the enemies!
    if(man.body.touching.down && enemy.body.touching.up){
      if(man.state === 'hitting'){
        enemy.die(heroMomentum);
      }
      return;
    }
    if(man.state === 'hitting'){
      enemy.die(heroMomentum);
      man.shout('hunting', { killed: enemy });
    }else{
      var shouldReload = man.lives() % 4 - 1 === 0;
      man.hurt(enemyMomentum);
      man.shout('hurt', { livesLeft: man.lives() });
      if(shouldReload){
        weapon.sprite.kill();
        game.time.events.add(Phaser.Timer.SECOND * 3, function(){
          // restart while keep caches: 
          game.state.start('Play', true, false);
        }, this);
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

