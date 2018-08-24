
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

        this.caminho = getPathFile(UV1AV2UD7OA01);

        // SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        this.load.atlas('anim_fada1', this.caminho+'anim_fada.png', this.caminho+'anim_fada.json');
        this.load.atlas('anim_fada2', this.caminho+'anim_fada1.png', this.caminho+'anim_fada1.json');
        this.load.atlas('anim_fada3', this.caminho+'anim_fada2.png', this.caminho+'anim_fada2.json');

        // GAMEPLAY
        this.load.image('dezena', this.caminho+'dezena.png');
        this.load.image('unidade', this.caminho+'unidade.png');
        this.load.atlas('numbers', this.caminho+'numeros.png', this.caminho+'numeros.json');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD7OA01);

        this.load.audio('soundCtA', this.caminho+'UV1AV2S7OA1_CtA.mp3');
        this.load.audio('soundDica', this.caminho+'UV1AV2S7OA1_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S7OA1_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S7OA1_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S7OA1_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};