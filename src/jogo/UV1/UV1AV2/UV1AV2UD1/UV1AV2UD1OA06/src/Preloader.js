
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

        this.caminho = getPathFile(GLOBAL);
		this.load.image('capsulas_background', this.caminho+'background_anim_UV1AV2UD1.png');
		// SCENE

		this.caminho = getPathFile(UV1AV2UD1OA06);

		this.load.image('background', this.caminho+'background.png');


		// CHARACTER ANIMATION
		//this.load.atlas('capsulas_background', this.caminho+'background_anim.png', this.caminho+'background_anim.json');

		this.load.atlas('capsulas', this.caminho+'capsulas_anim.png', this.caminho+'capsulas_anim.json');
		
		this.load.atlas('fred', this.caminho+'fred_anim.png', this.caminho+'fred_anim.json');
		this.load.atlas('fred_happy', this.caminho+'fred_anim_happy.png', this.caminho+'fred_anim_happy.json');
		
		this.load.atlas('juninho', this.caminho+'juninho_anim.png', this.caminho+'juninho_anim.json');
		this.load.atlas('juninho_happy', this.caminho+'juninho_anim_happy.png', this.caminho+'juninho_anim_happy.json');

		this.load.atlas('frases_p1', this.caminho+'frases_p1.png', this.caminho+'frases_p1.json');
		this.load.atlas('frases_p2', this.caminho+'frases_p2.png', this.caminho+'frases_p2.json');
		this.load.atlas('frases_p3', this.caminho+'frases_p3.png', this.caminho+'frases_p3.json');
		this.load.atlas('frases_intro', this.caminho+'frases_intro.png', this.caminho+'frases_intro.json');

		this.load.image('rima', this.caminho+'capsula_rima.png');
		this.load.image('nao_rima', this.caminho+'capsula_nao_rima.png');
		this.load.image('marca', this.caminho+'marca.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD1OA06);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD1OA6_CALLtoACTION.mp3']);

		this.load.audio('frases_p1_0', [this.caminho+'UV1AV2UD1OA6_P1_RIMA1.mp3']);
		this.load.audio('frases_p1_1', [this.caminho+'UV1AV2UD1OA6_P1_RIMA2.mp3']);
		this.load.audio('frases_p1_2', [this.caminho+'UV1AV2UD1OA6_P1_RIMA3.mp3']);

		this.load.audio('frases_p1_3', [this.caminho+'UV1AV2UD1OA6_P1_NAO_RIMA1.mp3']);
		this.load.audio('frases_p1_4', [this.caminho+'UV1AV2UD1OA6_P1_NAO_RIMA2.mp3']);
		this.load.audio('frases_p1_5', [this.caminho+'UV1AV2UD1OA6_P1_NAO_RIMA3.mp3']);

		this.load.audio('frases_p2_0', [this.caminho+'UV1AV2UD1OA6_P2_RIMA1.mp3']);
		this.load.audio('frases_p2_1', [this.caminho+'UV1AV2UD1OA6_P2_RIMA2.mp3']);
		this.load.audio('frases_p2_2', [this.caminho+'UV1AV2UD1OA6_P2_RIMA3.mp3']);

		this.load.audio('frases_p2_3', [this.caminho+'UV1AV2UD1OA6_P2_NAO_RIMA1.mp3']);
		this.load.audio('frases_p2_4', [this.caminho+'UV1AV2UD1OA6_P2_NAO_RIMA2.mp3']);
		this.load.audio('frases_p2_5', [this.caminho+'UV1AV2UD1OA6_P2_NAO_RIMA3.mp3']);

		this.load.audio('frases_p3_0', [this.caminho+'UV1AV2UD1OA6_P3_RIMA1.mp3']);
		this.load.audio('frases_p3_2', [this.caminho+'UV1AV2UD1OA6_P3_RIMA2.mp3']);
		this.load.audio('frases_p3_1', [this.caminho+'UV1AV2UD1OA6_P3_RIMA3.mp3']);

		this.load.audio('frases_p3_3', [this.caminho+'UV1AV2UD1OA6_P3_NAO_RIMA1.mp3']);
		this.load.audio('frases_p3_4', [this.caminho+'UV1AV2UD1OA6_P3_NAO_RIMA2.mp3']);
		this.load.audio('frases_p3_5', [this.caminho+'UV1AV2UD1OA6_P3_NAO_RIMA3.mp3']);

		this.load.audio('0', [this.caminho+'UV1AV2UD1OA6_P1_RIMA1.mp3']);

		this.load.audio('soundP2', [this.caminho+'UV1AV2UD1OA6_CALLtoACTION.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD1OA6_CALLtoACTION.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD1OA6_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD1OA6_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD1OA6_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD1OA6_INTRO.mp3']);
	},

	update: function () {
        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
