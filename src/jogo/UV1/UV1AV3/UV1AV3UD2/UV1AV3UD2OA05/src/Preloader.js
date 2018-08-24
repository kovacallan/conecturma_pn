
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

        //this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
        
        this.caminho = getPathFile(UV1AV3UD2OA05);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        
        this.load.atlas('anim_polly', this.caminho+'anim_polly.png', this.caminho+'anim_polly.json');
        this.load.atlas('anim_polly_happy', this.caminho+'anim_polly_comemora.png', this.caminho+'anim_polly_comemora.json');
        
        // GAMEPLAY

        this.load.image('quadro', this.caminho+'quadro.png');
        this.load.image('quadrado', this.caminho+'quadrado.png');
        this.load.image('retangulo', this.caminho+'retangulo.png');
        this.load.image('losango', this.caminho+'losango.png');
        this.load.image('trapezio', this.caminho+'trapezio.png');

        this.load.image('intro_quadrado', this.caminho+'intro_quadrado.png');
        this.load.image('intro_retangulo', this.caminho+'intro_retangulo.png');
        this.load.image('intro_losango', this.caminho+'intro_losango.png');
        this.load.image('intro_trapezio', this.caminho+'intro_trapezio.png');

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD2OA05);

        this.load.audio('soundIntro', [this.caminho+'AV3_S2_OA5_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S2_OA5_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S2_OA5_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S2_OA5_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S2_OA5_CtA.mp3']);
        this.load.audio('Aquadrado', [this.caminho+'AV3_S2_OA5_QUADRADO.mp3']);
        this.load.audio('Alosango', [this.caminho+'AV3_S2_OA5_LOSANGO.mp3']);
        this.load.audio('Aretangulo', [this.caminho+'AV3_S2_OA5_RETANGULO.mp3']);
        this.load.audio('Atrapezio', [this.caminho+'AV3_S2_OA5_TRAPEZIO.mp3']);

        //this.load.audio('soundP2', [this.caminho+'AV3_S2_OA4_P2.mp3']);
        //this.load.audio('soundP3', [this.caminho+'AV3_S2_OA4_P3.mp3']);
       
        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};