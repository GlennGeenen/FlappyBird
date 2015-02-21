window.onload = function () {
    'use strict';

    var ns = window['flappybird'];
    var game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'flappybird');

    game.state.add('boot', ns.Boot);
    game.state.add('preloader', ns.Preloader);
    game.state.add('menu', ns.Menu);
    game.state.add('game', ns.Game);

    game.state.start('boot');
};