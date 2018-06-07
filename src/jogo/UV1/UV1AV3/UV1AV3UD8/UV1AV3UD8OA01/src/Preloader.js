
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

        this.caminho = getPathFile(UV1AV3UD8OA01);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('simpatia', this.caminho+'simpatia.png');
        this.load.image('faixa', this.caminho+'faixa.png');
        this.load.image('placa', this.caminho+'placa.png');

        this.load.atlas('dezenas', this.caminho+'dezenas.png', this.caminho+'dezenas.json');
        this.load.atlas('unidades', this.caminho+'unidades.png', this.caminho+'unidades.json');
        this.load.atlas('monstro', this.caminho+'monstro.png', this.caminho+'monstro.json');
        this.load.atlas('tigela', this.caminho+'tigela.png', this.caminho+'tigela.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD8OA01); 

        this.load.audio('soundDica', [this.caminho+'AV3_S8_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S8_OA1_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S8_OA1_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S8_OA1_RESUMO.mp3']);  

        this.load.audio('soundP', [this.caminho+'AV3_S8_OA1_CtA.mp3']);
        this.load.audio('soundA_20', [this.caminho+'AV3_S8_OA1_20.mp3']);
        this.load.audio('soundA_30', [this.caminho+'AV3_S8_OA1_30.mp3']);
        this.load.audio('soundA_40', [this.caminho+'AV3_S8_OA1_40.mp3']);
        this.load.audio('soundA_50', [this.caminho+'AV3_S8_OA1_50.mp3']);
        this.load.audio('soundA_60', [this.caminho+'AV3_S8_OA1_60.mp3']);
        this.load.audio('soundA_70', [this.caminho+'AV3_S8_OA1_70.mp3']);
        this.load.audio('soundA_80', [this.caminho+'AV3_S8_OA1_80.mp3']);
        this.load.audio('soundA_90', [this.caminho+'AV3_S8_OA1_90.mp3']);
        this.load.audio('soundA_E1', [this.caminho+'AV3_S8_OA1_E1.mp3']);
        this.load.audio('soundA_E2', [this.caminho+'AV3_S8_OA1_E2.mp3']);
        this.load.audio('soundA_E3', [this.caminho+'AV3_S8_OA1_E3.mp3']);
        this.load.audio('soundA_E4', [this.caminho+'AV3_S8_OA1_E4.mp3']);
        this.load.audio('soundA_E5', [this.caminho+'AV3_S8_OA1_E5.mp3']);
        this.load.audio('soundA_E6', [this.caminho+'AV3_S8_OA1_E6.mp3']);
        this.load.audio('soundA_E7', [this.caminho+'AV3_S8_OA1_E7.mp3']);
        this.load.audio('soundA_E8', [this.caminho+'AV3_S8_OA1_E8.mp3']);
        this.load.audio('soundA_E9', [this.caminho+'AV3_S8_OA1_E9.mp3']);
        
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
