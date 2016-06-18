/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	var Menu = __webpack_require__(/*! ./gamestates/menu.js */ 1);
	var Play = __webpack_require__(/*! ./gamestates/play.js */ 2);
	
	var globalSettings = {
	  level: window.location.hash && window.location.hash.split('#')[1] || 'hall-of-ages',
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
	    accelerationMultiplier: 3 // for mobile. 5 = speed up for slower device, 1 = same speed as desktop
	  }
	};
	
	var game = new Phaser.Game(globalSettings.dimensions.WIDTH, globalSettings.dimensions.HEIGHT, Phaser.AUTO, '', null, false, false);
	var PRE2 = { 
	  Play: Play.bind(this, game, globalSettings)
	};
	game.state.add('Play', PRE2.Play);
	game.state.start('Play', true, true, { levelNumber: globalSettings.level });
	


/***/ },
/* 1 */
/*!*******************************!*\
  !*** ./js/gamestates/menu.js ***!
  \*******************************/
/***/ function(module, exports) {

	function Menu(){
	  
	  /*
	    press a key for a level: 1, 2, 3...
	  */
	  this.preload = function preload(){
	    
	  }
	  this.create = function create(){
	    
	  }
	  this.update = function update(){
	    
	  }
	}
	
	module.exports = Menu;

/***/ },
/* 2 */
/*!*******************************!*\
  !*** ./js/gamestates/play.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureFactory = __webpack_require__(/*! ../classes/creatureFactory.js */ 3)();
	var Thing = __webpack_require__(/*! ../classes/things.js */ 21);
	var levelManager = __webpack_require__(/*! ../services/levelManager.js */ 22);
	var enemyManager = __webpack_require__(/*! ../services/enemyManager.js */ 23);
	var thingManager = __webpack_require__(/*! ../services/thingManager.js */ 26);
	var menuManager = __webpack_require__(/*! ../services/menuManager.js */ 30);
	var levelConfigs = __webpack_require__(/*! ../configs/levelConfigs.js */ 31);
	var util = __webpack_require__(/*! ../services/util.js */ 25);
	
	
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
	    man = creatureFactory.create(game, 'man', level.entryPoint.x, level.entryPoint.y);
	    
	    weapon.sprite = man.addChild(game.make.sprite(0, 0, 'club'));
	    
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
	      man.state.name = 'move';
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
	    //weapon.sprite.x = man.x;
	    //weapon.sprite.y = man.y;
	
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
	    if(keys.left.isDown) {
	      man.facingRight = false;
	      man.moveLeft();
	      man.state.name = man.isGrounded() ? 'move' : 'jump';
	    }
	    else if(keys.right.isDown) {
	      man.facingRight = true;
	      man.moveRight();
	      man.state.name = man.isGrounded() ? 'move' : 'jump';
	    }
	    else{
	      // slowing down / slippery rate: 10% after stopped moving
	      man.stop(globalSettings.physics.slippery);
	      //man.animations.play('man-stop-left');
	    }
	    if(keys.up.isDown || game.input.pointer1.isDown) {
	        man.jump();
	        if(!man.isGrounded()){
	          man.state.name = 'jump';
	        }
	    }
	    else if(keys.down.isDown) {
	        // man.duck();
	        events.somethingHappened.dispatch(this, man.x);
	    }
	    if(keys.space.isDown) {
	      man.setState('hit', 400);
	      man.stop(globalSettings.physics.slippery);
	      weapon.sprite.visible = true;
	      weapon.sprite.animations.play('club-hit-' + man.direction());
	    }
	  }
	  
	  function debug(){
	    game.debug.text('LIVES: ' + man.health(), 32, 96);
	    game.debug.pointer(game.input.pointer1);
	    //game.debug.body(weapon.sprite);
	    //game.physics.enable(weapon.sprite, Phaser.Physics.ARCADE);
	  }
	  
	  /*=============
	  *   UPDATE
	  =============*/
	  function update(){
	    
	    // show FPS on bottom left corner
	    game.debug.text(game.time.fps, 5, game.height - 20);
	    game.debug.text(enemies.population(), 5, game.height - 35);
	    
	    // debug sprites
	    enemies.forEachAlive(function(creature){
	      //creature.debug(creature.state.name);
	      //creature.debug(creature.creatureId);
	    });
	    man.debug(man.state.name);
	    
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
	  
	  function onProcess(){
	    
	  }
	  
	  function toggleVivibility(sprite){
	    sprite.visible = !sprite.visible;
	  }
	}
	
	module.exports = Play;
	


/***/ },
/* 3 */
/*!***************************************!*\
  !*** ./js/classes/creatureFactory.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var creature = {
	  dino: __webpack_require__(/*! ./creatures/Dino.js */ 4),
	  bear: __webpack_require__(/*! ./creatures/Bear.js */ 7),
	  native: __webpack_require__(/*! ./creatures/Native.js */ 8),
	  turtle: __webpack_require__(/*! ./creatures/Turtle.js */ 9),
	  insect: __webpack_require__(/*! ./creatures/Insect.js */ 10),
	  bug: __webpack_require__(/*! ./creatures/Bug.js */ 11),
	  frog: __webpack_require__(/*! ./creatures/Frog.js */ 12),
	  tiger: __webpack_require__(/*! ./creatures/Tiger.js */ 13),
	  spider: __webpack_require__(/*! ./creatures/Spider.js */ 14),
	  ptero: __webpack_require__(/*! ./creatures/Ptero.js */ 15),
	  parrot: __webpack_require__(/*! ./creatures/Parrot.js */ 16),
	  dragonfly: __webpack_require__(/*! ./creatures/Dragonfly.js */ 17),
	  bat: __webpack_require__(/*! ./creatures/Bat.js */ 18),
	  jelly: __webpack_require__(/*! ./creatures/Jelly.js */ 19),
	  man: __webpack_require__(/*! ./creatures/Man.js */ 20)
	};
	
	function creatureFactory(){
	  return {
	    create: function(game, creatureType, x, y){
	      if(!creature[creatureType]){
	        console.error('We don\'t have this animal in the zoo: ', creatureType);
	        return;
	      }
	      return new creature[creatureType](game, x, y);
	    }
	  };
	}
	
	module.exports = creatureFactory;

/***/ },
/* 4 */
/*!**************************************!*\
  !*** ./js/classes/creatures/Dino.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Dino(game, x, y){
	  Creature.call(this, game, 'dino', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Dino.prototype = Object.create(Creature.prototype);
	Dino.prototype.constructor = Dino;
	
	
	Dino.prototype.specialMoves = function specialMoves(){
	  if(this.props.jumping && Math.random() < 0.05){
	    return 'jump';
	  }
	  if(Math.random() < 0.005){
	    return 'turn';
	  }
	  return 'move';
	};
	
	module.exports = Dino;
	  

/***/ },
/* 5 */
/*!***************************************!*\
  !*** ./js/configs/creatureConfigs.js ***!
  \***************************************/
