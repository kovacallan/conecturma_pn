
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

        this.caminho = getPathFile(UV1AV2UD1OA02);

		//INITIAL
		this.load.image('marca', this.caminho+'marca.png');
		this.load.image('marcaSombra', this.caminho+'marcaSombra.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		//animações 

		this.load.atlas('omega', this.caminho+'omega_anim.png', this.caminho+'omega_anim.json');
		this.load.atlas('omega_happy', this.caminho+'omega_anim_happy.png', this.caminho+'omega_anim_happy.json');
		
		this.load.atlas('objetos', this.caminho+'imageDisplay.png', this.caminho+'imageDisplay.json');
		//this.load.atlas('capsulas', this.caminho+'capsulas.png',this.caminho+'capsulas.json');
		this.load.atlas('letras', this.caminho+'letters.png', this.caminho+'letters.json');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD1OA02);

		this.load.audio('soundP1', [this.caminho+'UV1AV2UD1OA2_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD1OA2_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD1OA2_P3.mp3']);

		this.load.audio('casa', [this.caminho+'UV1AV2UD1OA2_P1_CASA.mp3']);
		this.load.audio('lata', [this.caminho+'UV1AV2UD1OA2_P1_LATA.mp3']);
		this.load.audio('pata', [this.caminho+'UV1AV2UD1OA2_P1_PATA.mp3']);

		this.load.audio('boca', [this.caminho+'UV1AV2UD1OA2_P2_BOCA.mp3']);
		this.load.audio('rato', [this.caminho+'UV1AV2UD1OA2_P2_RATO.mp3']);
		this.load.audio('sapo', [this.caminho+'UV1AV2UD1OA2_P2_SAPO.mp3']);

		this.load.audio('bolsa', [this.caminho+'UV1AV2UD1OA2_P3_BOLSA.mp3']);
		this.load.audio('campo', [this.caminho+'UV1AV2UD1OA2_P3_CAMPO.mp3']);
		this.load.audio('saco', [this.caminho+'UV1AV2UD1OA2_P3_SACO.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD1OA2_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD1OA2_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD1OA2_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD1OA2_INTRO.mp3']);
	},

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
