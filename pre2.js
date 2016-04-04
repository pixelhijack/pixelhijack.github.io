/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Menu = __webpack_require__(1);
	var Play = __webpack_require__(2);

	var globalSettings = {
	  level: window.location.hash && window.location.hash.split('#')[1] || 1,
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

	var game = new Phaser.Game(globalSettings.dimensions.WIDTH, globalSettings.dimensions.HEIGHT, Phaser.AUTO, '');
	var PRE2 = { 
	  Play: Play.bind(this, game, globalSettings)
	};
	game.state.add('Play', PRE2.Play);
	game.state.start('Play');



/***/ },
/* 1 */
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
/***/ function(module, exports, __webpack_require__) {

	var Creature = __webpack_require__(3);
	var levelManager = __webpack_require__(6);
	var enemyManager = __webpack_require__(7);
	var levelConfigs = __webpack_require__(10);
	var util = __webpack_require__(9);


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
	    
	    game.load.tilemap('tilemap-level-1', './levels/78x23.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.tilemap('tilemap-level-2', './levels/49x100-old.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.tilemap('tilemap-level-3', './levels/49x100.json', null, Phaser.Tilemap.TILED_JSON);
	  
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
	    
	    // restore lifes if game state reloaded:
	    man.props.lives = 3;
	    
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
	    }else{
	      man.hurt(enemyMomentum);
	      renderMenu();
	      if(man.lives() < 0){
	        weapon.sprite.kill();
	        man.die();
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



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(4);
	var movements = __webpack_require__(5);

	var Creature = function(game, creatureType, x, y){
	  Phaser.Sprite.call(this, game, x, y, (creatureType || creatureConfigs[creatureType].image));
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.props = creatureConfigs[creatureType] || creatureConfigs['creatureDefaults'];
	  this.state = '';
	  this.body.collideWorldBounds = true;
	  this.body.gravity.y = creatureConfigs[creatureType].gravity;
	  this.body.mass = creatureConfigs[creatureType].mass;
	  this.anchor.setTo(0.5, 0.5);
	  
	  this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
	  this._debugText.visible = false;

	  /*
	    @this.lifespan: the actual, used by Phaser
	    @this.props.lifespan: the abstract from creature & level configs
	  */
	  this.lifespan = this.props.lifespan;
	  this.stunnedUntil = 0;

	  this.facingRight = Math.random() < 0.5 ? true : false;
	  
	  creatureConfigs[creatureType].animations.forEach(function(anim){
	    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
	  }.bind(this));
	  
	  // apply creature 'class' by extend the object with behavioural mixins
	  movements.behaviours[creatureType].call(Creature.prototype);
	  // apply the creature's own update to be called
	  this.update = movements.updates[creatureType].bind(this);
	};

	Creature.prototype = Object.create(Phaser.Sprite.prototype);
	Creature.prototype.constructor = Creature;

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
	        this._boundTo = new Phaser.Point(0, 0, this.game.width, this.game.height);
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
	  this._debugText.setText(toDebug);
	};

	/*==========================================
	  FIXME!! 
	http://www.html5gamedevs.com/topic/9158-sprite-lifespan-problem/
	==========================================*/
	Creature.prototype.revive = function revive(x, y){
	  this.lifespan = this.props.lifespan;
	  this.state = 'moving';
	  this.reset(x, y);
	};

	module.exports = Creature;
	  

/***/ },
/* 4 */
/***/ function(module, exports) {

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
	    }
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
	    maxSpeed: 75,
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
	    maxSpeed: 50,
	    acceleration: 50, 
	    animations: [
	      { name: 'moving-left', frames: [3,3,3,3,3,4,5,3,4,5,3,3,3,3,3,4,5,3,4,5], fps: 12, loop: true },
	      { name: 'moving-right', frames: [0,1,2,0,1,2,2,2,2,2,2,0,1,2,0,1,2,2,2,2,2,2,2], fps: 12, loop: true },
	      { name: 'descend-left', frames: [3], fps: 12, loop: true },
	      { name: 'descend-right', frames: [2], fps: 12, loop: true },
	      { name: 'ascend-left', frames: [3,4,5], fps: 20, loop: true },
	      { name: 'ascend-right', frames: [0,1,2], fps: 20, loop: true }
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
	      { name: 'moving-right', frames: [0,1], fps: 12, loop: true },
	      { name: 'moving-left', frames: [8,9], fps: 12, loop: true },
	      { name: 'turn-right', frames: [2,3], fps: 12, loop: true },
	      { name: 'turn-left', frames: [2,3], fps: 12, loop: true },
	      { name: 'dead-right', frames: [4], fps: 12, loop: true },
	      { name: 'dead-left', frames: [5], fps: 12, loop: true }
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
	      { name: 'spawn-right', frames: [0,1,2,3], fps: 10, loop: false },
	      { name: 'spawn-left', frames: [0,1,2,3], fps: 10, loop: false },
	      { name: 'moving-right', frames: [16,17,18,19], fps: 10, loop: true },
	      { name: 'moving-left', frames: [22,23,24,25], fps: 10, loop: true },
	      { name: 'climbing-right', frames: [20], fps: 10, loop: true },
	      { name: 'climbing-left', frames: [21], fps: 10, loop: true },
	      { name: 'waiting-right', frames: [3,4,5], fps: 10, loop: true },
	      { name: 'waiting-left', frames: [3,4,5], fps: 10, loop: true },
	      { name: 'dead-right', frames: [6], fps: 10, loop: false },
	      { name: 'dead-left', frames: [7], fps: 10, loop: false }
	    ]
	  },
	  native: {
	    maxSpeed: 100,
	    acceleration: 20,
	    animations: [
	      { name: 'moving-right', frames: [0,1,2], fps: 10, loop: true },
	      { name: 'moving-left', frames: [7,6,5], fps: 10, loop: true },
	      { name: 'dead-right', frames: [3], fps: 10, loop: false },
	      { name: 'dead-left', frames: [4], fps: 10, loop: false }
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	// general behaviour reducers any entity can use
	var mixins = {
	  /******************************
	  *     MOVE LEFT
	  ******************************/
	  moveLeft: function(overrideAcc){
	    this.facingRight = false;
	    if(overrideAcc === 0){
	      this.body.velocity.x = 0;
	      this.body.velocity.y = 0;
	    }
	    if(this.body.velocity.x > -this.props.maxSpeed){
	      this.body.velocity.x -= overrideAcc || this.props.acceleration;
	    }
	  },
	  /******************************
	  *     MOVE RIGHT
	  ******************************/
	  moveRight: function(overrideAcc){
	    this.facingRight = true;
	    if(overrideAcc === 0){
	      this.body.velocity.x = 0;
	      this.body.velocity.y = 0;
	    }
	    if(this.body.velocity.x < this.props.maxSpeed){
	        this.body.velocity.x += overrideAcc || this.props.acceleration;
	      }
	  },
	  move: function(overrideAcc){
	    this.facingRight ? 
	      mixins.moveRight.call(this, overrideAcc) : 
	      mixins.moveLeft.call(this, overrideAcc);
	  },
	  turnIfBlocked: function(){
	    if(this.body.blocked.left){ 
	      mixins.moveRight.call(this); 
	      this.state = 'moving';
	    }
	    if(this.body.blocked.right){ 
	      mixins.moveLeft.call(this); 
	      this.state = 'moving';
	    }
	  },
	  hurry: function(){
	    this.turnIfBlocked();
	    this.move();
	    this.state = 'moving';
	  },
	  jump: function(){
	    if(this.body.touching.down || this.body.blocked.down){
	      this.body.velocity.y -= this.props.jumping;
	    }
	  }, 
	  turn: function(){
	    
	  },
	  lives: function(){
	    return this.props.lives;
	  },
	  stop: function(slippery){
	    this.body.velocity.x /= slippery;
	  },
	  duck: function(){},
	  enter: function(){},
	  hit: function(){
	    
	  },
	  hurt: function(force){
	    this.props.lives -= 1;
	    this.body.velocity.x -= force * 3;
	    this.body.velocity.y -= force * 3;
	    this.stunnedUntil = this.game.time.now + Math.max(force * 5, 1000);
	  },
	  die: function(force){
	    this.state = 'dead';
	    //this.props.collide = false;
	    this.body.velocity.x -= force * 3;
	    this.body.velocity.y -= force * 3;
	    // http://www.html5gamedevs.com/topic/6429-use-phasertime-like-settimeout/
	    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.kill, this);
	  },
	  see: function(){},
	  sniff: function(enemy){
	    // @enemy: the position of the hero
	    // @return: decision = call a behaviour based on sniffing out the approaching enemy
	  },
	  decide: function(condition, behaviour){
	    // @condition: based on decision
	    // @behaviour: list of behaviours
	    // @return: one behaviour 
	  },
	  wait: function(){
	    this.body.moves = false;
	    this.state = 'idle';
	  },
	  descend: function(){
	    this.body.velocity.y += this.props.acceleration;
	  },
	  ascend: function(){
	    this.body.velocity.y -= this.props.acceleration;
	  },
	  sleep: function(){},
	  sentinel: function(){
	    // @boundTo: {x1, x2} or {x1, y1, x2, y2} Rectangle
	    // @behaviour 'sentinel back & forth': if bound to a zone, stay there
	    if(this.boundTo.hasOwnProperty('width')){
	      if(this.x < this.boundTo.x){
	        this.facingRight = true;
	        mixins.move.call(this);
	      }
	      if(this.x > this.boundTo.x + this.boundTo.width){
	        this.facingRight = false;
	        mixins.move.call(this);
	      }
	    }
	    // @boundTo: {x, y} Point
	    // @behaviour 'hurry somewhere': if bound to a point, head there
	    // @behaviour 'wait at': if reached the point, wait there
	    if(!this.boundTo.hasOwnProperty('width')){
	      if(Phaser.Rectangle.containsPoint(this.getBounds(), this.boundTo)){
	        console.info('[movements] %s reached boundTo point', this.key);
	        mixins.wait.call(this);
	        return false;
	      }
	    }  
	  },
	  attack: function(bait, overrideDist){
	    var attackDistance = this.props.attack || overrideDist || 50;
	    if(Math.abs(bait.x - this.x) < attackDistance){
	      this.body.moves = true;
	      //this.frenzy();
	    }
	  }
	};

	// creature class mixins implementing behaviours should be added here
	var behaviours = {
	  man: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.jump = mixins.jump;
	    this.hurt = mixins.hurt;
	    this.stop = mixins.stop;
	    this.lives = mixins.lives;
	    return this;
	  },
	  dino: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.move = mixins.move;
	    this.jump = mixins.jump;
	    this.wait = mixins.wait;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.hurry = mixins.hurry;
	    this.sentinel = mixins.sentinel;
	    this.die = mixins.die;
	    return this;
	  },
	  ptero: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.descend = mixins.descend;
	    this.ascend = mixins.ascend;
	    return this;
	  },
	  bear: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.hurry = mixins.hurry;
	    this.sentinel = mixins.sentinel;
	    this.die = mixins.die;
	  }, 
	  dragonfly: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.hurry = mixins.hurry;
	    this.die = mixins.die;
	  },
	  spider: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.hurry = mixins.hurry;
	    this.sentinel = mixins.sentinel;
	    this.die = mixins.die;
	  },
	  native: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.hurry = mixins.hurry;
	    this.sentinel = mixins.sentinel;
	    this.die = mixins.die;
	  }
	};

	// specific updates of a creature
	var updates = {
	  dino: function(){
	    this.play(this.state + '-' + this.direction());
	    if(this.state !== 'dead'){
	      this.turnIfBlocked();
	      this.move();
	      this.sentinel();
	      this.x <= 0 ? this.x = this.game.world.width : this.x;
	      if(Math.random() < 0.005){ 
	        this.facingRight = !this.facingRight;
	      }
	      if(Math.random() < 0.05){ 
	        this.jump(); 
	        this.state = 'jumping';
	      }
	    }
	  },
	  ptero: function(){
	    this.play(this.state + '-' + this.direction());
	    this.move();
	    this.state = 'moving';
	    //this.x = this.x <= this.width * 0.5 ? this.game.world.width - 5 : this.x;
	    this.turnIfBlocked();
	    if(Math.random() < 0.01){
	      this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
	        this.state = 'descend';
	        this.descend();
	      }, this);
	    }
	    if(Math.random() < 0.01){
	      this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
	        this.state = 'ascend';
	        this.ascend();
	      }, this);
	    }
	    //this.x = this.x <= this.game.world.width - (this.width * 0.5) ? this.x : 0;
	  },
	  bear: function(){
	    this.play(this.state + '-' + this.direction());
	    if(this.state !== 'dead'){
	      this.hurry();
	      this.sentinel();
	    }
	  },
	  man: function(){
	    this.animations.play(this.state + '-' + this.direction());
	  }, 
	  dragonfly: function(){
	    this.animations.play(this.state + '-' + this.direction());
	    if(this.state !== 'dead'){
	     this.hurry();
	    }
	  },
	  spider: function(){
	    this.animations.play(this.state + '-' + this.direction());
	    if(this.state !== 'dead'){
	      this.hurry();
	      this.sentinel();
	    }
	  },
	  native: function(){
	    this.animations.play(this.state + '-' + this.direction());
	    if(this.state !== 'dead'){
	      if(!this.sentinel()){
	        this.hurry(); 
	      }
	    }
	  }
	};

	module.exports = {
	  mixins: mixins,
	  behaviours: behaviours,
	  updates: updates
	};



