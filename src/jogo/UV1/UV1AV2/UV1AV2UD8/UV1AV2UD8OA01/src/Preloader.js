
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

        

        
        this.caminho = getPathFile(UV1AV2UD8OA01);
		// SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('frontground', this.caminho+'frontground.png');

        // CHARACTER ANIMATION
        this.load.atlas('fred_anim', this.caminho+'fred_anim.png', this.caminho+'fred_anim.json');
        this.load.atlas('poly_anim', this.caminho+'poly_anim.png', this.caminho+'poly_anim.json');
        this.load.atlas('juninho_anim', this.caminho+'jr_anim.png', this.caminho+'jr_anim.json');

        // GAMEPLAY
        this.load.image('placa', this.caminho+'placa.png');
        this.load.image('ordinal', this.caminho+'ordinal.png');
        this.load.atlas('numbers', this.caminho+'numbers.png', this.caminho+'numbers.json');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD8OA01);

		this.load.audio('soundP1', this.caminho+'UV1AV2S8OA1_P1.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S8OA1_P2.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S8OA1_P3.mp3');

        this.load.audio('soundDica', this.caminho+'UV1AV2S8OA1_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S8OA1_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S8OA1_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S8OA1_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};