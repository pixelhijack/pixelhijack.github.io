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

	var game = new Phaser.Game(globalSettings.dimensions.WIDTH, globalSettings.dimensions.HEIGHT, Phaser.AUTO, '', null, false, false);
	var PRE2 = { 
	  Play: Play.bind(this, game, globalSettings)
	};
	game.state.add('Play', PRE2.Play);
	game.state.start('Play', true, true, { levelNumber: globalSettings.level });



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
	var Thing = __webpack_require__(6);
	var levelManager = __webpack_require__(7);
	var enemyManager = __webpack_require__(8);
	var thingManager = __webpack_require__(11);
	var menuManager = __webpack_require__(12);
	var levelConfigs = __webpack_require__(13);
	var util = __webpack_require__(10);


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
	  var levels = levelManager(game, levelConfigs);
	  var level;
	  var levelNo;
	  
	  var enemies;
	  
	  var things;
	  
	  var utils = util(game);
	  
	  var events = { };

	  // public methods for Phaser
	  this.init = function init(initConfigs){
	    console.log('INIT:', initConfigs);
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
	    /*
	    game.load.spritesheet('dino', './assets/dino.png', 42, 36);
	    game.load.spritesheet('ptero', './assets/pterodactylus.png', 62, 50);
	    game.load.spritesheet('bear', './assets/bears.png', 44, 44);
	    game.load.spritesheet('dragonfly', './assets/dragonflies.png', 36, 22);
	    game.load.spritesheet('spider', './assets/spiders.png', 32, 26);
	    game.load.spritesheet('native', './assets/natives.png', 28, 32);
	    game.load.spritesheet('man', './assets/man.png', 32, 36);
	    */
	    game.load.spritesheet('club', './assets/clubs-96x72.png', 96, 36);
	    
	    game.load.atlas('pre2atlas', 'assets/pre2atlas.png', 'assets/pre2atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	    
	    game.load.image('background-1', './assets/bg1seamless.png');
	    game.load.image('background-2', './assets/bg3seamless.jpg');
	    game.load.image('background-3', './assets/bg_04.png');
	    
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
	    game.world.setBounds(0, 0, globalSettings.dimensions.WIDTH * globalSettings.dimensions.blocks, globalSettings.dimensions.HEIGHT);
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	  }
	  
	  function loadLevel(){
	    level = levels(levelNo);
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
	    
	    
	    things = thingManager(game, level.bonus);
	    
	    game.camera.follow(man);
	    //game.add.existing(man);
	    game.world.addAt(man, 2);
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



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var creatureConfigs = __webpack_require__(4);
	var movements = __webpack_require__(5);

	var Creature = function(game, creatureType, x, y){
	  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.creatureType = creatureType;
	  this.props = creatureConfigs[creatureType] || creatureConfigs['creatureDefaults'];
	  this.state = '';
	  this.body.collideWorldBounds = true;
	  this.body.gravity.y = creatureConfigs[creatureType].gravity;
	  this.body.mass = creatureConfigs[creatureType].mass;
	  this.anchor.setTo(creatureConfigs[creatureType].correctedAnchor.x, creatureConfigs[creatureType].correctedAnchor.y);
	  
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
	    anim.frames = anim.frames.map(function(frameNumber){
	      return frameNumber.toString();
	    });
	    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
	  }.bind(this));
	  
	  // apply creature 'class' by extend the object with behavioural mixins
	  movements.behaviours[creatureType].call(Creature.prototype);
	  // apply the creature's own update to be called
	  this.update = movements.updates[creatureType].bind(this);
	  // every creature makes noises: an observable phaser channel to subscribe for:
	  this.noise = new Phaser.Signal();
	  // every creature react to other noises: event listener collection here:
	  this.reactions = movements.reactions[creatureType] || movements.reactions.default;
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

	Creature.prototype.render = function render(){
	  this.play(this.state); 
	  this.facingRight ? this.scale.x = 1 : this.scale.x = -1;
	};


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

	Creature.prototype.onEnemyMovements = function onEnemyMovements(evt){
	  var reaction = this.reactions[evt.who + ':' + evt.event];
	  if(reaction){
	    reaction.call(this, evt);
	  }
	  //console.log('[creature][Signals][%s] heard some noise!', this.creatureType, event);
	}

	Creature.prototype.listen = function listen(subject, reaction){
	  // subscribe a creature to man's noises: man.noise.add(creature.onEnemyMovements, creature);
	  subject.noise.add(reaction, this);
	}

	Creature.prototype.shout = function shout(eventType, args){
	  this.noise.dispatch({ who: this.creatureType, event: eventType, x: this.x, y: this.y, args: args });
	}

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
	      { name: 'idle', frames: [25,25,25,25,25,25,25,25,27,27,27,27,25,25,25,25,25,25,25,25,30,25,25,25,25,25,25,25,25,27,30,27,30,35,36,25,25,25,25,25,25,25,25,'07','07','07','07','02','02'], fps: 5, loop: true }, 
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
	    mixins.move.call(this);
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
	    this.body.velocity.x += force * 3;
	    this.body.velocity.y += force * 3;
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
	  watch: function(){
	    this.state = 'idle';
	    this.body.velocity.x = 0;
	    this.body.velocity.y = 0;
	  },
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
	        //console.info('[movements] %s reached boundTo point', this.key);
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
	    this.die = mixins.die;
	    return this;
	  },
	  parrot: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.descend = mixins.descend;
	    this.ascend = mixins.ascend;
	    this.die = mixins.die;
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
	  },
	  frog: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.move = mixins.move;
	    this.jump = mixins.jump;
	    this.wait = mixins.wait;
	    this.turnIfBlocked = mixins.turnIfBlocked;
	    this.hurry = mixins.hurry;
	    this.sentinel = mixins.sentinel;
	    this.die = mixins.die;
	    this.watch = mixins.watch;
	    return this;
	  }
	};

	// specific updates of a creature
	var updates = {
	  dino: function(){
	    this.render();
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
	    this.render();
	    if(this.state !== 'dead'){
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
	    }
	  },
	  bear: function(){
	    this.render();
	    if(this.state !== 'dead'){
	      this.hurry();
	      this.sentinel();
	    }
	  },
	  man: function(){
	    this.render();
	  }, 
	  dragonfly: function(){
	    this.render();
	    if(this.state !== 'dead'){
	     this.hurry();
	    }
	  },
	  parrot: function(){
	    this.render();
	    if(this.state !== 'dead'){
	     this.hurry();
	    }
	  },
	  spider: function(){
	    this.render();
	    if(this.state !== 'dead'){
	      this.hurry();
	      this.sentinel();
	    }
	  },
	  native: function(){
	    this.render();
	    if(this.state !== 'dead'){
	      if(!this.sentinel()){
	        this.hurry(); 
	      }
	    }
	  },
	  frog: function(){
	    this.render();
	    if(this.state !== 'dead'){
	      this.turnIfBlocked();
	      this.move();
	      if(Math.random() < 0.005){ 
	        this.facingRight = !this.facingRight;
	      }
	      if(Math.random() < 0.05){ 
	        this.jump(); 
	        this.state = 'jumping';
	      }
	    }
	  }
	};

	var reactions = {
	  default: {
	    'man:hurt': function(evt){
	      console.info('[EVENT][%s:%s][%s:] Who cares...', evt.who, evt.event, this.key, evt);  
	    }
	  },
	  native: {
	    'man:hunting': function(evt){
	      console.info('[EVENT][%s:%s][%s:] heard some noise!', evt.who, evt.event, this.key, evt);  
	    }
	  }, 
	  spider: {
	    'man:hurt': function(evt){
	      console.info('[EVENT][%s:%s][%s:] I killed the pray?', evt.who, evt.event, this.key, evt);  
	    }
	  }
	};

	module.exports = {
	  mixins: mixins,
	  behaviours: behaviours,
	  updates: updates, 
	  reactions: reactions
	};