/***/ },
/* 6 */
/***/ function(module, exports) {

	var levelManager = function(game, levelList){
	  
	  var level = {
	    tilemap: null,
	    backgroundLayer: null,
	    groundLayer: null,
	    collisionLayer: null,
	    objects: {}
	  };
	  
	  return function setLevel(id){
	    var levelToLoad = levelList.find(function(level){
	      return level.id === +id;
	    });
	    if(!levelToLoad){
	      throw new TypeError('PRE2: Couldn\'t find this level. Sorry, pal.');
	    }
	    level.backgroundLayer = game.add.tileSprite(0, 0, levelToLoad.width, levelToLoad.height, levelToLoad.backgroundLayer);
	    level.backgroundLayer.fixedToCamera = levelToLoad.fixedBackground;
	    level.tilemap = game.add.tilemap(levelToLoad.tilemap);
	    level.tilemap.addTilesetImage(levelToLoad.tilesetImageName, levelToLoad.tileset);
	    level.groundLayer = level.tilemap.createLayer(levelToLoad.groundLayer);
	    level.collisionLayer = level.tilemap.createLayer(levelToLoad.collisionLayer);
	    level.collisionLayer.visible = false;
	    if(levelToLoad.deathLayer){
	      level.deathLayer = level.tilemap.createLayer(levelToLoad.deathLayer);
	      level.tilemap.setCollisionBetween(1, 352, true, levelToLoad.deathLayer);
	      level.deathLayer.visible = false;
	    }
	    level.tilemap.setCollisionBetween(1, 352, true, levelToLoad.collisionLayer);
	    level.groundLayer.resizeWorld();
	    level.enemies = levelToLoad.enemies;
	    
	    //level.groundLayer.debug = true;
	    
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
	    
	    return level;
	  };
	}

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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Creature = __webpack_require__(3);
	var Group = __webpack_require__(8);
	var util = __webpack_require__(9);

	/*  
	    ENEMIES API: 
	    var enemies = enemyManager(game, level.enemies);
	    @Phaser.Group::enemies.global.dino
	    @Phaser.Group::enemies.global.bear
	    @Phaser.Group::enemies.zone(1).bear
	    ...
	    
	    enemyManager: 
	      @levelEnemies: enemies of zones and types from level lists
	      @levelZones: zone coordinates from tilemap's object-layers
	      -> create phaser group for each zone - type - enemy type
	      -> populate group references 
	      every zone has:
	        @guards: enemies placed in zones once
	        @spawns: enemies spawning in the zone, moving away, subsequently
	      
	*/
	var enemyManager = function(game, levelEnemies, levelZones){
	  var utils = util(game);
	  
	  var groups = [];
	  var reviveTimers = [];

	  // populate enemy groups
	  groups = levelEnemies.map(function(groupConfig){
	    
	    // cache groupConfig as the group props for later use
	    var group = new Group(game, groupConfig);
	    
	    for(var i = 1, max = groupConfig.number; i <= max; i++){
	      var creature = new Creature(game, groupConfig.type, groupConfig.origin.x, groupConfig.origin.y);
	      group.add(creature);
	    }
	    //group.setAll('props.boundTo', groupConfig.boundTo); 
	    group.setAll('boundTo', groupConfig.boundTo);
	    group.setAll('props.move', groupConfig.move);
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
	      console.info('[enemyManager] reviving a %s', enemyToRevive.key, enemyToRevive);
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Creature = __webpack_require__(3);

	var Group = function(game, props){
	  Phaser.Group.call(this, game);
	  this.props = props || {};
	};

	Group.prototype = Object.create(Phaser.Group.prototype);
	Group.prototype.constructor = Group;

	module.exports = Group;

/***/ },
/* 9 */
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
/* 10 */
/***/ function(module, exports) {

	var levelConfigs = [
	  {
	    id: 1,
	    tileset: 'tileset-level-1',
	    tilemap: 'tilemap-level-1',
	    tilesetImageName: 'tileset1',
	    width: 78 * 16,
	    height: 23 * 16,
	    backgroundLayer: 'background-1',
	    fixedBackground: true, // this can be false also as seamless background, though it makes the game much slower :(
	    groundLayer: 'foreground-layer',
	    collisionLayer: 'collision-layer',
	    deathLayer: null,
	    objectsLayer: 'objects-layer', 
	    enemies: [
	      {
	        type: 'bear',
	        number: 1,
	        lifespan: Infinity,
	        revive: false,
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	  },
	  {
	    id: 2,
	    tileset: 'tileset-level-2',
	    tilemap: 'tilemap-level-2',
	    tilesetImageName: 'tileset2',
	    width: 49 * 16,
	    height: 100 * 16,
	    backgroundLayer: 'background-2',
	    fixedBackground: true,
	    groundLayer: 'foreground-layer',
	    collisionLayer: 'collision-layer',
	    deathLayer: null,
	    objectsLayer: null, 
	    enemies: [
	      {
	        type: 'bear',
	        number: 2,
	        lifespan: Infinity,
	        revive: 5000,
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	  },
	  {
	    id: 3,
	    tileset: 'tileset-level-3',
	    tilemap: 'tilemap-level-3',
	    tilesetImageName: 'tileset1_2',
	    width: 49 * 16,
	    height: 100 * 16,
	    backgroundLayer: 'background-2',
	    fixedBackground: true,
	    groundLayer: 'foreground-layer',
	    collisionLayer: 'collision-layer',
	    deathLayer: 'death-layer',
	    objectsLayer: 'objects-layer', 
	    enemies: [
	      {
	        type: 'bear', // 1-2 bears constantly run through the view
	        number: 1,
	        lifespan: Infinity,
	        revive: false,
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: 200,  // attacks if man distance is 200
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
	  }
	];

	module.exports = levelConfigs;

/***/ }
/******/ ]);