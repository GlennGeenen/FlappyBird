(function () {
    'use strict';

    function Game() {
        this.bird = null;
        this.jumpButton = null;
        this.blockGroup = null;
        this.scoreText = null;
    }

    Game.prototype = {

        create: function () {

            // Set Background
            this.add.sprite(0, 0, 'background');

            // Start Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Setup game variables
            this.setupVariables();

            // Setup Bird
            this.createBird();

            // Setup Blocks	
            this.createBlocks();

            // Setup Score Text
            this.scoreText = this.add.bitmapText(40, 20, 'gamefont', '' + this.score);
            this.scoreText.scale.setTo(4, 4);

            // Setup Touch
            this.game.input.onDown.add(this.flap, this);
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

        createBird: function () {
            this.bird = this.add.sprite(400, this.lastY, 'bird');
            this.bird.anchor.set(0.5);
            this.bird.animations.add('fly');
            this.bird.animations.play('fly', 10, true);
            this.physics.arcade.enable(this.bird);
            this.bird.body.bounce.y = 0.1;
            this.bird.body.gravity.y = 500;
            this.bird.body.velocity.x = 0;
            this.bird.body.collideWorldBounds = true;
        },

        createBlocks: function () {
            this.blockGroup = this.add.group();
            this.blockGroup.enableBody = true;
            this.blockGroup.physicsBodyType = Phaser.Physics.ARCADE;

            for (var i = 0; i < this.numberOfBlocks; ++i) {
                var x = this.game.width + (i * this.blockSpacing);
                var y = this.getNewYPosition();

                this.lastY = y;
                this.lastBlock = x;

                // We always create a top and a bottom block
                var topBlock = this.blockGroup.create(x, y, 'block-top');
                topBlock.anchor.setTo(0.5, 1);
                topBlock.body.immovable = true;

                var bottomBlock = this.blockGroup.create(x, y + this.verticalSpacing, 'block-bottom');
                bottomBlock.anchor.setTo(0.5, 0);
                bottomBlock.body.immovable = true;
            }

            this.blockGroup.setAll('body.velocity.x', -200);
        },

        update: function () {

            this.physics.arcade.collide(this.bird, this.blockGroup, this.gameOver, null, this);

            this.updateBird();
            this.updateBlocks();
        },

        updateBird: function () {
            if (this.game.didFlap) {
                this.flap();
            }
            this.bird.rotation = this.bird.body.velocity.y / 480.0;
            if (this.bird.y > 875) {
                this.gameOver();
            }
        },

        flap: function () {
            // Setting velocity.y makes you go up
            this.bird.body.velocity.y = -350;
            this.game.didFlap = false;
        },

        updateBlocks: function () {
            var lastX = 0;
            var newY = 0;
            var scored = false;
            this.blockGroup.forEach(function (block) {

                // Check If Scored
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

        gameOver: function () {
            this.game.state.states['menu'].score = this.score;
            this.game.state.start('menu');
        }
    };

    window['flappybird'] = window['flappybird'] || {};
    window['flappybird'].Game = Game;

}());