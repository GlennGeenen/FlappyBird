var game = null;

window.onload = function () {
  'use strict';

  var ns = window['flappybird'];
  game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'flappybird');

  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);

  game.state.start('boot');
  
  var connection = new WebSocket('ws://localhost:3333/kinect');
	
  // When the connection is open, send some data to the server
  connection.onopen = function () {
      console.log('Websocket open');
  };

  // Log errors
  connection.onerror = function (error) {
      console.log('WebSocket Error ' + JSON.stringify(error));
  };

  // Log messages from the server
  connection.onmessage = function (e) {
      game.bodies = JSON.parse(e.data);    
  };
  
};