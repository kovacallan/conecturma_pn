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
		this.caminho = getPathFile(UV1AV2UD3OA03);
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('iara', this.caminho+'anim_iara.png', this.caminho+'anim_iara.json');
		this.load.atlas('iara_happy', this.caminho+'anim_iara_happy.png', this.caminho+'anim_iara_happy.json');
		this.load.atlas('numeros', this.caminho+'numeros.png', this.caminho+'numeros.json');

		// GAMEPLAY
		this.load.image('brilho', this.caminho+'brilho_img.png');
		this.load.image('quadro', this.caminho+'quadro.png');


		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD3OA03);

		this.load.audio('soundP1', [this.caminho+'UV1AV2UD3OA3_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD3OA3_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD3OA3_P3.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV2UD3OA3_P4.mp3']);
		this.load.audio('soundP5', [this.caminho+'UV1AV2UD3OA3_P5.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD3OA3_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD3OA3_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD3OA3_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD3OA3_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
