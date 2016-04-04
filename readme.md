#Prehistorik 2 Revival Project

##Planned flow
1. Boot: choose level, single / multiplayer
2. Phaser instance created, level manager opens level, game play handles player inputs, enemies
3. Hero & enemy movements, states stored in a model which can be passed via websockets
4. In multiplayer mode the other client browser gets these states as inputs and render accordingly

##Adding new creature
1. Add spritesheet to assets, set proper width-height dimensions
2. Reference in preload
3. Add behaviour in movements
4. Add features & animations in creatureConfigs
5. Add update in movements
6. Instantiate / populate

##User Stories
###Enemies
Sentinel type: 
Run-tru type: level 1, bear, lifespan--, revive. Spider from cave, boundTo infinity, crawl offscreen, revive
Wait-attack type: 
Follow type: sniff man, stick to him

###Groups
Leader wolf: kill leader, horde flees
Egg hatching: egg pulsing, hatch dozen dino
Baby pterosaurs sleeping hanging

###Objects
Bonus class, sprite atlas
Bonus up-down tween animations
Platform fall if stand on