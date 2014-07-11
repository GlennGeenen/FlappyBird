(function () {
	'use strict';

	function Boot() {}

	Boot.prototype = {

		preload: function () {
			this.load.image('preloader', 'assets/preloader.gif');
		},

		create: function () {
			this.game.input.maxPointers = 1;
			this.game.scale.forceLandscape = true;
			this.game.state.start('preloader');
		}
	};

	window['flappybird'] = window['flappybird'] || {};
	window['flappybird'].Boot = Boot;

}());