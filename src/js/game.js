(function () {
    'use strict';

    function Game() {
      this.jumpButton = null;
      this.blockGroup = null;
      this.scoreText = null;
    }

    Game.prototype = {

        create: function () {

            // Set Background
            this.add.sprite(0, 0, 'background');

            // Start Physics
            //this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Setup game variables
            this.setupVariables();
          
            // Setup Blocks	
            this.createBlocks();

            // Setup Players
            this.createPlayers();

            // Setup Score Text
            this.scoreText = this.add.bitmapText(40, 20, 'gamefont', '' + this.score);
            this.scoreText.scale.setTo(4, 4);
        },

        setupVariables: function () {
            // Always start with score 0
            this.score = 0;
            // The number of block pairs
            this.numberOfBlocks = 5;
            // How far blocks are apart of each other horizontally
            this.blockSpacing = 600;
            // How far blocks are apart of each other vertically
            this.verticalSpacing = 270;
            // X Position of the last block so we know where to add the next
            this.lastBlock = 0;
            // Y Position of the last block and starting position of bird
            this.lastY = 300;
        },
      
        createPlayers: function () {
        
          var i;
          
          this.players = [];
          
          this.birds = this.add.group();

          for(i = 0; i < this.game.maxPlayers; ++i) {
            
            var bird = this.birds.create(400, this.lastY + i * 20, 'bird' + i);
            bird.anchor.set(0.5);
            bird.animations.add('fly');
            bird.animations.play('fly', 10, true);
            bird.g = 0;
            
            this.players.push({
              bird: bird,
              score: 0,
              didFlap: false,
              deaths: 0,
              flapStatus: 0,
              flaptry: 0,
              trackid: null,
              index: i
            });
          }
          
          if(this.game.bodies.length) {
            this.game.bodies = _.sortBy(this.game.bodies, function(body){ return body.Joints.Head.X; });
            
            for(i = 0; i < this.game.maxPlayers; ++i) {
              if(this.game.bodies[i]) {
                this.players[i].trackid = this.game.bodies[i].TrackingId;
              }
            }            
          }
          
        },

        createBlocks: function () {
            this.blockGroup = this.add.group();

            for (var i = 0; i < this.numberOfBlocks; ++i) {
                var x = this.game.width + (i * this.blockSpacing);
                var y = this.getNewYPosition();

                this.lastY = y;
                this.lastBlock = x;

                // We always create a top and a bottom block
                var topBlock = this.blockGroup.create(x, y, 'block-top');
                topBlock.anchor.setTo(0.5, 1);

                var bottomBlock = this.blockGroup.create(x, y + this.verticalSpacing, 'block-bottom');
                bottomBlock.anchor.setTo(0.5, 0);
            }
        },

        update: function () {
          
          var deltaTime = this.time.elapsed / 1000;
          
          this.checkFlapping();
          
          var bird = null;
          for(var i = 0; i < this.game.maxPlayers; ++i) {
            
            bird = this.players[i].bird;
            if(bird.alive) {
              
              bird.g += deltaTime * 5;
              
              bird.y += bird.g;
              
              if(bird.y < 0) {
                bird.y = 0;
              }
              
              bird.rotation = bird.g / 10;
              if (bird.y > 875) {
                this.gameOver(bird);
              }
              
            }
          }

          this.updateBlocks(deltaTime);
        },

        updateBlocks: function (dt) {
            var lastX = 0;
            var newY = 0;
            var scored = false;
          
            var birdx = this.players[0].bird.x;
            var birdw = this.players[0].bird.width;
          
            this.blockGroup.forEach(function (block) {
              
                block.x -= dt * 100;

                // Check If Scored
                if (!block.scored && block.x + block.width * 0.5 < birdx - birdw * 0.5) {
                    scored = true;
                    block.scored = true;
                }

                // Check if largest element
                if (block.x > lastX) {
                    lastX = block.x;
                }
                // Check collision with birds
                else if (block.x < 500 && block.x > 300) {
                  
                  if(Math.abs(block.x - birdx) < birdw) {
                    
                    for(var i = 0; i < this.game.maxPlayers; ++i) {
                      if ((block.anchor.y === 1 && block.y > this.players[i].bird.y - 30) ||
                         (block.anchor.y === 0 && block.y < this.players[i].bird.y + 30)) {
                          this.gameOver(this.players[i].bird);
                      }
                    }
                    
                  }
                }
                // Reset block to the right
                else if(block.x < -200) {
                    if (newY === 0) {
                        newY = this.getNewYPosition();
                    }
                    block.x = this.lastBlock + this.blockSpacing;
                    if (block.anchor.y === 1) {
                        block.y = newY;
                    } else {
                        block.y = newY + this.verticalSpacing;
                    }
                    block.scored = false;
                  }
            }, this);

            if (newY !== 0) {
                this.lastY = newY;
            }
            this.lastBlock = lastX;

            // You always have a top and a bottom block scoring, but you only want to score one.
            if (scored) {
                ++this.score;
                this.scoreText.setText('' + this.score);
            }
        },

        // Calculate Y Position for the next block
        // Edit this method to change the difficulty of the game
        getNewYPosition: function () {
            var y = 0;
            do {
                y = 200 + Math.random() * 400;
            }
            while (this.lastY - y > 200 || this.lastY - y < -200);
            return y;
        },

        gameOver: function (bird) {
          
          function resetBird() {
            bird.y = 400;
            if(bird.body) {
              bird.body.velocity.y = 0;
            }
            bird.alive = true;
          }
          
          var player = _.find(this.players, function(player) { return player.bird === bird; });
          if(player) {
            ++player.deaths;
          }
          
          bird.alive = false;
          
          if(_.every(this.players, function(player) { return player.deaths > 0; } )) {
            
            this.game.winner = player.index;
            
            this.game.state.states['menu'].score = this.score;
            this.game.state.start('menu');
            return;
          }
          
          setTimeout(resetBird, 500);
        },

        checkFlapping: function ()
        {
          if(!this.game.bodies.length) {
            console.log('no bodies');
            return;
          }
          
          var trackingids = _.map(this.game.bodies, function(body){ return body.TrackingId; });
              
          var joints = null;
          var trackid = null;
          for(var i = 0; i < this.game.maxPlayers; ++i) {
            
            trackid = this.players[i].trackid;
      
            if (!_.contains(trackingids, trackid)) {
              console.log('no ' + trackid);
              continue;
            }
            
            joints = _.find(this.game.bodies, function(body){ return body.TrackingId === trackid; });
            if(!joints) {
              console.log('invalid ' + trackid);
              continue;
            }
            joints = joints.Joints;
            
            // console.log(i + ': ' + this.players[i].flaptry + ' ' + this.players[i].flapStatus);

            ++this.players[i].flaptry;
            if(this.players[i].flaptry > 15) {
                this.players[i].flaptry = 0;
                this.players[i].flapStatus = 0;
            }
            
            if(this.players[i].flapStatus === 0) {

                if(joints.HandRight.Position.Y < joints.ShoulderRight.Position.Y || 
                joints.HandLeft.Position.Y < joints.ShoulderLeft.Position.Y) {
                    continue;
                }

                if(joints.HandRight.Position.X < joints.ShoulderRight.Position.X || 
                joints.HandLeft.Position.X > joints.ShoulderLeft.Position.X) {
                    continue;
                }

                this.players[i].flapStatus = 1;
                this.players[i].flaptry = 0;

            } else if(this.players[i].flapStatus === 1) {

                if(joints.HandRight.Position.Y > joints.ShoulderRight.Position.Y || 
                joints.HandLeft.Position.Y > joints.ShoulderLeft.Position.Y) {
                    continue;
                }

                if(joints.HandRight.Position.X < joints.ShoulderRight.Position.X || 
                joints.HandLeft.Position.X > joints.ShoulderLeft.Position.X) {
                    continue;
                }

                this.players[i].bird.g = -8;
                this.players[i].flapStatus = 0;
                this.players[i].flaptry = 0;
            }
          }
        }
 
    };

    window['flappybird'] = window['flappybird'] || {};
    window['flappybird'].Game = Game;

}());