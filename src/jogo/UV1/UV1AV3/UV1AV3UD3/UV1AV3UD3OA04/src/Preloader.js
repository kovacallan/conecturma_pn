
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

        this.caminho = getPathFile(UV1AV3UD3OA04);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('anim_bumba', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
        this.load.atlas('objetos', this.caminho+'objetos.png', this.caminho+'objetos.json');
        this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD3OA04);

        this.load.audio('soundIntro', [this.caminho+'AV3_S3_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S3_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S3_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S3_OA4_RESUMO.mp3']);      

        this.load.audio('soundP1_camera', [this.caminho+'AV3_S3_OA4_P1_CAMERA.mp3']);
        this.load.audio('soundP1_queijo', [this.caminho+'AV3_S3_OA4_P1_QUEIJO.mp3']);
        this.load.audio('soundP1_mosquito', [this.caminho+'AV3_S3_OA4_P1_MOSQUITO.mp3']);
        this.load.audio('soundP1_jacare', [this.caminho+'AV3_S3_OA4_P1_JACARE.mp3']);
        this.load.audio('soundP1_galo', [this.caminho+'AV3_S3_OA4_P1_GALO.mp3']);
        this.load.audio('soundP2_girafa', [this.caminho+'AV3_S3_OA4_P2_GIRAFA.mp3']);
        this.load.audio('soundP2_jaca', [this.caminho+'AV3_S3_OA4_P2_JACA.mp3']);
        this.load.audio('soundP2_joelho', [this.caminho+'AV3_S3_OA4_P2_JOELHO.mp3']);
        this.load.audio('soundP2_jujuba', [this.caminho+'AV3_S3_OA4_P2_JUJUBA.mp3']);
        this.load.audio('soundP2_guache', [this.caminho+'AV3_S3_OA4_P2_GUACHE.mp3']);
        this.load.audio('soundP3_quindim', [this.caminho+'AV3_S3_OA4_P3_QUINDIM.mp3']);
        this.load.audio('soundP3_basquete', [this.caminho+'AV3_S3_OA4_P3_BASQUETE.mp3']);
        this.load.audio('soundP3_parque', [this.caminho+'AV3_S3_OA4_P3_PARQUE.mp3']);
        this.load.audio('soundP3_caju', [this.caminho+'AV3_S3_OA4_P3_CAJU.mp3']);
        this.load.audio('soundP3_feijoada', [this.caminho+'AV3_S3_OA4_P3_FEIJOADA.mp3']);
        this.load.audio('soundP3_beijo', [this.caminho+'AV3_S3_OA4_P3_BEIJO.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};