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
	var levelList = __webpack_require__(9);


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
	    game.debug.text(enemies.population(), 5, game.height - 15);
	    
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



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var configs = __webpack_require__(4);
	var behaviours = __webpack_require__(5);

	var Creature = function(game, creatureType, x, y){
	  Phaser.Sprite.call(this, game, x, y, (creatureType || configs[creatureType].image));
	  game.physics.enable(this, Phaser.Physics.ARCADE);
	  this.props = configs[creatureType] || configs['creatureDefaults'];
	  this._state = '';
	  this.body.collideWorldBounds = true;
	  this.body.gravity.y = this.props.gravity;
	  this.anchor.setTo(0.5, 0.5);
	  
	  this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
	  this._debugText.visible = false;
	  
	  this.lifespan = this.props.lifespan;

	  this.facingRight = true;
	  
	  configs[creatureType].animations.forEach(function(anim){
	    this.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
	  }.bind(this));
	  
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

	// use in update()
	Creature.prototype.debug = function debug(toDebug){
	  this._debugText.visible = true;
	  this._debugText.setText(toDebug);
	};

	/*==========================================
	  FIXME!! 
	http://www.html5gamedevs.com/topic/9158-sprite-lifespan-problem/
	==========================================*/
	Creature.prototype.revive = function revive(){
	  this.lifespan = this.props.lifespan;
	};

	module.exports = Creature;
	  

/***/ },
/* 4 */
/***/ function(module, exports) {

	//var _ = require('lodash');

	var configs = {
	  creatureDefaults: {
	    gravity: 500,
	    bounce: 0.2,
	    jumping: 300,
	    maxSpeed: 200,
	    acceleration: 10, 
	    lives: 1, 
	    lifespan: 100000,
	    animations: []
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
	      { name: 'stopping-left', frames: [30,31,32,33], fps: 10, loop: false }, 
	      { name: 'jumping-right', frames: [36,37,38,39], fps: 10, loop: false }, 
	      { name: 'jumping-left', frames: [42,43,44,45], fps: 10, loop: false }, 
	      { name: 'idle-right', frames: [48,49,50,51], fps: 10, loop: false }, 
	      { name: 'idle-left', frames: [54,55,56,57], fps: 10, loop: false }  
	    ]
	  },
	  dino: {
	    jumping: 400,
	    maxSpeed: 300,
	    acceleration: 20, 
	    animations: [
	      { name: 'moving-right', frames: [0,1,2,3], fps: 10, loop: true },
	      { name: 'moving-left', frames: [8,9,10,11], fps: 10, loop: true },
	      { name: 'jumping-right', frames: [0,1,2,3,4], fps: 10, loop: true },
	      { name: 'jumping-left', frames: [7,8,9,10,11], fps: 10, loop: true }
	    ]
	  },
	  bear: {
	    acceleration: 15, 
	    animations: [] 
	  },
	  'super-bear': {
	    acceleration: 30,
	    maxSpeed: 400,
	    image: 'super-bear-sprite-ref', // override sprite (creature name by default)
	    animations: []
	  },
	  ptero: {
	    gravity: 0,
	    bounce: 0.1,
	    jumping: 0,
	    maxSpeed: 100,
	    acceleration: 50, 
	    animations: [
	      { name: 'fly', frames: [3,4,5], fps: 10, loop: true }
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

	for(var creature in configs){
	  //configs[creature] = _.merge({}, configs.creatureDefaults, configs[creature]);  
	  var defaults = configs['creatureDefaults'];
	  for(var prop in defaults){
	    if(configs[creature][prop] == undefined){
	      configs[creature][prop] = defaults[prop];
	    }
	  }  
	}

	module.exports = configs;

/***/ },
/* 5 */
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
	    level.tilemap.setCollisionBetween(1, 200, true, level.collisionLayer);
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
	var util = __webpack_require__(8);

	/*  
	    ENEMIES API: 
	    var enemies = enemyManager(game, level.enemies);
	    @Phaser.Group::enemies.of.dino
	    @Phaser.Group::enemies.of.bear
	    ...
	*/
	var enemyManager = function(game, levelEnemies){
	  var utils = util(game);
	  // init enemy pools
	  var of = {};
	  
	  for(var enemy in levelEnemies){
	    of[enemy] = game.add.group();
	  }
	  
	  return {
	    of: of,
	    initLevelEnemies: function(){ 
	      for(var enemyType in of){
	        for(var i = 0, max = levelEnemies[enemyType];i<max;i++){
	          // of.dino.add(new Creature('dino', game, 126, 45)) =>
	          var randomPoint = utils.randomWorldPoint();
	          this.add(enemyType, randomPoint.x, randomPoint.y);
	        }
	      }    
	    },
	    add: function(enemyType, whereX, whereY){ 
	      var enemyWaiting = of[enemyType].getFirstDead();
	      if(!enemyWaiting){
	        var anotherEnemy = new Creature(game, enemyType, whereX, whereY);
	        of[enemyType].add(anotherEnemy);
	      }
	    },
	    revive: function(enemyType, whereX, whereY){
	      var enemyToRevive = of[enemyType].getFirstDead();
	      if(enemyToRevive){
	        enemyToRevive.revive();
	        enemyToRevive.reset(whereX, whereY);
	      }
	    },
	    forEachAlive: function(fn, args){
	      for(var enemyType in of){
	        // close your eyes please
	        if(typeof fn === 'function'){
	          of[enemyType].forEachAlive(function(creature){
	            // should check if Creature really has the method...
	            fn.apply(creature, args);  
	          });
	        }  
	      }  
	    },
	    population: function(){
	      var allAnimal = 0;
	      for(var enemyGroup in of){
	        allAnimal += of[enemyGroup].children.filter(function(enemy){ return enemy.alive; }).length;
	      }
	      return allAnimal;
	    }
	  };
	};

	module.exports = enemyManager;

/***/ },
/* 8 */
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
	    randomWorldPoint: function(){
	      return this.randomPointIn(0, 0, game.world.width, game.world.height);
	    }
	  };
	};

	module.exports = util;

/***/ },
/* 9 */
/***/ function(module, exports) {

	var levelList = [
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
	    objectsLayer: 'objects-layer', 
	    enemies: {
	      dino: 5,
	      ptero: 2,
	      bear: 0
	    }
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
	    objectsLayer: null, 
	    enemies: {
	      dino: 5,
	      ptero: 2,
	      bear: 0
	    }
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
	    objectsLayer: null, 
	    enemies: {
	      dino: 5,
	      ptero: 2,
	      bear: 0
	    }
	  }
	];

	module.exports = levelList;

/***/ }
/******/ ]);