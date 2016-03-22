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

	var Play = __webpack_require__(1);

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
	    dino: 5,
	    ptero: 1
	  }
	};

	var game = new Phaser.Game(settings.dimensions.WIDTH, settings.dimensions.HEIGHT, Phaser.AUTO, '');
	var PRE2 = { 
	  Play: Play.bind(this, game, settings)
	};
	game.state.add('Play', PRE2.Play);
	game.state.start('Play');



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Creature = __webpack_require__(2);


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
	  var dinos;
	  var ptero;
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
	  var level = {
	    background: null,
	    tilemap: null,
	    groundLayer: null,
	    collisionLayer: null,
	    objectsLayer: null
	  };

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
	    
	    game.load.image('tileset-level-1', './assets/level-1-transparent.png');
	    game.load.tilemap('tilemap-level-1', './levels/78x23.json', null, Phaser.Tilemap.TILED_JSON);
	  }
	  
	  function initWorld(){
	    game.world.setBounds(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT);
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	  }
	  
	  function loadLevel(levelModel, tileset, tilemap){
	    levelModel.background = game.add.tileSprite(0, 0, settings.dimensions.WIDTH * settings.dimensions.blocks, settings.dimensions.HEIGHT, 'background');
	    levelModel.tilemap = game.add.tilemap(tilemap);
	    levelModel.tilemap.addTilesetImage('tileset1', tileset);
	    levelModel.groundLayer = levelModel.tilemap.createLayer('foreground-layer');
	    levelModel.collisionLayer = levelModel.tilemap.createLayer('collision-layer');
	    levelModel.collisionLayer.visible = false;
	    levelModel.tilemap.setCollisionBetween(1, 200, true, 'collision-layer');
	    levelModel.groundLayer.resizeWorld();
	  }
	  function addHero(){
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
	    man.animations.add('idle-right', [48,49,50,51], 10, false);
	    man.animations.add('idle-left', [54,55,56,57], 10, false);
	    
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
	    menu.lives= game.add.sprite(20, 20, 'lives');
	    menu.lives.frame = 0;
	    // hearts
	    var hearts = man.lives();
	    menu.hearts = game.add.group();
	    for(var i=0;i<hearts;i++){
	      var heart = game.add.sprite(60 + i*20, 20, 'lives');
	      heart.frame = 1;
	      menu.hearts.add(heart);
	    }
	  }
	  
	  function addDinos(){
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
	  }
	  
	  function addPtero(){
	    ptero = new Creature('ptero', game, {
	      image: 'pterodactylus',
	      x: 0, 
	      y: 100, 
	      gravity: 0,
	      bounce: 0
	    });
	    
	    ptero.animations.add('fly', [3,4,5], 10, true);
	    
	    game.add.existing(ptero);
	  
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
	  function create(){
	    initWorld();
	    loadLevel(level, 'tileset-level-1', 'tilemap-level-1');
	    addHero();
	    renderMenu();
	    addDinos();
	    addPtero();
	    setInputs();
	    
	    onEvery(10, function(){
	      //game.debug.text('Elapsed: ' + Math.floor(game.time.totalElapsedSeconds()), 32, 64);
	      var dinoToRevive = dinos.getFirstExists(false);
	      if(dinoToRevive){
	        dinoToRevive.reset(Math.random() * settings.dimensions.WIDTH, settings.dimensions.HEIGHT / 2);
	      }
	    });
	    
	    console.log("PHASER created");
	  }
	  
	  function setParallax(){
	    level.background.x = -(game.camera.x * settings.physics.parallax);
	  }
	  
	  function collisions(){
	    game.physics.arcade.collide(man, level.collisionLayer);
	    game.physics.arcade.collide(dinos, level.collisionLayer);
	    //collisionLayer.debug = true;
	    game.physics.arcade.collide(man, dinos, onEnemyCollision, onProcess, this);
	    game.physics.arcade.collide(man, ptero, onEnemyCollision, onProcess, this);
	    
	    // hit'n kill enemy: collision should calculated on weapon sprite
	    game.physics.arcade.collide(weapon.sprite, dinos, function(weaponSprite, enemy){
	      if(man.state === 'hitting'){
	        enemy.kill();
	      }
	    }, null, this);
	  }
	  
	  function moveDinos(){
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
	  }
	  
	  function movePtero(){
	    ptero.x -= 1;
	    ptero.animations.play('fly');
	    ptero.x <= 0 ? ptero.x = game.world.width : ptero.x;
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
	      man.isGrounded() ? man.state = 'moving' : man.state = 'jumping';
	    }
	    else if(keys.right.isDown) {
	      man.moveRight();
	      man.isGrounded() ? man.state = 'moving' : man.state = 'jumping';
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
	    }
	    if(keys.space.isDown) {
	      man.state = 'hitting';
	      weapon.sprite.visible = true;
	      weapon.sprite.animations.play('club-hit-' + man.direction());
	    }
	  }
	  
	  function debug(){
	    game.debug.text('LIVES: ' + man.lives(), 32, 96);
	    game.debug.pointer(game.input.pointer1);
	    game.debug.body(weapon.sprite);
	  }
	  
	  /*=============
	  *   UPDATE
	  =============*/
	  function update(){
	    setParallax();
	    collisions();
	    moveDinos();
	    movePtero();
	    moveHero();
	    debug();
	    man.animations.play(man.state + '-' + man.direction());
	    
	    console.log("PHASER updated");
	  }
	  
	  function onEnemyCollision(hero, enemy){
	    if(man.body.touching.down && enemy.body.touching.up){
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



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var behaviours = __webpack_require__(3);

	var Creature = function(creatureType, game, config){
	  Phaser.Sprite.call(this, game, config.x, config.y, config.image);
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.props = config.props;
	  this._state = config.state || '';
	  this.body.collideWorldBounds = true;
	  this.body.gravity.y = config.gravity;
	  this.anchor.setTo(0.5, 0.5);
	  
	  this.facingRight = true;
	  
	  // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
	  behaviours[creatureType].call(Creature.prototype);
	};

	Creature.prototype = Object.create(Phaser.Sprite.prototype);

	Creature.prototype.constructor = Creature;

	Object.defineProperty(Creature.prototype, 'state', {
	    get: function() { return this._state; }, 
	    set: function(value) {
	        if (value !== this._state)
	        {
	            this._state = value;
	        }
	    }
	});

	Creature.prototype.direction = function direction(){
	  return this.facingRight ? 'right' : 'left';
	};

	Creature.prototype.isGrounded = function isGrounded(){
	  return this.body.touching.down || this.body.blocked.down;
	};

	module.exports = Creature;
	  

/***/ },
/* 3 */
/***/ function(module, exports) {

	var mixins = {
	  /******************************
	  *     MOVE LEFT
	  ******************************/
	  moveLeft: function(overrideAcc){
	    this.facingRight = false;
	    if(this.body.velocity.x > -this.props.maxSpeed){
	      this.body.velocity.x -= overrideAcc || this.props.acceleration;
	    }
	  },
	  /******************************
	  *     MOVE RIGHT
	  ******************************/
	  moveRight: function(overrideAcc){
	    this.facingRight = true;
	    if(this.body.velocity.x < this.props.maxSpeed){
	        this.body.velocity.x += overrideAcc || this.props.acceleration;
	      }
	  },
	  move: function(){
	    if(this.body.velocity.x >= 0){
	      mixins.moveRight.bind(this);
	    }else{
	     mixins.moveLeft.bind(this); 
	    }
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
	  damage: function(severity){
	    this.props.lives -= severity;
	    this.body.velocity.x -= severity * Math.random() * 20;
	  },
	  die: function(){},
	  
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
	    this.body.velocity.x = 0;
	    this.body.velocity.y = 0;
	  },
	  sleep: function(){},
	  sentinel: function(){},
	  follow: function(){}
	};

	var behaviours = {
	  man: function(){
	    this.moveRight = mixins.moveRight;
	    this.moveLeft = mixins.moveLeft;
	    this.jump = mixins.jump;
	    this.damage = mixins.damage;
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
	    return this;
	  },
	  ptero: function(){
	    this.runRight = mixins.moveRight;
	    this.runLeft = mixins.moveLeft;
	    return this;
	  }
	};

	module.exports = behaviours;



/***/ }
/******/ ]);