
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
        
        this.caminho = getPathFile(UV1AV3UD2OA06);

        // SCENE - IMAGES AND ANIMATIONS
        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('anim_guri', this.caminho+'anim_guri.png', this.caminho+'anim_guri.json');
        this.load.atlas('anim_poly', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
        this.load.atlas('anim_guri_happy', this.caminho+'anim_guri_happy.png', this.caminho+'anim_guri_happy.json');
        this.load.atlas('anim_poly_happy', this.caminho+'anim_poly_happy.png', this.caminho+'anim_poly_happy.json');
        this.load.atlas('frases', this.caminho+'frases.png', this.caminho+'frases.json');
        this.load.atlas('opcao', this.caminho+'opcao.png', this.caminho+'opcao.json');
        
        // GAMEPLAY - SOUNDS

        //getPathFileSound 
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD2OA06);
        this.load.audio('soundCallAction', [this.caminho+'AV3_S2_OA6_CtA.mp3']);
        this.load.audio('soundIntro', [this.caminho+'AV3_S2_OA6_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S2_OA6_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S2_OA6_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S2_OA6_RESUMO.mp3']);
        this.load.audio('P1_1', [this.caminho+'AV3_S2_OA6_P1_1.mp3']);
        this.load.audio('P1_2', [this.caminho+'AV3_S2_OA6_P1_2.mp3']);
        this.load.audio('P1_3', [this.caminho+'AV3_S2_OA6_P1_3.mp3']);
        this.load.audio('P2_1', [this.caminho+'AV3_S2_OA6_P2_1.mp3']);
        this.load.audio('P2_2', [this.caminho+'AV3_S2_OA6_P2_2.mp3']);
        this.load.audio('P2_3', [this.caminho+'AV3_S2_OA6_P2_3.mp3']);
        this.load.audio('P3_1', [this.caminho+'AV3_S2_OA6_P3_1.mp3']);
        this.load.audio('P3_2', [this.caminho+'AV3_S2_OA6_P3_2.mp3']);
        this.load.audio('P3_3', [this.caminho+'AV3_S2_OA6_P3_3.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};