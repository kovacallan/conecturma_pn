
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

        this.caminho = getPathFile(UV1AV3UD3OA01);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
		this.load.image('maquina', this.caminho+'maquina.png');
		this.load.spritesheet('bug', this.caminho+'bugs.png', 150, 160, 9);
		this.load.spritesheet('maos', this.caminho+'maos.png', 205, 467, 6);
        
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD3OA01);

        this.load.audio('soundIntro', [this.caminho+'AV3_S3_OA1_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S3_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S3_OA1_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S3_OA1_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S3_OA1_CtA.mp3']);        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};