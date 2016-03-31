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

// planned enemy config structure:
{
        id: 1,
        type: 'bear', // 1-2 bears constantly run through the view
        number: 2,
        lifespan: 10000,
        revive: 5000,
        move: true,
        boundTo: {
          x: Infinity,
          y: Infinity
        }
      },
      {
        id: 2,
        type: 'spider', // spiders coming from a cave frequently
        number: 1,
        lifespan: Infinity,
        revive: 10000,
        move: true,
        boundTo: {
          x: 568,
          y: 734
        }
      },
      {
        id: 3,
        type: 'dino', // a guard dino standing waiting
        number: 1,
        lifespan: Infinity,
        revive: true,
        move: 200,  // attacks if man distance is 200
        boundTo: {
          x1: 568,  // stays between x1 x2 zone
          x2: 734
        }
      },