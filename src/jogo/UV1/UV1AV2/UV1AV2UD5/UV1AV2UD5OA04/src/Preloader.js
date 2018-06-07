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
		this.caminho = getPathFile(UV1AV2UD5OA04);

		this.load.image('background', this.caminho+'background.png');
		this.load.image('ramo', this.caminho+'ramo.png');

		this.load.image('chuchu', this.caminho+'chuchu.png');
		this.load.image('pinheiro', this.caminho+'pinheiro.png');


		// CHARACTER ANIMATION
		this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');
		this.load.atlas('urubu', this.caminho+'anim_urubu.png', this.caminho+'anim_urubu.json');
		this.load.atlas('urubu_happy', this.caminho+'anim_urubu_happy.png', this.caminho+'anim_urubu_happy.json');

		this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
	
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD5OA04);

		this.load.audio('soundP1', this.caminho+'UV1AV2UD5OA4_CALL_TO_ACTION.mp3');
		this.load.audio('abelha', this.caminho+'UV1AV2UD5OA4_P1_ABELHA.mp3');
		this.load.audio('caminho', this.caminho+'UV1AV2UD5OA4_P1_CAMINHO.mp3');
		this.load.audio('chapeu', this.caminho+'UV1AV2UD5OA4_P1_CHAPEU.mp3');

		this.load.audio('cochilo', this.caminho+'UV1AV2UD5OA4_P2_COCHILO.mp3');
		this.load.audio('coelho', this.caminho+'UV1AV2UD5OA4_P2_COELHO.mp3');
		this.load.audio('ninho', this.caminho+'UV1AV2UD5OA4_P2_NINHO.mp3');
	
		this.load.audio('chuva', this.caminho+'UV1AV2UD5OA4_P3_CHUVA.mp3');
		this.load.audio('galinha', this.caminho+'UV1AV2UD5OA4_P3_GALINHA.mp3');
		this.load.audio('milho', this.caminho+'UV1AV2UD5OA4_P3_MILHO.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD5OA4_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD5OA4_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD5OA4_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD5OA4_INTRO.mp3');
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


	

};
