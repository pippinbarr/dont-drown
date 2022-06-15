
BasicGame.Preloader = function (game) {

	// this.background = null;
	// this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		// this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(0, 400, 'loadingBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, the lines below won't work as the files themselves will 404, they are just an example of use.
		this.load.spritesheet('drowner', 'images/drowner.png', 54, 120);

		this.load.image('cloud1', 'images/cloud1.png');
		this.load.image('cloud2', 'images/cloud2.png');
		this.load.image('cloud3', 'images/cloud3.png');
		this.load.image('cloud4', 'images/cloud4.png');
		this.load.image('cloud5', 'images/cloud5.png');
		this.load.image('cloud6', 'images/cloud6.png');
		this.load.image('cloud7', 'images/cloud7.png');
		this.load.image('cloud8', 'images/cloud8.png');
		this.load.image('waterFG', 'images/waterFG.png');
		this.load.image('skyBG', 'images/skyBG.png');
		this.load.spritesheet('waves1', 'images/waves1.png', 480, 50);
		this.load.spritesheet('waves2', 'images/waves2.png', 480, 50);

		this.load.image('splash', 'images/splash.png');
		// this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		// this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		// this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here


	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		// this.preloadBar.cropEnabled = false;
		
		this.state.start('Game');

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		// if (this.ready == false)
		// {
		// 	this.ready = true;
		// }

	}

};
