
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

        this.caminho = getPathFile(UV1AV3UD5OA05);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('menino', this.caminho+'menino.png', this.caminho+'menino.json');
        this.load.atlas('placa', this.caminho+'placa.png', this.caminho+'placa.json');
        this.load.atlas('td', this.caminho+'td.png', this.caminho+'td.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD5OA05); 

        this.load.audio('soundDica', [this.caminho+'AV3_S5_OA5_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S5_OA5_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S5_OA5_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S5_OA5_RESUMO.mp3']);  

        this.load.audio('soundP1', [this.caminho+'AV3_S5_OA5_P1.mp3']);
        this.load.audio('soundP1_A1', [this.caminho+'AV3_S5_OA5_P1_A1.mp3']);
        this.load.audio('soundP1_A2', [this.caminho+'AV3_S5_OA5_P1_A2.mp3']);
        this.load.audio('soundP1_A3', [this.caminho+'AV3_S5_OA5_P1_A3.mp3']);
        this.load.audio('soundP1_T1', [this.caminho+'AV3_S5_OA5_P1_T1.mp3']);
        this.load.audio('soundP1_T2', [this.caminho+'AV3_S5_OA5_P1_T2.mp3']);
        this.load.audio('soundP1_T3', [this.caminho+'AV3_S5_OA5_P1_T3.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S5_OA5_P2.mp3']);
        this.load.audio('soundP2_A1', [this.caminho+'AV3_S5_OA5_P2_A1.mp3']);
        this.load.audio('soundP2_A2', [this.caminho+'AV3_S5_OA5_P2_A2.mp3']);
        this.load.audio('soundP2_A3', [this.caminho+'AV3_S5_OA5_P2_A3.mp3']);
        this.load.audio('soundP2_T1', [this.caminho+'AV3_S5_OA5_P2_T1.mp3']);
        this.load.audio('soundP2_T2', [this.caminho+'AV3_S5_OA5_P2_T2.mp3']);
        this.load.audio('soundP2_T3', [this.caminho+'AV3_S5_OA5_P2_T3.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S5_OA5_P3.mp3']);
        this.load.audio('soundP3_A1', [this.caminho+'AV3_S5_OA5_P3_A1.mp3']);
        this.load.audio('soundP3_A2', [this.caminho+'AV3_S5_OA5_P3_A2.mp3']);
        this.load.audio('soundP3_A3', [this.caminho+'AV3_S5_OA5_P3_A3.mp3']);
        this.load.audio('soundP3_A4', [this.caminho+'AV3_S5_OA5_P3_A4.mp3']);
        this.load.audio('soundP3_T1', [this.caminho+'AV3_S5_OA5_P3_T1.mp3']);
        this.load.audio('soundP3_T2', [this.caminho+'AV3_S5_OA5_P3_T2.mp3']);
        this.load.audio('soundP3_T3', [this.caminho+'AV3_S5_OA5_P3_T3.mp3']);
        this.load.audio('soundP3_T4', [this.caminho+'AV3_S5_OA5_P3_T4.mp3']); 

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