/***/ function(module, exports) {

	var creatureConfigs = {
	  creatureDefaults: {
	    active: true,
	    gravity: 500,
	    bounce: 0.2,
	    mass: 1,
	    jumping: 300,
	    maxSpeed: 100,
	    acceleration: 10,
	    collide: true,
	    lives: 1, 
	    lifespan: Infinity,
	    sense: 150,
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
	      { name: 'move', frames: [11,'03','05',14,20], fps: 10, loop: false }, 
	      { name: 'hit', frames: [22,24,28,31,34,22,24,28,31,34], fps: 10, loop: true }, 
	      { name: 'stop', frames: [42,45,49,52], fps: 10, loop: false }, 
	      { name: 'jump', frames: [16,41,47,50,50,50,50,50,50,50,50,13,50,13,50,13], fps: 10, loop: false }, 
	      { name: 'idle', frames: [25,25,25,25,25,25,25,25,27,27,27,27,25,25,25,25,25,25,25,25,30,25,25,25,25,25,25,25,25,27,30,27,30,35,36,25,25,25,25,25,25,25,25,'07','07','07','07','02','02'], fps: 5, loop: true }, 
	      { name: 'hurt', frames: [19], fps: 10, loop: true },
	      { name: 'stun', frames: [19], fps: 10, loop: true },
	      { name: 'die', frames: [19], fps: 10, loop: false },
	      { name: 'spawn', frames: [11,'03','05',14,20], fps: 10, loop: false }
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
	      { name: 'idle', frames: [360,360,360,360,360,360,360,367], fps: 5, loop: true },
	      { name: 'move', frames: [360,361,364,367,369], fps: 10, loop: true },
	      { name: 'jump', frames: [360,361,364,367,369], fps: 10, loop: true },
	      { name: 'fall', frames: [369], fps: 10, loop: true },
	      { name: 'die', frames: [371], fps: 10, loop: true },
	      { name: 'spawn', frames: [360,361,364,367], fps: 10, loop: true }
	    ]
	  },
	  bear: {
	    mass: 1.2,
	    maxSpeed: 75,
	    jumping: 0,
	    acceleration: 15, 
	    animations: [
	      { name: 'idle', frames: [321], fps: 10, loop: false },
	      { name: 'move', frames: [320,321,324], fps: 10, loop: true },
	      { name: 'spawn', frames: [366,363,358,317], fps: 10, loop: false },
	      { name: 'die', frames: [328], fps: 10, loop: true }
	    ] 
	  },
	  'super-bear': {
	    acceleration: 30,
	    maxSpeed: 200,
	    image: 'super-bear-sprite-ref', // override sprite (creature name by default)
	    animations: []
	  },
	  tiger: {
	    mass: 1.5,
	    jumping: 300,
	    maxSpeed: 50,
	    acceleration: 20, 
	    animations: [
	      { name: 'idle', frames: [393,395], fps: 10, loop: true },
	      { name: 'move', frames: [393,395], fps: 10, loop: true },
	      { name: 'jump', frames: [399,401], fps: 10, loop: false },
	      { name: 'fall', frames: [399], fps: 10, loop: false },
	      { name: 'die', frames: [402], fps: 10, loop: true },
	      { name: 'spawn', frames: [393,395], fps: 10, loop: true }
	    ]
	  },
	  ptero: {
	    mass: 0.5,
	    gravity: 0,
	    bounce: 0.1,
	    jumping: 0,
	    collide: false,
	    maxSpeed: 10,
	    acceleration: 10, 
	    animations: [
	      { name: 'idle', frames: [478,478,478,478,478,478,478,478,477,478,478,478,478,478,477,477], fps: 3, loop: true },
	      { name: 'move', frames: [403,404,405,403,404,405,405,405,405,405,405,403,404,405,403,404,405,405,405,405,405,405,405], fps: 10, loop: true },
	      { name: 'descend', frames: [405], fps: 15, loop: true },
	      { name: 'ascend', frames: [403,404,405], fps: 15, loop: true },
	      { name: 'die', frames: [471], fps: 10, loop: true },
	      { name: 'spawn', frames: [405,403,404], fps: 15, loop: true }
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
	      { name: 'idle', frames: [337,338], fps: 12, loop: true },
	      { name: 'move', frames: [337,338], fps: 12, loop: true },
	      { name: 'turn', frames: [339,340], fps: 12, loop: true },
	      { name: 'die', frames: [342], fps: 12, loop: true },
	      { name: 'spawn', frames: [337,338], fps: 12, loop: true }
	    ]
	  },
	  bat: {
	    mass: 0.5,
	    gravity: 0,
	    bounce: 0.1,
	    jumping: 0,
	    collide: false,
	    maxSpeed: 20,
	    acceleration: 10, 
	    animations: [
	      { name: 'idle', frames: [351,352,351,351,351,351], fps: 10, loop: true },
	      { name: 'move', frames: [357,359], fps: 10, loop: true },
	      { name: 'die', frames: [362], fps: 10, loop: true },
	      { name: 'spawn', frames: [357,359], fps: 10, loop: true }
	    ]
	  },
	  spider: {
	    mass: 0.3,
	    jumping: 0,
	    collide: true,
	    bounce: 0,
	    maxSpeed: 50,
	    acceleration: 10,
	    animations: [
	      { name: 'idle', frames: [335], fps: 10, loop: true },
	      { name: 'spawn', frames: [365,368,370,372], fps: 10, loop: false },
	      { name: 'move', frames: [299,302,305,309], fps: 10, loop: true },
	      { name: 'turn', frames: [319], fps: 10, loop: true },
	      { name: 'climb', frames: [341,343,345,347], fps: 10, loop: true },
	      { name: 'wait', frames: [332,335,372], fps: 10, loop: true },
	      { name: 'die', frames: [322], fps: 10, loop: false }
	    ]
	  },
	  native: {
	    maxSpeed: 100,
	    acceleration: 20,
	    jumping: 0,
	    animations: [
	      { name: 'idle', frames: [373], fps: 10, loop: true },
	      { name: 'move', frames: [373,376,378], fps: 10, loop: true },
	      { name: 'die', frames: [380], fps: 10, loop: false },
	      { name: 'spawn', frames: [373,376,378], fps: 10, loop: true }
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
	      { name: 'idle', frames: [394,397,398], fps: 12, loop: true },
	      { name: 'move', frames: [394,397,398], fps: 10, loop: true },
	      { name: 'die', frames: [400], fps: 10, loop: false },
	      { name: 'spawn', frames: [394,397,398], fps: 10, loop: true }
	    ]
	  },
	  insect: {
	    mass: 1,
	    collide: true,
	    bounce: 1.5,
	    jumping: 300,
	    maxSpeed: 50,
	    acceleration: 25, 
	    animations: [
	      { name: 'idle', frames: [348,348,348,348,348,348,349], fps: 10, loop: true },
	      { name: 'move', frames: [323,348,349], fps: 10, loop: true },
	      { name: 'jump', frames: [323,348,349], fps: 10, loop: true },
	      { name: 'die', frames: [348], fps: 10, loop: true },
	      { name: 'spawn', frames: [323,348,349], fps: 10, loop: true }
	    ]
	  },
	  bug: {
	    mass: 1,
	    collide: true,
	    bounce: 1.5,
	    jumping: 300,
	    maxSpeed: 50,
	    acceleration: 25, 
	    animations: [
	      { name: 'idle', frames: [344,344,344,344,344,344,344,344,346], fps: 10, loop: true },
	      { name: 'move', frames: [344,346], fps: 10, loop: true },
	      { name: 'jump', frames: [344,346], fps: 10, loop: true },
	      { name: 'die', frames: [344], fps: 10, loop: true },
	      { name: 'spawn', frames: [344,346], fps: 10, loop: true }
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
	      { name: 'idle', frames: [325], fps: 10, loop: true },
	      { name: 'move', frames: [325,327,331,325], fps: 10, loop: false },
	      { name: 'jump', frames: [325,327,331,325], fps: 10, loop: false },
	      { name: 'die', frames: [334], fps: 10, loop: true },
	      { name: 'spawn', frames: [325,327,331,325], fps: 10, loop: false }
	    ]
	  },
	  turtle: {
	    mass: 2,
	    jumping: 0,
	    collide: true,
	    bounce: 0.3,
	    maxSpeed: 50,
	    acceleration: 10,
	    animations: [
	      { name: 'idle', frames: [390], fps: 10, loop: true },
	      { name: 'spawn', frames: [377,381,384,385], fps: 10, loop: true },
	      { name: 'move', frames: [387,389,390,391], fps: 10, loop: true },
	      { name: 'die', frames: [392], fps: 10, loop: true }
	    ]
	  },
	  jelly: {
	    mass: 2,
	    jumping: 0,
	    collide: true,
	    bounce: 1,
	    maxSpeed: 5,
	    acceleration: 1,
	    animations: [
	      { name: 'idle', frames: [420,433,434], fps: 3, loop: true },
	      { name: 'spawn', frames: [420,433,434], fps: 3, loop: true },
	      { name: 'move', frames: [420,433,434], fps: 3, loop: true },
	      { name: 'die', frames: [420,433,434], fps: 3, loop: true }
	    ]
	  },
	  gorilla: {
	    // grim level bosses with lots of lifes!!
	    lives: 10, 
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

/***/ },
/* 6 */
/*!******************************************!*\
  !*** ./js/classes/creatures/Creature.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	
	var Creature = function(game, creatureType, x, y){
	  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.creatureType = creatureType;
	
	  this.state = {
	    name: 'spawn', 
	    until: this.game.time.now
	  };
	  
	  this.body.collideWorldBounds = true;
	  this.checkWorldBounds = true;
	  this.outOfBoundsKill = true;
	  
	  this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
	  this._debugText.visible = false;
	
	  this.facingRight = Math.random() < 0.5 ? true : false;
	  
	  // every creature makes noises: an observable phaser channel to subscribe for:
	  this.noise = new Phaser.Signal();
	};
	
	Creature.prototype = Object.create(Phaser.Sprite.prototype);
	Creature.prototype.constructor = Creature;
	
	Creature.prototype.setAnimations = function setAnimations(){
	  creatureConfigs[this.creatureType].animations.forEach(function(anim){
	    anim.frames = anim.frames.map(function(frameNumber){
	      return frameNumber.toString();
	    });
	    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
	  }.bind(this));
	};
	
	Creature.prototype.setId = function setId(creatureType, x, y, enemyGroupIterator){
	  // @creatureId: creatureType-x-y-enemyGroupIterator
	  this.creatureId = creatureType + '-' + x + '-' + y + '-' + enemyGroupIterator;
	};
	
	Creature.prototype.setProps = function setProps(){
	  this.props = creatureConfigs[this.creatureType] || creatureConfigs.creatureDefaults;
	  
	  this.body.gravity.y = creatureConfigs[this.creatureType].gravity;
	  this.body.mass = creatureConfigs[this.creatureType].mass;
	  this.anchor.setTo(creatureConfigs[this.creatureType].correctedAnchor.x, creatureConfigs[this.creatureType].correctedAnchor.y);
	
	  /*
	    @this.lifespan: the actual, used by Phaser
	    @this.props.lifespan: the abstract from creature & level configs
	  */
	  this.lifespan = this.props.lifespan;
	};
	
	Creature.prototype.setState = function setState(state, until){
	  this.state = {
	    name: state,
	    until: this.game.time.now + (until || 0)
	  };
	};
	
	Creature.prototype.nextAction = function nextAction(){
	  // if dead can't do anything else :)
	  if(this.state.name === 'die'){
	    return 'die';
	  }
	  // lock states for a time like stunned for 2 sec
	  if(this.state.until > this.game.time.now){
	    return this.state.name;
	  }
	  // fall state to prevent active:false idles stop in the middle of air
	  if(this.props.jumping && !this.isGrounded() && this.body.velocity.y > 0){
	    return 'fall';
	  }
	  // bored guys...
	  if(!this.props.active){
	    return 'idle';
	  }
	  // boundTo {x1, x2} or {x1, y1, x2, y2} Rectangle
	  if(this.boundTo.hasOwnProperty('width') && 
	    (this.x < this.boundTo.x && !this.facingRight || 
	     this.x > this.boundTo.x + this.boundTo.width && this.facingRight)){
	    return 'turn';
	  }
	  // boundTo {x, y} Point
	  if(!this.boundTo.hasOwnProperty('width') && 
	      Object.keys(this.boundTo).length &&
	      !Phaser.Rectangle.containsPoint(this.getBounds(), this.boundTo)){
	    if((this.x < this.boundTo.x && !this.facingRight) || 
	       (this.x > this.boundTo.x && this.facingRight)){
	      return 'turn';
	    }
	  }
	  // prevent stick to some wall or edge
	  if(this.body.blocked.left || this.body.blocked.right){
	    return 'turn';
	  }
	  return this.specialMoves() || 'move';
	};
	
	Creature.prototype.render = function render(){
	  this.play(this.state.name); 
	  this.scale.x = this.facingRight ? 1 : -1;
	};
	
	Creature.prototype.react = function react(){
	  if(this.state.name && this[this.state.name]){
	    this[this.state.name]();
	  }
	};
	
	Creature.prototype.decide = function decide(){
	  this.state.name = this.nextAction();
	};
	
	Creature.prototype.update = function update(){
	  this.render();
	  this.react();
	  this.decide();
	};
	
	Creature.prototype.specialMoves = function specialMoves(){
	  if(this.props.jumping && Math.random() < 0.05){
	    return 'jump';
	  }
	  if(!Object.keys(this.boundTo).length && Math.random() < 0.005){
	    return 'turn';
	  }
	  return 'move';
	};
	
	  /*  @boundTo
	    {x, y}            - a point
	    {x1, x2}          - a section
	    {x1, y1, x2, y2}  - an exact zone
	  */
	Object.defineProperty(Creature.prototype, 'boundTo', {
	    get: function() { return this._boundTo; }, 
	    set: function(bounds) {
	      // {x, y}
	      if(bounds.hasOwnProperty('x') && 
	        bounds.hasOwnProperty('y')){
	          this._boundTo = new Phaser.Point(bounds.x, bounds.y);
	      }
	      // {x1, x2}
	      else if(bounds.hasOwnProperty('x1') && 
	              bounds.hasOwnProperty('x2') &&
	              !bounds.hasOwnProperty('y1') &&
	              !bounds.hasOwnProperty('y2')){
	          this._boundTo = new Phaser.Rectangle(bounds.x1, 0, bounds.x2 - bounds.x1, this.game.height);
	      }
	      // {x1, y1, x2, y2}
	      else if(bounds.hasOwnProperty('x1') && 
	              bounds.hasOwnProperty('x2') &&
	              bounds.hasOwnProperty('y1') &&
	              bounds.hasOwnProperty('y2')){
	          this._boundTo = new Phaser.Rectangle(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
	      // default: bound to the whole world
	      } else {
	        this._boundTo = { };
	      }
	    }
	});
	
	Creature.prototype.direction = function direction(){
	  return this.facingRight ? 'right' : 'left';
	};
	
	Creature.prototype.isGrounded = function isGrounded(){
	  return this.body.touching.down || this.body.blocked.down;
	};
	
	// use in update()
	Creature.prototype.debug = function debug(toDebug){
	  this._debugText.visible = true;
	  this._debugText.scale.x = this.facingRight ? 1 : -1;
	  this._debugText.setText(toDebug || '');
	};
	
	Creature.prototype.listen = function listen(subject, reaction){
	  // subscribe a creature to man's noises: man.noise.add(creature.onEnemyMovements, creature);
	  subject.noise.add(reaction, this);
	};
	
	Creature.prototype.shout = function shout(eventType){
	  this.noise.dispatch({ 
	    who: this.creatureType, 
	    event: eventType, 
	    x: this.x | 0, 
	    y: this.y | 0, 
	    args: Array.prototype.slice.call(arguments, 1)[0]
	  });
	};
	
	Creature.prototype.onEnemyMovements = function onEnemyMovements(evt){
	  if(!(this.onMove || this.onClose || this.onLeave)){
	    return;
	  }
	  this.onMove && this.onMove.call(this, evt);
	  if(Math.abs(this.x - evt.x) < this.props.sense){
	    this.onClose && this.onClose.call(this, evt);
	  } else {
	    this.onLeave && this.onLeave.call(this, evt);
	  }
	};
	
	Creature.prototype.revive = function revive(x, y){
	  this.lifespan = this.props.lifespan;
	  this.state.name = 'spawn';
	  this.reset(x, y);
	};
	
	Creature.prototype.health = function health(eventType){
	  return this.props.lives;
	};
	
	Creature.prototype.move = function move(){
	  this.facingRight ? 
	      this.moveRight() : 
	      this.moveLeft();
	};
	
	Creature.prototype.moveLeft = function moveLeft(overrideAcc){
	  if(this.body.velocity.x > -this.props.maxSpeed){
	    this.body.velocity.x -= overrideAcc || this.props.acceleration;
	  }
	};
	
	Creature.prototype.moveRight = function moveRight(overrideAcc){
	  if(this.body.velocity.x < this.props.maxSpeed){
	    this.body.velocity.x += overrideAcc || this.props.acceleration;
	  }
	};
	
	Creature.prototype.turn = function turn(){
	  this.facingRight = !this.facingRight;
	  // ensure dont get stuck:
	  this.setState('move', 50);
	};
	
	Creature.prototype.wakeUp = function wakeUp(){
	  this.props.active = true;
	};
	Creature.prototype.wait = function wait(){
	  this.props.active = false;
	};
	Creature.prototype.follow = function follow(evt){
	  this.props.active = true;
	  this.boundTo = {
	    x: evt.x,
	    y: evt.y
	  };
	};
	
	Creature.prototype.idle = function idle(){
	  this.body.velocity.x = 0;
	  this.body.velocity.y = 0;
	};
	
	Creature.prototype.jump = function jump(){
	  if(this.props.jumping && (this.body.touching.down || this.body.blocked.down)){
	    this.body.velocity.y -= this.props.jumping;
	  }
	};
	
	Creature.prototype.stop = function stop(slippery){
	  this.body.velocity.x /= (slippery || 1.1);
	};
	
	Creature.prototype.hurt = function hurt(force){
	  this.setState('stun', 1500);
	  this.props.lives -= 1;
	  this.body.velocity.x += force * 3;
	  this.body.velocity.y += force * 3;
	};
	
	Creature.prototype.die = function die(force){
	  this.setState('die', 2000);
	  //this.props.collide = false;
	  this.body.velocity.x -= force * 3;
	  this.body.velocity.y -= force * 3;
	  // http://www.html5gamedevs.com/topic/6429-use-phasertime-like-settimeout/
	  this.game.time.events.add(Phaser.Timer.SECOND * 2, this.kill, this);
	};
	
	Creature.prototype.sentinel = function sentinel(){
	  // @boundTo: {x1, x2} or {x1, y1, x2, y2} Rectangle
	  // @behaviour 'sentinel back & forth': if bound to a zone, stay there
	  if(this.boundTo.hasOwnProperty('width')){
	    if(this.x < this.boundTo.x){
	      this.facingRight = true;
	      this.move();
	    }
	    if(this.x > this.boundTo.x + this.boundTo.width){
	      this.facingRight = false;
	      this.move();
	    }
	  }
	  // @boundTo: {x, y} Point
	  // @behaviour 'hurry somewhere': if bound to a point, head there
	  // @behaviour 'wait at': if reached the point, wait there
	  if(!this.boundTo.hasOwnProperty('width')){
	    if(Phaser.Rectangle.containsPoint(this.getBounds(), this.boundTo)){
	      //console.info('[movements] %s reached boundTo point', this.key);
	      this.wait();
	      return false;
	    }
	  }  
	};
	
	Creature.prototype.attackIfClose = function attackIfClose(evt){
	  if(Math.abs(this.x - evt.x) < this.props.sense){
	    //this.update = this.defaultUpdate;
	  } else {
	    //this.update = this.waitStill;
	  }
	};
	
	Creature.prototype.attackIfAwakened = function attackIfAwakened(evt){
	  if(Math.abs(this.x - evt.x) < this.props.sense){
	    this.update = this.defaultUpdate;
	  }
	};
	
	module.exports = Creature;
	  

/***/ },
/* 7 */
/*!**************************************!*\
  !*** ./js/classes/creatures/Bear.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Bear(game, x, y){
	  Creature.call(this, game, 'bear', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Bear.prototype = Object.create(Creature.prototype);
	Bear.prototype.constructor = Bear;
	
	module.exports = Bear;
	  

/***/ },
/* 8 */
/*!****************************************!*\
  !*** ./js/classes/creatures/Native.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Native(game, x, y){
	  Creature.call(this, game, 'native', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Native.prototype = Object.create(Creature.prototype);
	Native.prototype.constructor = Native;
	
	module.exports = Native;
	  

/***/ },
/* 9 */
/*!****************************************!*\
  !*** ./js/classes/creatures/Turtle.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Turtle(game, x, y){
	  Creature.call(this, game, 'turtle', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Turtle.prototype = Object.create(Creature.prototype);
	Turtle.prototype.constructor = Turtle;
	
	module.exports = Turtle;
	  

/***/ },
/* 10 */
/*!****************************************!*\
  !*** ./js/classes/creatures/Insect.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Insect(game, x, y){
	  Creature.call(this, game, 'insect', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Insect.prototype = Object.create(Creature.prototype);
	Insect.prototype.constructor = Insect;
	
	module.exports = Insect;
	  

/***/ },
/* 11 */
/*!*************************************!*\
  !*** ./js/classes/creatures/Bug.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Bug(game, x, y){
	  Creature.call(this, game, 'bug', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Bug.prototype = Object.create(Creature.prototype);
	Bug.prototype.constructor = Bug;
	
	module.exports = Bug;
	  

/***/ },
/* 12 */
/*!**************************************!*\
  !*** ./js/classes/creatures/Frog.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Frog(game, x, y){
	  Creature.call(this, game, 'frog', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Frog.prototype = Object.create(Creature.prototype);
	Frog.prototype.constructor = Frog;
	
	module.exports = Frog;
	  

/***/ },
/* 13 */
/*!***************************************!*\
  !*** ./js/classes/creatures/Tiger.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Tiger(game, x, y){
	  Creature.call(this, game, 'tiger', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Tiger.prototype = Object.create(Creature.prototype);
	Tiger.prototype.constructor = Tiger;
	
	module.exports = Tiger;
	  

/***/ },
/* 14 */
/*!****************************************!*\
  !*** ./js/classes/creatures/Spider.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Spider(game, x, y){
	  Creature.call(this, game, 'spider', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Spider.prototype = Object.create(Creature.prototype);
	Spider.prototype.constructor = Spider;
	
	Spider.prototype.crawl = function crawl(){
	  if(this.body.velocity.y > 0){
	    this.scale.y = -1;
	  } else {
	    this.scale.y = 1;
	  }
	  if(this.body.blocked.left || this.body.blocked.right){
	    this.body.gravity.y = 0;
	    this.state = 'climbing';
	    this.move();
	    //this.scale.y = this.body.velocity.y > 0 && this.isGrounded() ? -1 : 1;
	    
	    // crawling up:
	    if(this.body.blocked.down){
	      this.body.velocity.y -= this.props.acceleration;
	    }
	    //crawling down:
	    if(this.body.blocked.up){
	      this.body.velocity.y += this.props.acceleration;
	    }
	  } else {
	    this.body.gravity.y = this.props.gravity;
	    this.move();
	    this.state = 'moving';
	  }
	};
	
	module.exports = Spider;
	  

/***/ },
/* 15 */
/*!***************************************!*\
  !*** ./js/classes/creatures/Ptero.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Ptero(game, x, y){
	  Creature.call(this, game, 'ptero', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Ptero.prototype = Object.create(Creature.prototype);
	Ptero.prototype.constructor = Ptero;
	
	Ptero.prototype.specialMoves = function specialMoves(){
	  if(Math.random() < 0.005){
	    return 'turn';
	  }
	  if(Math.random() < 0.05){
	    this.setState('descend', 50);
	    return 'descend';
	  }
	  if(Math.random() < 0.05){
	    this.setState('ascend', 100);
	    return 'ascend';
	  }
	  if(Math.random() < 0.05){
	    this.setState('move', 500);
	    return 'move';
	  }
	  return 'move';
	};
	
	Ptero.prototype.ascend = function ascend(){
	  this.body.velocity.y -= this.props.acceleration;
	};
	
	Ptero.prototype.descend = function descend(){
	  this.body.velocity.y += this.props.acceleration;
	};
	
	module.exports = Ptero;
	  

/***/ },
/* 16 */
/*!****************************************!*\
  !*** ./js/classes/creatures/Parrot.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Parrot(game, x, y){
	  Creature.call(this, game, 'parrot', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Parrot.prototype = Object.create(Creature.prototype);
	Parrot.prototype.constructor = Parrot;
	
	module.exports = Parrot;
	  

/***/ },
/* 17 */
/*!*******************************************!*\
  !*** ./js/classes/creatures/Dragonfly.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Dragonfly(game, x, y){
	  Creature.call(this, game, 'dragonfly', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Dragonfly.prototype = Object.create(Creature.prototype);
	Dragonfly.prototype.constructor = Dragonfly;
	
	module.exports = Dragonfly;
	  

/***/ },
/* 18 */
/*!*************************************!*\
  !*** ./js/classes/creatures/Bat.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Bat(game, x, y){
	  Creature.call(this, game, 'bat', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Bat.prototype = Object.create(Creature.prototype);
	Bat.prototype.constructor = Bat;
	
	Bat.prototype.move = function move(){
	  this.y += 1;
	  this.x = this.facingRight ? this.x + 0.5 : this.x - 0.5;
	};
	
	Bat.prototype.diagonalDescend = function diagonalDescend(dx, dy){
	  this.y += dy;
	  this.x += dx;
	};
	
	module.exports = Bat;
	  

/***/ },
/* 19 */
/*!***************************************!*\
  !*** ./js/classes/creatures/Jelly.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Jelly(game, x, y){
	  Creature.call(this, game, 'jelly', x, y);
	
	  this.setProps();
	  this.setAnimations();
	}
	
	Jelly.prototype = Object.create(Creature.prototype);
	Jelly.prototype.constructor = Jelly;
	
	module.exports = Jelly;
	  

/***/ },
/* 20 */
/*!*************************************!*\
  !*** ./js/classes/creatures/Man.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(/*! ../../configs/creatureConfigs.js */ 5);
	var Creature = __webpack_require__(/*! ./Creature.js */ 6);
	
	function Man(game, x, y){
	  Creature.call(this, game, 'man', x, y);
	
	  this.setProps();
	  this.setAnimations();
	  this.update = this.defaultUpdate;
	}
	
	Man.prototype = Object.create(Creature.prototype);
	Man.prototype.constructor = Man;
	
	Man.prototype.defaultUpdate = function defaultUpdate(){
	  if(this.game.time.now < this.state.until){
	    this.state.name = this.state.name;
	  }
	  this.render();
	  if(this.state.name === 'die'){
	    return;
	  }
	};
	
	module.exports = Man;
	  

