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

		
		// SCENE
		this.caminho = getPathFile(UV1AV2UD2OA02);
		this.load.image('background', this.caminho+'background.png');


		// CHARACTER ANIMATION
		this.load.atlas('quebraCabeca', this.caminho+'quebra_cabeca.png', this.caminho+'quebra_cabeca.json');
		this.load.atlas('walterIdle', this.caminho+'anim_walter_idle.png', this.caminho+'anim_walter_idle.json');
		this.load.atlas('walterHappy', this.caminho+'anim_walter_happy.png', this.caminho+'anim_walter_happy.json');

		this.load.atlas('pi', this.caminho+'pi.png', this.caminho+'pi.json');

		// GAMEPLAY

		this.load.image('quadro', this.caminho+'quadro.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD2OA02);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD2OA2_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD2OA2_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD2OA2_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD2OA2_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD2OA2_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD2OA2_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD2OA2_INTRO.mp3']);

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
