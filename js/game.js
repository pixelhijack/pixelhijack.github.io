/* 
  http://upkk670a72a1.pixelhijack.koding.io//index.html
*/

var man;
var dino;
var keys;
var platforms;

var maze = {
  generated: labyrinth(10,10),
  dimensions: {
    width: 100,
    height: 100
  },
  walls: null,
  tile: {
    width: 16,
    height: 16
  }
};

var settings = {
  dimensions: {
    WIDTH: 794,
    HEIGHT: 434
  }, 
  physics: {
    gravity: 500,
    jumping: 300,
    maxSpeed: 200,
    acceleration: 10,
    slippery: 1.1
  }
};

var game = new Phaser.Game(settings.dimensions.WIDTH, settings.dimensions.HEIGHT, Phaser.AUTO, '', { 
  preload: preload, 
  create: create, 
  update: update 
});

function preload(){
  
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  
  game.stage.backgroundColor = '#eee';
  
  console.log("PHASER preloaded");
  game.load.image('man', './assets/standright.png');
  game.load.image('dino', './assets/dinoleft.png');
  game.load.spritesheet('run', './assets/run.png', 42, 36, 6);
  game.load.image('stone', './assets/99.png');
  game.load.image('background', './assets/bg3seamless.jpg');
  game.load.spritesheet('wall', './assets/tileset1.png', 16, 16, 3);
  game.load.spritesheet('void', './assets/tileset1.png', 16, 16, 1);
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  
  game.farBackground = game.add.tileSprite(0, 0, settings.dimensions.WIDTH, settings.dimensions.HEIGHT, 'background');
  game.farBackground.x = -(this.camera.x * 0.7);
  
  man = game.add.sprite(200, 50, 'run');
  man.animations.add('run', [0,1,2,3,4,5], 10, true);
  
  game.physics.enable(man, Phaser.Physics.ARCADE);
  man.body.collideWorldBounds = true;
  man.body.bounce.y = 0.2;
  man.body.gravity.y = settings.physics.gravity;
  
  game.camera.follow(man);
  
  dino = new Player(game, {
    image: 'dino',
    x: 300, 
    y: 300, 
    gravity: settings.physics.gravity
  });

  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  
  for(var i = 0; i < 10; i++){
    var platform = platforms.create(Math.random() * settings.dimensions.WIDTH  | 0, 
      Math.random() * settings.dimensions.HEIGHT | 0, 
      'stone', './assets/99.png');
    platform.body.bounce.set(0);
    platform.body.immovable = true;
  }
  
  //maze.walls = game.add.group();
  
  //maze.walls.add(game.add.sprite(200, 100, 'void'), game.add.sprite(20, 20, 'wall'));
  /*
  for(var i = 0, maxi = maze.generated.horiz.length;i<maxi;i++){
    var row =  maze.generated.horiz[i];
    for(var j = 0, maxj =  maze.generated.horiz.length;j<maxj;j++){
      var cell = row[j] || false;
      if(cell){
        var cellX = i * maze.tile.width;
        var cellY = j * maze.tile.height;
        var newCell = game.add.sprite(cellX, cellY, 'wall');
        game.physics.enable(newCell, Phaser.Physics.ARCADE);
        newCell.body.immovable = true;
        //newCell.anchor.set(0.5);
        maze.walls.add(newCell);
      }
      console.log(i, j, cellX, cellY, cell);
      console.log('maze.walls', maze.walls);
      
    }  
  }
  */
  
  keys = game.input.keyboard.createCursorKeys();

  console.log("PHASER created");
  console.log(maze);
}

function update(){
  
  game.physics.arcade.collide(man, platforms);
  game.physics.arcade.collide(man, dino);
  game.physics.arcade.collide(dino, platforms);
  
  dino.x <= 0 ? dino.x = game.world.width : dino.x;
  if(Math.random() < 0.05 && (dino.body.touching.down || dino.body.blocked.down)){
     dino.body.velocity.y -= Math.random() * 400;
     dino.body.velocity.x -= Math.random() * 50;
  }

  if(keys.left.isDown) {
    if(man.body.velocity.x > -settings.physics.maxSpeed){
        man.body.velocity.x -= settings.physics.acceleration;
      }
  }
  else if(keys.right.isDown) {
    if(man.body.velocity.x < settings.physics.maxSpeed){
        man.body.velocity.x += settings.physics.acceleration;
      }
    man.animations.play('run');
  }
  else{
    // slowing down / slippery rate: 10% after stopped moving
    man.body.velocity.x /= settings.physics.slippery;
  }
  if(keys.up.isDown && (man.body.touching.down || man.body.blocked.down)) {
      man.body.velocity.y -= settings.physics.jumping;
  }
  else if(keys.down.isDown) {
      man.body.velocity.y += 1;
  }

  console.log("PHASER updated");
}