/***/ },
/* 21 */
/*!******************************!*\
  !*** ./js/classes/things.js ***!
  \******************************/
/***/ function(module, exports) {

	var Thing = function(game, frameName, x, y, configs){
	  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.frameName = frameName;
	  
	  var pulseDistance = 10 + Math.random() * 5 - Math.random() * 5;
	  this.props = {
	    x: x,
	    y: y,
	    pulseDistance: pulseDistance,
	    pulseVelocity: pulseDistance * 3
	  };
	  this.body.gravity.y = 100;
	  this.allowGravity = true;
	  this.anchor.setTo(0.5, 0.5);
	  game.add.existing(this);
	  
	  this.update = function(){
	    this.pulse();
	  };
	};
	
	Thing.prototype = Object.create(Phaser.Sprite.prototype);
	Thing.prototype.constructor = Thing;
	
	Thing.prototype.pulse = function pulse(){
	  if(this.y >= this.props.y + this.props.pulseDistance){
	    this.body.velocity.y = -this.props.pulseVelocity;
	  }
	  if(this.y < this.props.y){
	    //this.body.velocity.y = 0;
	  }
	};
	
	module.exports = Thing;

/***/ },
/* 22 */
/*!*************************************!*\
  !*** ./js/services/levelManager.js ***!
  \*************************************/
