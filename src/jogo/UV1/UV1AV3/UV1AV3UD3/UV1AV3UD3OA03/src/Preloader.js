
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

        this.caminho = getPathFile(UV1AV3UD3OA03);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('coluna', this.caminho+'barra_progresso.png');
        this.load.image('bug', this.caminho+'bug.png');
        this.load.image('omega', this.caminho+'omega.png');
        this.load.image('pi', this.caminho+'pi.png');
        this.load.image('robo', this.caminho+'robo.png');
        this.load.image('robocam', this.caminho+'robocam.png');

        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD3OA03);

        this.load.audio('soundIntro', [this.caminho+'AV3_S3_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S3_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S3_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S3_OA3_RESUMO.mp3']);      

        this.load.audio('soundP1_1', [this.caminho+'AV3_S3_OA3_P1_1.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S3_OA3_P1_2.mp3']);
        this.load.audio('soundP2_1', [this.caminho+'AV3_S3_OA3_P2_1.mp3']);
        this.load.audio('soundP2_2', [this.caminho+'AV3_S3_OA3_P2_2.mp3']);
        this.load.audio('soundP3_1', [this.caminho+'AV3_S3_OA3_P3_1.mp3']);
        this.load.audio('soundP3_2', [this.caminho+'AV3_S3_OA3_P3_2.mp3']);
        this.load.audio('soundP3_3', [this.caminho+'AV3_S3_OA3_P3_3.mp3']);
        this.load.audio('soundP4_1', [this.caminho+'AV3_S3_OA3_P4_1.mp3']);
        this.load.audio('soundP4_2', [this.caminho+'AV3_S3_OA3_P4_2.mp3']);
        this.load.audio('soundP5_1', [this.caminho+'AV3_S3_OA3_P5_1.mp3']);
        this.load.audio('soundP5_2', [this.caminho+'AV3_S3_OA3_P5_2.mp3']);


    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};