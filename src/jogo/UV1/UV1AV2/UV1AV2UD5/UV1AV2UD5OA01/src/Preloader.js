BasicGame.Preloader = function (game) {

    this.initExtends();

    BasicGame.PreloaderBase.call(game);
};

BasicGame.Preloader.prototype = Object.create(BasicGame.PreloaderBase.prototype);
BasicGame.Preloader.prototype.constructor = BasicGame.Preloader;

BasicGame.Preloader.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Preloader.prototype[name] = this.extends[name];
    }
};

BasicGame.Preloader.prototype.extends = {

	preload: function () {

		this.initPreloaderBase();

        	

		
		
		// SCENE
		this.caminho = getPathFile(UV1AV2UD5OA01);

		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');
		this.load.atlas('cartas', this.caminho+'cartas.png', this.caminho+'cartas.json');
		
		// GAMEPLAY
		
		this.load.image('caderno1', this.caminho+'caderno_p1.png');
		this.load.image('caderno2', this.caminho+'caderno_p2.png');
		this.load.image('caderno3', this.caminho+'caderno_p3.png');
		
		this.load.image('estrela', this.caminho+'estrela.png');
		this.load.image('resumoQuadro', this.caminho+'resumo_quadro.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD5OA01);

		this.load.audio('soundP1', this.caminho+'UV1AV2UD5OA1_P1.mp3');
		this.load.audio('soundP2', this.caminho+'UV1AV2UD5OA1_P2.mp3');
		this.load.audio('soundP3', this.caminho+'UV1AV2UD5OA1_P3.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD5OA1_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD5OA1_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD5OA1_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD5OA1_INTRO.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
