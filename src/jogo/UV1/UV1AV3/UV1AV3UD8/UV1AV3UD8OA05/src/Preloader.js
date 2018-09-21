
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
        this.caminho = getPathFile(UV1AV3UD8OA05);
        
        this.load.image('background', this.caminho + 'background.png');
        this.load.image('tigela', this.caminho + 'tigela.png');
        this.load.atlas('anim_setas', this.caminho + 'anim_setas.png', this.caminho+'anim_setas.json');
        this.load.atlas('setas', this.caminho + 'setas.png', this.caminho+'setas.json');
        
        //SOUNDS
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD8OA05);

        this.load.audio('soundIntro', [this.caminho+'AV3_S8_OA5_INTRO.mp3']);
        // this.load.audio('soundFinal', [this.caminho+'AV3_S8_OA5_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S8_OA5_RESUMO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S8_OA5_DICA.mp3']);
        this.load.audio('sound_6', [this.caminho+'AV3_S8_OA5_BAIXO.mp3']);
        this.load.audio('sound_4', [this.caminho+'AV3_S8_OA5_CIMA.mp3']);
        this.load.audio('sound_0', [this.caminho+'AV3_S8_OA5_DIREITA.mp3']);
        this.load.audio('sound_2', [this.caminho+'AV3_S8_OA5_ESQUERDA.mp3']);

        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};