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
    
    // game.bodies.push(JSON.parse('{"Joints":{"SpineBase":{"JointType":0,"Position":{"X":-0.636280656,"Y":-0.111688107,"Z":1.90218878},"TrackingState":2},"SpineMid":{"JointType":1,"Position":{"X":-0.6299072,"Y":0.144937381,"Z":1.88684094},"TrackingState":2},"Neck":{"JointType":2,"Position":{"X":-0.6155468,"Y":0.392872065,"Z":1.85757339},"TrackingState":2},"Head":{"JointType":3,"Position":{"X":-0.6007323,"Y":0.5508295,"Z":1.83257127},"TrackingState":2},"ShoulderLeft":{"JointType":4,"Position":{"X":-0.7684441,"Y":0.471336067,"Z":1.90738285},"TrackingState":2},"ElbowLeft":{"JointType":5,"Position":{"X":-0.832878768,"Y":0.679317236,"Z":1.82923353},"TrackingState":2},"WristLeft":{"JointType":6,"Position":{"X":-0.792611837,"Y":0.944974542,"Z":1.83724415},"TrackingState":2},"HandLeft":{"JointType":7,"Position":{"X":-0.7774244,"Y":1.00433648,"Z":1.84004128},"TrackingState":2},"ShoulderRight":{"JointType":8,"Position":{"X":-0.442686051,"Y":0.401679516,"Z":1.88312554},"TrackingState":2},"ElbowRight":{"JointType":9,"Position":{"X":-0.345683157,"Y":0.6246492,"Z":1.82524538},"TrackingState":2},"WristRight":{"JointType":10,"Position":{"X":-0.3795036,"Y":0.9256571,"Z":1.8667469},"TrackingState":2},"HandRight":{"JointType":11,"Position":{"X":-0.383762062,"Y":0.982584238,"Z":1.87216687},"TrackingState":2},"HipLeft":{"JointType":12,"Position":{"X":-0.7007439,"Y":-0.108495332,"Z":1.87358141},"TrackingState":2},"KneeLeft":{"JointType":13,"Position":{"X":-0.7125258,"Y":-0.603274345,"Z":1.99513924},"TrackingState":2},"AnkleLeft":{"JointType":14,"Position":{"X":-0.6941392,"Y":-0.9862203,"Z":2.12513757},"TrackingState":2},"FootLeft":{"JointType":15,"Position":{"X":-0.645140648,"Y":-1.06107414,"Z":2.05925274},"TrackingState":2},"HipRight":{"JointType":16,"Position":{"X":-0.549510956,"Y":-0.11122591,"Z":1.86468422},"TrackingState":2},"KneeRight":{"JointType":17,"Position":{"X":-0.5474462,"Y":-0.6280261,"Z":1.97963834},"TrackingState":2},"AnkleRight":{"JointType":18,"Position":{"X":-0.564122856,"Y":-0.988396168,"Z":2.104707},"TrackingState":2},"FootRight":{"JointType":19,"Position":{"X":-0.6040878,"Y":-1.06437588,"Z":2.05757117},"TrackingState":2},"SpineShoulder":{"JointType":20,"Position":{"X":-0.62001276,"Y":0.332015,"Z":1.86715341},"TrackingState":2},"HandTipLeft":{"JointType":21,"Position":{"X":-0.756312847,"Y":1.07708871,"Z":1.86991382},"TrackingState":1},"ThumbLeft":{"JointType":22,"Position":{"X":-0.8138998,"Y":1.02046645,"Z":1.841972},"TrackingState":2},"HandTipRight":{"JointType":23,"Position":{"X":-0.40711534,"Y":1.05266476,"Z":1.904575},"TrackingState":2},"ThumbRight":{"JointType":24,"Position":{"X":-0.431169659,"Y":1.00241911,"Z":1.89},"TrackingState":2}},"TrackingId":72057594037960600}'));
    
  };
  
};