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
		this.caminho = getPathFile(UV1AV2UD4OA04);

		this.load.image('background', this.caminho+'background.png');
		this.load.atlasJSONHash('poly_anim', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlasJSONHash('saci_anim', this.caminho+'anim_saci.png', this.caminho+'anim_saci.json');

		// GAMEPLAY
		
		this.load.atlas('animais', this.caminho+'animais.png', this.caminho+'animais.json');
		
		// BUTTONS
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD4OA04);

		this.load.audio('pergunta_1_aud', this.caminho+'UV1AV2UD4OA4_P1.mp3');
		this.load.audio('pergunta_2_aud', this.caminho+'UV1AV2UD4OA4_P2.mp3');
		this.load.audio('pergunta_3_aud', this.caminho+'UV1AV2UD4OA4_P3.mp3');
		this.load.audio('pergunta_4_aud', this.caminho+'UV1AV2UD4OA4_P4.mp3');
		
		this.load.audio('pergunta_1_0_aud', this.caminho+'UV1AV2UD4OA4_P1_BOI.mp3');
		this.load.audio('pergunta_1_3_aud', this.caminho+'UV1AV2UD4OA4_P1_FORMIGA.mp3');
		this.load.audio('pergunta_1_1_aud', this.caminho+'UV1AV2UD4OA4_P1_MICO.mp3');
		this.load.audio('pergunta_1_4_aud', this.caminho+'UV1AV2UD4OA4_P1_BESOURO.mp3');
		this.load.audio('pergunta_1_2_aud', this.caminho+'UV1AV2UD4OA4_P1_LEAO.mp3');
		this.load.audio('pergunta_1_5_aud', this.caminho+'UV1AV2UD4OA4_P1_MINHOCA.mp3');
		
		this.load.audio('pergunta_2_0_aud', this.caminho+'UV1AV2UD4OA4_P2_ESCORPIAO.mp3');
		this.load.audio('pergunta_2_3_aud', this.caminho+'UV1AV2UD4OA4_P2_BOTO.mp3');
		this.load.audio('pergunta_2_1_aud', this.caminho+'UV1AV2UD4OA4_P2_TARTARUGA.mp3');
		this.load.audio('pergunta_2_4_aud', this.caminho+'UV1AV2UD4OA4_P2_TIGRE.mp3');
		this.load.audio('pergunta_2_2_aud', this.caminho+'UV1AV2UD4OA4_P2_ARANHA.mp3');
		this.load.audio('pergunta_2_5_aud', this.caminho+'UV1AV2UD4OA4_P2_RA.mp3');
		
		this.load.audio('pergunta_3_0_aud', this.caminho+'UV1AV2UD4OA4_P3_ELEFANTE.mp3');
		this.load.audio('pergunta_3_3_aud', this.caminho+'UV1AV2UD4OA4_P3_TATU.mp3');
		this.load.audio('pergunta_3_1_aud', this.caminho+'UV1AV2UD4OA4_P3_MACACO.mp3');
		this.load.audio('pergunta_3_4_aud', this.caminho+'UV1AV2UD4OA4_P3_SAPO.mp3');
		this.load.audio('pergunta_3_2_aud', this.caminho+'UV1AV2UD4OA4_P3_HIPOPOTAMO.mp3');
		this.load.audio('pergunta_3_5_aud', this.caminho+'UV1AV2UD4OA4_P3_PEIXE.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD4OA4_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD4OA4_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD4OA4_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD4OA4_INTRO.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
