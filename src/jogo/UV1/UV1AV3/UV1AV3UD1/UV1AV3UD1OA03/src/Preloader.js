
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

        
        this.caminho = getPathFile(UV1AV3UD1OA03);

        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('bumba_anim', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
        this.load.atlas('bumba_anim_happy', this.caminho+'anim_bumba_comemora.png', this.caminho+'anim_bumba_comemora.json');
        this.load.atlas('mc_resumo', this.caminho+'mc_resumo.png', this.caminho+'mc_resumo.json');
        
        // GAMEPLAY

        this.load.image('dezenas', this.caminho+'dezenas.png');
        this.load.image('unidade', this.caminho+'unidade.png');
        this.load.image('painel_unidades', this.caminho+'painel_unidades.png');
        this.load.image('painel_dezenas', this.caminho+'painel_dezenas.png');
        this.load.image('painel_quadrado', this.caminho+'painel_quadrado.png');

        //this.caminho = SOUNDS_UV1AV3UD1OA3;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD1OA03); 

        
        this.load.audio('soundIntro', [this.caminho+'AV3_S1_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S1_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S1_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S1_OA3_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S1_OA3_CtA.mp3']);

        this.load.audio('11', [this.caminho+'AV3_S1_OA3_11.mp3']);
        this.load.audio('12', [this.caminho+'AV3_S1_OA3_12.mp3']);
        this.load.audio('13', [this.caminho+'AV3_S1_OA3_13.mp3']);
        this.load.audio('14', [this.caminho+'AV3_S1_OA3_14.mp3']);
        this.load.audio('15', [this.caminho+'AV3_S1_OA3_15.mp3']);
        this.load.audio('16', [this.caminho+'AV3_S1_OA3_16.mp3']);
        this.load.audio('17', [this.caminho+'AV3_S1_OA3_17.mp3']);
        this.load.audio('18', [this.caminho+'AV3_S1_OA3_18.mp3']);
        this.load.audio('19', [this.caminho+'AV3_S1_OA3_19.mp3']);

        this.load.audio('20', [this.caminho+'AV3_S1_OA3_20.mp3']);
        this.load.audio('21', [this.caminho+'AV3_S1_OA3_21.mp3']);
        this.load.audio('22', [this.caminho+'AV3_S1_OA3_22.mp3']);
        this.load.audio('23', [this.caminho+'AV3_S1_OA3_23.mp3']);
        this.load.audio('24', [this.caminho+'AV3_S1_OA3_24.mp3']);
        this.load.audio('25', [this.caminho+'AV3_S1_OA3_25.mp3']);
        this.load.audio('26', [this.caminho+'AV3_S1_OA3_26.mp3']);
        this.load.audio('27', [this.caminho+'AV3_S1_OA3_27.mp3']);
        this.load.audio('28', [this.caminho+'AV3_S1_OA3_28.mp3']);
        this.load.audio('29', [this.caminho+'AV3_S1_OA3_29.mp3']);

        this.load.audio('30', [this.caminho+'AV3_S1_OA3_30.mp3']);
        this.load.audio('31', [this.caminho+'AV3_S1_OA3_31.mp3']);
        this.load.audio('32', [this.caminho+'AV3_S1_OA3_32.mp3']);
        this.load.audio('33', [this.caminho+'AV3_S1_OA3_33.mp3']);
        this.load.audio('34', [this.caminho+'AV3_S1_OA3_34.mp3']);
        this.load.audio('35', [this.caminho+'AV3_S1_OA3_35.mp3']);
        this.load.audio('36', [this.caminho+'AV3_S1_OA3_36.mp3']);
        this.load.audio('37', [this.caminho+'AV3_S1_OA3_37.mp3']);
        this.load.audio('38', [this.caminho+'AV3_S1_OA3_38.mp3']);
        this.load.audio('39', [this.caminho+'AV3_S1_OA3_39.mp3']);

        this.load.audio('40', [this.caminho+'AV3_S1_OA3_40.mp3']);
        this.load.audio('41', [this.caminho+'AV3_S1_OA3_41.mp3']);
        this.load.audio('42', [this.caminho+'AV3_S1_OA3_42.mp3']);
        this.load.audio('43', [this.caminho+'AV3_S1_OA3_43.mp3']);
        this.load.audio('44', [this.caminho+'AV3_S1_OA3_44.mp3']);
        this.load.audio('45', [this.caminho+'AV3_S1_OA3_45.mp3']);
        this.load.audio('46', [this.caminho+'AV3_S1_OA3_46.mp3']);
        this.load.audio('47', [this.caminho+'AV3_S1_OA3_47.mp3']);
        this.load.audio('48', [this.caminho+'AV3_S1_OA3_48.mp3']);
        this.load.audio('49', [this.caminho+'AV3_S1_OA3_49.mp3']);
       

    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};