/***/ function(module, exports) {

	var levelManager = function(game, levelList){
	  
	  var levelToLoad;
	  
	  var level = {
	    tilemap: null,
	    backgroundLayer: null,
	    groundLayer: null,
	    foregroundLayer: null,
	    collisionLayer: null,
	    objects: {}, 
	    bonus: [],
	    portals: [],
	    platforms: [],
	    entryPoint: {
	      x: 200, 
	      y: 50
	    }
	  };
	  
	  level.preloadAssets = function(id){
	    levelToLoad = levelList.find(function(level){
	      return level.id === id;
	    });
	    if(!levelToLoad){
	      console.error('PRE2: Couldn\'t find level "%s". Sorry, pal.', id);
	      window.location = window.location.href.split('#')[0] + '#hall-of-ages';
	      levelToLoad = levelList.find(function(level){
	        return level.id === 'hall-of-ages';
	      });
	    }
	    // load background
	    game.load.image(levelToLoad.backgroundLayer, 'assets/backgrounds/' + levelToLoad.backgroundImage + '.png');
	    // load tileset
	    game.load.image(levelToLoad.tileset, 'assets/tilesets/' + levelToLoad.tilesetImage + '.png');
	    // load tilemap
	    game.load.tilemap(levelToLoad.tilemap, 'levels/' + levelToLoad.tiledJson + '.json', null, Phaser.Tilemap.TILED_JSON);
	  };
	  
	  level.setLevel = function(){
	    if(levelToLoad.maxHeight){
	      game.scale.setGameSize(game.width, levelToLoad.maxHeight);
	    }
	    if(levelToLoad.maxWidth){
	      game.scale.setGameSize(game.height, levelToLoad.maxWidth);
	    }
	    level.backgroundLayer = game.add.tileSprite(0, 0, levelToLoad.width, levelToLoad.height, levelToLoad.backgroundLayer);
	    level.backgroundLayer.fixedToCamera = levelToLoad.fixedBackground;
	    level.tilemap = game.add.tilemap(levelToLoad.tilemap);
	    level.tilemap.addTilesetImage(levelToLoad.tilesetImage, levelToLoad.tileset);
	    if(levelToLoad.parallaxLayer){
	      level.parallaxLayer = level.tilemap.createLayer(levelToLoad.parallaxLayer);
	    }
	    level.groundLayer = level.tilemap.createLayer(levelToLoad.groundLayer);
	    level.collisionLayer = level.tilemap.createLayer(levelToLoad.collisionLayer);
	    level.collisionLayer.visible = false;
	    if(levelToLoad.deathLayer){
	      level.deathLayer = level.tilemap.createLayer(levelToLoad.deathLayer);
	      level.tilemap.setCollisionBetween(0, 3000, true, levelToLoad.deathLayer);
	      level.deathLayer.visible = false;
	    }
	    if(levelToLoad.foregroundLayer){
	      level.foregroundLayer = level.tilemap.createLayer(levelToLoad.foregroundLayer);
	    }
	    level.tilemap.setCollisionBetween(0, 3000, true, levelToLoad.collisionLayer);
	    level.groundLayer.resizeWorld();
	    level.enemies = levelToLoad.enemies;
	    
	    level.entryPoint = levelToLoad.entryPoint;
	    
	    level.bonus = levelToLoad.bonus || [];
	    level.portals = levelToLoad.portals || [];
	    level.platforms = levelToLoad.platforms || [];
	    
	    //level.collisionLayer.debug = true;
	    //level.deathLayer.debug = true;
	    
	    //  parse level json provided objects if given
	    if(levelToLoad.objectsLayer){
	      
	      level.objects.all = level.tilemap.objects[levelToLoad.objectsLayer];
	      // restrucuture as group by object type:
	      var objTypes = level.tilemap.objects[levelToLoad.objectsLayer]
	        .map(function(obj){
	          return obj.type || '';
	        })
	        .reduce(function(types, type){
	          if(types.indexOf(type) < 0){
	            types.push(type);
	          }
	          return types;
	        }, [])
	        .forEach(function(type){
	          level.objects[type] = level.tilemap.objects[levelToLoad.objectsLayer]
	            .filter(function(obj){
	              return obj.type === type;
	            });
	        });
	    }
	  };
	  return level;
	};
	
	// find polyfill...
	if (!Array.prototype.find) {
	  Array.prototype.find = function(predicate) {
	    if (this === null) {
	      throw new TypeError('Array.prototype.find called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;
	
	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return value;
	      }
	    }
	    return undefined;
	  };
	}
	
	module.exports = levelManager;

/***/ },
/* 23 */
/*!*************************************!*\
  !*** ./js/services/enemyManager.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var creatureFactory = __webpack_require__(/*! ../classes/creatureFactory.js */ 3)();
	var Group = __webpack_require__(/*! ../classes/group.js */ 24);
	var util = __webpack_require__(/*! ./util.js */ 25);
	
	
	var enemyManager = function(game, levelEnemies, levelZones){
	  var utils = util(game);
	  
	  var groups = [];
	  var reviveTimers = [];
	
	  // populate enemy groups
	  groups = levelEnemies.map(function(groupConfig){
	    
	    // cache groupConfig as the group props for later use
	    var group = new Group(game, groupConfig);
	    
	    for(var i = 1, max = groupConfig.number; i <= max; i++){
	      var creature = creatureFactory.create(game, groupConfig.type, groupConfig.origin.x, groupConfig.origin.y);
	      creature.setId(groupConfig.type, groupConfig.origin.x, groupConfig.origin.y, i);
	      // override general creature-specific updates
	      if(groupConfig.active !== undefined){
	        creature.props.active = groupConfig.active;
	      }
	      if(groupConfig.onClose && creature[groupConfig.onClose] && typeof creature[groupConfig.onClose] === 'function'){
	        creature.onClose = creature[groupConfig.onClose];
	      }
	      if(groupConfig.onLeave && creature[groupConfig.onLeave] && typeof creature[groupConfig.onLeave] === 'function'){
	        creature.onLeave = creature[groupConfig.onLeave];
	      }
	      group.add(creature);
	    }
	    //group.setAll('props.boundTo', groupConfig.boundTo); 
	    group.setAll('boundTo', groupConfig.boundTo || {});
	    group.setAll('props.lifespan', groupConfig.lifespan); // gotta override the abstract class & instance lifespan too!!
	    group.setAll('lifespan', groupConfig.lifespan);
	    return group;
	  });
	  
	  // start timers to recycle revivable enemy groups
	  reviveTimers = groups
	    .filter(function(group){
	      return group.props.revive;
	    })
	    .map(function(group){
	      var revivables = utils.onEvery(group.props.revive, revive.bind(this, group));
	      return revivables;
	    });
	    
	  function revive(group){
	    var enemyToRevive = group.getFirstDead();
	    if(enemyToRevive){
	      //console.info('[enemyManager] reviving a %s', enemyToRevive.creatureType, enemyToRevive);
	      enemyToRevive.revive(group.props.origin.x, group.props.origin.y);
	    }
	  }
	  
	  
	  return {
	    revive: revive,
	    forEachAlive: function(fn){
	      groups.forEach(function(group){
	        group.forEachAlive(function(creature){
	          if(typeof fn === 'function'){
	            fn.apply(this, arguments);
	          }  
	        });
	      });
	    },
	    population: function(){
	      var zoo = 0;
	      this.forEachAlive(function(){
	        zoo++;
	      });
	      return zoo;
	    }
	  };
	};
	
	module.exports = enemyManager;

/***/ },
/* 24 */
/*!*****************************!*\
  !*** ./js/classes/group.js ***!
  \*****************************/
/***/ function(module, exports) {

	function Group(game, props){
	  Phaser.Group.call(this, game);
	  this.props = props || {};
	}
	
	Group.prototype = Object.create(Phaser.Group.prototype);
	Group.prototype.constructor = Group;
	
	module.exports = Group;

/***/ },
/* 25 */
/*!*****************************!*\
  !*** ./js/services/util.js ***!
  \*****************************/
/***/ function(module, exports) {

	var util = function(game){
	  
	  return {
	    randomPointIn: function(x1, y1, x2, y2){
	      /*
	      var rectangle = new Phaser.Rectangle(x1, y1, x2, y2), 
	          p = new Phaser.Point();
	        return rectangle.random().floor();
	      */
	        return {
	          x: game.rnd.integerInRange(x1, x2),
	          y: game.rnd.integerInRange(y1, y2)
	        }
	    },
	    centerPointIn: function(x1, y1, x2, y2){
	      return {
	        x: x1 + (x2 - x1)/2,
	        y: y1 + (y2 - y1)/2
	      }
	    },
	    randomWorldPoint: function(){
	      return this.randomPointIn(0, 0, game.world.width, game.world.height);
	    },
	    fate: {
	      sometimes: function(){
	        return Math.random() < 0.5;
	      },
	      rarely: function(){
	        return Math.random() < 0.1;
	      },
	      hardly: function(){
	        return Math.random() < 0.05;
	      },
	      hardlyEver: function(){
	        return Math.random() < 0.01;
	      }
	    },
	    debugZone: function(x, y, width, height){
	      var graphics = game.add.graphics(x, y);
	      window.graphics = graphics;
	      graphics.lineStyle(2, 0x0000FF, 1);
	      graphics.drawRect(x, y, width, height);
	    }, 
	    debugRuler: function(){
	      // ruler for showing world x or y coordinates on every i.e. 100pixels
	    },
	    onEvery: function(tickerIntervalMillisec, callback){
	      var ticker = game.time.events.loop(Phaser.Timer.SECOND * 0.001 * tickerIntervalMillisec, callback, this);
	      ticker.timer.start();
	      return ticker;
	  }
	  };
	};
	
	module.exports = util;

/***/ },
/* 26 */
/*!*************************************!*\
  !*** ./js/services/thingManager.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var Thing = __webpack_require__(/*! ../classes/things.js */ 21);
	var Portal = __webpack_require__(/*! ../classes/portal.js */ 27);
	var Platform = __webpack_require__(/*! ../classes/platform.js */ 29);
	var Group = __webpack_require__(/*! ../classes/group.js */ 24);
	
	var thingManager = function(game, thingsToLoad){
	  
	  var things = {
	    bonus: new Group(game),
	    portals: new Group(game),
	    platforms: new Group(game)
	  };
	  
	  thingsToLoad.bonus.forEach(function(bonusConfig){
	    var bonus = new Thing(game, bonusConfig.img, bonusConfig.x, bonusConfig.y);
	    things.bonus.add(bonus);
	  });
	  
	  thingsToLoad.portals.forEach(function(portalConfig){
	    var portal = new Portal(game, portalConfig.jumpTo, portalConfig.x, portalConfig.y);
	    things.portals.add(portal);
	  });
	  
	  thingsToLoad.platforms.forEach(function(platformConfig){
	    var platform = new Platform(game, platformConfig.img, platformConfig.x, platformConfig.y, platformConfig);
	    things.platforms.add(platform);
	  });
	  
	  return things;
	};
	
	module.exports = thingManager;

/***/ },
/* 27 */
/*!******************************!*\
  !*** ./js/classes/portal.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../configs/assetMap.js */ 28);
	
	var Portal = function(game, jumpTo, x, y){
	  
	  this.jumpTo = jumpTo;
	  
	  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.frameName = atlas.PORTAL_LEVEL_GO;
	  this.anchor.setTo(0.5, 0.5);
	  game.add.existing(this);
	  
	  
	  this.update = function(){
	
	  }
	};
	
	Portal.prototype = Object.create(Phaser.Sprite.prototype);
	Portal.prototype.constructor = Portal;
	
	module.exports = Portal;

/***/ },
/* 28 */
/*!********************************!*\
  !*** ./js/configs/assetMap.js ***!
  \********************************/
