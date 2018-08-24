
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

        //ANIMATIONS
        this.caminho = getPathFile(UV1AV3UD8OA04);
        
        this.load.image('background', this.caminho + 'background.png');
        this.load.image('celular', this.caminho + 'celular.png');
        this.load.image('tela', this.caminho + 'tela.png');
        this.load.image('intro_1', this.caminho + 'intro_1.png');
        this.load.image('intro_2', this.caminho + 'intro_2.png');
        this.load.image('guri_keep_alive', this.caminho + 'guri_keep_alive.png');
        this.load.image('guri_happy', this.caminho + 'guri_happy.png');
        this.load.atlas('alternativas', this.caminho + 'alternativas.png', this.caminho+'alternativas.json');
         
        // SOUNDS 
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD8OA04);

        this.load.audio('soundIntro', [this.caminho+'AV3_S8_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S8_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S8_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S8_OA4_RESUMO.mp3']);
        this.load.audio('P1', [this.caminho+'AV3_S8_OA4_P1.mp3']);
        this.load.audio('P2', [this.caminho+'AV3_S8_OA4_P2.mp3']);
        this.load.audio('P3', [this.caminho+'AV3_S8_OA4_P3.mp3']);
        this.load.audio('P1_0_0', [this.caminho+'P1_0_0.mp3']);
        this.load.audio('P1_0_1', [this.caminho+'P1_0_1.mp3']);
        this.load.audio('P1_1_0', [this.caminho+'P1_1_0.mp3']);
        this.load.audio('P1_1_1', [this.caminho+'P1_1_1.mp3']);
        this.load.audio('P1_2_0', [this.caminho+'P1_2_0.mp3']);
        this.load.audio('P1_2_1', [this.caminho+'P1_2_1.mp3']);
        this.load.audio('P2_0_0', [this.caminho+'P2_0_0.mp3']);
        this.load.audio('P2_0_1', [this.caminho+'P2_0_1.mp3']);
        this.load.audio('P2_1_0', [this.caminho+'P2_1_0.mp3']);
        this.load.audio('P2_1_1', [this.caminho+'P2_1_1.mp3']);
        this.load.audio('P2_2_0', [this.caminho+'P2_2_0.mp3']);
        this.load.audio('P2_2_1', [this.caminho+'P2_2_1.mp3']);
        this.load.audio('P3_0_0', [this.caminho+'P3_0_0.mp3']);
        this.load.audio('P3_0_1', [this.caminho+'P3_0_1.mp3']);
        this.load.audio('P3_1_0', [this.caminho+'P3_1_0.mp3']);
        this.load.audio('P3_1_1', [this.caminho+'P3_1_1.mp3']);
        this.load.audio('P3_2_0', [this.caminho+'P3_2_0.mp3']);
        this.load.audio('P3_2_1', [this.caminho+'P3_2_1.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};