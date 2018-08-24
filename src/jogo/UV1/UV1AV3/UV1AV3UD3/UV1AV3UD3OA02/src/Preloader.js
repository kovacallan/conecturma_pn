
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

        this.caminho = getPathFile(UV1AV3UD3OA02);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
		this.load.atlas('anim_bumba', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD3OA02);

        this.load.audio('soundIntro', [this.caminho+'AV3_S3_OA2_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S3_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S3_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S3_OA2_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S3_OA2_P1.mp3']);
        this.load.audio('soundP1_1', [this.caminho+'AV3_S3_OA2_P1_1.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S3_OA2_P1_2.mp3']);
        this.load.audio('soundP1_3', [this.caminho+'AV3_S3_OA2_P1_3.mp3']);

        this.load.audio('soundP2', [this.caminho+'AV3_S3_OA2_P2.mp3']);
        this.load.audio('soundP2_1_A', [this.caminho+'AV3_S3_OA2_P2_1_A.mp3']);
        this.load.audio('soundP2_1_B', [this.caminho+'AV3_S3_OA2_P2_1_B.mp3']);
        this.load.audio('soundP2_2_A', [this.caminho+'AV3_S3_OA2_P2_2_A.mp3']);
        this.load.audio('soundP2_2_B', [this.caminho+'AV3_S3_OA2_P2_2_B.mp3']);
        this.load.audio('soundP2_3_A', [this.caminho+'AV3_S3_OA2_P2_3_A.mp3']);
        this.load.audio('soundP2_3_B', [this.caminho+'AV3_S3_OA2_P2_3_B.mp3']);

        this.load.audio('soundP3', [this.caminho+'AV3_S3_OA2_P3.mp3']);
        this.load.audio('soundP3_1_A', [this.caminho+'AV3_S3_OA2_P3_1_A.mp3']);
        this.load.audio('soundP3_1_B', [this.caminho+'AV3_S3_OA2_P3_1_B.mp3']);
        this.load.audio('soundP3_1_C', [this.caminho+'AV3_S3_OA2_P3_1_C.mp3']);
        this.load.audio('soundP3_2_A', [this.caminho+'AV3_S3_OA2_P3_2_A.mp3']);
        this.load.audio('soundP3_2_B', [this.caminho+'AV3_S3_OA2_P3_2_B.mp3']);
        this.load.audio('soundP3_2_C', [this.caminho+'AV3_S3_OA2_P3_2_C.mp3']);
        this.load.audio('soundP3_3_A', [this.caminho+'AV3_S3_OA2_P3_3_A.mp3']);
        this.load.audio('soundP3_3_B', [this.caminho+'AV3_S3_OA2_P3_3_B.mp3']);
        this.load.audio('soundP3_3_C', [this.caminho+'AV3_S3_OA2_P3_3_C.mp3']);

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