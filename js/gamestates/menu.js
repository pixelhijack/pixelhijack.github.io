//var levels = require('../configs/levelConfigs.js');

function Menu(){
  
  var dimensions = {
    width: 546, 
    height: 372
  };
  
  var texts = [
    {
      key: 1,
      text: 'The Great Abyss', 
      id: 'great-abyss'
    },
    {
      key: 2,
      text: 'Downfall Rifts', 
      id: 'downfall-rifts'
    }, 
    {
      key: 3,
      text: 'Green Hell', 
      id: 'green-hell'
    },
    {
      key: 4,
      text: 'Hall of Ages', 
      id: 'hall-of-ages'
    },
    {
      key: 5,
      text: 'Into the Woods', 
      id: 'into-the-woods'
    },
    {
      key: 6,
      text: 'Mosquito Falls', 
      id: 'mosquito-falls'
    },
    {
      key: 7,
      text: 'Rise of the Tide', 
      id: 'rise-of-the-tide'
    },
    {
      key: 8,
      text: 'Stairway from Heaven', 
      id: 'stairway-from-heaven'
    },
    {
      key: 'a',
      text: 'Sleeping Jungle (work in progress)', 
      id: 'level-10'
    },
    {
      key: 'b',
      text: 'Forest in Fire (work in progress)', 
      id: 'level-12'
    },
    {
      key: 'c',
      text: 'Demon Dungeons (work in progress)', 
      id: 'level-13'
    },
    {
      key: 'd',
      text: 'Pillars of Hercules (work in progress)', 
      id: 'level-14'
    }
  ];
  
  var textStyle = { 
    font: "18px Courier", 
    fill: "#ffffff" 
  };
  var backgroundLayer = null;

  this.randomLevel = function(){
    const level = texts[Math.floor(Math.random() * texts.length)];
    this.game.state.start('Play', true, true, { levelNumber: level.id });
  };

  /*
    press a key for a level: 1, 2, 3...
  */
  this.preload = function preload(){
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.load.image('menu-background', 'assets/backgrounds/bg1seamless.png');
  };
  
  this.create = function create(){

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.addOnce(this.randomLevel, this);
    
    this.game.input.addPointer();
    
    this.game.world.setBounds(0, 0, dimensions.width, dimensions.height);
    backgroundLayer = this.game.add.tileSprite(0, 0, dimensions.width, dimensions.height, 'menu-background');
    
    var heading = this.game.add.text(20, 20, 'Press a key to start a level', textStyle);
    texts = texts.map(function(line, i){
      line.textRef = this.game.add.text(20, 60 + i * 20, line.key +' - '+ line.text, textStyle);
      return line;
    }.bind(this));
  };
  
  this.update = function update(){
    this.game.input.keyboard.onDownCallback = function(e){
      var levelToLoad = texts.find(function(text){
        return text.key.toString() === e.key;
      });
      if(levelToLoad){
        this.game.state.start('Play', true, true, { levelNumber: levelToLoad.id }); 
      }
    };
    if(this.game.input.pointer1.isDown) {
      this.randomLevel();
    };
  };
}

module.exports = Menu;