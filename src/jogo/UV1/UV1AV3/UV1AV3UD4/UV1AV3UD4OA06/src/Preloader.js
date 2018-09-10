
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

        this.caminho = getPathFile(UV1AV3UD4OA06);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('menina', this.caminho+'menina.png', this.caminho+'menina.json');
        this.load.atlas('caldeirao', this.caminho+'anim_caldeirao.png', this.caminho+'anim_caldeirao.json');
        this.load.atlas('frases', this.caminho+'frases.png', this.caminho+'frases.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD4OA06);

        this.load.audio('soundIntro', [this.caminho+'AV3_S4_OA6_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S4_OA6_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S4_OA6_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S4_OA6_RESUMO.mp3']);      
    
        this.load.audio('soundP1', [this.caminho+'AV3_S4_OA6_P1.mp3']);
        this.load.audio('soundP1_C_1', [this.caminho+'AV3_S4_OA6_P1_C_1.mp3']);
        this.load.audio('soundP1_C_2', [this.caminho+'AV3_S4_OA6_P1_C_2.mp3']);
        this.load.audio('soundP1_C_3', [this.caminho+'AV3_S4_OA6_P1_C_3.mp3']);
        this.load.audio('soundP1_P_1', [this.caminho+'AV3_S4_OA6_P1_P_1.mp3']);
        this.load.audio('soundP1_P_2', [this.caminho+'AV3_S4_OA6_P1_P_2.mp3']);
        this.load.audio('soundP1_P_3', [this.caminho+'AV3_S4_OA6_P1_P_3.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S4_OA6_P2.mp3']);
        this.load.audio('soundP2_C_1', [this.caminho+'AV3_S4_OA6_P2_C_1.mp3']);
        this.load.audio('soundP2_C_2', [this.caminho+'AV3_S4_OA6_P2_C_2.mp3']);
        this.load.audio('soundP2_C_3', [this.caminho+'AV3_S4_OA6_P2_C_3.mp3']);
        this.load.audio('soundP2_P_1', [this.caminho+'AV3_S4_OA6_P2_P_1.mp3']);
        this.load.audio('soundP2_P_2', [this.caminho+'AV3_S4_OA6_P2_P_2.mp3']);
        this.load.audio('soundP2_P_3', [this.caminho+'AV3_S4_OA6_P2_P_3.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S4_OA6_P3.mp3']);
        this.load.audio('soundP3_C_1', [this.caminho+'AV3_S4_OA6_P3_C_1.mp3']);
        this.load.audio('soundP3_C_2', [this.caminho+'AV3_S4_OA6_P3_C_2.mp3']);
        this.load.audio('soundP3_C_3', [this.caminho+'AV3_S4_OA6_P3_C_3.mp3']);
        this.load.audio('soundP3_P_1', [this.caminho+'AV3_S4_OA6_P3_P_1.mp3']);
        this.load.audio('soundP3_P_2', [this.caminho+'AV3_S4_OA6_P3_P_2.mp3']);
        this.load.audio('soundP3_P_3', [this.caminho+'AV3_S4_OA6_P3_P_3.mp3']);

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

