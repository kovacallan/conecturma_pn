
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
		this.caminho = getPathFile(UV1AV2UD6OA05);

		this.load.image('background', this.caminho+'background.png');
		this.load.image('position_rocks', this.caminho+'pedras.png');
		this.load.image('cenario', this.caminho+'cenario.png');

		// GAMEPLAY
		
		this.load.image('position_0', this.caminho+'poly_podium.png');
		this.load.image('position_1', this.caminho+'juninho_podium.png');
		this.load.image('position_2', this.caminho+'curupira_podium.png');
		this.load.image('position_3', this.caminho+'fred_podium.png');
		this.load.image('position_4', this.caminho+'saci_podium.png');
		
		// BUTTONS
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD6OA05);

		this.load.audio('soundDica', this.caminho+'UV1AV2UD6OA5_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD6OA5_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD6OA5_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD6OA5_INTRO.mp3');
		this.load.audio('soundCallToAction', this.caminho+'UV1AV2UD6OA5_Call_To_Action.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