/***/ function(module, exports) {

	var assetMap = {
	  key0: "0",
	  key1: "1",
	  key2: "2",
	  key3: "3",
	  key4: "4",
	  key5: "5",
	  key6: "6",
	  key7: "7",
	  key8: "8",
	  key9: "9",
	  key10: "10",
	  key11: "11",
	  key12: "12",
	  key13: "13",
	  key14: "14",
	  key15: "15",
	  key16: "16",
	  key17: "17",
	  key18: "18",
	  key19: "19",
	  key20: "20",
	  key21: "21",
	  key22: "22",
	  key23: "23",
	  key24: "24",
	  key25: "25",
	  key26: "26",
	  key27: "27",
	  key28: "28",
	  key29: "29",
	  key30: "30",
	  key31: "31",
	  key32: "32",
	  key33: "33",
	  key34: "34",
	  key35: "35",
	  key36: "36",
	  key37: "37",
	  key38: "38",
	  key39: "39",
	  key40: "40",
	  key41: "41",
	  key42: "42",
	  key43: "43",
	  key44: "44",
	  key45: "45",
	  key46: "46",
	  key47: "47",
	  key48: "48",
	  key49: "49",
	  key50: "50",
	  key51: "51",
	  key52: "52",
	  key53: "53",
	  SCORE_100: "54",
	  key55: "55",
	  SCORE_200: "56",
	  key57: "57",
	  SCORE_300: "58",
	  key59: "59",
	  SCORE_500: "60",
	  key61: "61",
	  key62: "62",
	  SCORE_600: "63",
	  key64: "64",
	  key65: "65",
	  SCORE_700: "66",
	  key67: "67",
	  key68: "68",
	  SCORE_750: "69",
	  key70: "70",
	  key71: "71",
	  SCORE_800: "72",
	  SCORE_1000: "73",
	  key74: "74",
	  key75: "75",
	  SCORE_2000: "76",
	  WEAPON_AXE_SMALL: "77",
	  SCORE_5000: "78",
	  key79: "79",
	  key80: "80",
	  SCORE_8000: "81",
	  key82: "82",
	  key83: "83",
	  key84: "84",
	  key85: "85",
	  key86: "86",
	  key87: "87",
	  SCORE_60000: "88",
	  key89: "89",
	  SCORE_100000: "90",
	  key91: "91",
	  key92: "92",
	  key93: "93",
	  key94: "94",
	  key95: "95",
	  key96: "96",
	  key97: "97",
	  key98: "98",
	  key99: "99",
	  key100: "100",
	  BONUS_BIG_ICECREAM: "101",
	  WEAPON_AXE: "102",
	  BONUS_BIG_BANANA: "103",
	  key104: "104",
	  key105: "105",
	  BONUS_BIG_MCDONALDS: "106",
	  PORTAL_KEY: "107",
	  key108: "108",
	  key109: "109",
	  SCORE_10000: "110",
	  key111: "111",
	  SCORE_20000: "112",
	  key113: "113",
	  key114: "114",
	  SCORE_30000: "115",
	  key116: "116",
	  key117: "117",
	  key118: "118",
	  key119: "119",
	  key120: "120",
	  key121: "121",
	  key122: "122",
	  key123: "123",
	  key124: "124",
	  key125: "125",
	  key126: "126",
	  key127: "127",
	  BONUS_PINEAPPLE: "128",
	  key129: "129",
	  key130: "130",
	  key131: "131",
	  key132: "132",
	  key133: "133",
	  key134: "134",
	  key135: "135",
	  BONUS_FRIDGE: "136",
	  key137: "137",
	  key138: "138",
	  key139: "139",
	  key140: "140",
	  key141: "141",
	  key142: "142",
	  key143: "143",
	  key144: "144",
	  key145: "145",
	  key146: "146",
	  key147: "147",
	  key148: "148",
	  key149: "149",
	  key150: "150",
	  key151: "151",
	  key152: "152",
	  key153: "153",
	  key154: "154",
	  key155: "155",
	  key156: "156",
	  BONUS_CHICKEN: "157",
	  key158: "158",
	  key159: "159",
	  key160: "160",
	  key161: "161",
	  key162: "162",
	  key163: "163",
	  key164: "164",
	  key165: "165",
	  key166: "166",
	  key167: "167",
	  key168: "168",
	  key169: "169",
	  key170: "170",
	  key171: "171",
	  key172: "172",
	  key173: "173",
	  key174: "174",
	  key175: "175",
	  key176: "176",
	  key177: "177",
	  BONUS_SUITCASE: "178",
	  key179: "179",
	  key180: "180",
	  key181: "181",
	  key182: "182",
	  key183: "183",
	  key184: "184",
	  key185: "185",
	  key186: "186",
	  key187: "187",
	  key188: "188",
	  key189: "189",
	  key190: "190",
	  key191: "191",
	  key192: "192",
	  key193: "193",
	  key194: "194",
	  key195: "195",
	  key196: "196",
	  key197: "197",
	  key198: "198",
	  key199: "199",
	  key200: "200",
	  key201: "201",
	  key202: "202",
	  key203: "203",
	  key204: "204",
	  key205: "205",
	  key206: "206",
	  key207: "207",
	  key208: "208",
	  key209: "209",
	  key210: "210",
	  key211: "211",
	  key212: "212",
	  key213: "213",
	  key214: "214",
	  key215: "215",
	  key216: "216",
	  key217: "217",
	  key218: "218",
	  key219: "219",
	  key220: "220",
	  key221: "221",
	  TEXT_SUPER: "222",
	  key223: "223",
	  TEXT_YEAH: "224",
	  key225: "225",
	  key226: "226",
	  PLATFORM_BRIDGE: "227",
	  key228: "228",
	  key229: "229",
	  key230: "230",
	  key231: "231",
	  key232: "232",
	  key233: "233",
	  key234: "234",
	  key235: "235",
	  BONUS_SKULL_BIG: "236",
	  key237: "237",
	  key238: "238",
	  key239: "239",
	  key240: "240",
	  key241: "241",
	  ALPHABET_QUESTION_MARK: "242",
	  ALPHABET_O: "243",
	  ALPHABET_EXCLAMATION_MARK: "244",
	  key245: "245",
	  ALPHABET_A: "246",
	  ALPHABET_P: "247",
	  ALPHABET_DOT: "248",
	  ALPHABET_B: "249",
	  ALPHABET_Q: "250",
	  ALPHABET_COMMA: "251",
	  ALPHABET_C: "252",
	  ALPHABET_R: "253",
	  key254: "254",
	  ALPHABET_D: "255",
	  ALPHABET_S: "256",
	  ALPHABET_E: "257",
	  ALPHABET_T: "258",
	  ALPHABET_U: "259",
	  ALPHABET_F: "260",
	  ALPHABET_G: "261",
	  ALPHABET_V: "262",
	  ALPHABET_H: "263",
	  ALPHABET_W: "264",
	  ALPHABET_I: "265",
	  ALPHABET_J: "266",
	  ALPHABET_Y: "267",
	  ALPHABET_K: "268",
	  ALPHABET_Z: "269",
	  ALPHABET_L: "270",
	  key271: "271",
	  key272: "272",
	  key273: "273",
	  ALPHABET_M: "274",
	  ALPHABET_COLON: "275",
	  NUMBER_0: "276",
	  key277: "277",
	  key278: "278",
	  key279: "279",
	  key280: "280",
	  PORTAL_SMALL_GO: "281",
	  PORTAL_SMALL_STOP: "282",
	  TEXT_PASS: "283",
	  PLATFORM_ICE: "284",
	  NUMBER_1: "285",
	  NUMBER_2: "286",
	  key287: "287",
	  NUMBER_3: "288",
	  key289: "289",
	  NUMBER_4: "290",
	  key291: "291",
	  key292: "292",
	  key293: "293",
	  NUMBER_5: "294",
	  key295: "295",
	  PLATFORM_ICE_BIG: "296",
	  NUMBER_7: "297",
	  PLATFORM_WOOD: "298",
	  key299: "299",
	  NUMBER_8: "300",
	  key301: "301",
	  key302: "302",
	  NUMBER_9: "303",
	  PLATFORM_DEATH: "304",
	  key305: "305",
	  key306: "306",
	  key307: "307",
	  PORTAL_LEVEL_STOP: "308",
	  key309: "309",
	  PORTAL_LEVEL_GO: "310",
	  key311: "311",
	  key312: "312",
	  key313: "313",
	  key314: "314",
	  PORTAL_LEVEL_GENERAL: "315",
	  key316: "316",
	  key317: "317",
	  key318: "318",
	  key319: "319",
	  key320: "320",
	  key321: "321",
	  key322: "322",
	  key323: "323",
	  key324: "324",
	  key325: "325",
	  key326: "326",
	  key327: "327",
	  key328: "328",
	  key329: "329",
	  key330: "330",
	  key331: "331",
	  key332: "332",
	  key333: "333",
	  key334: "334",
	  key335: "335",
	  key336: "336",
	  key337: "337",
	  key338: "338",
	  key339: "339",
	  key340: "340",
	  key341: "341",
	  key342: "342",
	  key343: "343",
	  key344: "344",
	  key345: "345",
	  key346: "346",
	  key347: "347",
	  key348: "348",
	  key349: "349",
	  key350: "350",
	  key351: "351",
	  key352: "352",
	  key353: "353",
	  key354: "354",
	  key355: "355",
	  key356: "356",
	  key357: "357",
	  key358: "358",
	  key359: "359",
	  key360: "360",
	  key361: "361",
	  key362: "362",
	  key363: "363",
	  key364: "364",
	  key365: "365",
	  key366: "366",
	  key367: "367",
	  key368: "368",
	  key369: "369",
	  key370: "370",
	  key371: "371",
	  key372: "372",
	  key373: "373",
	  key374: "374",
	  key375: "375",
	  key376: "376",
	  key377: "377",
	  key378: "378",
	  key379: "379",
	  key380: "380",
	  key381: "381",
	  key382: "382",
	  key383: "383",
	  key384: "384",
	  key385: "385",
	  key386: "386",
	  key387: "387",
	  key388: "388",
	  key389: "389",
	  key390: "390",
	  key391: "391",
	  key392: "392",
	  key393: "393",
	  key394: "394",
	  key395: "395",
	  key396: "396",
	  key397: "397",
	  key398: "398",
	  key399: "399",
	  key400: "400",
	  key401: "401",
	  key402: "402",
	  key403: "403",
	  key404: "404",
	  key405: "405",
	  key406: "406",
	  key407: "407",
	  key408: "408",
	  key409: "409",
	  key410: "410",
	  key411: "411",
	  key412: "412",
	  key413: "413",
	  key414: "414",
	  key415: "415",
	  key416: "416",
	  key417: "417",
	  key418: "418",
	  key419: "419",
	  key420: "420",
	  key421: "421",
	  key422: "422",
	  key423: "423",
	  key424: "424",
	  key425: "425",
	  key426: "426",
	  key427: "427",
	  key428: "428",
	  key429: "429",
	  key430: "430",
	  key431: "431",
	  key432: "432",
	  key433: "433",
	  key434: "434",
	  key435: "435",
	  key436: "436",
	  key437: "437",
	  key438: "438",
	  key439: "439",
	  key440: "440",
	  key441: "441",
	  key442: "442",
	  key443: "443",
	  key444: "444",
	  key445: "445",
	  key446: "446",
	  key447: "447",
	  key448: "448",
	  key449: "449",
	  key450: "450",
	  key451: "451",
	  key452: "452",
	  key453: "453",
	  key454: "454",
	  key455: "455",
	  key456: "456",
	  key457: "457",
	  key458: "458",
	  key459: "459",
	  key460: "460",
	  key461: "461",
	  key462: "462",
	  key463: "463",
	  key464: "464",
	  key465: "465",
	  key466: "466",
	  ALPHABET_N: "467",
	  NUMBER_6: "468",
	  ALPHABET_X: "469",
	  key470: "470"
	};
	
	module.exports = assetMap;

/***/ },
/* 29 */
/*!********************************!*\
  !*** ./js/classes/platform.js ***!
  \********************************/
