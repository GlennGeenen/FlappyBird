(function () {
    'use strict';

    function Preloader() {
        this.asset = null;
        this.ready = false;
    }

    Preloader.prototype = {

        preload: function () {
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.load.setPreloadSprite(this.asset);

            this.loadResources();
        },

        loadResources: function () {
            this.load.spritesheet('bird0', 'assets/bird0.png', 100, 69, 2);
            this.load.spritesheet('bird1', 'assets/bird1.png', 100, 69, 2);

            this.load.image('background', 'assets/background.png');
            this.load.image('block-top', 'assets/block-top.png');
            this.load.image('block-bottom', 'assets/block-bottom.png');
            this.load.image('start', 'assets/start.png');
            this.load.image('flap', 'assets/flap.png');

            this.load.bitmapFont('gamefont', 'assets/Arial.png', 'assets/Arial.xml');
        },

        create: function () {
            this.asset.cropEnabled = false;
        },

        update: function () {
            if (!!this.ready) {
                this.game.state.start('menu');
            }
        },

        onLoadComplete: function () {
            this.ready = true;
        }
    };

    window['flappybird'] = window['flappybird'] || {};
    window['flappybird'].Preloader = Preloader;

}());