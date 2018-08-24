
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

        

		// SCENE
		this.caminho = getPathFile(UV1AV2UD5OA06);

		this.load.image('background', this.caminho+'background.png');
		this.load.image('cenario', this.caminho+'cenario.png');


		// CHARACTER ANIMATION
		this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');
		
		this.load.atlas('conviteIntro', this.caminho+'conviteIntro.png', this.caminho+'conviteIntro.json');
		this.load.atlas('saci', this.caminho+'convite.png', this.caminho+'convite.json');
		this.load.atlas('boitata', this.caminho+'convite1.png', this.caminho+'convite1.json');
		this.load.atlas('iara', this.caminho+'convite2.png', this.caminho+'convite2.json');

		this.load.atlas('botoes', this.caminho+'botoes.png', this.caminho+'botoes.json');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD5OA06);

		this.load.audio('assinatura', this.caminho+'UV1AV2UD5OA6_ASSINATURA.mp3');
		this.load.audio('data', this.caminho+'UV1AV2UD5OA6_DATA.mp3');
		this.load.audio('hora', this.caminho+'UV1AV2UD5OA6_HORARIO.mp3');
		this.load.audio('local', this.caminho+'UV1AV2UD5OA6_LUGAR.mp3');

		this.load.audio('soundP1', this.caminho+'UV1AV2UD5OA6_P1.mp3');
		this.load.audio('soundP2', this.caminho+'UV1AV2UD5OA6_P2.mp3');
		this.load.audio('soundP3', this.caminho+'UV1AV2UD5OA6_P3.mp3');

		this.load.audio('soundDica', this.caminho+'UV1AV2UD5OA6_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD5OA6_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD5OA6_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD5OA6_INTRO.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
