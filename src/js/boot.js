(function () {
	'use strict';

	function Boot() {}

	Boot.prototype = {

		preload: function () {
			this.load.image('preloader', 'assets/preloader.gif');
		},

		create: function () {
			this.game.input.maxPointers = 1;

			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.minWidth = 480;
			this.scale.minHeight = 240;
			this.scale.maxWidth = 1920;
			this.scale.maxHeight = 1080;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.setScreenSize(true);

			this.game.state.start('preloader');
		}
	};

	window['flappybird'] = window['flappybird'] || {};
	window['flappybird'].Boot = Boot;

}());