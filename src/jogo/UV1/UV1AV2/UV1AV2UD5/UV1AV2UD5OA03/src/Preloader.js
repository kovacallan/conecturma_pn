
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
		
		
		// SCENE
		this.caminho = getPathFile(UV1AV2UD5OA03);

		this.load.image('background', this.caminho+'background.png');
		this.load.image('placa', this.caminho+'placa.png');


		// CHARACTER ANIMATION
		this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');
		this.load.atlas('borboleta_0', this.caminho+'borboleta_amarela.png', this.caminho+'borboleta_amarela.json');
		this.load.atlas('borboleta_1', this.caminho+'borboleta_azul.png', this.caminho+'borboleta_azul.json');
		this.load.atlas('borboleta_2', this.caminho+'borboleta_preta.png', this.caminho+'borboleta_preta.json');
		this.load.atlas('borboleta_3', this.caminho+'borboleta_rosa.png', this.caminho+'borboleta_rosa.json');
		this.load.atlas('borboleta_4', this.caminho+'borboleta_vermelha.png', this.caminho+'borboleta_vermelha.json');

		this.load.atlas('numeros_tecla', this.caminho+'numeros_tecla.png', this.caminho+'numeros_tecla.json');
		this.load.atlas('numeros', this.caminho+'numeros.png', this.caminho+'numeros.json');
		
		// GAMEPLAY
	
		this.load.image('imgResumo2', this.caminho+'resumo_img2.png');
		this.load.image('imgResumo3', this.caminho+'resumo_img3.png');
		this.load.image('imgResumo4', this.caminho+'resumo_img4.png');
		this.load.image('imgResumo5', this.caminho+'resumo_img5.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD5OA03);

		this.load.audio('soundP1', this.caminho+'UV1AV2UD5OA3_P1.mp3');
		this.load.audio('soundP2', this.caminho+'UV1AV2UD5OA3_P2.mp3');
		this.load.audio('soundP3', this.caminho+'UV1AV2UD5OA3_P3.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD5OA3_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD5OA3_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD5OA3_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD5OA3_INTRO.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
