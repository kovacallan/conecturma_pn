
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
	this.effectFinished = false;

};

BasicGame.Preloader.prototype = {



	createPreloadEffect: function() {

		var bg = this.add.sprite(this.world.centerX, this.world.centerY, "preloader","loadingBackground");
		bg.anchor.set(0.5,0.5);
		bg.scale.set(0.4,0.4);
		bg.alpha = 0;

		this.add.tween(bg).to({alpha: 1}, 250, Phaser.Easing.Quadratic.Out, true);
		this.add.tween(bg.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out, true);

		var txt = this.add.sprite(this.world.centerX, this.world.centerY-30, "preloader","loadingText");
		txt.anchor.set(0.5,0.5);
		txt.scale.set(0.4,0.4);
		txt.alpha = 0;

		this.add.tween(txt).to({alpha: 1}, 250, Phaser.Easing.Quadratic.Out, true, 250);
		this.add.tween(txt.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out, true, 250).onComplete.add(function() {

			this.preloadEmpty.alpha = 1;
			this.preloadBar.alpha = 1;

			this.effectFinished = true;

		}, this);

		this.preloadEmpty = this.add.sprite(this.world.centerX-175, this.world.centerY, "preloader",'preloaderBarEmpty');
		this.preloadEmpty.alpha = 0;

		this.preloadBar = this.add.sprite(this.world.centerX-175, this.world.centerY, "preloader",'preloaderBarFull');
		this.preloadBar.alpha = 0;

		this.load.setPreloadSprite(this.preloadBar);
	},

	preload: function () {

		this.game.canvas.className = "visible";
		this.createPreloadEffect();
		

//UV1MAPA
		// SCENE

		this.caminho = getPathFileMapaUniverso(UV1MAPA);

		this.load.image('background', this.caminho+'background.png');

		this.load.image('unidade1', this.caminho+'unidade1.png');
		this.load.image('unidade2', this.caminho+'unidade2.png');
		this.load.image('unidade3', this.caminho+'unidade3.png');

		
		this.load.spritesheet('buttonLeft', this.caminho+'buttonLeft.png', 95,100);
		this.load.spritesheet('buttonRight', this.caminho+'buttonRight.png', 95,100);
		

		//this.load.atlas('button1', 'images/btn1.png', 'images/btn1.json');
		
		
		//this.load.audio('soundIntro', ['sound/JC-UV1AV1UD1OA1-Mat-INTRO.mp3']);
	},

	create: function () {
		this.preloadBar.cropEnabled = true;
		this.state.start('Game');
	},

	update: function () {
		
		if (this.cache.isSoundDecoded('soundIntro') && this.ready == false && this.effectFinished)
		{
			this.ready = true;
			this.state.start('Game');
		}

	}

};
