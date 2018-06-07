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
		this.caminho = getPathFile(UV1AV2UD3OA06); 
		this.load.image('background', this.caminho+'background.png');
		this.load.image('tronco', this.caminho+'tronco.png');
		this.load.image('marca', this.caminho+'marca.png');

		// CHARACTER ANIMATION
		this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
		this.load.atlas('grilo', this.caminho+'anim_grilo.png', this.caminho+'anim_grilo.json');
		
		this.load.image('marca', this.caminho+'marca.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD3OA06);

		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD3OA6_CALL_TO_ACTION.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV2UD3OA6_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD3OA6_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD3OA6_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD3OA6_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
