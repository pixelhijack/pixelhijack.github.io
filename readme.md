#Prehistorik 2 Revival Project

##Planned flow
1. Boot: choose level, single / multiplayer
2. Phaser instance created, level manager opens level, game play handles player inputs, enemies
3. Hero & enemy movements, states stored in a model which can be passed via websockets
4. In multiplayer mode the other client browser gets these states as inputs and render accordingly