
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

		// SCENE
		this.caminho = getPathFile(UV1AV2UD2OA03);
		this.load.image('background', this.caminho+'background.png');

		this.load.image('cesto', this.caminho+'cesto.png');

		// CHARACTER ANIMATION
		this.load.atlas('bumbaHappy', this.caminho+'anim_bumba_happy.png', this.caminho+'anim_bumba_happy.json');
		this.load.atlas('bumbaIdle', this.caminho+'anim_bumba_idle.png', this.caminho+'anim_bumba_idle.json');

		this.load.atlas('bananas', this.caminho+'bananas.png', this.caminho+'bananas.json');
		this.load.atlas('numeros', this.caminho+'numeros.png', this.caminho+'numeros.json');

		// GAMEPLAY
		
		this.load.image('resumo1', this.caminho+'resumo1.png');
		this.load.image('resumo2', this.caminho+'resumo2.png');
		this.load.image('resumo3', this.caminho+'resumo3.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD2OA03);
		
		this.load.audio('soundPGeral', [this.caminho+'UV1AV2UD2OA3_P_GERAL_APOS_BANANAS.mp3']);

		this.load.audio('soundP1-26', [this.caminho+'UV1AV2UD2OA3_P1_26_BANANAS.mp3']);
		this.load.audio('soundP1-27', [this.caminho+'UV1AV2UD2OA3_P1_27_BANANAS.mp3']);
		this.load.audio('soundP1-28', [this.caminho+'UV1AV2UD2OA3_P1_28_BANANAS.mp3']);

		this.load.audio('soundP2-23', [this.caminho+'UV1AV2UD2OA3_P2_23_BANANAS.mp3']);
		this.load.audio('soundP2-24', [this.caminho+'UV1AV2UD2OA3_P2_24_BANANAS.mp3']);
		this.load.audio('soundP2-25', [this.caminho+'UV1AV2UD2OA3_P2_25_BANANAS.mp3']);

		this.load.audio('soundP3-21', [this.caminho+'UV1AV2UD2OA3_P3_21_BANANAS.mp3']);
		this.load.audio('soundP3-22', [this.caminho+'UV1AV2UD2OA3_P3_22_BANANAS.mp3']);
		this.load.audio('soundP3-23', [this.caminho+'UV1AV2UD2OA3_P3_23_BANANAS.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD2OA3_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD2OA3_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD2OA3_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD2OA3_INTRO.mp3']);

	},

	update: function () {
        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
