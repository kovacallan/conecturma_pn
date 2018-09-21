
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

        this.caminho = getPathFile(UV1AV2UD7OA02);

        this.load.image('background', this.caminho+'background.png');
        this.load.image('frente_cenario', this.caminho+'frente_cenario.png');

        // CHARACTER ANIMATION
        this.load.atlas('anim_bumba', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
        this.load.atlas('cartaz', this.caminho+'cartaz.png', this.caminho+'cartaz.json');

        // GAMEPLAY
        this.load.atlas('cartaz', this.caminho+'cartaz.png', this.caminho+'cartaz.json');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD7OA02);

        this.load.audio('soundDica', this.caminho+'UV1AV2S7OA2_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S7OA2_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S7OA2_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S7OA2_INTRO.mp3');

        this.load.audio('pergunta_1', this.caminho+'UV1AV2S7OA2_P1.mp3');
        this.load.audio('pergunta_2', this.caminho+'UV1AV2S7OA2_P2.mp3');
        this.load.audio('pergunta_3', this.caminho+'UV1AV2S7OA2_P3.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};