var gameOver = false;
var activeButton = null;
var DROWNER_GRAVITY = 80;
var DROWNER_START_STRENGTH = 10;
var drownerCurrentStrength;

var currentCloud1, currentCloud2;

BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
};

BasicGame.Game.prototype = 
{

	create: function () 
    {

        // SETTINGS //

        this.stage.backgroundColor = "#FFFFFF";

        gameOver = false;
        activeButton = null;
        startTime = this.game.time.now;
        survivalTime = 0;
        oxygen = 100;
        drowned = false;
        canTryAgain = false;
        drownerCurrentStrength = DROWNER_START_STRENGTH;

        inputEnabled = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        // SPRITES //

        // Sky

        skyBG = this.add.sprite(0,0,'skyBG');

        // Clouds

        cloud1 = this.add.sprite(this.game.canvas.width,30,'cloud1');
        cloud2 = this.add.sprite(this.game.canvas.width,30,'cloud2');
        cloud3 = this.add.sprite(this.game.canvas.width,30,'cloud3');
        cloud4 = this.add.sprite(this.game.canvas.width,30,'cloud4');
        cloud5 = this.add.sprite(this.game.canvas.width,30,'cloud5');
        cloud6 = this.add.sprite(this.game.canvas.width,30,'cloud6');
        cloud7 = this.add.sprite(this.game.canvas.width,30,'cloud7');
        cloud8 = this.add.sprite(this.game.canvas.width,30,'cloud8');

        this.game.physics.enable(cloud1, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud2, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud3, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud4, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud5, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud6, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud7, Phaser.Physics.ARCADE);
        this.game.physics.enable(cloud8, Phaser.Physics.ARCADE);

        clouds = [cloud1,cloud2,cloud3,cloud4,cloud5,cloud6,cloud7,cloud8];

        currentCloud1 = cloud1;
        currentCloud1.body.x = this.game.canvas.width;
        currentCloud1.body.y = 0 + Math.random() * 200;
        currentCloud1.body.velocity.x = Math.random() * -10 + -10;

        currentCloud2 = cloud2;
        currentCloud2.body.x = this.game.canvas.width * 1.5 + Math.random() * 50;
        currentCloud1.body.y = 0 + Math.random() * 200;
        currentCloud2.body.velocity.x = Math.random() * -10 + -10;
        

        // Water BG

        waterBG = this.add.sprite(0,320,'waterFG');

        wavesBG = this.add.sprite(0,320,'waves1');
        wavesBG.animations.add('wave');
        wavesBG.animations.play('wave',1,true);

        // Drowner

        drowner = this.add.sprite(0,0,'drowner');
        drowner.animations.add('splash');
        this.game.physics.enable(drowner, Phaser.Physics.ARCADE);
        drowner.body.x = this.game.canvas.width/2 - drowner.width/2;
        drowner.body.y = this.game.canvas.height/2;

        drowner.body.velocity.x = drowner.body.velocity.y = 0;

        // Water FG

        waterFG = this.add.sprite(0,420,'waterFG');
        waterFG.alpha = 0.9;

        wavesFG = this.add.sprite(0,370,'waves2');
        wavesFG.alpha = 0.9;
        wavesFG.animations.add('wave');
        wavesFG.animations.play('wave',1,true);


        // EMITTERS //

        leftSplashEmitter = this.game.add.emitter(0, 0, 200);
        leftSplashEmitter.makeParticles('splash');
        leftSplashEmitter.gravity = 200;
        rightSplashEmitter = this.game.add.emitter(0, 0, 200);
        rightSplashEmitter.makeParticles('splash');
        rightSplashEmitter.gravity = 200;

        bubbleEmitter = this.game.add.emitter(0, 0,200);
        bubbleEmitter.makeParticles('splash');
        bubbleEmitter.gravity = -40;
        bubbleEmitter.setXSpeed(-2,2);
        bubbleEmitter.setYSpeed(-100,-120);   
        bubbleEmitter.bounce.setTo(0);
        bubbleEmitter.width = 4;


        // TEXTS //

        dontDrownText = this.add.text(40,this.game.canvas.height/2 - 48,"DON'T DROWN.",{ font: 'bold 52px sans-serif', fill: '#d64319' });

        drownText = this.add.text(40,40,"YOU DIDN'T DROWN FOR 10 MINUTES AND 34 SECONDS.",{ font: 'bold 36px sans-serif', fill: '#d64319', wordWrap: true, wordWrapWidth: 400});
        drownText.anchor.x = 0;
        drownText.anchor.y = 0;
        drownText.visible = false;



        tweetText = this.add.text(this.game.canvas.width/2,this.game.canvas.height - 120,"TWEET IT",{ font: '24px sans-serif', fill: '#fff' });
        tweetText.anchor.x = tweetText.anchor.y = 0.5;
        tweetText.inputEnabled = true;
        tweetText.events.onInputUp.add(this.buttonUp);
        tweetText.events.onInputDown.add(this.buttonDown);
        tweetText.events.onInputOut.add(this.buttonOut);
        tweetText.events.onInputOver.add(this.buttonOver);
        tweetText.visible = false;

        tryAgainText = this.add.text(this.game.canvas.width/2,this.game.canvas.height - 80,"TRY IT AGAIN",{ font: '24px sans-serif', fill: '#fff' });
        tryAgainText.anchor.x = tryAgainText.anchor.y = 0.5;
        tryAgainText.inputEnabled = true;
        tryAgainText.events.onInputUp.add(this.buttonUp);
        tryAgainText.events.onInputDown.add(this.buttonDown);
        tryAgainText.events.onInputOut.add(this.buttonOut);
        tryAgainText.events.onInputOver.add(this.buttonOver); 
        tryAgainText.visible = false;

        creditText = this.add.text(this.game.canvas.width/2,this.game.canvas.height - 40,"PIPPINBARR.COM",{ font: '24px sans-serif', fill: '#fff' });
        creditText.anchor.x = creditText.anchor.y = 0.5;
        creditText.inputEnabled = true;
        creditText.events.onInputUp.add(this.buttonUp);
        creditText.events.onInputDown.add(this.buttonDown);
        creditText.events.onInputOut.add(this.buttonOut);
        creditText.events.onInputOver.add(this.buttonOver); 
        creditText.visible = false;

        this.game.onPause.add(this.onGamePause,this);
        this.game.onResume.add(this.onGameResume,this);


        // CHECKING FOR SUSPICIOUS BEHAVIOUR //

        lastTime = this.game.time.now;
        this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.checkTime, this);    

        this.startTheGame();
    },


    startTheGame: function () 
    {
        // Start drowning.
        drowner.body.gravity.y = DROWNER_GRAVITY;

        // Game has started, remember when.
        startedTheGame = true;
        startTime = this.game.time.now;
    },


    checkTime: function () 
    {
        // Don't bother if the game isn't running
        if (gameOver) return;

        // If the last time we ran this is longer than it should be
        // then we have a problem...
        if (this.game.time.now - lastTime > 2500)
        {
            // So drown them
            this.handleGameOver();
        }
        else
        {
            // Otherwise remember this time for next time
            lastTime = this.game.time.now;
        }
    },


    onGamePause: function () 
    {
        if (gameOver) return;

        // They paused the game in one way or another,
        // so the game is over
        lastTime = this.game.time.now;
        this.handleGameOver();
    },


    onGameResume: function () {
        if (gameOver) return;

        // They resumed the game in one way or another,
        // so the game is over.
        // lastTime = this.game.time.now;
        this.handleGameOver();
    },


    webKitChange: function () 
    {
        // They did something with the webkit (like changing apps, say),
        // so the game is over.
        this.handleGameOver();
    },


    handleGameOver: function() 
    {
        // The game is over
        gameOver = true;

        // Make the drowner drown
        inputEnabled = false;
        drowned = true;
        drowner.animations.stop();
        drowner.frame = 0;
        bubbleEmitter.on = false;

        // Calculate how long they survived for...
        survivalTime = lastTime - startTime;
        theTime = Math.floor(survivalTime/1000);
        
        theStrings = [];

        yearString = "";
        years = Math.floor(theTime / (60*60*24*365));
        theTime -= years * (60*60*24*365);
        if (years > 0)
        {
            yearString += years;
            (years == 1) ? yearString += " year" : yearString += " years";
            theStrings.push(yearString);
        }
        dayString = "";
        days = Math.floor(theTime / (60*60*24));
        theTime -= days * (60*60*24);
        if (days > 0)
        {
            dayString += days;
            (days == 1) ? dayString += " day" : dayString += " days";
            theStrings.push(dayString);
        }
        hourString = "";
        hours = Math.floor(theTime / (60*60));
        theTime -= hours * (60*60);
        if (hours > 0)
        {
            hourString += hours;
            (days == 1) ? hourString += " hour" : hourString += " hours";
            theStrings.push(hourString);
        }
        minutesString = "";
        minutes = Math.floor(theTime / 60);
        theTime -= minutes * 60;
        if (minutes > 0)
        {
            minutesString += minutes;
            (days == 1) ? minutesString += " minute" : minutesString += " minutes";
            theStrings.push(minutesString);
        }
        secondsString = "";
        seconds = theTime;
        if (seconds > 0)
        {
            secondsString += seconds;
            (days == 1) ? secondsString += " second" : secondsString += " seconds";
            theStrings.push(secondsString);
        }
        
        drownText.text = "You didn't drown for ";
        
        finalTimeString = "";
        while (theStrings.length > 0)
        {
            nextString = theStrings.shift();
            finalTimeString += nextString;
            if (theStrings.length == 0)
            {
                finalTimeString += ".";
            }
            else if (theStrings.length == 1)
            {
                finalTimeString += ", AND ";
            }
            else if (theStrings.length > 1)
            {
                finalTimeString += ", ";
            }
        }

        drownText.text += finalTimeString;
        drownText.text = drownText.text.toUpperCase();

        drownText.y = waterBG.y - drownText.height;

        // And toggle visibility of the various texts
        drownText.visible = true;
        dontDrownText.visible = false;

        // And now let them try again (timer?)
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.setCanTryAgain, this);    
    },


    setCanTryAgain: function ()
    {
        // They can try again
        canTryAgain = true;

        // Toggle visibility of the relevant texts
        tweetText.visible = true;
        tryAgainText.visible = true;  
        creditText.visible = true;  
    },

    update: function () 
    {
        this.handleClouds();

        // Handle all the stuff
        this.handleOxygen();
        this.handleInput();
        this.handleTop();
        this.handleBottom();
    },



    handleClouds: function ()
    {
        if (currentCloud1.body.x + currentCloud1.width < 0)
        {
            currentCloud1.body.x = this.game.canvas.width;

            previousCloud1 = currentCloud1;
            while (currentCloud1 != previousCloud1 && currentCloud1 != currentCloud2)
            {
                currentCloud1 = clouds[Math.floor(Math.random() * clouds.length)];
            }

            currentCloud1.body.x = this.game.canvas.width + Math.random() * 50;
            currentCloud1.body.y = 0 + Math.random() * 200;
            currentCloud1.body.velocity.x = Math.random() * -10 + -10;
        }

        if (currentCloud2.body.x + currentCloud2.width < 0)
        {
            currentCloud2.body.x = this.game.canvas.width;

            previousCloud2 = currentCloud2;
            while (currentCloud2 != previousCloud2 && currentCloud2 != currentCloud1)
            {
                currentCloud2 = clouds[Math.floor(Math.random() * clouds.length)];
            }

            currentCloud2.body.x = this.game.canvas.width + Math.random() * 50;
            currentCloud2.body.y = 0 + Math.random() * 200;
            currentCloud2.body.velocity.x = Math.random() * -10 + -10;
        }
    },


    handleOxygen: function () 
    {
        // Take away some oxygen if their mouth is under the water
        if (!gameOver && !drowned && drowner.y > wavesFG.y - 20)
        {
            oxygen = Math.max(0, oxygen - 0.1);
            if (oxygen == 0)
            {
                // They have drowned
                lastTime = this.game.time.now;
                this.handleGameOver();
            }
            else
            {
                // Otherwise they're under water with oxygen and should emit bubbles
                bubbleEmitter.x = drowner.x + drowner.width/2;
                bubbleEmitter.y = drowner.y + 34;

                if (!bubbleEmitter.on)
                {
                    bubbleEmitter.start(false, 4000, 200, 10);
                }
            }
        }
        else if (!drowned)
        {
            // otherwise give it back and emit bubbles
            if (bubbleEmitter.on) bubbleEmitter.on = false;
            oxygen = Math.min(oxygen + 1,100);
        }

        // Handle the bubbles disappearing
        bubbleEmitter.forEachAlive(this.handleParticleOverlapsFG,this);
    },


    handleParticleOverlapsFG: function (p) 
    {
        // If a bubble touches the foreground (e.g. the "top" of the water)
        // then kill ("pop") it.
        if (p.y <= wavesFG.y + wavesFG.height) p.kill();
    },


    handleInput: function () 
    {
        if (!inputEnabled) return;

        // If they tap/click then make the drowner thrash,
        // go up a bit in the water,
        // and emit a splash.
        if (this.input.activePointer.justPressed(50))
        {
            // If they thrashed with arms above water, then splash
            if (drowner.y < wavesFG.y) this.makeSplash();

            // Calculate push upwards from splash
            if (drowner.body.velocity.y > -50) drowner.body.velocity.y += -2*DROWNER_START_STRENGTH * (oxygen/50);

            // Use oxygen to struggle under water
            if (drowner.y > wavesFG.y - 20) oxygen = (Math.max(0,oxygen - 1));

            // Play the animation
            drowner.animations.play('splash',10);
        }
    },


    handleTop: function () 
    {
        // Don't let the drowner go above the waterline
        if (drowner.body.y < wavesFG.y - 40)
        {
            drowner.body.y = wavesFG.y - 40;
        }
    },


    handleBottom: function ()
    {
        if (gameOver) return;

        // Drowner drowns if below the screen
        if (drowner.y > this.game.canvas.height)
        {
            lastTime = this.game.time.now;
            this.handleGameOver();
        }
    },


    makeSplash: function () 
    {
        //  Position the emitters relative to the drowner
        leftSplashEmitter.x = drowner.x;
        leftSplashEmitter.y = wavesFG.y;
        rightSplashEmitter.x = drowner.x + drowner.width;
        rightSplashEmitter.y = wavesFG.y;

        // Set them off
        leftSplashEmitter.start(true, 500, null, 10);
        rightSplashEmitter.start(true, 500, null, 10);

    },



    // BUTTON HANDLING //

    buttonUp: function ( b ) 
    {
        if (activeButton == b && b.input.pointerOver())
        {
            b.setStyle({ font: '24px sans-serif', fill: '#fff' });

            if (b == tweetText)
            {
                if (b.game.device.desktop)
                {
                    window.open("http://twitter.com/intent/tweet?text=" + "I didn't drown for " + finalTimeString + "&url=http://www.pippinbarr.com/games/dontdrown/","_system");                         
                }
                else
                {
                    nativeTwitter = window.open("twitter://post?message=" + "I didn't drown for " + finalTimeString + "! http://www.pippinbarr.com/games/dontdrown/","_self");
                    if (!nativeTwitter)
                    {
                        window.open("http://twitter.com/intent/tweet?text=" + "I didn't drown for " + finalTimeString + "http://www.pippinbarr.com/games/dontdrown/","_system");             
                    }
                }
            }
            else if (b == tryAgainText)
            {
                startedTheGame = false;
                b.game.state.start('Game');
            }
            else if (b == creditText)
            {
                window.open("http://www.pippinbarr.com/games/","_system");                                 
            }
        }
    },

    buttonDown: function ( b ) {
        activeButton = b;
        b.setStyle({ font: 'bold 24px sans-serif', fill: '#fff' });
    },

    buttonOut: function ( b ) {
        b.setStyle({ font: '24px sans-serif', fill: '#fff' });
    },

    buttonOver: function ( b ) {
        if (b != activeButton)
        {
            b.setStyle({ font: 'bold 24px sans-serif', fill: '#fff' });
        }
        else
        {
           b.setStyle({ font: 'bold 24px sans-serif', fill: '#fff' });           
       }
   },

};




