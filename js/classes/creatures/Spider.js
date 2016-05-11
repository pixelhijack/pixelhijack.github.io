var creatureConfigs = require('../../configs/creatureConfigs.js');
var Creature = require('./Creature.js');

function Spider(game, x, y){
  Creature.call(this, game, 'spider', x, y);

  this.setProps();
  this.setAnimations();
  this.update = this.defaultUpdate;
}

Spider.prototype = Object.create(Creature.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.defaultUpdate = function defaultUpdate(){
  this.render();
  if(this.state === 'dead'){
    return;
  }
  this.crawl();
  this.sentinel();
};

Spider.prototype.crawl = function crawl(){
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
};

module.exports = Spider;
  