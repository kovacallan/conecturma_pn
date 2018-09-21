
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

        this.caminho = getPathFile(UV1AV3UD7OA04);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('menino', this.caminho+'menino.png', this.caminho+'menino.json');
        this.load.atlas('cafe', this.caminho+'cafe.png', this.caminho+'cafe.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD7OA04);

        this.load.audio('soundIntro', [this.caminho+'AV3_S7_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S7_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S7_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S7_OA4_RESUMO.mp3']);      
    
        this.load.audio('soundP', [this.caminho+'AV3_S7_OA4_CtA.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S7_OA4_BR.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S7_OA4_CR.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S7_OA4_DR.mp3']);
        this.load.audio('soundP4', [this.caminho+'AV3_S7_OA4_FR.mp3']);
        this.load.audio('soundP5', [this.caminho+'AV3_S7_OA4_GR.mp3']);
        this.load.audio('soundP6', [this.caminho+'AV3_S7_OA4_PR.mp3']);
        this.load.audio('soundP7', [this.caminho+'AV3_S7_OA4_TR.mp3']);
        this.load.audio('soundA0', [this.caminho+'AV3_S7_OA4_BROTO.mp3']);
        this.load.audio('soundA1', [this.caminho+'AV3_S7_OA4_BRILHO.mp3']);
        this.load.audio('soundA2', [this.caminho+'AV3_S7_OA4_BRINQUEDO.mp3']);
        this.load.audio('soundA3', [this.caminho+'AV3_S7_OA4_CREDO.mp3']);
        this.load.audio('soundA4', [this.caminho+'AV3_S7_OA4_CRAVO.mp3']);
        this.load.audio('soundA5', [this.caminho+'AV3_S7_OA4_CRESPO.mp3']);
        this.load.audio('soundA6', [this.caminho+'AV3_S7_OA4_DRAGA.mp3']);
        this.load.audio('soundA7', [this.caminho+'AV3_S7_OA4_DRAGAO.mp3']);
        this.load.audio('soundA8', [this.caminho+'AV3_S7_OA4_DRAGAR.mp3']);
        this.load.audio('soundA9', [this.caminho+'AV3_S7_OA4_FRACO.mp3']);
        this.load.audio('soundA10', [this.caminho+'AV3_S7_OA4_FRACA.mp3']);
        this.load.audio('soundA11', [this.caminho+'AV3_S7_OA4_FRITAS.mp3']);
        this.load.audio('soundA12', [this.caminho+'AV3_S7_OA4_GRALHA.mp3']);
        this.load.audio('soundA13', [this.caminho+'AV3_S7_OA4_GRUTA.mp3']);
        this.load.audio('soundA14', [this.caminho+'AV3_S7_OA4_GRAVE.mp3']);
        this.load.audio('soundA15', [this.caminho+'AV3_S7_OA4_PRATICO.mp3']);
        this.load.audio('soundA16', [this.caminho+'AV3_S7_OA4_PRONTO.mp3']);
        this.load.audio('soundA17', [this.caminho+'AV3_S7_OA4_PRIMO.mp3']);
        this.load.audio('soundA18', [this.caminho+'AV3_S7_OA4_TROPA.mp3']);
        this.load.audio('soundA19', [this.caminho+'AV3_S7_OA4_TRUTA.mp3']);
        this.load.audio('soundA20', [this.caminho+'AV3_S7_OA4_TRAMPO.mp3']);


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

