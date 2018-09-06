
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

        this.caminho = getPathFile(UV1AV3UD3OA05);
        // SCENE
        this.load.image('background0', this.caminho+'background0.png');
        this.load.image('background1', this.caminho+'background1.png');

        this.load.image('agua', this.caminho+'agua.png');

        this.load.atlas('garrafa', this.caminho+'garrafa.png', this.caminho+'garrafa.json');
        this.load.atlas('pi', this.caminho+'pi.png', this.caminho+'pi.json');
        this.load.atlas('placas', this.caminho+'placas.png', this.caminho+'placas.json');
        this.load.atlas('teclas', this.caminho+'teclas.png', this.caminho+'teclas.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD3OA05);

        this.load.audio('soundIntro', [this.caminho+'AV3_S3_OA5_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S3_OA5_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S3_OA5_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S3_OA5_RESUMO.mp3']);      

        this.load.audio('soundP1', [this.caminho+'AV3_S3_OA5_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S3_OA5_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S3_OA5_P3.mp3']);   
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};