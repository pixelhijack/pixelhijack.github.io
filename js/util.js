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