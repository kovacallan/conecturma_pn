
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
		this.load.image('capsulas', this.caminho+'background_anim_UV1AV2UD1.png');
		
		//INITIAL

		this.caminho = getPathFile(UV1AV2UD1OA03);

		this.load.image('3macas', this.caminho+'3macas.png');
		this.load.image('4macas', this.caminho+'4macas.png');
		this.load.image('7macas', this.caminho+'7macas.png');

		this.load.image('mais', this.caminho+'mais.png');
		this.load.image('igual', this.caminho+'igual.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		//this.load.image('capsulas', this.caminho+'background_anim.png');
		this.load.atlas('juninho_idle', this.caminho+'juninho_anim.png', this.caminho+'juninho_anim.json');
		this.load.atlas('bumba_idle', this.caminho+'bumba_anim.png', this.caminho+'bumba_anim.json');

		this.load.atlas('intro', this.caminho+'intro.png', this.caminho+'intro.json');
		
		// GAMEPLAY
		
		this.load.atlas('level3_question', this.caminho+'carros.png', this.caminho+'carros.json');
		this.load.atlas('level2_question', this.caminho+'doces.png', this.caminho+'doces.json');
		this.load.atlas('level1_question', this.caminho+'bananas.png', this.caminho+'bananas.json');
		
		this.load.atlas('numbersChoice', this.caminho+'numbersChoice.png', this.caminho+'numbersChoice.json');
		this.load.image('numbersChoice_holder', this.caminho+'numbersChoice_holder.png');
		
		this.load.image('pergunta_1_calc', this.caminho+'pergunta_1_calc.png');
		this.load.image('pergunta_2_calc', this.caminho+'pergunta_2_calc.png');
		this.load.image('pergunta_3_calc', this.caminho+'pergunta_3_calc.png');
		
		// BUTTONS
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD1OA03);

		this.load.audio('pergunta_1_aud', [this.caminho+'UV1AV2UD1OA3_P1.mp3']);
		this.load.audio('pergunta_2_aud', [this.caminho+'UV1AV2UD1OA3_P2.mp3']);
		this.load.audio('pergunta_3_aud', [this.caminho+'UV1AV2UD1OA3_P3.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV2UD1OA3_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD1OA3_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD1OA3_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD1OA3_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
