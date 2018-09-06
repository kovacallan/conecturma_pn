
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

        

        
        this.caminho = getPathFile(UV1AV2UD8OA05);
		// SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        this.load.atlas('quadros', this.caminho+'quadros.png', this.caminho+'quadros.json');
        this.load.atlas('bumba_anim', this.caminho+'bumba_anim.png', this.caminho+'bumba_anim.json');
        this.load.atlas('fred_anim', this.caminho+'fred_anim.png', this.caminho+'fred_anim.json');
        this.load.atlas('poly_anim', this.caminho+'poly_anim.png', this.caminho+'poly_anim.json');
        this.load.atlas('juninho_anim', this.caminho+'juninho_anim.png', this.caminho+'juninho_anim.json');


        // GAMEPLAY
        this.caminho = getPathFile(SOUNDS_UV1AV2UD8OA05);

		this.load.audio('soundP1', this.caminho+'UV1AV2S8OA5_P1.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S8OA5_P2.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S8OA5_P3.mp3');

        this.load.audio('soundDica', this.caminho+'UV1AV2S8OA5_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S8OA5_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S8OA5_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S8OA5_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};