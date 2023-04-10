var creatureFactory = require('../classes/creatureFactory.js')();
var Thing = require('../classes/things.js');
var levelManager = require('../services/levelManager.js');
var enemyManager = require('../services/enemyManager.js');
var thingManager = require('../services/thingManager.js');
var menuManager = require('../services/menuManager.js');
var levelConfigs = require('../configs/levelConfigs.js');

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
  
  /*=============
  *   INIT
  =============*/
  this.init = function init(initConfigs){
    console.info('INIT:', initConfigs);
    levelNo = initConfigs.levelNumber;
    window.location.hash = '#' + initConfigs.levelNumber;
  };

  /*=============
  *   PRELOAD
  =============*/
  this.preload = function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    
    game.load.spritesheet('lives', './assets/lives.png', 38, 24);
    game.load.spritesheet('club', './assets/clubs-96x72.png', 96, 36);
    
    game.load.atlas('pre2atlas', 'assets/pre2atlas.png', 'assets/pre2atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    
    level.preloadAssets(levelNo);
  
    console.info('[play] PHASER preloaded');
  };
  
  /*=============
  *   CREATE
  =============*/
  this.create = function create() {
    // for fps debugging:
    game.time.advancedTiming = true;
    
    /*=============
    *   Init world
    =============*/
    game.world.setBounds(0, 0, globalSettings.dimensions.WIDTH * globalSettings.dimensions.blocks, globalSettings.dimensions.HEIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    /*=============
    *   Load level
    =============*/
    level.setLevel();

    /*=============
    *   Load enemies
    =============*/
    enemies = enemyManager(game, level.enemies, level.objects.zone);

    /*=============
    *   Add hero
    =============*/
    man = creatureFactory.create(game, 'man', level.entryPoint.x, level.entryPoint.y);
    
    weapon.sprite = man.addChild(game.make.sprite(0, 0, 'club'));
    
    weapon.sprite.anchor.setTo(man.props.correctedAnchor.x, man.props.correctedAnchor.y);
    weapon.sprite.visible = false;
    weapon.anim = weapon.sprite.animations.add('club-hit', [0,1,2,3,4], 10, false);
    //weapon.animLeft = weapon.sprite.animations.add('club-hit-left', [9,8,7,6,5], 10, false);
    weapon.anim.onComplete.add(toggleVivibility, this);
    
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

    /*=============
    *   Render menu
    =============*/
    menu = menuManager(game, man);
    // subscribe menu modul on man's actions:
    menu.listen(man, menu.update);

    /*=============
    *   Set inputs
    =============*/
    keys = game.input.keyboard.createCursorKeys();
    keys.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keys.escape = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    
    game.input.keyboard.onDownCallback = function(e){
      man.shout('near');
    };
    
    game.input.addPointer();
  
    window.addEventListener("deviceorientation", function orientation(event){
      var tilt = window.innerHeight > window.innerWidth ? event.gamma : event.beta;
      man.state.name = 'move';
      tilt >= 0 ? 
        man.moveRight(tilt * globalSettings.physics.accelerationMultiplier) :
        man.moveLeft(-tilt * globalSettings.physics.accelerationMultiplier);
    }, false);
        
    console.info('[play] PHASER created');
  };

  /*=============
  *   UPDATE
  =============*/
  this.update = function update() {
    // show FPS on bottom left corner
    game.debug.text(game.time.fps, 5, game.height - 20);
    game.debug.text(enemies.population(), 5, game.height - 35);
    
    // debug sprites
    enemies.forEachAlive(function(creature){
      //creature.debug(creature.state.name);
      //creature.debug(creature.creatureId);
    });
    //man.debug(man.state.name);
    
    /**============
     * Set parallax
     ============*/
    level.backgroundLayer.x = -(game.camera.x * globalSettings.physics.parallax);
    
    /**============
     * Set collisions
     ============*/
    game.physics.arcade.collide(man, level.collisionLayer);
    
    enemies.forEachAlive(function(enemy){
      if(enemy.props.collide && enemy.state.name !== 'die'){
        game.physics.arcade.collide(enemy, level.collisionLayer);
      }
      if(enemy.inCamera && enemy.state.name !== 'die' && man.state.name !== 'stun'){
        game.physics.arcade.collide(man, enemy, onEnemyCollision, onProcess, this);
      }
    });
    
    if(level.deathLayer){
      game.physics.arcade.collide(man, level.deathLayer, function(){
        weapon.sprite.kill();
        man.kill();
        game.state.start('Play', true, false, { levelNumber: levelNo });
      });
    }
    
    things.portals.forEach(function(portal){
      game.physics.arcade.overlap(man, portal, function(){
        // level named portal: jump to another level
        if(typeof portal.jumpTo === 'string') {
          game.state.start('Play', true, false, { levelNumber: portal.jumpTo });
        }
        // x,y portal: jump within same level (x,y)
        if(portal.jumpTo.x && portal.jumpTo.y && man.state === 'duck'){
          man.x = portal.jumpTo.x;
          man.y = portal.jumpTo.y;
        }
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

  /**============
   * Move hero
   ============*/

    if(man.state.name === 'stun' && game.time.now < man.state.until){
      keys.enabled = false;
      return;
    } else {
      keys.enabled = true;
    }
    
    if(!keys.left.isDown && 
      !keys.right.isDown && 
      !keys.up.isDown && 
      !keys.down.isDown && 
      !keys.space.isDown &&
      man.isGrounded() &&
      game.time.now > man.state.until){
        man.state.name = 'idle';
    }
    if(keys.left.isDown || game.input.pointer2.isDown) {
      man.facingRight = false;
      man.moveLeft();
      man.state.name = man.isGrounded() ? 'move' : 'jump';
    }
    else if(keys.right.isDown || game.input.pointer1.isDown) {
      man.facingRight = true;
      man.moveRight();
      man.state.name = man.isGrounded() ? 'move' : 'jump';
    }
    else{
      // slowing down / slippery rate: 10% after stopped moving
      man.stop(globalSettings.physics.slippery);
      //man.animations.play('man-stop-left');
    }
    if(keys.up.isDown || (game.input.pointer1.isDown && game.input.pointer2.isDown)) {
        man.jump();
        if(!man.isGrounded()){
          man.state.name = 'jump';
        }
    }
    else if(keys.down.isDown) {
        man.duck();
        console.log(`x: ${man.body.center.x} y: ${man.body.center.y}`);
    }
    if(keys.space.isDown) {
      man.setState('hit', 400);
      man.stop(globalSettings.physics.slippery);
      weapon.sprite.visible = true;
      weapon.sprite.animations.play('club-hit');
    }
    if(keys.escape.isDown) {
      game.state.start('Menu', true, true);
    }
    
    if(game.input.activePointer.leftButton.isDown){
      game.debug.pointer(game.input.activePointer);
      console.info('[play][Events] clicked at', game.input.activePointer.worldX | 0, game.input.activePointer.worldY | 0);
    }
    
    //console.info('[play] PHASER updated');
  };
  
  function debug(){
    game.debug.text('LIVES: ' + man.health(), 32, 96);
    game.debug.pointer(game.input.pointer1);
    //game.debug.body(weapon.sprite);
    //game.physics.enable(weapon.sprite, Phaser.Physics.ARCADE);
  }
  
  function onEnemyCollision(hero, enemy){
    var enemyMomentum = enemy.body.velocity.x * enemy.body.mass,
        heroMomentum = man.body.velocity.x * man.body.mass;
    // jumping on top of the enemies!
    if(man.body.touching.down && enemy.body.touching.up){
      if(man.state.name === 'hit'){
        enemy.die(heroMomentum);
      }
      return;
    }
    if(man.state.name === 'hit'){
      enemy.die(heroMomentum);
      man.shout('hunting', { killed: enemy });
    }else{
      game.camera.shake(0.003, 500, true, Phaser.Camera.VERTICAL, true);
      man.hurt(enemyMomentum);
      man.shout('hurt', { 
        livesLeft: man.health()
      });
      if(man.health() <= 0){
        man.props.lives = 8;
        game.state.start('Play', true, false, { levelNumber: 'hall-of-ages' });
      }
      var shouldReload = man.health() % 4 - 1 === 0;
      if(shouldReload){
        weapon.sprite.kill();
        game.time.events.add(Phaser.Timer.SECOND * 3, function(){
          // restart while keep caches: 
          game.state.start('Play', true, false, { levelNumber: levelNo });
        }, this);
      }
    }
  }
  
  function onProcess(){}
  
  function toggleVivibility(sprite){
    sprite.visible = !sprite.visible;
  }
}

module.exports = Play;

