
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
        this.caminho = getPathFile(UV1AV3UD6OA01);

        this.load.image('background', this.caminho + 'background.png');
        this.load.image('livro', this.caminho + 'livro.png');
        this.load.image('quadro', this.caminho + 'quadro.png');
        this.load.atlas('guria_keep_alive', this.caminho + 'guria_keep_alive.png', this.caminho+'guria_keep_alive.json');
        this.load.atlas('guria_happy', this.caminho + 'guria_happy.png', this.caminho+'guria_happy.json');
        this.load.atlas('rato_1', this.caminho + 'rato_1.png', this.caminho+'rato_1.json');
        this.load.atlas('rato_2', this.caminho + 'rato_2.png', this.caminho+'rato_2.json');
        this.load.atlas('rato_3', this.caminho + 'rato_3.png', this.caminho+'rato_3.json');
        
        // GAMEPLAY - SOUNDS
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD6OA01);

        this.load.audio('soundIntro', [this.caminho+'AV3_S6_OA1_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S6_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S6_OA1_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S6_OA1_RESUMO.mp3']);
        this.load.audio('P1', [this.caminho+'AV3_S6_OA1_P1.mp3']);
        this.load.audio('P2', [this.caminho+'AV3_S6_OA1_P2.mp3']);
        this.load.audio('P3', [this.caminho+'AV3_S6_OA1_P3.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};