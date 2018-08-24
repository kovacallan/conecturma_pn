
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
		this.caminho = getPathFile(UV1AV2UD5OA02);

		this.load.image('background', this.caminho+'background.png');
		
		this.load.atlas('folhas_vazias', this.caminho+'folhas_vazias.png', this.caminho+'folhas_vazias.json');
		this.load.atlas('simbolos', this.caminho+'letrasNumSinais.png', this.caminho+'letrasNumSinais.json');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD5OA02);

		this.load.audio('soundP1', this.caminho+'UV1AV2UD5OA2_CALL_TO_ACTION.mp3');
	
		this.load.audio('soundDica', this.caminho+'UV1AV2UD5OA2_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD5OA2_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD5OA2_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD5OA2_INTRO.mp3');
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
