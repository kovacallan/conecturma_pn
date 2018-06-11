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

		//INITIAL
		this.caminho = getPathFile(UV1AV2UD2OA01);

		this.load.image('estrelaLimpa', this.caminho+'estrela_limpa.png');
		this.load.image('estrelaNormal', this.caminho+'estrela_normal.png');
		this.load.image('maoTutorial', this.caminho+'mao_tutorial.png');
		this.load.image('tecla', this.caminho+'tecla.png');
		this.load.image('bgStar', this.caminho+'bgStar.png');

		// CHARACTER ANIMATION
		this.load.atlas('saciHappy', this.caminho+'anim_saci_happy.png', this.caminho+'anim_saci_happy.json');
		this.load.atlas('saciIdle', this.caminho+'anim_saci_idle.png', this.caminho+'anim_saci_idle.json');

		this.load.image('background', this.caminho+'background.png');
		
		// GAMEPLAY

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD2OA01);
	
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD2OA1_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD2OA1_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD2OA1_P3.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV2UD2OA1_P4.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD2OA1_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD2OA1_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD2OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD2OA1_INTRO.mp3']);

	},


	update: function () {
        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
