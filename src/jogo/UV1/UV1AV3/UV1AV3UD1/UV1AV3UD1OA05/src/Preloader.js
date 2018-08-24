
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
        
        // SCENE

        this.caminho = getPathFile(UV1AV3UD1OA05);

        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('bumba_anim', this.caminho+'bumba_anim.png', this.caminho+'bumba_anim.json');
        this.load.atlas('bumba_anim_happy', this.caminho+'bumba_anim_comemora.png', this.caminho+'bumba_anim_comemora.json');
        this.load.atlas('cartas', this.caminho+'cartas.png', this.caminho+'cartas.json');
        this.load.atlas('resumo_img', this.caminho+'resumo_img.png', this.caminho+'resumo_img.json');


        
        // GAMEPLAY

        //this.caminho = SOUNDS_UV1AV3UD1OA5;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD1OA05); 


        this.load.audio('soundIntro', [this.caminho+'AV3_S1_OA5_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S1_OA5_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S1_OA5_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S1_OA5_RESUMO.mp3']);

        this.load.audio('P1_1', [this.caminho+'AV3_S1_OA5_P1_1.mp3']);
        this.load.audio('P1_2', [this.caminho+'AV3_S1_OA5_P1_2.mp3']);
        this.load.audio('P1_3', [this.caminho+'AV3_S1_OA5_P1_3.mp3']);
        this.load.audio('P1_4', [this.caminho+'AV3_S1_OA5_P2_1.mp3']);
        this.load.audio('P1_5', [this.caminho+'AV3_S1_OA5_P2_2.mp3']);

        this.load.audio('P2_1', [this.caminho+'AV3_S1_OA5_P2_1.mp3']);
        this.load.audio('P2_2', [this.caminho+'AV3_S1_OA5_P2_2.mp3']);
        this.load.audio('P2_3', [this.caminho+'AV3_S1_OA5_P2_3.mp3']);
        this.load.audio('P2_4', [this.caminho+'AV3_S1_OA5_P2_4.mp3']);
        this.load.audio('P2_5', [this.caminho+'AV3_S1_OA5_P2_5.mp3']);
        this.load.audio('P2_6', [this.caminho+'AV3_S1_OA5_P2_6.mp3']);

        this.load.audio('P3_1', [this.caminho+'AV3_S1_OA5_P3_1.mp3']);
        this.load.audio('P3_2', [this.caminho+'AV3_S1_OA5_P3_2.mp3']);
        this.load.audio('P3_3', [this.caminho+'AV3_S1_OA5_P3_3.mp3']);





       
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};