// general behaviour reducers any entity can use
var mixins = {
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
  diagonalDescend: function(dx, dy){
    this.y += dy;
    this.x += dx;
  },
  crawl: function(){
    if(this.body.velocity.y > 0){
      this.scale.y = -1;
    } else {
      this.scale.y = 1;
    }
    if(this.body.blocked.left || this.body.blocked.right){
      this.body.gravity.y = 0;
      this.state = 'climbing';
      this.move();
      //this.scale.y = this.body.velocity.y > 0 && this.isGrounded() ? -1 : 1;
      
      // crawling up:
      if(this.body.blocked.down){
        this.body.velocity.y -= this.props.acceleration;
      }
      //crawling down:
      if(this.body.blocked.up){
        this.body.velocity.y += this.props.acceleration;
      }
    } else {
      this.body.gravity.y = this.props.gravity;
      this.move();
      this.state = 'moving';
    }
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
  walker: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.move = mixins.move;
    this.jump = mixins.jump;
    this.wait = mixins.wait;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.sentinel = mixins.sentinel;
    this.watch = mixins.watch;
    this.die = mixins.die;
    return this;
  },
  crawler: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.move = mixins.move;
    this.crawl = mixins.crawl;
    this.wait = mixins.wait;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.hurry = mixins.hurry;
    this.sentinel = mixins.sentinel;
    this.watch = mixins.watch;
    this.die = mixins.die;
    return this;
  },
  flier: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.turnIfBlocked = mixins.turnIfBlocked;
    this.descend = mixins.descend;
    this.ascend = mixins.ascend;
    this.diagonalDescend = mixins.diagonalDescend;
    this.die = mixins.die;
    return this;
  },
  man: function(){
    this.moveRight = mixins.moveRight;
    this.moveLeft = mixins.moveLeft;
    this.jump = mixins.jump;
    this.hurt = mixins.hurt;
    this.stop = mixins.stop;
    this.lives = mixins.lives;
    return this;
  }
};
behaviours.dino = behaviours.walker;
behaviours.ptero = behaviours.flier;
behaviours.parrot = behaviours.flier;
behaviours.bear = behaviours.walker;
behaviours.dragonfly = behaviours.flier;
behaviours.bat = behaviours.flier;
behaviours.spider = behaviours.crawler;
behaviours.native = behaviours.walker;
behaviours.insect = behaviours.walker;
behaviours.bug = behaviours.walker;
behaviours.frog = behaviours.walker;
behaviours.tiger = behaviours.walker;
behaviours.turtle = behaviours.walker;

// specific updates of a creature
var updates = {
  waitStill: function(){
    this.render();
    if(this.state !== 'dead'){
      this.state = 'moving';
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }
  },
  jumpAttack: function(){
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
  },
  dino: function(){
    this.render();
    if(this.state !== 'dead'){
      this.turnIfBlocked();
      this.move();
      this.sentinel();
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
  bat: function(){
    this.render();
    if(this.state !== 'dead'){
      this.diagonalDescend(0.5, 1);
    }
  },
  spider: function(){
    this.render();
    if(this.state !== 'dead'){
      this.crawl();
      //this.hurry();
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
  insect: function(){
    updates.jumpAttack.call(this);
  },
  bug: function(){
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
  },
  tiger: function(){
    this.render();
    if(this.state !== 'dead'){
      if(Math.random() < 0.005){ 
        this.jump(); 
        this.state = 'jumping';
      }else{
        this.turnIfBlocked();
        this.move();
      }
    }
  },
  turtle: function(){
    this.render();
    if(this.state !== 'dead'){
      this.hurry();
      this.sentinel();
    }
  }
};

var reactions = {
  default: {
    'man:hurt': function(evt){
      console.info('[EVENT][%s:%s][%s:] Who cares...', evt.who, evt.event, this.creatureType, evt);  
    }
  },
  native: {
    'man:hunting': function(evt){
      console.info('[EVENT][%s:%s][%s:] heard some noise!', evt.who, evt.event, this.creatureType, evt);  
    }
  }, 
  frog: {
    'man:near': function(evt){
      console.info('[EVENT][%s:%s][%s:] Man is near!', evt.who, evt.event, this.creatureType, evt);  
      if(Math.abs(this.x - evt.x) < 200){
        this.update = updates.jumpAttack;
      }
    }
  }
};

module.exports = {
  mixins: mixins,
  behaviours: behaviours,
  updates: updates, 
  reactions: reactions
};

