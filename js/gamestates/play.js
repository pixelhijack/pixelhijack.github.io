var Creature = require('../classes/creature.js');
var Thing = require('../classes/things.js');
var levelManager = require('../services/levelManager.js');
var enemyManager = require('../services/enemyManager.js');
var thingManager = require('../services/thingManager.js');
var menuManager = require('../services/menuManager.js');
var levelConfigs = require('../configs/levelConfigs.js');
var util = require('../services/util.js');


window.addEventListener('error', function(e){
  var stack = e && e.error && e.error.stack;
  var message = e && e.error && e.error.toString();
  if(stack){
    message += '\n' + stack;
  }
  console.error('[PRE2-ERROR]', message);
});

// Play game state
function Play(game, globalSettings){

  var man;
  
  var keys; 
  
  var weapon = {
    sprite: null,
    animRight: null,
    animLeft: null
  };
  var menu;
  var level = levelManager(game, levelConfigs);

  var levelNo;
  
  var enemies;
  
  var things;
  
  var utils = util(game);
  
  var events = { };

  // public methods for Phaser
  this.init = function init(initConfigs){
    console.info('INIT:', initConfigs);
    levelNo = initConfigs.levelNumber;
    window.location.hash = '#' + initConfigs.levelNumber;
  };
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
    game.load.spritesheet('club', './assets/clubs-96x72.png', 96, 36);
    
    game.load.atlas('pre2atlas', 'assets/pre2atlas.png', 'assets/pre2atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    
    level.preloadAssets(levelNo);
  
    console.info('[play] PHASER preloaded');
  }
  
  function initWorld(){
    game.world.setBounds(0, 0, globalSettings.dimensions.WIDTH * globalSettings.dimensions.blocks, globalSettings.dimensions.HEIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }
  
  function loadLevel(){
    level.setLevel();
  }
  
  function loadEnemies(){
    enemies = enemyManager(game, level.enemies, level.objects.zone);
  }
  
  function addHero(){
    man = new Creature(game, 'man', level.entryPoint.x, level.entryPoint.y);
    
    weapon.sprite = game.add.sprite(man.body.x, man.body.y, 'club');
    weapon.sprite.anchor.setTo(man.props.correctedAnchor.x, man.props.correctedAnchor.y);
    weapon.sprite.visible = false;
    weapon.animRight = weapon.sprite.animations.add('club-hit-right', [0,1,2,3,4], 10, false);
    weapon.animLeft = weapon.sprite.animations.add('club-hit-left', [9,8,7,6,5], 10, false);
    weapon.animRight.onComplete.add(toggleVivibility, this);
    weapon.animLeft.onComplete.add(toggleVivibility, this);
    
    // subscribe enemies on man's actions:
    enemies.forEachAlive(function(creature){
      creature.listen(man, creature.onEnemyMovements);
    });
    
    things = thingManager(game, {
      bonus: level.bonus,
      portals: level.portals,
      platforms: level.platforms
    });
    
    game.camera.follow(man);
    game.add.existing(man);
    //game.world.addAt(man, 2);
  }
  
  function renderMenu(){
    menu = menuManager(game, man);
    // subscribe menu modul on man's actions:
    menu.listen(man, menu.update);
  }
  
  function setInputs(){
    keys = game.input.keyboard.createCursorKeys();
    keys.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    game.input.keyboard.onDownCallback = function(e){
      man.shout('near');
    };
    
    game.input.addPointer();
  
    window.addEventListener("deviceorientation", function orientation(event){
      var tilt = window.innerHeight > window.innerWidth ? event.gamma : event.beta;
      man.state = 'moving';
      tilt >= 0 ? 
        man.moveRight(tilt * globalSettings.physics.accelerationMultiplier) :
        man.moveLeft(-tilt * globalSettings.physics.accelerationMultiplier);
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
    
    console.info('[play] PHASER created');
  }
  
  function onSomethingHappened(evt, whereItHappn){
    console.info('[play][Events] something just happened in Pre2 World!', whereItHappn);
  }
  
  function setParallax(){
    level.backgroundLayer.x = -(game.camera.x * globalSettings.physics.parallax);
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
        game.state.start('Play', true, false, { levelNumber: globalSettings.level });
      });
    }
    
    things.portals.forEach(function(portal){
      game.physics.arcade.collide(man, portal, function(){
        game.state.start('Play', true, false, { levelNumber: portal.jumpTo });
      }, null, this);
    });
    
    things.platforms.forEach(function(platform){
      if(Phaser.Rectangle.intersects(platform.getBounds(), man.getBounds()) && platform.body.wasTouching.up){
        platform.stepped.prev = platform.stepped.on;
        platform.stepped.on = true; 
      } else {
        platform.stepped.prev = platform.stepped.on;
        platform.stepped.on = false; 
      }
      game.physics.arcade.collide(man, platform, function(stander, platform){
        if(platform.onStand){
          platform.onStand(stander, platform);
        }
      }, null, this);
    });
    
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
      man.stop(globalSettings.physics.slippery);
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
      man.stop(globalSettings.physics.slippery);
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
  function update(){
    
    // show FPS on bottom left corner
    game.debug.text(game.time.fps, 5, game.height - 5);
    game.debug.text(enemies.population(), 5, game.height - 15);
    
    // debug sprites
    enemies.forEachAlive(function(creature){
      //creature.debug((creature.lifespan / 1000 | 0));
      //creature.debug(creature.creatureId);
    });
    //man.debug(man.props.lives +' '+ man.state);
    
    setParallax();
    collisions();
    moveHero();
    
    if(game.input.activePointer.leftButton.isDown){
      game.debug.pointer(game.input.activePointer);
      console.info('[play][Events] clicked at', game.input.activePointer.worldX | 0, game.input.activePointer.worldY | 0);
    }
    
    //console.info('[play] PHASER updated');
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
          game.state.start('Play', true, false, { levelNumber: globalSettings.level });
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

