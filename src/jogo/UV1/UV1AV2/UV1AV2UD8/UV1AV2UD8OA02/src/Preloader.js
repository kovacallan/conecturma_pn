
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

        
        
        this.caminho = getPathFile(UV1AV2UD8OA02);
		// SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        
        this.load.atlas('cartas', this.caminho+'cartas.png', this.caminho+'cartas.json');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD8OA02);

		this.load.audio('soundDica', this.caminho+'UV1AV2S8OA2_DICA.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S8OA2_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S8OA2_INTRO.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S8OA2_FINAL.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};