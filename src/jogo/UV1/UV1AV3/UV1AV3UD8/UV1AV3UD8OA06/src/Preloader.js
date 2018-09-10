
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

        //ANIMATIONS
        this.caminho = getPathFile(UV1AV3UD8OA06);
        
        this.load.image('background', this.caminho + 'background.png');
        this.load.image('celular', this.caminho + 'celular.png');
        this.load.atlas('alternativas', this.caminho + 'alternativas.png', this.caminho+'alternativas.json');
        this.load.atlas('questions', this.caminho + 'questions.png', this.caminho+'questions.json');

        // SOUNDS 
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD8OA06);

        this.load.audio('soundIntro', [this.caminho + 'AV3_S8_OA6_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho + 'AV3_S8_OA6_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho + 'AV3_S8_OA6_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho + 'AV3_S8_OA6_RESUMO.mp3']);
        this.load.audio('soundCtA', [this.caminho + 'AV3_S8_OA6_P_GERAL_CtA.mp3']);

        this.load.audio('P1_0', [this.caminho+'AV3_S8_OA6_P1_1.mp3']);
        this.load.audio('P1_0_0', [this.caminho+'AV3_S8_OA6_P1_1_VENCER.mp3']);
        this.load.audio('P1_0_1', [this.caminho+'AV3_S8_OA6_P1_1_VENDER.mp3']);

        this.load.audio('P1_1', [this.caminho+'AV3_S8_OA6_P1_2.mp3']);
        this.load.audio('P1_1_0', [this.caminho+'AV3_S8_OA6_P1_2_NORTE.mp3']);
        this.load.audio('P1_1_1', [this.caminho+'AV3_S8_OA6_P1_2_MAR.mp3']);

        this.load.audio('P1_2', [this.caminho+'AV3_S8_OA6_P1_3.mp3']);
        this.load.audio('P1_2_0', [this.caminho+'AV3_S8_OA6_P1_3_FORCA.mp3']);
        this.load.audio('P1_2_1', [this.caminho+'AV3_S8_OA6_P1_3_MEDO.mp3']);


        this.load.audio('P2_0', [this.caminho+'AV3_S8_OA6_P2_1.mp3']);
        this.load.audio('P2_0_0', [this.caminho+'AV3_S8_OA6_P2_1_VENCER.mp3']);
        this.load.audio('P2_0_1', [this.caminho+'AV3_S8_OA6_P2_1_PERDER.mp3']);

        this.load.audio('P2_1', [this.caminho+'AV3_S8_OA6_P2_2.mp3']);
        this.load.audio('P2_1_0', [this.caminho+'AV3_S8_OA6_P2_2_TODO.mp3']);
        this.load.audio('P2_1_1', [this.caminho+'AV3_S8_OA6_P2_2_NENHUM.mp3']);

        this.load.audio('P2_2', [this.caminho+'AV3_S8_OA6_P2_3.mp3']);
        this.load.audio('P2_2_0', [this.caminho+'AV3_S8_OA6_P2_3_MERCADO.mp3']);
        this.load.audio('P2_2_1', [this.caminho+'AV3_S8_OA6_P2_3_CARPINTEIRO.mp3']);

        this.load.audio('P3_0', [this.caminho+'AV3_S8_OA6_P3_1.mp3']);
        this.load.audio('P3_0_0', [this.caminho+'AV3_S8_OA6_P3_1_ENCONTRO.mp3']);
        this.load.audio('P3_0_1', [this.caminho+'AV3_S8_OA6_P3_1_DESENCONTRO.mp3']);

        this.load.audio('P3_1', [this.caminho+'AV3_S8_OA6_P3_2.mp3']);
        this.load.audio('P3_1_0', [this.caminho+'AV3_S8_OA6_P3_2_AQUI.mp3']);
        this.load.audio('P3_1_1', [this.caminho+'AV3_S8_OA6_P3_2_ALI.mp3']);

        this.load.audio('P3_2', [this.caminho+'AV3_S8_OA6_P3_3.mp3']);
        this.load.audio('P3_2_0', [this.caminho+'AV3_S8_OA6_P3_3_BOCA.mp3']);
        this.load.audio('P3_2_1', [this.caminho+'AV3_S8_OA6_P3_3_OCA.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};