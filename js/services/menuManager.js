var Menu = function(game, man){
  
  var lives, 
      livesCount,
      hearts, 
      score, 
      hurtDelay = 2000,
      lastHurt = -hurtDelay;
      
  livesCount = game.add.text(20, 20, Math.floor(man.lives() / 4), { font: "16px Arial", fill: "#ffffff" });
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
      if(evt.event === 'hurt' && lastHurt + hurtDelay < evt.args[1].time){
        lastHurt = evt.args[1].time;
        var actualHeart = evt.args[1].livesLeft % 4 - 1;
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