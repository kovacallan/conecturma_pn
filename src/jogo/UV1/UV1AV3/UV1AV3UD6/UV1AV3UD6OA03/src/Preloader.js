
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

        this.caminho = getPathFile(UV1AV3UD6OA03);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('fina', this.caminho+'fina.png');
        this.load.image('grossa', this.caminho+'grossa.png');

        this.load.atlas('grilo', this.caminho+'grilo.png', this.caminho+'grilo.json');
        this.load.atlas('relogio', this.caminho+'relogio.png', this.caminho+'relogio.json');
        this.load.atlas('sapo-fina', this.caminho+'sapo-fina.png', this.caminho+'sapo-fina.json');
        this.load.atlas('sapo-grossa', this.caminho+'sapo-grossa.png', this.caminho+'sapo-grossa.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD6OA03);

        this.load.audio('soundIntro', [this.caminho+'AV3_S6_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S6_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S6_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S6_OA3_RESUMO.mp3']);
        this.load.audio('soundP', [this.caminho+'AV3_S6_OA3_CtA.mp3']);

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
