(function () {
    'use strict';

    function Menu() {
        this.score = 0;
    }

    Menu.prototype = {

        create: function () {

            var x = this.game.width * 0.5;
            var y = this.game.height * 0.5;

            this.add.sprite(0, 0, 'background');
            
            this.add.text(x, 100, 'FLAPPY BIRD', { font: '128px Arial', fill: '#DDD894', align: 'center' }).anchor.set(0.5);
            
            this.add.text(x, 190, 'HANDEN OMHOOG OM TE STARTEN', { font: '46px Arial', fill: '#DDD894', align: 'center' }).anchor.set(0.5);

            var shape = this.add.graphics(x - 125, y - 200);
            shape.lineStyle(5, 0xFFFFFF, 1);
            shape.beginFill(0xddd894, 1);
            shape.drawRect(0, 0, 250, 250);
          
            this.add.sprite(this.game.width * 0.25, y, 'bird0').anchor.set(0.5);
            this.add.sprite(this.game.width * 0.75, y, 'bird1').anchor.set(0.5);
            
            this.add.sprite(this.game.width * 0.5, this.game.height, 'start').anchor.setTo(0.5,1);
          
            this.addWinner();
            this.addScore();
            
            // Dont update for 3 seconds
            this.game.paused = true;
            var _this = this;
            setTimeout(function() {
                _this.game.paused = false;
            }, 3000);
        },
		
		update: function () {
          
          if (this.game.bodies && this.game.bodies.length) {
            var l = this.game.bodies.length;
            for (var i = 0; i < l; ++i) { 
              var joints = this.game.bodies[i].Joints;
              if (joints.HandLeft.Position.Y < joints.Head.Position.Y) {
                return;
              }
              if (joints.HandRight.Position.Y < joints.Head.Position.Y) {
                return;
              }
            }
            
            this.game.maxPlayers = l;
            this.game.state.start('game');
          }
		},
      
      addWinner: function () {
        
        if(this.game.maxPlayers > 1 && typeof this.game.winner !== 'undefined') {
              var pos;
              if(this.game.winner === 0) {
                pos = this.game.width * 0.25;
              } else {
                pos = this.game.width * 0.75;
              }
            
            this.add.text(pos, 450, 'WINNAAR', { font: '46px Arial', fill: '#DDD894', align: 'center' }).anchor.set(0.5);
          
        }
      },

        addScore: function () {
            var highScore = 0;
            if (localStorage.HighScore) {
                highScore = localStorage.HighScore;
            }
            if (this.score > highScore) {
                localStorage.HighScore = this.score;
                highScore = this.score;
            }

            var x = this.game.width * 0.5;
            var y = this.game.height * 0.5;

            var text = this.add.bitmapText(x, y - 165, 'gamefont', 'Score Winnaar');
            text.align = 'center';
            text.x = x - text.textWidth * 0.5;

            text = this.add.bitmapText(x, y - 130, 'gamefont', '' + this.score);
            text.align = 'center';
            text.scale.setTo(2, 2);
            text.x = x - text.textWidth;

            text = this.add.bitmapText(x, y - 65, 'gamefont', 'Hoogste Score');
            text.align = 'center';
            text.x = x - text.textWidth * 0.5;

            text = this.add.bitmapText(x, y - 30, 'gamefont', '' + highScore);
            text.align = 'center';
            text.scale.setTo(2, 2);
            text.x = x - text.textWidth;
        },

        actionOnClick: function () {
            this.game.state.start('game');
        }
    };

    window['flappybird'] = window['flappybird'] || {};
    window['flappybird'].Menu = Menu;

}());