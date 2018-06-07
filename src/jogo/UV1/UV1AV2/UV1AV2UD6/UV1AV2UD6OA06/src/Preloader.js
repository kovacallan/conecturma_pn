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

        


		//INITIAL
		
		this.caminho = getPathFile(UV1AV2UD6OA06);

		this.load.image('intro_carta', this.caminho+'intro_carta.png');
		this.load.image('intro_bolha1', this.caminho+'intro_bolha1.png');
		this.load.image('intro_bolha2', this.caminho+'intro_bolha2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('juninho_anim', this.caminho+'juninho_anim.png', this.caminho+'juninho_anim.json');
		
		// GAMEPLAY
		
		this.load.atlas('cartas', this.caminho+'cartas.png', this.caminho+'cartas.json');
		this.load.atlas('respostas', this.caminho+'palavras1.png', this.caminho+'palavras1.json');
		this.load.image('bolha', this.caminho+'bolha.png');
		this.load.image('papel', this.caminho+'papel.png');
		
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD6OA06);

		this.load.audio('pergunta_aud_1', this.caminho+'UV1AV2UD6OA6_P1.mp3');
		this.load.audio('pergunta_aud_2', this.caminho+'UV1AV2UD6OA6_P2.mp3');
		this.load.audio('pergunta_aud_3', this.caminho+'UV1AV2UD6OA6_P3.mp3');
		
		// BUTTONS
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD6OA6_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD6OA6_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD6OA6_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD6OA6_INTRO.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
