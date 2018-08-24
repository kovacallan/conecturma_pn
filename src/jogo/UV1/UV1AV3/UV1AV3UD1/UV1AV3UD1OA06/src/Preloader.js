
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

        //this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
        
        // SCENE

        this.caminho = getPathFile(UV1AV3UD1OA06);

        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('cenas', this.caminho+'cenas.png', this.caminho+'cenas.json');
        this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');

        
        // GAMEPLAY

        //this.caminho = SOUNDS_UV1AV3UD1OA6;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD1OA06); 


        this.load.audio('soundIntro', [this.caminho+'AV3_S1_OA6_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S1_OA6_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S1_OA6_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S1_OA6_RESUMO.mp3']);

        //this.load.audio('soundP1', [this.caminho+'AV3_S1_OA6_P1.mp3']);
        //this.load.audio('soundP2', [this.caminho+'AV3_S1_OA6_P2.mp3']);
        //this.load.audio('soundP3', [this.caminho+'AV3_S1_OA6_P3.mp3']);

        this.load.audio('C0', [this.caminho+'AV3_S1_OA6_P1_1.mp3']);
            this.load.audio('P0', [this.caminho+'AV3_S1_OA6_P1_1_C.mp3']);
            this.load.audio('P1', [this.caminho+'AV3_S1_OA6_P1_1_E.mp3']);

        this.load.audio('C1', [this.caminho+'AV3_S1_OA6_P1_2.mp3']);
            this.load.audio('P2', [this.caminho+'AV3_S1_OA6_P1_2_C.mp3']);
            this.load.audio('P3', [this.caminho+'AV3_S1_OA6_P1_2_E.mp3']);

        this.load.audio('C2', [this.caminho+'AV3_S1_OA6_P1_3.mp3']);
            this.load.audio('P4', [this.caminho+'AV3_S1_OA6_P1_3_C.mp3']);
            this.load.audio('P5', [this.caminho+'AV3_S1_OA6_P1_3_E.mp3']);

//-------------------------------------------------------------------------
        this.load.audio('C3', [this.caminho+'AV3_S1_OA6_P2_1.mp3']);
            this.load.audio('P6', [this.caminho+'AV3_S1_OA6_P2_1_C.mp3']);
            this.load.audio('P7', [this.caminho+'AV3_S1_OA6_P2_1_E1.mp3']);
            this.load.audio('P8', [this.caminho+'AV3_S1_OA6_P2_1_E2.mp3']);

        this.load.audio('C4', [this.caminho+'AV3_S1_OA6_P2_2.mp3']);
            this.load.audio('P9', [this.caminho+'AV3_S1_OA6_P2_2_C.mp3']);
            this.load.audio('P10', [this.caminho+'AV3_S1_OA6_P2_2_E1.mp3']);
            this.load.audio('P11', [this.caminho+'AV3_S1_OA6_P2_2_E2.mp3']);

        this.load.audio('C5', [this.caminho+'AV3_S1_OA6_P2_3.mp3']);
            this.load.audio('P12', [this.caminho+'AV3_S1_OA6_P2_3_C.mp3']);
            this.load.audio('P13', [this.caminho+'AV3_S1_OA6_P2_3_E1.mp3']);
            this.load.audio('P14', [this.caminho+'AV3_S1_OA6_P2_3_E2.mp3']);

//-------------------------------------------------------------------------
        this.load.audio('C6', [this.caminho+'AV3_S1_OA6_P3_1.mp3']);
            this.load.audio('P15', [this.caminho+'AV3_S1_OA6_P3_1_C.mp3']);
            this.load.audio('P16', [this.caminho+'AV3_S1_OA6_P3_1_E1.mp3']);
            this.load.audio('P17', [this.caminho+'AV3_S1_OA6_P3_1_E2.mp3']);
            this.load.audio('P18', [this.caminho+'AV3_S1_OA6_P3_1_E3.mp3']);

        this.load.audio('C7', [this.caminho+'AV3_S1_OA6_P3_2.mp3']);
            this.load.audio('P19', [this.caminho+'AV3_S1_OA6_P3_2_C.mp3']);
            this.load.audio('P20', [this.caminho+'AV3_S1_OA6_P3_2_E1.mp3']);
            this.load.audio('P21', [this.caminho+'AV3_S1_OA6_P3_2_E2.mp3']);
            this.load.audio('P22', [this.caminho+'AV3_S1_OA6_P3_2_E3.mp3']);

        this.load.audio('C8', [this.caminho+'AV3_S1_OA6_P3_3.mp3']);
            this.load.audio('P23', [this.caminho+'AV3_S1_OA6_P3_3_C.mp3']);
            this.load.audio('P24', [this.caminho+'AV3_S1_OA6_P3_3_E1.mp3']);
            this.load.audio('P25', [this.caminho+'AV3_S1_OA6_P3_3_E2.mp3']);
            this.load.audio('P26', [this.caminho+'AV3_S1_OA6_P3_3_E3.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};