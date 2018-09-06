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
		this.caminho = getPathFile(UV1AV2UD6OA02);

		this.load.image('background', this.caminho+'background.png');
		
		// GAMEPLAY
		
		this.load.atlas('bolhas', this.caminho+'bolhas.png', this.caminho+'bolhas.json');
		this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
	
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD6OA02);

		this.load.audio('pergunta_aud_1', this.caminho+'UV1AV2UD6OA2_P1.mp3');
		this.load.audio('pergunta_aud_2', this.caminho+'UV1AV2UD6OA2_P2.mp3');
		this.load.audio('pergunta_aud_3', this.caminho+'UV1AV2UD6OA2_P3.mp3');
		
		// BUTTONS
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD6OA2_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD6OA2_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD6OA2_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD6OA2_INTRO.mp3');


	},


	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
