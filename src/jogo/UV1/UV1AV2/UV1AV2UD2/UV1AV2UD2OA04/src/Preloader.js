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
		this.caminho = getPathFile(UV1AV2UD2OA04);
		this.load.image('background', this.caminho+'background.png');


		// CHARACTER ANIMATION
		this.load.atlas('letras', this.caminho+'letras.png', this.caminho+'letras.json');
		this.load.atlas('bumbaHappy', this.caminho+'anim_bumba_happy.png', this.caminho+'anim_bumba_happy.json');
		this.load.atlas('bumbaIdle', this.caminho+'anim_bumba_idle.png', this.caminho+'anim_bumba_idle.json');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD2OA04);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD2OA4_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD2OA4_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD2OA4_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD2OA4_INTRO.mp3']);

		this.load.audiosprite('audiosprite', this.caminho+'output.mp3', this.caminho+"output.json");
	},


	update: function () {
        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
