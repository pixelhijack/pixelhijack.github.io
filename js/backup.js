/* 
  http://upkk670a72a1.pixelhijack.koding.io//index.html
*/

var man;
var keys;

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

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { 
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
  game.load.spritesheet('wall', './assets/tileset1.png', 16, 16, 3);
  game.load.spritesheet('void', './assets/tileset1.png', 16, 16, 1);
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  man = game.add.sprite(0, 0, 'man');
  game.physics.enable(man, Phaser.Physics.ARCADE);
  man.body.velocity.set((Math.random() * 100 | 0), (Math.random() * 100 | 0));
  man.body.collideWorldBounds = true;
  man.body.bounce.set(1);
  
  maze.walls = game.add.group();
  
  //maze.walls.add(game.add.sprite(200, 100, 'void'), game.add.sprite(20, 20, 'wall'));
  
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
  
  keys = game.input.keyboard.createCursorKeys();

  console.log("PHASER created");
  console.log(maze);
}

function update(){
  if(keys.left.isDown) {
    console.log("LEFT");
		man.body.velocity.x -= 1;
	}
  console.log("PHASER updated");
}