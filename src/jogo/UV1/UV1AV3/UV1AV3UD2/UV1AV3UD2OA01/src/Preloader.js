
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

        this.caminho = getPathFile(UV1AV3UD2OA01);


        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('anim_guri', this.caminho+'anim_guri.png', this.caminho+'anim_guri.json');
        this.load.atlas('anim_guri_happy', this.caminho+'anim_guri_comemora.png', this.caminho+'anim_guri_comemora.json');
        this.load.atlas('resumo_img', this.caminho+'img_resumo.png', this.caminho+'img_resumo.json');

        this.load.image('madeira', this.caminho+'madeira.png');
        this.load.image('1', this.caminho+'1.png');
        this.load.image('2', this.caminho+'2.png');
        this.load.image('3', this.caminho+'3.png');
        this.load.image('4', this.caminho+'4.png');
        this.load.image('5', this.caminho+'5.png');
        this.load.image('6', this.caminho+'6.png');
        this.load.image('7', this.caminho+'7.png');
        this.load.image('8', this.caminho+'8.png');
        this.load.image('9', this.caminho+'9.png');

        this.load.image('20', this.caminho+'20.png');
        this.load.image('30', this.caminho+'30.png');
        this.load.image('40', this.caminho+'40.png');
        this.load.image('50', this.caminho+'50.png');
        this.load.image('60', this.caminho+'60.png');
        this.load.image('70', this.caminho+'70.png');
        this.load.image('80', this.caminho+'80.png');
        this.load.image('90', this.caminho+'90.png');
        
        // GAMEPLAY

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD2OA01);

        this.load.audio('soundIntro', [this.caminho+'AV3_S2_OA1_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S2_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S2_OA1_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S2_OA1_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S2_OA1_CtA.mp3']);
       
        this.load.audio('A20', [this.caminho+'AV3_S2_OA1_P_20.mp3']);
        this.load.audio('A30', [this.caminho+'AV3_S2_OA1_P_30.mp3']);
        this.load.audio('A40', [this.caminho+'AV3_S2_OA1_P_40.mp3']);
        this.load.audio('A50', [this.caminho+'AV3_S2_OA1_P_50.mp3']);
        this.load.audio('A60', [this.caminho+'AV3_S2_OA1_P_60.mp3']);
        this.load.audio('A70', [this.caminho+'AV3_S2_OA1_P_70.mp3']);
        this.load.audio('A80', [this.caminho+'AV3_S2_OA1_P_80.mp3']);
        this.load.audio('A90', [this.caminho+'AV3_S2_OA1_P_90.mp3']);
        
        this.load.audio('A1', [this.caminho+'AV3_S2_OA1_P_e1.mp3']);
        this.load.audio('A2', [this.caminho+'AV3_S2_OA1_P_e2.mp3']);
        this.load.audio('A3', [this.caminho+'AV3_S2_OA1_P_e3.mp3']);
        this.load.audio('A4', [this.caminho+'AV3_S2_OA1_P_e4.mp3']);
        this.load.audio('A5', [this.caminho+'AV3_S2_OA1_P_e5.mp3']);
        this.load.audio('A6', [this.caminho+'AV3_S2_OA1_P_e6.mp3']);
        this.load.audio('A7', [this.caminho+'AV3_S2_OA1_P_e7.mp3']);
        this.load.audio('A8', [this.caminho+'AV3_S2_OA1_P_e8.mp3']);
        this.load.audio('A9', [this.caminho+'AV3_S2_OA1_P_e9.mp3']);














        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};