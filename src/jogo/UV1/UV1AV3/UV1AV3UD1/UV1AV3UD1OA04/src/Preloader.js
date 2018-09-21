
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

        this.caminho = getPathFile(UV1AV3UD1OA04);

        this.load.image('background', this.caminho+'background.png');
        this.load.atlas('cabo', this.caminho+'cabo.png', this.caminho+'cabo.json');
        this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
        this.load.image('marca_cabo', this.caminho+'marca_cabo.png');

        
        // GAMEPLAY

        //this.caminho = SOUNDS_UV1AV3UD1OA4;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD1OA04);
        console.log(this.caminho); 


        this.load.audio('soundIntro', [this.caminho+'AV3_S1_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S1_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S1_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S1_OA4_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S1_OA4_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S1_OA4_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S1_OA4_P3.mp3']);

        this.load.audio('P0', [this.caminho+'AV3_S1_OA4_P1_SACOLA.mp3']);
        this.load.audio('P1', [this.caminho+'AV3_S1_OA4_P1_SORVETE.mp3']);
        this.load.audio('P2', [this.caminho+'AV3_S1_OA4_P1_SUCO.mp3']);

        this.load.audio('0', [this.caminho+'AV3_S1_OA4_P1_ASSADO.mp3']);
        this.load.audio('1', [this.caminho+'AV3_S1_OA4_P1_BATATA.mp3']);
        this.load.audio('2', [this.caminho+'AV3_S1_OA4_P1_OSSO.mp3']);
        this.load.audio('3', [this.caminho+'AV3_S1_OA4_P1_MORANGO.mp3']);
        this.load.audio('4', [this.caminho+'AV3_S1_OA4_P1_ASSUNTO.mp3']);
        this.load.audio('5', [this.caminho+'AV3_S1_OA4_P1_COPO.mp3']);

        this.load.audio('P3', [this.caminho+'AV3_S1_OA4_P2_AZAR.mp3']);
        this.load.audio('P4', [this.caminho+'AV3_S1_OA4_P2_TRAZER.mp3']);
        this.load.audio('P5', [this.caminho+'AV3_S1_OA4_P2_PAZES.mp3']);

        this.load.audio('6', [this.caminho+'AV3_S1_OA4_P2_CASA.mp3']);
        this.load.audio('7', [this.caminho+'AV3_S1_OA4_P2_CONEXAO.mp3']);
        this.load.audio('8', [this.caminho+'AV3_S1_OA4_P2_ASA.mp3']);
        this.load.audio('9', [this.caminho+'AV3_S1_OA4_P2_CHA.mp3']);
        this.load.audio('10', [this.caminho+'AV3_S1_OA4_P2_VASO.mp3']);
        this.load.audio('11', [this.caminho+'AV3_S1_OA4_P2_CHOCOLATE.mp3']);

        this.load.audio('P6', [this.caminho+'AV3_S1_OA4_P3_AZEDO.mp3']);
        this.load.audio('P7', [this.caminho+'AV3_S1_OA4_P3_AZEITE.mp3']);
        this.load.audio('P8', [this.caminho+'AV3_S1_OA4_P3_AZUL.mp3']);

        this.load.audio('12', [this.caminho+'AV3_S1_OA4_P3_EXATO.mp3']);
        this.load.audio('13', [this.caminho+'AV3_S1_OA4_P3_MASSA.mp3']);
        this.load.audio('14', [this.caminho+'AV3_S1_OA4_P3_EXAME.mp3']);
        this.load.audio('15', [this.caminho+'AV3_S1_OA4_P3_SOPA.mp3']);
        this.load.audio('16', [this.caminho+'AV3_S1_OA4_P3_EXEMPLO.mp3']);
        this.load.audio('17', [this.caminho+'AV3_S1_OA4_P3_PASSARO.mp3']);






        
       

    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};