/***/ function(module, exports) {

	var Platform = function(game, platformImage, x, y, props){
	  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  
	  this.frameName = platformImage;
	  this.props = props;
	  
	  this.stepped = {
	    on: false,
	    prev: false
	  };
	
	  this.props.prevPosition = {
	    x: this.x,
	    y: this.y,
	    dx: 0,
	    dy: 0
	  };
	  
	  this.body.gravity.y = 500;
	  this.body.immovable = true;
	  this.body.moves = false;
	  this.anchor.setTo(0.5, 0.5);
	  game.add.existing(this);
	  
	  if(this.props.behaviour === 'shuttle'){
	    this.shuttle({ x: this.props.moveTo.x, 
	                   y: this.props.moveTo.y },
	                 { x: this.props.x, 
	                   y: this.props.y }, 
	                 this.props.moveTo.timeout, 
	                 Phaser.Easing[this.props.moveTo.easing].InOut);
	  }
	  
	  this.update = function(){
	    // tweening object doesnt have body.velocity so we have to manually calculate:
	    this.props.prevPosition.dx = this.x - this.props.prevPosition.x;
	    this.props.prevPosition.dy = this.y - this.props.prevPosition.y;
	    this.props.prevPosition.x = this.x;
	    this.props.prevPosition.y = this.y;
	    
	    // one-off step-on step-off 'events' !== onStand
	    if(this.stepped.on && !this.stepped.prev){
	      this.onSteppedOn();
	    }
	    if(!this.stepped.on && this.stepped.prev){
	      this.onSteppedOff();
	    }
	  };
	};
	
	Platform.prototype = Object.create(Phaser.Sprite.prototype);
	Platform.prototype.constructor = Platform;
	
	Platform.prototype.onSteppedOn = function onSteppedOn(stander, platform){
	  if(this.props.behaviour === 'moveTo'){
	    this.props.tween1 = this.moveTo({ x: (this.props.moveTo.x || this.x), 
	                                      y: (this.props.moveTo.y || this.y) }, 
	                                      this.props.moveTo.timeout, 
	                                      Phaser.Easing[this.props.moveTo.easing].InOut);
	  }
	  
	  if(this.props.behaviour === 'fall'){
	    this.game.time.events.add(Phaser.Timer.SECOND * this.props.fallTimeout * 0.001, function(){
	      this.fall();
	    }, this);
	    this.game.time.events.add(Phaser.Timer.SECOND * this.props.restoreTimeout * 0.001, function(){
	      this.restore();
	    }, this);
	  }
	};
	
	Platform.prototype.onSteppedOff = function onSteppedOff(stander, platform){
	
	};
	
	Platform.prototype.onStand = function onStand(stander, platform){
	  // corrigation of standing sprite: if not, the platform move out of his feet
	  // stander.x = platform.x is not good enough, creates sticky platform
	  stander.x += platform.props.prevPosition.dx;
	  stander.y += platform.props.prevPosition.dy;
	};
	
	Platform.prototype.fall = function fall(){
	  this.immovable = false;
	  this.body.moves = true;
	  this.allowGravity = true;
	};
	
	Platform.prototype.restore = function restore(){
	  this.immovable = true;
	  this.body.moves = false;
	  this.allowGravity = false;
	  this.game.add.tween(this).to({ x: this.props.x, y: this.props.y }, 1000, Phaser.Easing.Linear.In);
	};
	
	Platform.prototype.moveTo = function moveTo(tweenTo, timeout, easing){
	  this.game.add.tween(this).to(tweenTo, timeout, easing);
	};
	
	Platform.prototype.shuttle = function shuttle(tween1, tween2, timeout, easing){
	  this.props.tween1 = this.game.add.tween(this).to(tween1, timeout, easing);
	  this.props.tween2 = this.game.add.tween(this).to(tween2, timeout, easing);
	  
	  this.props.tween1.chain(this.props.tween2);
	  this.props.tween2.chain(this.props.tween1);
	  this.props.tween1.start();
	};
	
	module.exports = Platform;

/***/ },
/* 30 */
/*!************************************!*\
  !*** ./js/services/menuManager.js ***!
  \************************************/
/***/ function(module, exports) {

	var Menu = function(game, man){
	  
	  var lives, 
	      livesCount,
	      hearts, 
	      score;
	      
	  livesCount = game.add.text(20, 20, Math.floor(man.health() / 4), { font: "16px Arial", fill: "#ffffff" });
	  livesCount.fixedToCamera = true;
	  
	  lives = game.add.sprite(30, 20, 'lives');
	  lives.fixedToCamera = true;
	  lives.frame = 0;
	  
	  hearts = game.add.group();
	  for(var i=0;i<3;i++){
	    var heart = game.add.sprite(60 + i * 20, 20, 'lives');
	    heart.fixedToCamera = true;
	    heart.frame = 1;
	    hearts.add(heart);
	  }
	
	  return {
	    listen: function(subject, onEventCallback){
	      subject.noise.add(onEventCallback, this);
	    },
	    update: function(evt){
	      if(evt.event === 'hurt'){
	        var actualHeart = evt.args.livesLeft % 4 - 1;
	        hearts.children.forEach(function(heart, i){
	          if(i >= actualHeart){
	            heart.visible = false;
	          }
	        });
	      }
	    }
	  };
	};
	
	module.exports = Menu;

/***/ },
/* 31 */
/*!************************************!*\
  !*** ./js/configs/levelConfigs.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var level1 = __webpack_require__(/*! ./levelConfigs/level1.js */ 32);
	var level2 = __webpack_require__(/*! ./levelConfigs/level2.js */ 33);
	var level3 = __webpack_require__(/*! ./levelConfigs/level3.js */ 34);
	var level4 = __webpack_require__(/*! ./levelConfigs/level-downfall-rifts.js */ 35);
	var level5 = __webpack_require__(/*! ./levelConfigs/level-great-abyss.js */ 36);
	var level6 = __webpack_require__(/*! ./levelConfigs/level-green-hell.js */ 37);
	var level7 = __webpack_require__(/*! ./levelConfigs/level-into-the-woods.js */ 38);
	var level8 = __webpack_require__(/*! ./levelConfigs/level-hall-of-ages.js */ 39);
	var level9 = __webpack_require__(/*! ./levelConfigs/level-mosquito-falls.js */ 40);
	var level10 = __webpack_require__(/*! ./levelConfigs/level-stairway-from-heaven.js */ 41);
	
	var levelConfigs = [
	  level1,
	  level2,
	  level3, 
	  level4,
	  level5,
	  level6,
	  level7,
	  level8,
	  level9,
	  level10
	];
	
	module.exports = levelConfigs;