/***/ },
/* 6 */
/***/ function(module, exports) {

	var Thing = function(game, frameName, x, y, configs){
	  Phaser.Sprite.call(this, game, x, y, 'pre2atlas');
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.frameName = frameName;
	  this.anchor.setTo(0.5, 0.5);
	  game.add.existing(this);
	  
	  
	  this.update = function(){

	  }
	};

	Thing.prototype = Object.create(Phaser.Sprite.prototype);
	Thing.prototype.constructor = Thing;

	module.exports = Thing;

/***/ },
/* 7 */
/***/ function(module, exports) {

	var levelManager = function(game, levelList){
	  
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
	      level.tilemap.setCollisionBetween(0, 3000, true, levelToLoad.deathLayer);
	      level.deathLayer.visible = true;
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Creature = __webpack_require__(3);
	var Group = __webpack_require__(9);
	var util = __webpack_require__(10);

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
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Thing = __webpack_require__(6);
	var Group = __webpack_require__(9);

	var thingManager = function(game, thingList){
	  
	  var things = {
	    bonus: new Group(game),
	    portals: new Group(game),
	    platforms: new Group(game)
	  };
	  
	  thingList.forEach(function(thingConfig){
	    var thing = new Thing(game, thingConfig.img, thingConfig.x, thingConfig.y);
	    things.bonus.add(thing);
	  });
	  
	  return things;
	};

	module.exports = thingManager;

/***/ },
/* 12 */
/***/ function(module, exports) {

	var Menu = function(game, man){
	  
	  var lives, 
	      livesCount,
	      hearts, 
	      score;
	      
	  livesCount = game.add.text(20, 20, Math.floor(man.lives() / 4), { font: "16px Arial", fill: "#ffffff" })
	      
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
	      console.info('[EVENT][Menu]: updating', evt);
	      var actualHeart = evt.args.livesLeft % 4 - 1;
	      hearts.children.forEach(function(heart, i){
	        if(i >= actualHeart){
	          heart.visible = false;
	        }
	      });
	    }
	  };
	};

	module.exports = Menu;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var atlas = __webpack_require__(15);

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
	    groundLayer: 'ground-layer',
	    collisionLayer: 'collision-layer',
	    deathLayer: null,
	    objectsLayer: 'objects-layer', 
	    entryPoint: {
	      x: 200, 
	      y: 50
	    },
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
	    groundLayer: 'ground-layer',
	    collisionLayer: 'collision-layer',
	    deathLayer: 'death-layer',
	    objectsLayer: 'objects-layer', 
	    entryPoint: {
	      x: 285, 
	      y: 206
	    },
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
	  }, 
	  {
	    id: 4,
	    tileset: 'tileset-level-4',
	    tilemap: 'tilemap-level-4',
	    tilesetImageName: 'L2_bank',
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
	      x: 311, 
	      y: 291
	    },
	    portals: [],
	    platforms: [],
	    bonus: [
	      {
	        img: atlas.PORTAL_LEVEL_GO,
	        x: 329,
	        y: 154
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
	        lifespan: 10000,
	        revive: 10000,
	        move: true,
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
	        lifespan: 10000,
	        revive: 10000,
	        move: true,
	        origin: {
	          x: 0,
	          y: 0
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
	        move: true,
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
	        move: true,
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
	        number: 3,
	        lifespan: Infinity,
	        revive: 5000,
	        move: 200,  
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
	        move: true,
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
	        number: 3,
	        lifespan: Infinity,
	        revive: 5000,
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
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
	        move: true,
	        origin: {
	          x: 55,
	          y: 663
	        },
	        boundTo: {
	          
	        }
	      }
	    ]
	  }
	];

	module.exports = levelConfigs;

