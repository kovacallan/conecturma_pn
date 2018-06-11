
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

        
        
        
    	///this.load.image('initialText', this.caminho+'initialText.png');
        this.caminho = getPathFile(UV1AV2UD7OA03);
        
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('frente_cenario', this.caminho+'frente_cenario.png');

        // CHARACTER ANIMATION
        this.load.atlas('boitata', this.caminho+'anim_boitata.png', this.caminho+'anim_boitata.json');
        this.load.atlas('boitata_happy', this.caminho+'anim_boitata_happy.png', this.caminho+'anim_boitata_happy.json');
        this.load.atlas('bumba', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
        this.load.atlas('bumba_happy', this.caminho+'anim_bumba_happy.png', this.caminho+'anim_bumba_happy.json');


        // GAMEPLAY
       
        this.load.atlas('cedulas', this.caminho+'real_cedula.png', this.caminho+'real_cedula.json');
        this.load.atlas('outras', this.caminho+'outras_moedas.png', this.caminho+'outras_moedas.json');
        this.load.atlas('moedas', this.caminho+'real_moeda.png', this.caminho+'real_moeda.json');
        
        this.load.image('imgResumo', this.caminho+'resumo_img.png');
        this.load.image('imgResumo1', this.caminho+'resumo_img1.png');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD7OA03);
        
        this.load.audio('soundP1', this.caminho+'UV1AV2S7OA3_P1.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S7OA3_P2.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S7OA3_P3.mp3');

        this.load.audio('soundDica', this.caminho+'UV1AV2S7OA3_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S7OA3_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S7OA3_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S7OA3_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};