/***/ },
/* 32 */
/*!*******************************************!*\
  !*** ./js/configs/levelConfigs/level1.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level1 = {
	  id: 1,
	  tileset: 'tileset-level-1',
	  tilemap: 'tilemap-level-1',
	  tiledJson: '78x23', 
	  tilesetImage: 'level-1-transparent',
	  backgroundImage: 'bg1seamless',
	  width: 78 * 16,
	  height: 23 * 16,
	  backgroundLayer: 'background-1',
	  fixedBackground: true, // this can be false also as seamless background, though it makes the game much slower :(
	  groundLayer: 'ground-layer',
	  collisionLayer: 'collision-layer',
	  deathLayer: null,
	  objectsLayer: 'objects-layer', 
	  entryPoint: {
	    x: 200, 
	    y: 50
	  },
	  portals: [
	    {
	      jumpTo: 3,
	      x: 1121,
	      y: 132
	    }  
	  ],
	  enemies: [
	    {
	      type: 'bear',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 130,
	        y: 270
	      },
	      boundTo: {
	        x1: 0,
	        x2: 200
	      }
	    },
	    {
	      type: 'bear',
	      number: 1,
	      lifespan: 10000,
	      revive: 5000,
	      origin: {
	        x: 90,
	        y: 260
	      },
	      boundTo: {
	        x1: 200,
	        x2: 400
	      }
	    },
	    {
	      type: 'dino',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 682,
	        y: 279
	      },
	      boundTo: {
	        x1: 682,
	        x2: 788
	      }
	    },
	    {
	      type: 'ptero',
	      number: 2,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: { }
	    },
	    {
	      type: 'dragonfly',
	      number: 2,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 800,
	        y: 130
	      },
	      boundTo: { }
	    },
	    {
	      type: 'spider',
	      number: 2,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 44,
	        y: 198
	      },
	      boundTo: {
	        x1: 44,
	        x2: 102
	      }
	    },
	    {
	      type: 'native',
	      number: 2,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 470,
	        y: 30
	      },
	      boundTo: {
	        x1: 408,
	        x2: 534
	      }
	    }
	  ]
	};
	
	module.exports = level1;

/***/ },
/* 33 */
/*!*******************************************!*\
  !*** ./js/configs/levelConfigs/level2.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level2 = {
	  id: 2,
	  tileset: 'tileset-level-2',
	  tilemap: 'tilemap-level-2',
	  tiledJson: '49x100-old', 
	  tilesetImage: 'tileset2',
	  backgroundImage: 'bg3seamless',
	  width: 49 * 16,
	  height: 100 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  collisionLayer: 'collision-layer',
	  deathLayer: null,
	  objectsLayer: null, 
	  entryPoint: {
	    x: 200, 
	    y: 50
	  },
	  enemies: [
	    {
	      type: 'bear',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    },
	    {
	      type: 'dino',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    },
	    {
	      type: 'ptero',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    },
	    {
	      type: 'dragonfly',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    },
	    {
	      type: 'spider',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    },
	    {
	      type: 'native',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 200,
	        y: 200
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    }
	  ]
	};
	
	module.exports = level2;

/***/ },
/* 34 */
/*!*******************************************!*\
  !*** ./js/configs/levelConfigs/level3.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level3 = {
	  id: 'heights',
	  tileset: 'tileset-level-heights',
	  tilemap: 'tilemap-level-heights',
	  tiledJson: '49x100', 
	  tilesetImage: 'tileset1_2',
	  backgroundImage: 'bg3seamless',
	  width: 49 * 16,
	  height: 100 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  objectsLayer: 'objects-layer', 
	  entryPoint: {
	    x: 285, 
	    y: 206
	  },
	  portals: [
	    {
	      jumpTo: 4,
	      x: 761,
	      y: 1290
	    }  
	  ],
	  enemies: [
	    {
	      type: 'bear', // 1-2 bears constantly run through the view
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 344,
	        y: 277
	      },
	      boundTo: {
	        x1: 344,
	        x2: 404
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 10,
	        y: 10
	      },
	      boundTo: {
	        x: 101,
	        y: 158
	      }
	    },
	    {
	      type: 'spider', // spiders coming from a cave frequently
	      number: 1,
	      lifespan: 10000,
	      revive: 10000,
	      origin: {
	        x: 10,
	        y: 10
	      },
	      boundTo: {
	        x1: Infinity,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'dino', // a guard dino standing waiting
	      number: 1,
	      lifespan: 8000,
	      revive: 5000,
	      origin: {
	        x: 94,
	        y: 156
	      },
	      boundTo: {
	        x1: 8,  // stays between x1 x2 zone
	        x2: 94
	      }
	    }
	  ]
	};
	
	module.exports = level3;

/***/ },
/* 35 */
/*!*********************************************************!*\
  !*** ./js/configs/levelConfigs/level-downfall-rifts.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'downfall-rifts',
	  tileset: 'tileset-level-downfall-rifts',
	  tilemap: 'tilemap-level-downfall-rifts',
	  tiledJson: 'L2v1', 
	  tilesetImage: 'L2_bank',
	  backgroundImage: 'bg3seamless',
	  width: 100 * 16,
	  height: 50 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true, 
	  groundLayer: 'ground-layer',
	  foregroundLayer: 'foreground-layer',
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 23, 
	    y: 364
	  },
	  portals: [
	    {
	      jumpTo: 'into-the-woods',
	      x: 1569,
	      y: 139
	    }  
	  ],
	  platforms: [],
	  bonus: [
	    {
	      img: atlas.ALPHABET_Z,
	      x: 448,
	      y: 196
	    },
	    {
	      img: atlas.ALPHABET_O,
	      x: 458,
	      y: 193
	    },
	    {
	      img: atlas.ALPHABET_O,
	      x: 468,
	      y: 195
	    },
	    {
	      img: atlas.ALPHABET_EXCLAMATION_MARK,
	      x: 478,
	      y: 196
	    },
	    {
	      img: atlas.BONUS_BIG_MCDONALDS,
	      x: 86,
	      y: 250
	    },
	    {
	      img: atlas.BONUS_BIG_BANANA,
	      x: 147,
	      y: 216
	    },
	    {
	      img: atlas.BONUS_BIG_ICECREAM,
	      x: 209,
	      y: 250
	    },
	    {
	      img: atlas.BONUS_CHICKEN,
	      x: 984,
	      y: 237
	    }
	  ],
	  enemies: [
	    {
	      type: 'spider', 
	      number: 1,
	      lifespan: 40000,
	      revive: 5000,
	      origin: {
	        x: 513,
	        y: 225
	      },
	      boundTo: {
	        x1: 0,
	        x2: 0
	      }
	    },
	    {
	      type: 'spider', 
	      number: 1,
	      lifespan: 40000,
	      revive: 10000,
	      origin: {
	        x: 1,
	        y: 1
	      },
	      boundTo: {
	        x1: 0,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'spider', 
	      number: 1,
	      lifespan: 10000,
	      revive: 10000,
	      origin: {
	        x: 436,
	        y: 555
	      },
	      boundTo: {
	        x1: 0,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'spider', 
	      number: 1,
	      lifespan: 10000,
	      revive: 10000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 611,
	        y: 496
	      },
	      boundTo: {
	        x1: 0,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'dino', 
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 925,
	        y: 300
	      },
	      boundTo: {
	        x1: 0,  
	        x2: 925
	      }
	    }, 
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1400,
	        y: 178
	      },
	      boundTo: {
	        x1: 1400,
	        x2: 1535
	      }
	    },
	    {
	      type: 'ptero',
	      number: 2,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 1130,
	        y: 216
	      },
	      boundTo: {
	        x: Infinity,
	        y: Infinity
	      }
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 56,
	        y: 364
	      },
	      boundTo: {
	        x1: 56,
	        x2: 1200
	      }
	    },
	    {
	      type: 'bear',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 1037,
	        y: 532
	      },
	      boundTo: {
	        x1: 1037,
	        x2: 1358
	      }
	    },
	    {
	      type: 'parrot',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 1204,
	        y: 216
	      },
	      boundTo: {
	        x1: 1204,
	        x2: 1532
	      }
	    },
	    {
	      type: 'frog',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 55,
	        y: 663
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 4000,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 307,
	        y: 541
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'turtle',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 764,
	        y: 301
	      },
	      boundTo: {
	        x1: 764,
	        x2: 1003
	      }
	    },
	    {
	      type: 'insect',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 533,
	        y: 311
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'bug',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 533,
	        y: 311
	      },
	      boundTo: {
	        
	      }
	    }
	  ]
	};
	
	module.exports = level;

/***/ },
/* 36 */
/*!******************************************************!*\
  !*** ./js/configs/levelConfigs/level-great-abyss.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'great-abyss',
	  tileset: 'tileset-level-great-abyss',
	  tilemap: 'tilemap-level-great-abyss',
	  tiledJson: 'L1v4', 
	  tilesetImage: 'L1',
	  backgroundImage: 'bg1seamless',
	  width: 100 * 16,
	  height: 100 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  foregroundLayer: 'foreground-layer',
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 274, 
	    y: 73
	  },
	  portals: [
	    {
	      jumpTo: 'downfall-rifts',
	      x: 470,
	      y: 60
	    }  
	  ],
	  platforms: [
	    {
	      img: atlas.PLATFORM_BRIDGE,
	      behaviour: 'shuttle', // null, fall, moveTo, shuttle
	      x: 260,
	      y: 1445,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 260,
	        y: 572,
	        timeout: 10000,
	        easing: 'Cubic'
	      }
	    }  
	  ],
	  bonus: [
	    {
	      img: atlas.ALPHABET_W,
	      x: 60,
	      y: 290
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 80,
	      y: 293
	    },
	    {
	      img: atlas.ALPHABET_L,
	      x: 100,
	      y: 291
	    },
	    {
	      img: atlas.ALPHABET_C,
	      x: 120,
	      y: 288
	    },
	    {
	      img: atlas.ALPHABET_O,
	      x: 140,
	      y: 290
	    },
	    {
	      img: atlas.ALPHABET_M,
	      x: 160,
	      y: 292
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 180,
	      y: 294
	    },
	    {
	      img: atlas.ALPHABET_T,
	      x: 60,
	      y: 315
	    },
	    {
	      img: atlas.ALPHABET_O,
	      x: 80,
	      y: 313
	    },
	    {
	      img: atlas.ALPHABET_T,
	      x: 120,
	      y: 316
	    },
	    {
	      img: atlas.ALPHABET_H,
	      x: 140,
	      y: 317
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 160,
	      y: 315
	    },
	    {
	      img: atlas.ALPHABET_A,
	      x: 60,
	      y: 335
	    },
	    {
	      img: atlas.ALPHABET_B,
	      x: 80,
	      y: 340
	    },
	    {
	      img: atlas.ALPHABET_Y,
	      x: 100,
	      y: 340
	    },
	    {
	      img: atlas.ALPHABET_S,
	      x: 120,
	      y: 345
	    },
	    {
	      img: atlas.ALPHABET_S,
	      x: 140,
	      y: 340
	    },
	    {
	      img: atlas.ALPHABET_DOT,
	      x: 160,
	      y: 345
	    },
	    {
	      img: atlas.ALPHABET_DOT,
	      x: 170,
	      y: 346
	    },
	    {
	      img: atlas.ALPHABET_DOT,
	      x: 180,
	      y: 345
	    },
	    {
	      img: atlas.PORTAL_SMALL_STOP,
	      x: 1531,
	      y: 990
	    },
	    {
	      img: atlas.ALPHABET_U,
	      x: 1531,
	      y: 1015
	    },
	    {
	      img: atlas.ALPHABET_P,
	      x: 1545,
	      y: 1016
	    },
	    {
	      img: atlas.ALPHABET_EXCLAMATION_MARK,
	      x: 1560,
	      y: 1017
	    },
	    {
	      img: atlas.ALPHABET_U,
	      x: 1531,
	      y: 1035
	    },
	    {
	      img: atlas.ALPHABET_P,
	      x: 1545,
	      y: 1036
	    },
	    {
	      img: atlas.ALPHABET_EXCLAMATION_MARK,
	      x: 1560,
	      y: 1037
	    },
	    {
	      img: atlas.BONUS_SKULL_BIG,
	      x: 277,
	      y: 34
	    },
	    {
	      img: atlas.WEAPON_AXE,
	      x: 533,
	      y: 1278
	    }
	  ],
	  enemies: [
	    {
	      type: 'dino', 
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 13,
	        y: 179
	      },
	      boundTo: {
	        
	      }
	    },
	    {
	      type: 'insect',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 248,
	        y: 1533
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 4000,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 402,
	        y: 1377
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 472,
	        y: 222
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 767,
	        y: 1300
	      },
	      boundTo: {
	        x1: 767,
	        x2: 882
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1000,
	        y: 1263
	      },
	      boundTo: {
	        x1: 1000,
	        x2: 1060
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1173,
	        y: 1212
	      },
	      boundTo: {
	        x1: 1173,
	        x2: 1240
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1398,
	        y: 1181
	      },
	      boundTo: {
	        x1: 1398,
	        x2: 1455
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 10000,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 842,
	        y: 970
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 816,
	        y: 967
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'frog',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 228,
	        y: 853
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 15000,
	      revive: 1000,
	      origin: {
	        x: 1460,
	        y: 632
	      },
	      boundTo: {}
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 20000,
	      revive: 3000,
	      origin: {
	        x: 937,
	        y: 632
	      },
	      boundTo: {}
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      origin: {
	        x: 913,
	        y: 632
	      },
	      boundTo: {}
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 253,
	        y: 927
	      },
	      boundTo: {
	        x1: 253,
	        x2: 750
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 786,
	        y: 462
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 891,
	        y: 432
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 1088,
	        y: 478
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 1200,
	        y: 490
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 993,
	        y: 488
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bug',
	      number: 3,
	      lifespan: Infinity,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 860,
	        y: 166
	      },
	      boundTo: {
	        
	      }
	    },
	    {
	      type: 'ptero',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 513,
	        y: 93
	      },
	      boundTo: {
	        x1: 513,
	        y1: 93,
	        x2: 860,
	        y2: 100
	      }
	    }
	  ]
	};
	
	module.exports = level;

/***/ },
/* 37 */
/*!*****************************************************!*\
  !*** ./js/configs/levelConfigs/level-green-hell.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'green-hell',
	  tileset: 'tileset-level-green-hell',
	  tilemap: 'tilemap-level-green-hell',
	  tiledJson: 'L5greenv1', 
	  tilesetImage: 'L5_green',
	  backgroundImage: 'forest-green',
	  width: 48 * 16,
	  height: 26 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  foregroundLayer: null,
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 749, 
	    y: 87
	  },
	  portals: [
	    
	  ],
	  bonus: [
	    {
	      img: atlas.WEAPON_AXE,
	      x: 675,
	      y: 99
	    },
	    {
	      img: atlas.BONUS_PINEAPPLE,
	      x: 573,
	      y: 52
	    },
	    {
	      img: atlas.BONUS_SUITCASE,
	      x: 397,
	      y: 116
	    }
	  ],
	  enemies: [
	    {
	      type: 'tiger', 
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 282,
	        y: 219
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'dino', 
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 536,
	        y: 178
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 10000,
	      revive: 1000,
	      origin: {
	        x: 328,
	        y: 69
	      },
	      boundTo: {
	        x1: 0,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 8000,
	      revive: 1200,
	      origin: {
	        x: 536,
	        y: 88
	      },
	      boundTo: {
	        x1: 0,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'ptero',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 161,
	        y: 221
	      },
	      boundTo: {
	        x1: 161,
	        x2: 750
	      }
	    },
	    {
	      type: 'bat',
	      active: false,
	      number: 1,
	      lifespan: 7000,
	      revive: 5000,
	      origin: {
	        x: 116,
	        y: 49
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 1000,
	      origin: {
	        x: 143,
	        y: 226
	      },
	      boundTo: {
	        x1: 183,
	        x2: 484
	      }
	    }
	  ]
	};
	
	module.exports = level;

/***/ },
/* 38 */
/*!*********************************************************!*\
  !*** ./js/configs/levelConfigs/level-into-the-woods.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'into-the-woods',
	  tileset: 'tileset-level-into-the-woods',
	  tilemap: 'tilemap-level-into-the-woods',
	  tiledJson: 'L5v1', 
	  tilesetImage: 'L5',
	  backgroundImage: 'forest-pink',
	  width: 55 * 16,
	  height: 33 * 16,
	  maxHeight: 350,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  foregroundLayer: null,
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 147, 
	    y: 187
	  },
	  portals: [
	    {
	      jumpTo: 'hall-of-ages',
	      x: 397,
	      y: 432
	    }
	  ],
	  platforms: [
	    {
	      img: atlas.PLATFORM_WOOD,
	      behaviour: 'shuttle', // null, fall, moveTo, shuttle
	      x: 706,
	      y: 214,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 177,
	        y: 214,
	        timeout: 10000,
	        easing: 'Cubic'
	      }
	    },
	    {
	      img: atlas.PLATFORM_WOOD,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 626,
	      y: 386,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 177,
	        y: 214,
	        timeout: 10000,
	        easing: 'Cubic'
	      }
	    },
	    {
	      img: atlas.PLATFORM_WOOD,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 232,
	      y: 273,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 177,
	        y: 214,
	        timeout: 10000,
	        easing: 'Cubic'
	      }
	    },
	    {
	      img: atlas.PLATFORM_WOOD,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 684,
	      y: 298,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 177,
	        y: 214,
	        timeout: 10000,
	        easing: 'Cubic'
	      }
	    }
	  ],
	  bonus: [
	    
	  ],
	  enemies: [
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 321,
	        y: 248
	      },
	      boundTo: {
	        x1: 321,
	        x2: 518
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 400,
	        y: 113
	      },
	      boundTo: {
	        x1: 400,
	        x2: 523
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 736,
	        y: 112
	      },
	      boundTo: {
	        x1: 736,
	        x2: 862
	      }
	    },
	    {
	      type: 'ptero',
	      number: 1,
	      lifespan: Infinity,
	      revive: 1000,
	      origin: {
	        x: 864,
	        y: 4
	      },
	      boundTo: {
	
	      }
	    }
	  ]
	};
	
	module.exports = level;

/***/ },
/* 39 */
/*!*******************************************************!*\
  !*** ./js/configs/levelConfigs/level-hall-of-ages.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'hall-of-ages',
	  tileset: 'tileset-level-hall-of-ages',
	  tilemap: 'tilemap-level-hall-of-ages',
	  tiledJson: 'L8v1', 
	  tilesetImage: 'L8',
	  backgroundImage: 'cave',
	  width: 300 * 16,
	  height: 20 * 16,
	  maxHeight: 20 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  foregroundLayer: null,
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 147, 
	    y: 187
	  },
	  portals: [
	    {
	      jumpTo: 'green-hell',
	      x: 855,
	      y: 275
	    },
	    {
	      jumpTo: 'into-the-woods',
	      x: 4464,
	      y: 260
	    },
	    {
	      jumpTo: 'great-abyss',
	      x: 4771,
	      y: 74
	    },
	    {
	      jumpTo: 'downfall-rifts',
	      x: 3690,
	      y: 255
	    }
	  ],
	  platforms: [
	     {
	      img: atlas.PLATFORM_ICE,
	      behaviour: 'shuttle', // null, fall, moveTo, shuttle
	      x: 1225,
	      y: 172,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 1415,
	        y: 172,
	        timeout: 5000,
	        easing: 'Cubic'
	      }
	    },
	    {
	      img: atlas.PLATFORM_ICE,
	      behaviour: 'shuttle', // null, fall, moveTo, shuttle
	      x: 3675,
	      y: 172,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 3920,
	        y: 172,
	        timeout: 5000,
	        easing: 'Cubic'
	      }
	    } 
	  ],
	  bonus: [
	    {
	      img: atlas.ALPHABET_H,
	      x: 280,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_A,
	      x: 300,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_L,
	      x: 320,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_L,
	      x: 340,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_O,
	      x: 380,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_F,
	      x: 400,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_A,
	      x: 440,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_G,
	      x: 460,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 480,
	      y: 115
	    },
	    {
	      img: atlas.ALPHABET_S,
	      x: 500,
	      y: 115
	    }
	  ],
	  enemies: [
	    {
	      type: 'insect',
	      number: 1,
	      lifespan: Infinity,
	      revive: 1000,
	      active: false,
	      onClose: 'follow',
	      origin: {
	        x: 321,
	        y: 220
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 438,
	        y: 217
	      },
	      boundTo: {
	        x1: 438,
	        x2: 558
	      }
	    },
	    {
	      type: 'insect',
	      number: 1,
	      lifespan: Infinity,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 711,
	        y: 138
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 861,
	        y: 3
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'dino', 
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 1172,
	        y: 99
	      },
	      boundTo: {
	        
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1450,
	        y: 227
	      },
	      boundTo: {
	        x1: 1450,
	        x2: 1623
	      }
	    },
	    {
	      type: 'bear',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1707,
	        y: 222
	      },
	      boundTo: {
	        x1: 1707,
	        x2: 1880
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1968,
	        y: 227
	      },
	      boundTo: {
	        x1: 1968,
	        x2: 2137
	      }
	    },
	    {
	      type: 'native', 
	      number: 3,
	      lifespan: 10000,
	      revive: 1000,
	      origin: {
	        x: 2815,
	        y: 220
	      },
	      boundTo: {
	        x: 2175,
	        y: 300
	      }
	    },
	    {
	      type: 'insect',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3083,
	        y: 105
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'bug',
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3090,
	        y: 105
	      },
	      boundTo: {
	        
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 5000,
	      revive: 4000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3221,
	        y: 3
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 5000,
	      revive: 5000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3321,
	        y: 3
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 5000,
	      revive: 3000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3451,
	        y: 3
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'bat',
	      number: 1,
	      lifespan: 5000,
	      revive: 2500,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3612,
	        y: 3
	      },
	      boundTo: {
	    
	      }
	    },
	    {
	      type: 'frog',
	      number: 1,
	      lifespan: 20000,
	      revive: 1000,
	      active: false,
	      onClose: 'wakeUp',
	      origin: {
	        x: 3838,
	        y: 253
	      },
	      boundTo: {
	        
	      },
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 4302,
	        y: 101
	      },
	      boundTo: {
	        x1: 4302,
	        x2: 4560
	      }
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 4328,
	        y: 70
	      },
	      boundTo: {
	        x1: 4328,
	        x2: 4720
	      }
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 4410,
	        y: 50
	      },
	      boundTo: {
	        x1: 4410,
	        x2: 4783
	      }
	    }
	  ]
	};
	
	module.exports = level;

/***/ },
/* 40 */
/*!*********************************************************!*\
  !*** ./js/configs/levelConfigs/level-mosquito-falls.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'mosquito-falls',
	  tileset: 'tileset-level-mosquito-falls',
	  tilemap: 'tilemap-level-mosquito-falls',
	  tiledJson: 'L5greenv2', 
	  tilesetImage: 'L5_green',
	  backgroundImage: 'forest-green',
	  width: 48 * 16,
	  height: 26 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  foregroundLayer: null,
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  parallaxLayer: 'parallax-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 28, 
	    y: 206
	  },
	  portals: [
	    {
	      jumpTo: 'downfall-rifts',
	      x: 3030,
	      y: 434
	    }
	  ],
	  platforms: [
	    {
	      img: atlas.PLATFORM_WOOD,
	      behaviour: 'shuttle', // null, fall, moveTo, shuttle
	      x: 75,
	      y: 243,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        x: 1200,
	        y: 243,
	        timeout: 20000,
	        easing: 'Linear'
	      }
	    },
	    {
	      img: atlas.PLATFORM_DEATH,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 514,
	      y: 435,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        
	      }
	    },
	    {
	      img: atlas.PLATFORM_DEATH,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 1183,
	      y: 388,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        
	      }
	    },
	    {
	      img: atlas.PLATFORM_DEATH,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 1454,
	      y: 310,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        
	      }
	    },
	    {
	      img: atlas.PLATFORM_DEATH,
	      behaviour: 'fall', // null, fall, moveTo, shuttle
	      x: 1539,
	      y: 255,
	      fallTimeout: 1000,
	      restoreTimeout: 2000,
	      moveTo: {
	        
	      }
	    }
	  ],
	  bonus: [
	    {
	      img: atlas.ALPHABET_L,
	      x: 230,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 240,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_T,
	      x: 250,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_T,
	      x: 270,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_H,
	      x: 280,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 280,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_J,
	      x: 300,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_U,
	      x: 310,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_N,
	      x: 320,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_G,
	      x: 330,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_L,
	      x: 340,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 350,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_S,
	      x: 370,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_L,
	      x: 380,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 390,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_E,
	      x: 400,
	      y: 135
	    },
	    {
	      img: atlas.ALPHABET_P,
	      x: 410,
	      y: 135
	    },
	    {
	      img: atlas.BONUS_BIG_BANANA,
	      x: 138,
	      y: 278
	    },
	    {
	      img: atlas.WEAPON_AXE,
	      x: 675,
	      y: 99
	    },
	    {
	      img: atlas.BONUS_PINEAPPLE,
	      x: 573,
	      y: 52
	    },
	    {
	      img: atlas.BONUS_SUITCASE,
	      x: 442,
	      y: 272
	    }
	  ],
	  enemies: [
	    {
	      type: 'jelly',
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 357,
	        y: 419
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'ptero',
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 211,
	        y: 90
	      },
	      onClose: 'follow',
	      onLeave: 'wait'
	    },
	    {
	      type: 'ptero',
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: 6000,
	      origin: {
	        x: 314,
	        y: 113
	      },
	      onClose: 'follow',
	      onLeave: 'wait'
	    },
	    {
	      type: 'tiger', 
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 848,
	        y: 391
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'dino', 
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 2175,
	        y: 400
	      },
	      boundTo: {
	        x1: 2068,
	        x2: 2214
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 10000,
	      revive: 1000,
	      origin: {
	        x: 185,
	        y: 135
	      },
	      boundTo: {
	        x1: 0,
	        x2: Infinity
	      }
	    },
	    {
	      type: 'native',
	      number: 1,
	      lifespan: 8000,
	      revive: 1200,
	      origin: {
	        x: 504,
	        y: 283
	      },
	      boundTo: {
	        x1: 494,
	        x2: 645
	      }
	    },
	    {
	      type: 'ptero',
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 400,
	        y: 67
	      },
	      boundTo: {
	        x1: 161,
	        x2: 750
	      },
	      onClose: 'follow',
	      onLeave: 'wait'
	    },
	    {
	      type: 'ptero',
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: 5000,
	      origin: {
	        x: 116,
	        y: 49
	      },
	      onClose: 'follow',
	      onLeave: 'wait'
	    },
	    {
	      type: 'dragonfly',
	      number: 1,
	      lifespan: Infinity,
	      revive: 1000,
	      origin: {
	        x: 143,
	        y: 226
	      },
	      boundTo: {
	        x1: 183,
	        x2: 484
	      }
	    },
	    {
	      type: 'frog', 
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 1530,
	        y: 233
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    }
	  ]
	};
	
	module.exports = level;

/***/ },
/* 41 */
/*!***************************************************************!*\
  !*** ./js/configs/levelConfigs/level-stairway-from-heaven.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(/*! ../assetMap.js */ 28);
	
	var level = {
	  id: 'stairway-from-heaven',
	  tileset: 'tileset-level-stairway-from-heaven',
	  tilemap: 'tilemap-level-stairway-from-heaven',
	  tiledJson: 'L5L14L9v1', 
	  tilesetImage: 'L2_L14_L9_L10_hued_bank',
	  backgroundImage: 'volcano',
	  width: 48 * 16,
	  height: 26 * 16,
	  backgroundLayer: 'background-2',
	  fixedBackground: true,
	  groundLayer: 'ground-layer',
	  foregroundLayer: null,
	  collisionLayer: 'collision-layer',
	  deathLayer: 'death-layer',
	  parallaxLayer: 'parallax-layer',
	  objectsLayer: null, 
	  entryPoint: {
	    x: 55, 
	    y: 144
	  },
	  portals: [
	    {
	      jumpTo: 'downfall-rifts',
	      x: 3030,
	      y: 434
	    }
	  ],
	  platforms: [
	    
	  ],
	  bonus: [
	    
	  ],
	  enemies: [
	    {
	      type: 'dino', 
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: false,
	      origin: {
	        x: 100,
	        y: 338
	      },
	      boundTo: {
	        x1: 2068,
	        x2: 2214
	      },
	      onClose: 'wakeUp',
	      onLeave: 'wait'
	    },
	    {
	      type: 'ptero',
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: 6000,
	      origin: {
	        x: 595,
	        y: 204
	      },
	      onClose: 'follow',
	      onLeave: 'wait'
	    },
	    {
	      type: 'ptero',
	      active: false,
	      number: 1,
	      lifespan: Infinity,
	      revive: 6000,
	      origin: {
	        x: 605,
	        y: 210
	      },
	      onClose: 'follow',
	      onLeave: 'wait'
	    }
	  ]
	};
	
	module.exports = level;

/***/ }
/******/ ]);
//# sourceMappingURL=pre2.js.map