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
		this.caminho = getPathFile(UV1AV2UD3OA01);

		this.load.image('background', this.caminho+'background.png');
		this.load.image('frente', this.caminho+'frente.png');

		// CHARACTER ANIMATION
		this.load.atlas('curupira', this.caminho+'anim_menino.png', this.caminho+'anim_menino.json');
		this.load.atlas('formas', this.caminho+'formas.png', this.caminho+'formas.json');
		this.load.atlas('nome_formas', this.caminho+'nome_formas.png', this.caminho+'nome_formas.json');
		
		this.load.image('imgResumo2', this.caminho+'resumo_triangulo.png');
		this.load.image('imgResumo3', this.caminho+'resumo_quadrado.png');
		this.load.image('imgResumo4', this.caminho+'resumo_retangulo.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD3OA01);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD3OA1_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD3OA1_P2.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV2UD3OA1_P3.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD3OA1_P4.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD3OA1_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD3OA1_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD3OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD3OA1_INTRO.mp3']);

	},


	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
