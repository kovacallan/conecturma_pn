
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

        this.caminho = getPathFile(UV1AV3UD1OA02);
    
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('luz', this.caminho+'luz.png');

        // palavras
        this.load.image('bateria', this.caminho+'bateria.png');
        this.load.image('campo', this.caminho+'campo.png');
        this.load.image('chuva', this.caminho+'chuva.png');
        this.load.image('dores', this.caminho+'dores.png');
        this.load.image('flores', this.caminho+'flores.png');
        this.load.image('fundo', this.caminho+'fundo.png');
        this.load.image('grama', this.caminho+'grama.png');
        this.load.image('lembrar', this.caminho+'lembrar.png');
        this.load.image('limpo', this.caminho+'limpo.png');
        this.load.image('lombo', this.caminho+'lombo.png'); 
        this.load.image('mundo', this.caminho+'mundo.png');
        this.load.image('ombro', this.caminho+'ombro.png');
        this.load.image('onda', this.caminho+'onda.png');
        this.load.image('pompa', this.caminho+'pompa.png');
        this.load.image('sempre', this.caminho+'sempre.png');
        this.load.image('tambor', this.caminho+'tambor.png');
        this.load.image('tampo', this.caminho+'tampo.png');
        this.load.image('tempestade', this.caminho+'tempestade.png');
        this.load.image('tempo', this.caminho+'tempo.png');
        this.load.image('tonto', this.caminho+'tonto.png');
        this.load.image('tanto', this.caminho+'tanto.png');
        this.load.image('vento', this.caminho+'vento.png');
        this.load.image('vida', this.caminho+'vida.png');
        this.load.image('pingo', this.caminho+'pingo.png');


        // GAMEPLAY
        //this.load.image('placa', this.caminho+'placa.png');
        //this.load.image('ordinal', this.caminho+'ordinal.png');
        //this.load.atlas('numbers', this.caminho+'numbers.png', this.caminho+'numbers.json');

        //this.caminho = SOUNDS_UV1AV3UD1OA2;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD1OA02); 


        this.load.audio('soundIntro', [this.caminho+'AV3_S1_OA2_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S1_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S1_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S1_OA2_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S1_OA2_CtA.mp3']);

        this.load.audio('vida', [this.caminho+'AV3_S1_OA2_P1_VIDA.mp3']);
        this.load.audio('tempestade', [this.caminho+'AV3_S1_OA2_P1_TEMPESTADE.mp3']);
        this.load.audio('tambor', [this.caminho+'AV3_S1_OA2_P1_TAMBOR.mp3']);
        this.load.audio('campo', [this.caminho+'AV3_S1_OA2_P1_CAMPO.mp3']);
        this.load.audio('pingo', [this.caminho+'AV3_S1_OA2_P1_PINGO.mp3']);
        this.load.audio('chuva', [this.caminho+'AV3_S1_OA2_P1_CHUVA.mp3']);
        this.load.audio('bateria', [this.caminho+'AV3_S1_OA2_P1_BATERIA.mp3']);
        this.load.audio('grama', [this.caminho+'AV3_S1_OA2_P1_GRAMA.mp3']);

        this.load.audio('vida', [this.caminho+'AV3_S1_OA2_P1_VIDA.mp3']);
        this.load.audio('tempestade', [this.caminho+'AV3_S1_OA2_P1_TEMPESTADE.mp3']);
        this.load.audio('tambor', [this.caminho+'AV3_S1_OA2_P1_TAMBOR.mp3']);
        this.load.audio('campo', [this.caminho+'AV3_S1_OA2_P1_CAMPO.mp3']);
        this.load.audio('pingo', [this.caminho+'AV3_S1_OA2_P1_PINGO.mp3']);
        this.load.audio('chuva', [this.caminho+'AV3_S1_OA2_P1_CHUVA.mp3']);
        this.load.audio('bateria', [this.caminho+'AV3_S1_OA2_P1_BATERIA.mp3']);
        this.load.audio('grama', [this.caminho+'AV3_S1_OA2_P1_GRAMA.mp3']);

        this.load.audio('lombo', [this.caminho+'AV3_S1_OA2_P2_LOMBO.mp3']);
        this.load.audio('limpo', [this.caminho+'AV3_S1_OA2_P2_LIMPO.mp3']);
        this.load.audio('lembrar', [this.caminho+'AV3_S1_OA2_P2_LEMBRAR.mp3']);
        this.load.audio('sempre', [this.caminho+'AV3_S1_OA2_P2_SEMPRE.mp3']);
        this.load.audio('tampo', [this.caminho+'AV3_S1_OA2_P2_TAMPO.mp3']);
        this.load.audio('ombro', [this.caminho+'AV3_S1_OA2_P2_OMBRO.mp3']);
        this.load.audio('tonto', [this.caminho+'AV3_S1_OA2_P2_TONTO.mp3']);
        this.load.audio('tanto', [this.caminho+'AV3_S1_OA2_P2_TANTO.mp3']);

        this.load.audio('flores', [this.caminho+'AV3_S1_OA2_P3_FLORES.mp3']);
        this.load.audio('vento', [this.caminho+'AV3_S1_OA2_P3_VENTO.mp3']);
        this.load.audio('mundo', [this.caminho+'AV3_S1_OA2_P3_MUNDO.mp3']);
        this.load.audio('onda', [this.caminho+'AV3_S1_OA2_P3_ONDA.mp3']);
        this.load.audio('dores', [this.caminho+'AV3_S1_OA2_P3_DORES.mp3']);
        this.load.audio('tempo', [this.caminho+'AV3_S1_OA2_P3_TEMPO.mp3']);
        this.load.audio('fundo', [this.caminho+'AV3_S1_OA2_P3_FUNDO.mp3']);
        this.load.audio('pompa', [this.caminho+'AV3_S1_OA2_P3_POMPA.mp3']);



        //this.load.audio('soundP1', [this.caminho+'AV3_S1_OA1_P1.mp3']);
        //this.load.audio('soundP2', [this.caminho+'AV3_S1_OA1_P2.mp3']);
        //this.load.audio('soundP3', [this.caminho+'AV3_S1_OA1_P3.mp3']);


    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};