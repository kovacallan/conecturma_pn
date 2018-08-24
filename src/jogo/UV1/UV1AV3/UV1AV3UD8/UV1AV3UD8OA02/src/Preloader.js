
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

        this.caminho = getPathFile(UV1AV3UD8OA02);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('acai', this.caminho+'acai.png', this.caminho+'acai.json');
        this.load.atlas('menina', this.caminho+'menina.png', this.caminho+'menina.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD8OA02); 

        this.load.audio('soundDica', [this.caminho+'AV3_S8_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S8_OA2_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S8_OA2_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S8_OA2_RESUMO.mp3']);  

        this.load.audio('soundA0', [this.caminho+'AV3_S8_OA2_BLEFE.mp3']);
        this.load.audio('soundA1', [this.caminho+'AV3_S8_OA2_BLITZ.mp3']);
        this.load.audio('soundA2', [this.caminho+'AV3_S8_OA2_BLOCO.mp3']);
        this.load.audio('soundA3', [this.caminho+'AV3_S8_OA2_CLARAO.mp3']);
        this.load.audio('soundA4', [this.caminho+'AV3_S8_OA2_CLORO.mp3']);
        this.load.audio('soundA5', [this.caminho+'AV3_S8_OA2_CLUBE.mp3']);
        this.load.audio('soundA6', [this.caminho+'AV3_S8_OA2_FLECHA.mp3']);
        this.load.audio('soundA7', [this.caminho+'AV3_S8_OA2_FLOR.mp3']);
        this.load.audio('soundA8', [this.caminho+'AV3_S8_OA2_FLUOR.mp3']);
        this.load.audio('soundA9', [this.caminho+'AV3_S8_OA2_GLACIAL.mp3']);
        this.load.audio('soundA10', [this.caminho+'AV3_S8_OA2_GLOBO.mp3']);
        this.load.audio('soundA11', [this.caminho+'AV3_S8_OA2_GLOBULO.mp3']);
        this.load.audio('soundP1', [this.caminho+'AV3_S8_OA2_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S8_OA2_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S8_OA2_P3.mp3']);
        this.load.audio('soundP4', [this.caminho+'AV3_S8_OA2_P4.mp3']);
        
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
