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

		this.caminho = getPathFile(UV1AV2UD3OA05);
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('poly', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlas('walter', this.caminho+'anim_walter.png', this.caminho+'anim_walter.json');
		
		this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');
		this.load.atlas('poly_happy', this.caminho+'anim_poly_happy.png', this.caminho+'anim_poly_happy.json');
		this.load.atlas('walter_happy', this.caminho+'anim_walter_happy.png', this.caminho+'anim_walter_happy.json');
		this.load.atlas('numeros', this.caminho+'numeros.png', this.caminho+'numeros.json');
		this.load.image('placa', this.caminho+'placa.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD3OA05);

		this.load.audio('soundP1', [this.caminho+'UV1AV2UD3OA5_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD3OA5_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD3OA5_P3.mp3']);
		
		this.load.audio('soundDica', [this.caminho+'UV1AV2UD3OA5_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD3OA5_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD3OA5_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD3OA5_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }



};
