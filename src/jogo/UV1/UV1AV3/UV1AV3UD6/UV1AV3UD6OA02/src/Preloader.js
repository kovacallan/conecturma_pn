
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

        this.caminho = getPathFile(UV1AV3UD6OA02);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        //sthis.load.image('tela', this.caminho+'tela.png');
        this.load.image('tecla', this.caminho+'tecla.png');

        this.load.atlas('menino', this.caminho+'menino.png', this.caminho+'menino.json');
        this.load.atlas('frases', this.caminho+'frases.png', this.caminho+'frases.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD6OA02);

        this.load.audio('soundIntro', [this.caminho+'AV3_S6_OA2_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S6_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S6_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S6_OA2_RESUMO.mp3']);      
        this.load.audio('soundP1', [this.caminho+'AV3_S6_OA2_P1.mp3']);
        this.load.audio('soundP1_0', [this.caminho+'AV3_S6_OA2_P1_F1.mp3']);
        this.load.audio('soundP1_1', [this.caminho+'AV3_S6_OA2_P1_F2.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S6_OA2_P1_F3.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S6_OA2_P2.mp3']);
        this.load.audio('soundP2_3', [this.caminho+'AV3_S6_OA2_P2_F1.mp3']);
        this.load.audio('soundP2_4', [this.caminho+'AV3_S6_OA2_P2_F2.mp3']);
        this.load.audio('soundP2_5', [this.caminho+'AV3_S6_OA2_P2_F3.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S6_OA2_P3.mp3']);
        this.load.audio('soundP3_6', [this.caminho+'AV3_S6_OA2_P3_F1.mp3']);
        this.load.audio('soundP3_7', [this.caminho+'AV3_S6_OA2_P3_F2.mp3']);
        this.load.audio('soundP3_8', [this.caminho+'AV3_S6_OA2_P3_F3.mp3']);

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

