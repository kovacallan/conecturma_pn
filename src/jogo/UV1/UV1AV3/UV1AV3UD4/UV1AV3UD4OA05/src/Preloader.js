
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

        this.caminho = getPathFile(UV1AV3UD4OA05);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.image('amendoim', this.caminho+'amendoim.png');
        this.load.image('acucar', this.caminho+'acucar.png');
        this.load.image('ingrediente-magico', this.caminho+'ingrediente-magico.png');

        this.load.image('codorna', this.caminho+'codorna.png');

        this.load.atlas('menino', this.caminho+'menino.png', this.caminho+'menino.json');
        this.load.atlas('cavalo', this.caminho+'cavalo.png', this.caminho+'cavalo.json');
        this.load.atlas('balanca', this.caminho+'balanca.png', this.caminho+'balanca.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD4OA05); 

        this.load.audio('soundDica', [this.caminho+'AV3_S4_OA5_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S4_OA5_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S4_OA5_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S4_OA5_RESUMO.mp3']);  

        this.load.audio('soundP1', [this.caminho+'AV3_S4_OA5_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S4_OA5_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S4_OA5_P3.mp3']);

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
