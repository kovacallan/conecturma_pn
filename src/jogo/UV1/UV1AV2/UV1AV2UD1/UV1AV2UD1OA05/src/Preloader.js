
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

		this.caminho = getPathFile(UV1AV2UD1OA05);
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('capsulas', this.caminho+'background_anim.png', this.caminho+'background_anim.json');
		this.load.atlas('bumba_idle', this.caminho+'bumba_anim.png', this.caminho+'bumba_anim.json');

		//this.load.atlas('intro', this.caminho+'intro.png', this.caminho+'intro.json');
		
		// GAMEPLAY
		
		this.load.image('time_1', this.caminho+'analog_1.png');
		this.load.image('time_2', this.caminho+'analog_2.png');
		this.load.image('time_3', this.caminho+'analog_3.png');
		this.load.image('time_4', this.caminho+'analog_4.png');
		this.load.image('time_5', this.caminho+'analog_5.png');
		this.load.image('time_6', this.caminho+'analog_6.png');
		this.load.image('time_7', this.caminho+'analog_7.png');
		this.load.image('time_8', this.caminho+'analog_8.png');
		this.load.image('time_9', this.caminho+'analog_9.png');
		this.load.image('time_10', this.caminho+'analog_10.png');
		this.load.image('time_11', this.caminho+'analog_11.png');
		this.load.image('time_12', this.caminho+'analog_12.png');
		
		this.load.image('time_13', this.caminho+'digital_1.png');
		this.load.image('time_14', this.caminho+'digital_2.png');
		this.load.image('time_15', this.caminho+'digital_3.png');
		this.load.image('time_16', this.caminho+'digital_4.png');
		this.load.image('time_17', this.caminho+'digital_5.png');
		this.load.image('time_18', this.caminho+'digital_6.png');
		this.load.image('time_19', this.caminho+'digital_7.png');
		this.load.image('time_20', this.caminho+'digital_8.png');
		this.load.image('time_21', this.caminho+'digital_9.png');
		this.load.image('time_22', this.caminho+'digital_10.png');
		this.load.image('time_23', this.caminho+'digital_11.png');
		this.load.image('time_24', this.caminho+'digital_12.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD1OA05);
		
		this.load.audio('pergunta_aud_1', [this.caminho+'UV1AV2UD1OA5_P1_1HORA.mp3']);
		this.load.audio('pergunta_aud_2', [this.caminho+'UV1AV2UD1OA5_P1_2HORAS.mp3']);
		this.load.audio('pergunta_aud_3', [this.caminho+'UV1AV2UD1OA5_P1_3HORAS.mp3']);
		this.load.audio('pergunta_aud_4', [this.caminho+'UV1AV2UD1OA5_P1_4HORAS.mp3']);
		this.load.audio('pergunta_aud_5', [this.caminho+'UV1AV2UD1OA5_P1_5HORAS.mp3']);
		this.load.audio('pergunta_aud_6', [this.caminho+'UV1AV2UD1OA5_P1_6HORAS.mp3']);
		this.load.audio('pergunta_aud_7', [this.caminho+'UV1AV2UD1OA5_P3_7HORAS.mp3']);
		this.load.audio('pergunta_aud_8', [this.caminho+'UV1AV2UD1OA5_P3_8HORAS.mp3']);
		this.load.audio('pergunta_aud_9', [this.caminho+'UV1AV2UD1OA5_P3_9HORAS.mp3']);
		this.load.audio('pergunta_aud_10', [this.caminho+'UV1AV2UD1OA5_P3_10HORAS.mp3']);
		this.load.audio('pergunta_aud_11', [this.caminho+'UV1AV2UD1OA5_P3_11HORAS.mp3']);
		this.load.audio('pergunta_aud_12', [this.caminho+'UV1AV2UD1OA5_P3_12HORAS.mp3']);
		this.load.audio('pergunta_aud_13', [this.caminho+'UV1AV2UD1OA5_P2_13HORAS.mp3']);
		this.load.audio('pergunta_aud_14', [this.caminho+'UV1AV2UD1OA5_P2_14HORAS.mp3']);
		this.load.audio('pergunta_aud_15', [this.caminho+'UV1AV2UD1OA5_P2_15HORAS.mp3']);
		this.load.audio('pergunta_aud_16', [this.caminho+'UV1AV2UD1OA5_P2_16HORAS.mp3']);
		this.load.audio('pergunta_aud_17', [this.caminho+'UV1AV2UD1OA5_P2_17HORAS.mp3']);
		this.load.audio('pergunta_aud_18', [this.caminho+'UV1AV2UD1OA5_P2_18HORAS.mp3']);
		this.load.audio('pergunta_aud_19', [this.caminho+'UV1AV2UD1OA5_P4_19HORAS.mp3']);
		this.load.audio('pergunta_aud_20', [this.caminho+'UV1AV2UD1OA5_P4_20HORAS.mp3']);
		this.load.audio('pergunta_aud_21', [this.caminho+'UV1AV2UD1OA5_P4_21HORAS.mp3']);
		this.load.audio('pergunta_aud_22', [this.caminho+'UV1AV2UD1OA5_P4_22HORAS.mp3']);
		this.load.audio('pergunta_aud_23', [this.caminho+'UV1AV2UD1OA5_P4_23HORAS.mp3']);
		//this.load.audio('pergunta_aud_24', [this.caminho+'UV1AV2UD1OA5_P4_24HORAS.mp3']);
		
		// BUTTONS
			
		this.load.audio('soundDica', [this.caminho+'UV1AV2UD1OA5_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD1OA5_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD1OA5_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD1OA5_INTRO.mp3']);
		this.load.audio('soundCallToAction', [this.caminho+'UV1AV2UD1OA5_CallToAction.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
