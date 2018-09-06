
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

        this.caminho = getPathFile(UV1AV3UD8OA03);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('guarana', this.caminho+'guarana.png', this.caminho+'guarana.json');

        this.load.bitmapFont('lucky-numbers', this.caminho+'lucky-numbers.png',  this.caminho+"lucky-numbers.fnt");

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD8OA03); 

        this.load.audio('soundDica', [this.caminho+'AV3_S8_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S8_OA3_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S8_OA3_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S8_OA3_RESUMO.mp3']);  

        this.load.audio('soundP', [this.caminho+'AV3_S8_OA3_CtA.mp3']);  
        this.load.audio('soundP1', [this.caminho+'AV3_S8_OA3_NUMERO_NATURAL.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S8_OA3_ORDINAL.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S8_OA3_DECIMAL.mp3']);

        this.caminho = getPathFile(GLOBAL_FONT);

        this.load.bitmapFont('lucky-32-shadow', this.caminho+'lucky_32_shadow.png',  this.caminho+"lucky_32_shadow.fnt");
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};
