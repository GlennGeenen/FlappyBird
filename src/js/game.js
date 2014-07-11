(function () {
	'use strict';

	function Game() {
		this.bird = null;
		this.jumpButton = null;
		this.world = null;

		this.numberOfBlocks = 5;
		this.blockGroup = null;

		this.score = 0;
		this.scoreText = null;

		// How far blocks are apart of each other horizontally
		this.blockSpacing = 600;
		// How far blocks are apart of each other vertically
		this.verticalSpacing = 270;
		// X Position of the last block so we know where to add the next
		this.lastBlock = 0;
		// Y Position of the last block and starting position of bird
		this.lastY = 300;
	}

	Game.prototype = {

		create: function () {

			// Put everything in world group that we scale
			this.world = this.game.add.group();
			this.world.scale.setTo(this.game.gameScale * 10 / 10, this.game.gameScale * 10 / 10);

			// Set Background
			this.world.create(0, 0, 'background');

			// Setup Bird
			this.bird = this.world.create(400, this.lastY, 'bird');
			this.bird.anchor.setTo(0.5, 0.5);
			this.bird.animations.add('fly');
			this.bird.animations.play('fly', 10, true);

			// Setup Gravity
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);
			this.bird.body.bounce.y = 0.1;
			this.bird.body.gravity.y = 500;
			this.bird.body.velocity.x = 0;
			this.bird.body.collideWorldBounds = true;

			// Setup Blocks	
			this.blockGroup = this.game.add.group();
			this.blockGroup.enableBody = true;

			for (var i = 0; i < this.numberOfBlocks; ++i) {

				var x = 1920 + (i * this.blockSpacing);
				var y = this.getNewYPosition();

				this.lastY = y;
				this.lastBlock = x;

				var topBlock = this.blockGroup.create(x, y, 'block-top');
				topBlock.anchor.setTo(0.5, 1);
				topBlock.body.immovable = true;
				topBlock.body.updateBounds(1, 1);

				var bottomBlock = this.blockGroup.create(x, y + this.verticalSpacing, 'block-bottom');
				bottomBlock.anchor.setTo(0.5, 0);
				bottomBlock.body.immovable = true;
			}
			this.game.physics.enable(this.blockGroup, Phaser.Physics.ARCADE);
			this.blockGroup.setAll('body.velocity.x', -200);
			this.world.add(this.blockGroup);

			// Setup Score
			this.score = 0;
			this.scoreText = this.add.bitmapText(40, 20, 'gamefont', '' + this.score);
			this.scoreText.scale.setTo(4, 4);
			this.world.add(this.scoreText);

			// Setup KeyBoard
			this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		},

		update: function () {

			this.physics.arcade.collide(this.bird, this.blockGroup, this.gameOver, null, this);

			this.updateBird();
			this.updateBlocks();
		},

		updateBird: function () {
			if (this.jumpButton.isDown || this.game.didFlap) {
				this.bird.body.velocity.y = -300;
				this.game.didFlap = false;
			}
			this.bird.rotation = this.bird.body.velocity.y / 480.0;
			if (this.bird.y > 875) {
				this.gameOver();
			}
		},

		updateBlocks: function () {
			var lastX = 0;
			var newY = 0;
			var scored = false;
			this.blockGroup.forEach(function (block) {

				//Check If Scored
				if (!block.scored && block.x + block.width * 0.5 < this.bird.x - this.bird.width * 0.5) {
					scored = true;
					block.scored = true;
				}

				if (block.x > lastX) {
					lastX = block.x;
				} else if (block.x < -200) {

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

		gameOver: function () {
			this.game.state.states['menu'].score = this.score;
			this.game.state.start('menu');
		}
	};

	window['flappybird'] = window['flappybird'] || {};
	window['flappybird'].Game = Game;

}());