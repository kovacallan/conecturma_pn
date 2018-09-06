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


		this.caminho = getPathFile(UV1AV2UD2OA06);

		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('livro', this.caminho+'livro.png', this.caminho+'livro.json');
		this.load.atlas('cenas', this.caminho+'cenas.png', this.caminho+'cenas.json');

		// GAMEPLAY
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD2OA06);
		
		this.load.audio('callToAction', [this.caminho+'UV1AV2UD2OA6_P1_CallToAction.mp3']);

		this.load.audio('0', [this.caminho+'UV1AV2UD2OA6_P1_POEMA1-novo.mp3']);
		this.load.audio('1', [this.caminho+'UV1AV2UD2OA6_P1_POEMA2.mp3']);
		this.load.audio('2', [this.caminho+'UV1AV2UD2OA6_P1_POEMA3.mp3']);

		this.load.audio('3', [this.caminho+'UV1AV2UD2OA6_P2_POEMA1.mp3']);
		this.load.audio('4', [this.caminho+'UV1AV2UD2OA6_P2_POEMA2.mp3']);
		this.load.audio('5', [this.caminho+'UV1AV2UD2OA6_P2_POEMA3.mp3']);

		this.load.audio('6', [this.caminho+'UV1AV2UD2OA6_P3_POEMA1.mp3']);
		this.load.audio('7', [this.caminho+'UV1AV2UD2OA6_P3_POEMA2.mp3']);
		this.load.audio('8', [this.caminho+'UV1AV2UD2OA6_P3_POEMA3.mp3']);

		//this.load.audio('soundP2', [this.caminho+'JC-UV1AV1UD1OA1-Mat-P2.mp3']);
		//this.load.audio('soundP3', [this.caminho+'JC-UV1AV1UD1OA1-Mat-P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD2OA6_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD2OA6_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD2OA6_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD2OA6_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
