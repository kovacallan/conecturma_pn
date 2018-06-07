

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
		this.caminho = getPathFile(UV1AV2UD6OA01);

		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('juninho_anim', this.caminho+'juninho_anim.png', this.caminho+'juninho_anim.json');

		// GAMEPLAY
		
		this.load.atlas('right_fish', this.caminho+'blue_fish_anim.png', this.caminho+'blue_fish_anim.json');
		this.load.atlas('left_fish', this.caminho+'green_fish_anim.png', this.caminho+'green_fish_anim.json');
		
		this.load.image('resumo_3', this.caminho+'resumo_3.png');
		this.load.image('resumo_1', this.caminho+'resumo_1.png');
		this.load.image('resumo_2', this.caminho+'resumo_2.png');
		
		this.load.atlas('placa', this.caminho+'placa.png', this.caminho+'placa.json');
		
		// BUTTONS
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD6OA01);

		this.load.audio('pergunta_1_aud', this.caminho+'UV1AV2UD6OA1_P1.mp3');
		this.load.audio('pergunta_2_aud', this.caminho+'UV1AV2UD6OA1_P2.mp3');
		this.load.audio('pergunta_3_aud', this.caminho+'UV1AV2UD6OA1_P3.mp3');
		this.load.audio('pergunta_4_aud', this.caminho+'UV1AV2UD6OA1_P4.mp3');
		this.load.audio('pergunta_5_aud', this.caminho+'UV1AV2UD6OA1_P5.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD6OA1_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD6OA1_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD6OA1_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD6OA1_INTRO.mp3');
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
