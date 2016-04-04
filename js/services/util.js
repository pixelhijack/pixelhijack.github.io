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