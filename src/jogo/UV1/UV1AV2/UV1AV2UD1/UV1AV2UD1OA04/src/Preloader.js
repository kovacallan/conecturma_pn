
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

		//this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');


		this.caminho = getPathFile(UV1AV2UD1OA04);

		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('capsulas', this.caminho+'background_anim.png', this.caminho+'background_anim.json');

		// GAMEPLAY
		
		this.load.atlas('words', this.caminho+'words.png', this.caminho+'words.json');
		
		this.load.atlas('intro_question', this.caminho+'pilulaM.png', this.caminho+'pilulaM.json');
		this.load.atlas('level1_question', this.caminho+'pilulaR.png', this.caminho+'pilulaR.json');
		this.load.atlas('level2_question', this.caminho+'pilulaX.png', this.caminho+'pilulaX.json');
		this.load.atlas('level3_question', this.caminho+'pilulaH.png', this.caminho+'pilulaH.json');

		this.load.image('trash', this.caminho+'trash.png');
	
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD1OA04);

		this.load.audio('pergunta_1_0', [this.caminho+'UV1AV2UD1OA4_P1_PORTAL.mp3']);
		this.load.audio('pergunta_1_1', [this.caminho+'UV1AV2UD1OA4_P1_ILHA.mp3']);
		this.load.audio('pergunta_1_2', [this.caminho+'UV1AV2UD1OA4_P1_TEXTO.mp3']);
		
		this.load.audio('pergunta_1_3', [this.caminho+'UV1AV2UD1OA4_P1_CORRER.mp3']);
		this.load.audio('pergunta_1_4', [this.caminho+'UV1AV2UD1OA4_P1_PEIXE.mp3']);
		this.load.audio('pergunta_1_5', [this.caminho+'UV1AV2UD1OA4_P1_NINHO.mp3']);
		
		this.load.audio('pergunta_1_6', [this.caminho+'UV1AV2UD1OA4_P1_ARQUIVO.mp3']);
		this.load.audio('pergunta_1_7', [this.caminho+'UV1AV2UD1OA4_P1_HELICE.mp3']);
		this.load.audio('pergunta_1_8', [this.caminho+'UV1AV2UD1OA4_P1_TAXI.mp3']);
		
		this.load.audio('pergunta_2_9', [this.caminho+'UV1AV2UD1OA4_P2_XALE.mp3']);
		this.load.audio('pergunta_2_10', [this.caminho+'UV1AV2UD1OA4_P2_REGUA.mp3']);
		this.load.audio('pergunta_2_11', [this.caminho+'UV1AV2UD1OA4_P2_LINHA.mp3']);
		
		this.load.audio('pergunta_2_12', [this.caminho+'UV1AV2UD1OA4_P2_LIXO.mp3']);
		this.load.audio('pergunta_2_13', [this.caminho+'UV1AV2UD1OA4_P2_GRITO.mp3']);
		this.load.audio('pergunta_2_14', [this.caminho+'UV1AV2UD1OA4_P2_CHUVA.mp3']);
		
		this.load.audio('pergunta_2_15', [this.caminho+'UV1AV2UD1OA4_P2_XODO.mp3']);
		this.load.audio('pergunta_2_16', [this.caminho+'UV1AV2UD1OA4_P2_GRUTA.mp3']);
		this.load.audio('pergunta_2_17', [this.caminho+'UV1AV2UD1OA4_P2_CHAVE.mp3']);
		
		this.load.audio('pergunta_3_18', [this.caminho+'UV1AV2UD1OA4_P3_LINHO.mp3']);
		this.load.audio('pergunta_3_19', [this.caminho+'UV1AV2UD1OA4_P3_RISCO.mp3']);
		this.load.audio('pergunta_3_20', [this.caminho+'UV1AV2UD1OA4_P3_XADREZ.mp3']);
		
		this.load.audio('pergunta_3_21', [this.caminho+'UV1AV2UD1OA4_P3_HOTEL.mp3']);
		this.load.audio('pergunta_3_22', [this.caminho+'UV1AV2UD1OA4_P3_XERIFE.mp3']);
		this.load.audio('pergunta_3_23', [this.caminho+'UV1AV2UD1OA4_P3_PROVA.mp3']);
		
		this.load.audio('pergunta_3_24', [this.caminho+'UV1AV2UD1OA4_P3_HOSPITAL.mp3']);
		this.load.audio('pergunta_3_25', [this.caminho+'UV1AV2UD1OA4_P3_XICARA.mp3']);
		this.load.audio('pergunta_3_26', [this.caminho+'UV1AV2UD1OA4_P3_COMPRIMIDO.mp3']);
		
		// BUTTONS

		
		
		this.load.audio('pergunta_1_aud', [this.caminho+'UV1AV2UD1OA4_P1.mp3']);
		this.load.audio('pergunta_2_aud', [this.caminho+'UV1AV2UD1OA4_P2.mp3']);
		this.load.audio('pergunta_3_aud', [this.caminho+'UV1AV2UD1OA4_P3.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV2UD1OA4_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD1OA4_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD1OA4_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD1OA4_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
