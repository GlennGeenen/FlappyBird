(function () {
	'use strict';

	function Menu() {
		this.world = null;
		this.titleTxt = null;
		this.startTxt = null;
		this.score = 0;
	}

	Menu.prototype = {

		create: function () {

			// Put everything in world group that we scale
			this.world = this.game.add.group();
			this.world.scale.setTo(this.game.gameScale, this.game.gameScale);

			var x = 1920 * 0.5;
			var y = 1080 * 0.5;

			this.world.create(0, 0, 'background');

			this.titleTxt = this.add.bitmapText(x, y - 300, 'gamefont', 'FLAPPY BIRD');
			this.titleTxt.scale.setTo(2, 2);
			this.titleTxt.align = 'center';
			this.titleTxt.x = x - this.titleTxt.textWidth;
			this.world.add(this.titleTxt);

			this.startTxt = this.add.bitmapText(x, y - 245, 'gamefont', 'CLICK/TAP TO FLAP');
			this.startTxt.align = 'center';
			this.startTxt.x = x - this.startTxt.textWidth * 0.5;
			this.world.add(this.startTxt);

			var button = this.add.button(x - 125, y + 125, 'start', this.actionOnClick, this, 2, 1, 0);
			this.world.add(button);

			var shape = this.add.graphics(x - 125, y - 200);
			shape.lineStyle(5, 0xFFFFFF, 1);
			shape.beginFill(0xddd894, 1);
			shape.drawRect(0, 0, 250, 250);
			this.world.add(shape);

			this.addScore();
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

			var x = 1920 * 0.5;
			var y = 1080 * 0.5;

			var text = this.add.bitmapText(x, y - 165, 'gamefont', 'Your Score');
			text.align = 'center';
			text.x = x - text.textWidth * 0.5;
			this.world.add(text);

			text = this.add.bitmapText(x, y - 130, 'gamefont', '' + this.score);
			text.align = 'center';
			text.scale.setTo(2, 2);
			text.x = x - text.textWidth;
			this.world.add(text);

			text = this.add.bitmapText(x, y - 65, 'gamefont', 'High Score');
			text.align = 'center';
			text.x = x - text.textWidth * 0.5;
			this.world.add(text);

			text = this.add.bitmapText(x, y - 30, 'gamefont', '' + highScore);
			text.align = 'center';
			text.scale.setTo(2, 2);
			text.x = x - text.textWidth;
			this.world.add(text);
		},

		actionOnClick: function () {
			this.game.state.start('game');
		}
	};

	window['flappybird'] = window['flappybird'] || {};
	window['flappybird'].Menu = Menu;

}());