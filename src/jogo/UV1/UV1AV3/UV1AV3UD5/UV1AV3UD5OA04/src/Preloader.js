
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

        this.caminho = getPathFile(UV1AV3UD5OA04);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('menino', this.caminho+'menino.png', this.caminho+'menino.json');
        this.load.atlas('palma', this.caminho+'palma.png', this.caminho+'palma.json');
        this.load.atlas('placas', this.caminho+'placas.png', this.caminho+'placas.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD5OA04);

        this.load.audio('soundIntro', [this.caminho+'AV3_S5_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S5_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S5_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S5_OA4_RESUMO.mp3']);      
        this.load.audio('soundP1', [this.caminho+'AV3_S5_OA4_P1.mp3']);
        this.load.audio('soundP1_3', [this.caminho+'AV3_S5_OA4_P1_GADO.mp3']);
        this.load.audio('soundP1_1', [this.caminho+'AV3_S5_OA4_P1_GALO.mp3']);
        this.load.audio('soundP1_0', [this.caminho+'AV3_S5_OA4_P1_GELO.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S5_OA4_P1_GEMA.mp3']);
        this.load.audio('soundP1_4', [this.caminho+'AV3_S5_OA4_P1_GENTE.mp3']);
        this.load.audio('soundP1_5', [this.caminho+'AV3_S5_OA4_P1_GOIABA.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S5_OA4_P2.mp3']);
        this.load.audio('soundP2_9', [this.caminho+'AV3_S5_OA4_P2_FOGO.mp3']);
        this.load.audio('soundP2_7', [this.caminho+'AV3_S5_OA4_P2_FUGA.mp3']);
        this.load.audio('soundP2_8', [this.caminho+'AV3_S5_OA4_P2_GELADO.mp3']);
        this.load.audio('soundP2_6', [this.caminho+'AV3_S5_OA4_P2_GIRAFA.mp3']);
        this.load.audio('soundP2_10', [this.caminho+'AV3_S5_OA4_P2_GIRASSOL.mp3']);
        this.load.audio('soundP2_11', [this.caminho+'AV3_S5_OA4_P2_LAGO.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S5_OA4_P3.mp3']);
        this.load.audio('soundP3_15', [this.caminho+'AV3_S5_OA4_P3_COGUMELO.mp3']);
        this.load.audio('soundP3_17', [this.caminho+'AV3_S5_OA4_P3_FORMIGA.mp3']);
        this.load.audio('soundP3_14', [this.caminho+'AV3_S5_OA4_P3_MAGICO.mp3']);
        this.load.audio('soundP3_13', [this.caminho+'AV3_S5_OA4_P3_PESSEGO.mp3']);
        this.load.audio('soundP3_12', [this.caminho+'AV3_S5_OA4_P3_RELOGIO.mp3']);
        this.load.audio('soundP3_16', [this.caminho+'AV3_S5_OA4_P3_TIGELA.mp3']);

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

