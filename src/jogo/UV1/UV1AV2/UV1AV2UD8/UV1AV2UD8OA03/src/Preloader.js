
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

        
        
        this.caminho = getPathFile(UV1AV2UD8OA03);
		// SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        
        // GAMEPLAY

        this.load.image('cena_p3_1', this.caminho+'janela_2_1.png');
        this.load.image('cena_p3_2', this.caminho+'janela_2_3.png');
        this.load.image('cena_p3_3', this.caminho+'janela_2_2.png');

        this.load.atlas('cena_p1', this.caminho+'cena_p1.png', this.caminho+'cena_p1.json');
        this.load.atlas('cena_p2', this.caminho+'cena_p2.png', this.caminho+'cena_p2.json');
        this.load.atlas('cena_p3', this.caminho+'cena_p3.png', this.caminho+'cena_p3.json');

        this.load.image('marca', this.caminho+'marca.png');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD8OA03);

		this.load.audio('soundP1', this.caminho+'UV1AV2S8OA3_P1.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S8OA3_P2.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S8OA3_P3.mp3');

        this.load.audio('soundDica', this.caminho+'UV1AV2S8OA3_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S8OA3_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S8OA3_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S8OA3_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};