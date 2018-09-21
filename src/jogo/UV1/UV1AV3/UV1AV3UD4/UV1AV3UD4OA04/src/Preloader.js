
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

        this.caminho = getPathFile(UV1AV3UD4OA04);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('bacia', this.caminho+'bacia.png');

        this.load.atlas('relogio', this.caminho+'relogio.png', this.caminho+'relogio.json');
        this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
        this.load.atlas('personagens', this.caminho+'personagens.png', this.caminho+'personagens.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD4OA04);

        this.load.audio('soundIntro', [this.caminho+'AV3_S4_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S4_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S4_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S4_OA4_RESUMO.mp3']);      
        this.load.audio('soundP1', [this.caminho+'AV3_S4_OA4_CtA.mp3']);     

    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};
