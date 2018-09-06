
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

        this.caminho = getPathFile(UV1AV3UD5OA06);
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        this.load.atlas('nao', this.caminho+'nao.png', this.caminho+'nao.json');
        this.load.atlas('sim', this.caminho+'sim.png', this.caminho+'sim.json');
        this.load.atlas('story', this.caminho+'story.png', this.caminho+'story.json');
        this.load.atlas('questions', this.caminho+'questions.png', this.caminho+'questions.json');
        this.load.atlas('relogio', this.caminho+'relogio.png', this.caminho+'relogio.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD5OA06);

        this.load.audio('soundDica', [this.caminho+'AV3_S5_OA6_DICA.mp3']);
        this.load.audio('soundFabula', [this.caminho+'AV3_S5_OA6_FABULA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S5_OA6_FINAL.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S5_OA6_INTRO.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S5_OA6_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S5_OA6_P1.mp3']);
        this.load.audio('soundP1_1', [this.caminho+'AV3_S5_OA6_P1_1.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S5_OA6_P1_2.mp3']);
        this.load.audio('soundP1_3', [this.caminho+'AV3_S5_OA6_P1_3.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S5_OA6_P2.mp3']);
        this.load.audio('soundP2_1', [this.caminho+'AV3_S5_OA6_P2_1.mp3']);
        this.load.audio('soundP2_2', [this.caminho+'AV3_S5_OA6_P2_2.mp3']);
        this.load.audio('soundP2_3', [this.caminho+'AV3_S5_OA6_P2_3.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S5_OA6_P3.mp3']);
        this.load.audio('soundP3_1', [this.caminho+'AV3_S5_OA6_P3_1.mp3']);
        this.load.audio('soundP3_2', [this.caminho+'AV3_S5_OA6_P3_2.mp3']);
        this.load.audio('soundP3_3', [this.caminho+'AV3_S5_OA6_P3_3.mp3']);

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
