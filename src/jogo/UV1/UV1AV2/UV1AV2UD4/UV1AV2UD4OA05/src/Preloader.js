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
		this.caminho = getPathFile(UV1AV2UD4OA05);

		this.load.image('resumoImg', this.caminho+'resumo_img.png');
		
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('poly_anim', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlas('saci_anim', this.caminho+'anim_saci.png', this.caminho+'anim_saci.json');

		// GAMEPLAY
		
		this.load.atlas('formas', this.caminho+'formas.png', this.caminho+'formas.json');
		this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
		
		this.load.image('resumo_1', this.caminho+'resumo_paralelepipedo.png');
		this.load.image('resumo_2', this.caminho+'resumo_esfera.png');
		this.load.image('resumo_3', this.caminho+'resumo_cube.png');
		
		this.load.image('pergunta_11_form', this.caminho+'paralelepipedo.png');
		this.load.image('pergunta_12_form', this.caminho+'esfera.png');
		this.load.image('pergunta_2_form', this.caminho+'cubo.png');
		
		this.load.image('placa', this.caminho+'placa.png');
		
		// BUTTONS
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD4OA05);

		this.load.audio('pergunta_11_aud', this.caminho+'UV1AV2UD4OA3_P1.mp3');
		this.load.audio('pergunta_12_aud', this.caminho+'UV1AV2UD4OA3_P2.mp3');
		this.load.audio('pergunta_2_aud', this.caminho+'UV1AV2UD4OA3_P3.mp3');
		this.load.audio('pergunta_3_aud', this.caminho+'UV1AV2UD4OA3_P4.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD4OA3_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD4OA3_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD4OA3_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD4OA3_INTRO.mp3');
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