/***/ },
/* 14 */,
/* 15 */
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
	  key54: "54",
	  key55: "55",
	  key56: "56",
	  key57: "57",
	  key58: "58",
	  key59: "59",
	  key60: "60",
	  key61: "61",
	  key62: "62",
	  key63: "63",
	  key64: "64",
	  key65: "65",
	  key66: "66",
	  key67: "67",
	  key68: "68",
	  key69: "69",
	  key70: "70",
	  key71: "71",
	  key72: "72",
	  key73: "73",
	  key74: "74",
	  key75: "75",
	  key76: "76",
	  WEAPON_AXE_SMALL: "77",
	  key78: "78",
	  key79: "79",
	  key80: "80",
	  key81: "81",
	  key82: "82",
	  key83: "83",
	  key84: "84",
	  key85: "85",
	  key86: "86",
	  key87: "87",
	  key88: "88",
	  key89: "89",
	  key90: "90",
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
	  key102: "102",
	  BONUS_BIG_BANANA: "103",
	  key104: "104",
	  key105: "105",
	  BONUS_BIG_MCDONALDS: "106",
	  key107: "107",
	  key108: "108",
	  key109: "109",
	  key110: "110",
	  key111: "111",
	  key112: "112",
	  key113: "113",
	  key114: "114",
	  key115: "115",
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
	  key128: "128",
	  key129: "129",
	  key130: "130",
	  key131: "131",
	  key132: "132",
	  key133: "133",
	  key134: "134",
	  key135: "135",
	  key136: "136",
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
	  key178: "178",
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
	  key222: "222",
	  key223: "223",
	  key224: "224",
	  key225: "225",
	  key226: "226",
	  key227: "227",
	  key228: "228",
	  key229: "229",
	  key230: "230",
	  key231: "231",
	  key232: "232",
	  key233: "233",
	  key234: "234",
	  key235: "235",
	  key236: "236",
	  key237: "237",
	  key238: "238",
	  key239: "239",
	  key240: "240",
	  key241: "241",
	  key242: "242",
	  key243: "243",
	  key244: "244",
	  key245: "245",
	  key246: "246",
	  key247: "247",
	  key248: "248",
	  key249: "249",
	  key250: "250",
	  key251: "251",
	  key252: "252",
	  key253: "253",
	  key254: "254",
	  key255: "255",
	  key256: "256",
	  key257: "257",
	  key258: "258",
	  key259: "259",
	  key260: "260",
	  key261: "261",
	  key262: "262",
	  key263: "263",
	  key264: "264",
	  key265: "265",
	  key266: "266",
	  key267: "267",
	  key268: "268",
	  key269: "269",
	  key270: "270",
	  key271: "271",
	  key272: "272",
	  key273: "273",
	  key274: "274",
	  key275: "275",
	  key276: "276",
	  key277: "277",
	  key278: "278",
	  key279: "279",
	  key280: "280",
	  PORTAL_SMALL_STOP: "281",
	  PORTAL_SMALL_GO: "282",
	  key283: "283",
	  key284: "284",
	  key285: "285",
	  key286: "286",
	  key287: "287",
	  key288: "288",
	  key289: "289",
	  key290: "290",
	  key291: "291",
	  key292: "292",
	  key293: "293",
	  key294: "294",
	  key295: "295",
	  key296: "296",
	  key297: "297",
	  key298: "298",
	  key299: "299",
	  key300: "300",
	  key301: "301",
	  key302: "302",
	  key303: "303",
	  key304: "304",
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
	  key315: "315",
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
	  key467: "467",
	  key468: "468",
	  key469: "469",
	  key470: "470"
	};

	module.exports = assetMap;

/***/ }
/******/ ]);