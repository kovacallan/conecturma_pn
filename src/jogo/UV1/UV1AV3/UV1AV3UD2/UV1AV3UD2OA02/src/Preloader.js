
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
        
        this.caminho = getPathFile(UV1AV3UD2OA02);


        this.load.image('background', this.caminho+'background.png');
        this.load.image('marca', this.caminho+'marca.png');
        this.load.image('marcaArbusto', this.caminho+'marcaArbusto.png');
        this.load.image('area', this.caminho+'area.png');
        this.load.image('area2', this.caminho+'area2.png');

        this.load.atlas('anim_polly', this.caminho+'anim_polly.png', this.caminho+'anim_polly.json');
        this.load.atlas('anim_polly_happy', this.caminho+'anim_polly_comemora.png', this.caminho+'anim_polly_comemora.json');
        
        this.load.atlas('silabas', this.caminho+'silabas.png', this.caminho+'silabas.json');

        this.load.atlas('capivara', this.caminho+'capivara.png', this.caminho+'capivara.json');
        this.load.atlas('coelho', this.caminho+'coelho.png', this.caminho+'coelho.json');
        this.load.atlas('gato', this.caminho+'gato.png', this.caminho+'gato.json');
        this.load.atlas('tatu', this.caminho+'tatu.png', this.caminho+'tatu.json');
        
        
        // GAMEPLAY
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD2OA02);

        this.load.audio('soundIntro', [this.caminho+'AV3_S2_OA2_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S2_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S2_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S2_OA2_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S2_OA2_CtA.mp3']);
       
        this.load.audio('biscoito', [this.caminho+'AV3_S2_OA2_BISCOITO.mp3']);
        this.load.audio('bis', [this.caminho+'AV3_S2_OA2_biscoito_BIS.mp3']);
        this.load.audio('coi', [this.caminho+'AV3_S2_OA2_biscoito_COI.mp3']);
        this.load.audio('to', [this.caminho+'AV3_S2_OA2_biscoito_TO.mp3']);

        this.load.audio('caneta', [this.caminho+'AV3_S2_OA2_CANETA.mp3']);
        this.load.audio('ca', [this.caminho+'AV3_S2_OA2_caneta_CA.mp3']);
        this.load.audio('ne', [this.caminho+'AV3_S2_OA2_caneta_NE.mp3']);
        this.load.audio('ta', [this.caminho+'AV3_S2_OA2_caneta_TA.mp3']);

        this.load.audio('caneta', [this.caminho+'AV3_S2_OA2_CANETA.mp3']);
        this.load.audio('ca', [this.caminho+'AV3_S2_OA2_caneta_CA.mp3']);
        this.load.audio('ne', [this.caminho+'AV3_S2_OA2_caneta_NE.mp3']);
        this.load.audio('ta', [this.caminho+'AV3_S2_OA2_caneta_TA.mp3']);

        this.load.audio('canivete', [this.caminho+'AV3_S2_OA2_CANIVETE.mp3']);
        this.load.audio('ca', [this.caminho+'AV3_S2_OA2_canivete_CA.mp3']);
        this.load.audio('ni', [this.caminho+'AV3_S2_OA2_canivete_NI.mp3']);
        this.load.audio('ve', [this.caminho+'AV3_S2_OA2_canivete_VE.mp3']);
        this.load.audio('te', [this.caminho+'AV3_S2_OA2_canivete_TE.mp3']);

        this.load.audio('ciranda', [this.caminho+'AV3_S2_OA2_CIRANDA.mp3']);
        this.load.audio('ci', [this.caminho+'AV3_S2_OA2_ciranda_CI.mp3']);
        this.load.audio('ran', [this.caminho+'AV3_S2_OA2_ciranda_RAN.mp3']);
        this.load.audio('da', [this.caminho+'AV3_S2_OA2_ciranda_DA.mp3']);

        this.load.audio('cirandar', [this.caminho+'AV3_S2_OA2_CIRANDAR.mp3']);
        this.load.audio('ci', [this.caminho+'AV3_S2_OA2_cirandar_CI.mp3']);
        this.load.audio('ran', [this.caminho+'AV3_S2_OA2_cirandar_RAN.mp3']);
        this.load.audio('dar', [this.caminho+'AV3_S2_OA2_cirandar_DAR.mp3']);

        this.load.audio('cirandinha', [this.caminho+'AV3_S2_OA2_CIRANDINHA.mp3']);
        this.load.audio('ci', [this.caminho+'AV3_S2_OA2_cirandinha_CI.mp3']);
        this.load.audio('ran', [this.caminho+'AV3_S2_OA2_cirandinha_RAN.mp3']);
        this.load.audio('di', [this.caminho+'AV3_S2_OA2_cirandinha_DIN.mp3']);
        this.load.audio('nha', [this.caminho+'AV3_S2_OA2_cirandinha_NHA.mp3']);

        this.load.audio('domino', [this.caminho+'AV3_S2_OA2_DOMINO.mp3']);
        this.load.audio('do', [this.caminho+'AV3_S2_OA2_domino_DO.mp3']);
        this.load.audio('mi', [this.caminho+'AV3_S2_OA2_domino_MI.mp3']);
        this.load.audio('no', [this.caminho+'AV3_S2_OA2_domino_NO.mp3']);

        this.load.audio('macaco', [this.caminho+'AV3_S2_OA2_MACACO.mp3']);
        this.load.audio('ma', [this.caminho+'AV3_S2_OA2_macaco_MA.mp3']);
        this.load.audio('ca', [this.caminho+'AV3_S2_OA2_macaco_CA.mp3']);
        this.load.audio('co', [this.caminho+'AV3_S2_OA2_macaco_CO.mp3']);

        this.load.audio('qualidade', [this.caminho+'AV3_S2_OA2_QUALIDADE.mp3']);
        this.load.audio('qua', [this.caminho+'AV3_S2_OA2_qualidade_QUA.mp3']);
        this.load.audio('li', [this.caminho+'AV3_S2_OA2_qualidade_LI.mp3']);
        this.load.audio('da', [this.caminho+'AV3_S2_OA2_qualidade_DA.mp3']);
        this.load.audio('de', [this.caminho+'AV3_S2_OA2_qualidade_DE.mp3']);

        this.load.audio('silaba', [this.caminho+'AV3_S2_OA2_SILABA.mp3']);
        this.load.audio('si', [this.caminho+'AV3_S2_OA2_silaba_SI.mp3']);
        this.load.audio('la', [this.caminho+'AV3_S2_OA2_silaba_LA.mp3']);
        this.load.audio('ba', [this.caminho+'AV3_S2_OA2_silaba_BA.mp3']);

        this.load.audio('tartaruga', [this.caminho+'AV3_S2_OA2_TARTARUGA.mp3']);
        this.load.audio('tar', [this.caminho+'AV3_S2_OA2_tartaruga_TAR.mp3']);
        this.load.audio('ta', [this.caminho+'AV3_S2_OA2_tartaruga_TA.mp3']);
        this.load.audio('ru', [this.caminho+'AV3_S2_OA2_tartaruga_RU.mp3']);
        this.load.audio('ga', [this.caminho+'AV3_S2_OA2_tartaruga_GA.mp3']);


        //--------------------------------------------------------------//
        this.load.audio('coelho', [this.caminho+'AV3_S2_OA2_Ih_Coelho.mp3']);
        this.load.audio('capivara', [this.caminho+'AV3_S2_OA2_Ih_Paca.mp3']);
        this.load.audio('tatu', [this.caminho+'AV3_S2_OA2_Ih_Tatu.mp3']);





       

        














        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};