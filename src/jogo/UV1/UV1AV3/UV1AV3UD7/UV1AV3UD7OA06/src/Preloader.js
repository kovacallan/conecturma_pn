
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

        this.caminho = getPathFile(UV1AV3UD7OA06);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('anexo', this.caminho + 'anexo.png', this.caminho+'anexo.json');
        this.load.atlas('assinatura', this.caminho + 'assinatura.png', this.caminho+'assinatura.json');
        this.load.atlas('assunto', this.caminho + 'assunto.png', this.caminho+'assunto.json');
        this.load.atlas('de', this.caminho + 'de.png', this.caminho+'de.json');
        this.load.atlas('para', this.caminho + 'para.png', this.caminho+'para.json');
        this.load.atlas('texto', this.caminho + 'texto.png', this.caminho+'texto.json');


        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD7OA06); 

        this.load.audio('soundFinal', [this.caminho+'AV3_S7_OA6_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S7_OA6_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S7_OA6_RESUMO.mp3']);

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
