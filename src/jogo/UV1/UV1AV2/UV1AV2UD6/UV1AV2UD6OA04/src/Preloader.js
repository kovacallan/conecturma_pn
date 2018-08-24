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
		this.caminho = getPathFile(UV1AV2UD6OA04);

		this.load.image('background', this.caminho+'background.png');
		this.load.image('background_2', this.caminho+'background_2.png');
		this.load.image('onda', this.caminho+'onda.png');
		this.load.image('onda_2', this.caminho+'onda_2.png');
		this.load.image('bolhas', this.caminho+'bolhas.png');
		
		// GAMEPLAY
		
		this.load.image('mao_rr', this.caminho+'mao_rr.png', this.caminho+'mao_rr.json');
		this.load.image('mao_ss', this.caminho+'mao_ss.png', this.caminho+'mao_ss.json');
		
		this.load.image('peixe_1_0', this.caminho+'peixe_1_0.png');
		this.load.image('peixe_1_1', this.caminho+'peixe_1_1.png');
		this.load.image('peixe_1_2', this.caminho+'peixe_1_2.png');
		this.load.image('peixe_1_3', this.caminho+'peixe_1_3.png');
		this.load.image('peixe_1_4', this.caminho+'peixe_1_4.png');
		this.load.image('peixe_1_5', this.caminho+'peixe_1_5.png');
		
		this.load.image('peixe_2_0', this.caminho+'peixe_2_0.png');
		this.load.image('peixe_2_1', this.caminho+'peixe_2_1.png');
		this.load.image('peixe_2_2', this.caminho+'peixe_2_2.png');
		this.load.image('peixe_2_3', this.caminho+'peixe_2_3.png');
		this.load.image('peixe_2_4', this.caminho+'peixe_2_4.png');
		this.load.image('peixe_2_5', this.caminho+'peixe_2_5.png');
		this.load.image('peixe_2_6', this.caminho+'peixe_2_6.png');
		this.load.image('peixe_2_7', this.caminho+'peixe_2_7.png');
		this.load.image('peixe_2_8', this.caminho+'peixe_2_8.png');
		
		this.load.image('peixe_3_0', this.caminho+'peixe_3_0.png');
		this.load.image('peixe_3_1', this.caminho+'peixe_3_1.png');
		this.load.image('peixe_3_2', this.caminho+'peixe_3_2.png');
		this.load.image('peixe_3_3', this.caminho+'peixe_3_3.png');
		this.load.image('peixe_3_4', this.caminho+'peixe_3_4.png');
		this.load.image('peixe_3_5', this.caminho+'peixe_3_5.png');
		this.load.image('peixe_3_6', this.caminho+'peixe_3_6.png');
		this.load.image('peixe_3_7', this.caminho+'peixe_3_7.png');
		this.load.image('peixe_3_8', this.caminho+'peixe_3_8.png');
		this.load.image('peixe_3_9', this.caminho+'peixe_3_9.png');
		this.load.image('peixe_3_10', this.caminho+'peixe_3_10.png');
		this.load.image('peixe_3_11', this.caminho+'peixe_3_11.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD6OA04);

		this.load.audio('peixe_1_0_aud', this.caminho+'UV1AV2UD6OA4_RR_BARRO.mp3');
		this.load.audio('peixe_1_1_aud', this.caminho+'UV1AV2UD6OA4_LAMA.mp3');
		this.load.audio('peixe_1_2_aud', this.caminho+'UV1AV2UD6OA4_SS_PASSARO.mp3');
		this.load.audio('peixe_1_3_aud', this.caminho+'UV1AV2UD6OA4_MOSQUITO.mp3');
		this.load.audio('peixe_1_4_aud', this.caminho+'UV1AV2UD6OA4_RR_CORRIDA.mp3');
		this.load.audio('peixe_1_5_aud', this.caminho+'UV1AV2UD6OA4_CAMINHADA.mp3');
			
		this.load.audio('peixe_2_0_aud', this.caminho+'UV1AV2UD6OA4_SS_PESSEGO.mp3');
		this.load.audio('peixe_2_1_aud', this.caminho+'UV1AV2UD6OA4_MACA.mp3');
		this.load.audio('peixe_2_2_aud', this.caminho+'UV1AV2UD6OA4_PERA.mp3');
		this.load.audio('peixe_2_3_aud', this.caminho+'UV1AV2UD6OA4_RR_TERRENO.mp3');
		this.load.audio('peixe_2_4_aud', this.caminho+'UV1AV2UD6OA4_CAMPO.mp3');
		this.load.audio('peixe_2_5_aud', this.caminho+'UV1AV2UD6OA4_QUINTAL.mp3');
		this.load.audio('peixe_2_6_aud', this.caminho+'UV1AV2UD6OA4_SS_GIRASSOL.mp3');
		this.load.audio('peixe_2_7_aud', this.caminho+'UV1AV2UD6OA4_MARGARIDA.mp3');
		this.load.audio('peixe_2_8_aud', this.caminho+'UV1AV2UD6OA4_ROSA.mp3');
		
		this.load.audio('peixe_3_0_aud', this.caminho+'UV1AV2UD6OA4_RR_TERRA.mp3');
		this.load.audio('peixe_3_1_aud', this.caminho+'UV1AV2UD6OA4_AREIA.mp3');
		this.load.audio('peixe_3_2_aud', this.caminho+'UV1AV2UD6OA4_MATO.mp3');
		this.load.audio('peixe_3_3_aud', this.caminho+'UV1AV2UD6OA4_GRAMA.mp3');
		this.load.audio('peixe_3_4_aud', this.caminho+'UV1AV2UD6OA4_SS_SOSSEGO.mp3');
		this.load.audio('peixe_3_5_aud', this.caminho+'UV1AV2UD6OA4_CALMA.mp3');
		this.load.audio('peixe_3_6_aud', this.caminho+'UV1AV2UD6OA4_TRANKS.mp3');
		this.load.audio('peixe_3_7_aud', this.caminho+'UV1AV2UD6OA4_AGUA.mp3');
		this.load.audio('peixe_3_8_aud', this.caminho+'UV1AV2UD6OA4_RR_MARROM.mp3');
		this.load.audio('peixe_3_9_aud', this.caminho+'UV1AV2UD6OA4_AZUL.mp3');
		this.load.audio('peixe_3_10_aud', this.caminho+'UV1AV2UD6OA4_VERDE.mp3');
		this.load.audio('peixe_3_11_aud', this.caminho+'UV1AV2UD6OA4_VERMELHO.mp3');
		
		// BUTTONS
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD6OA4_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD6OA4_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD6OA4_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD6OA4_INTRO.mp3');
		this.load.audio('soundCallToAction', this.caminho+'UV1AV2UD6OA4_CALL_TO_ACTION.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
