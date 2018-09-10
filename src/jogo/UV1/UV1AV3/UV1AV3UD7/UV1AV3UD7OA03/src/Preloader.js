
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

        this.caminho = getPathFile(UV1AV3UD7OA03);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('painel', this.caminho+'painel.png');

        this.load.atlas('cafe', this.caminho+'cafe.png', this.caminho+'cafe.json');
        this.load.atlas('linha', this.caminho+'linha.png', this.caminho+'linha.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD7OA03);

        this.load.audio('soundIntro', [this.caminho+'AV3_S7_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S7_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S7_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S7_OA3_RESUMO.mp3']);     
        this.load.audio('soundP1', [this.caminho+'AV3_S7_OA3_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S7_OA3_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S7_OA3_P3.mp3']);

        this.caminho = getPathFile(GLOBAL_FONT);

        this.load.bitmapFont('lucky-64', this.caminho+'lucky-64.png',  this.caminho+"lucky-64.fnt");
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};

