
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

        // SCENE - IMAGES AND ANIMATIONS
        this.caminho = getPathFile(UV1AV3UD5OA03);

        this.load.image('background', this.caminho + 'background.png');
        this.load.image('placa', this.caminho + 'placa.png');
        this.load.image('pedra', this.caminho + 'pedra.png');
        this.load.atlas('ave', this.caminho + 'ave.png', this.caminho+'ave.json');
        this.load.atlas('numeros', this.caminho + 'numeros.png', this.caminho+'numeros.json');
    
        // GAMEPLAY - SOUNDS
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD5OA03);

        this.load.audio('soundCallToAction', [this.caminho+'AV3_S5_OA3_CtA.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S5_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S5_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S5_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S5_OA3_RESUMO.mp3']);
        this.load.audio('P1_0', [this.caminho+'AV3_S5_OA3_P1_357.mp3']);
        this.load.audio('P1_1', [this.caminho+'AV3_S5_OA3_P1_135.mp3']);
        this.load.audio('P1_2', [this.caminho+'AV3_S5_OA3_P1_246.mp3']);
        this.load.audio('P2_0', [this.caminho+'AV3_S5_OA3_P2_579.mp3']);
        this.load.audio('P2_1', [this.caminho+'AV3_S5_OA3_P2_8_10_12.mp3']);
        this.load.audio('P2_2', [this.caminho+'AV3_S5_OA3_P2_7_9_11.mp3']);
        this.load.audio('P3_0', [this.caminho+'AV3_S5_OA3_P3_3_6_9_12.mp3']);
        this.load.audio('P3_1', [this.caminho+'AV3_S5_OA3_P3_5_10_15_20.mp3']);
        this.load.audio('P3_2', [this.caminho+'AV3_S5_OA3_P3_10_20_30_40.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};