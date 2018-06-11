
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

        

        
        this.caminho = getPathFile(UV1AV2UD8OA06);
		// SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('galho_1', this.caminho+'galho_1.png');
        this.load.image('galho_2', this.caminho+'galho_2.png');

        this.load.image('intro_keyboard',this.caminho+'mc_teclado.png');
        this.load.image('intro_button',this.caminho+'5.png');
        this.load.image('intro_dedo',this.caminho+'dedo.png');

        this.load.image('intro_1', this.caminho+'intro_1.png');
        this.load.image('intro_2', this.caminho+'intro_2.png');
        this.load.image('intro_3', this.caminho+'intro_3.png');
        this.load.image('intro_4', this.caminho+'intro_4.png');
        this.load.image('intro_5', this.caminho+'intro_5.png');

        // CHARACTER ANIMATION
        this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
        this.load.atlas('fred_anim', this.caminho+'fred_anim.png', this.caminho+'fred_anim.json');
        this.load.atlas('poly_anim', this.caminho+'poly_anim.png', this.caminho+'poly_anim.json');
        this.load.atlas('juninho_anim', this.caminho+'juninho_anim.png', this.caminho+'juninho_anim.json');


        // GAMEPLAY

        this.caminho = getPathFile(SOUNDS_UV1AV2UD8OA06);

		this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P1.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P1_1.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P1_2.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P1_3.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S8OA6_P2.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P2_1.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P2_2.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P2_3.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S8OA6_P3.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P3_1.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P3_2.mp3');
        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA6_P3_3.mp3');

        this.load.audio('soundDica', this.caminho+'UV1AV2S8OA6_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S8OA6_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S8OA6_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S8OA6_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};