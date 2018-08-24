
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

        this.caminho = getPathFile(UV1AV3UD3OA06);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('brilho_verde', this.caminho+'brilho_verde.png');
        this.load.image('brilho_vermelho', this.caminho+'brilho_vermelho.png');

        this.load.atlas('frases', this.caminho+'frases.png', this.caminho+'frases.json');
        this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD3OA06);

        this.load.audio('soundIntro', [this.caminho+'AV3_S3_OA6_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S3_OA6_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S3_OA6_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S3_OA6_RESUMO.mp3']);      

        this.load.audio('soundP1_1', [this.caminho+'AV3_S3_OA6_P1_1.mp3']);
        this.load.audio('soundP1_1_2', [this.caminho+'AV3_S3_OA6_P1_1_CORTA.mp3']);
        this.load.audio('soundP1_1_1', [this.caminho+'AV3_S3_OA6_P1_1_ESPICHA.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S3_OA6_P1_2.mp3']);
        this.load.audio('soundP1_2_2', [this.caminho+'AV3_S3_OA6_P1_2_LOBO.mp3']);
        this.load.audio('soundP1_2_1', [this.caminho+'AV3_S3_OA6_P1_2_OVO.mp3']);
        this.load.audio('soundP1_3', [this.caminho+'AV3_S3_OA6_P1_3.mp3']);
        this.load.audio('soundP1_3_2', [this.caminho+'AV3_S3_OA6_P1_3_VIDA.mp3']);
        this.load.audio('soundP1_3_1', [this.caminho+'AV3_S3_OA6_P1_3_VIUVA.mp3']);
        this.load.audio('soundP2_1', [this.caminho+'AV3_S3_OA6_P2_1.mp3']);
        this.load.audio('soundP2_1_1', [this.caminho+'AV3_S3_OA6_P2_1_BOLO.mp3']);
        this.load.audio('soundP2_1_3', [this.caminho+'AV3_S3_OA6_P2_1_CANETA.mp3']);
        this.load.audio('soundP2_1_2', [this.caminho+'AV3_S3_OA6_P2_1_GRADE.mp3']);
        this.load.audio('soundP2_2', [this.caminho+'AV3_S3_OA6_P2_2.mp3']);
        this.load.audio('soundP2_2_1', [this.caminho+'AV3_S3_OA6_P2_2_CAPIM.mp3']);
        this.load.audio('soundP2_2_2', [this.caminho+'AV3_S3_OA6_P2_2_GARRAFA.mp3']);
        this.load.audio('soundP2_2_3', [this.caminho+'AV3_S3_OA6_P2_2_TIJOLO.mp3']);
        this.load.audio('soundP2_3', [this.caminho+'AV3_S3_OA6_P2_3.mp3']);
        this.load.audio('soundP2_3_3', [this.caminho+'AV3_S3_OA6_P2_3_BANCO.mp3']);
        this.load.audio('soundP2_3_1', [this.caminho+'AV3_S3_OA6_P2_3_MAR.mp3']);
        this.load.audio('soundP2_3_2', [this.caminho+'AV3_S3_OA6_P2_3_PAPEL.mp3']);
        this.load.audio('soundP3_1', [this.caminho+'AV3_S3_OA6_P3_1.mp3']);
        this.load.audio('soundP3_1_2', [this.caminho+'AV3_S3_OA6_P3_1_ARMARIO.mp3']);
        this.load.audio('soundP3_1_1', [this.caminho+'AV3_S3_OA6_P3_1_ASSOVIA.mp3']);
        this.load.audio('soundP3_1_3', [this.caminho+'AV3_S3_OA6_P3_1_CHAO.mp3']);
        this.load.audio('soundP3_2', [this.caminho+'AV3_S3_OA6_P3_2.mp3']);
        this.load.audio('soundP3_2_3', [this.caminho+'AV3_S3_OA6_P3_2_CANSADO.mp3']);
        this.load.audio('soundP3_2_1', [this.caminho+'AV3_S3_OA6_P3_2_DAQUI.mp3']);
        this.load.audio('soundP3_2_2', [this.caminho+'AV3_S3_OA6_P3_2_TRISTE.mp3']);
        this.load.audio('soundP3_3', [this.caminho+'AV3_S3_OA6_P3_3.mp3']);
        this.load.audio('soundP3_3_1', [this.caminho+'AV3_S3_OA6_P3_3_ARROZ.mp3']);
        this.load.audio('soundP3_3_2', [this.caminho+'AV3_S3_OA6_P3_3_BRIGADEIRO.mp3']);
        this.load.audio('soundP3_3_3', [this.caminho+'AV3_S3_OA6_P3_3_QUINDIM.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};
