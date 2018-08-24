
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

        this.caminho = getPathFile(UV1AV3UD2OA03);

        this.load.image('background', this.caminho+'background.png');
        this.load.image('celeiro', this.caminho+'celeiro.png');
        this.load.image('computador', this.caminho+'computador.png');
        this.load.image('placa', this.caminho+'placa.png');
        
        this.load.image('tecla', this.caminho+'btn.png');
        this.load.image('teclado', this.caminho+'teclado.png');
        this.load.image('mao', this.caminho+'mao.png');

        this.load.image('dois', this.caminho+'dois.png');
        this.load.image('quatro', this.caminho+'quatro.png');
        this.load.image('sete', this.caminho+'sete.png');

        this.load.image('unidade', this.caminho+'unidade.png');
        this.load.image('dezena', this.caminho+'dezena.png');
        this.load.image('centena', this.caminho+'centena.png');
        
        this.load.atlas('anim_polly', this.caminho+'anim_polly.png', this.caminho+'anim_polly.json');
        this.load.atlas('anim_guri', this.caminho+'anim_guri.png', this.caminho+'anim_guri.json');
        this.load.atlas('anim_porta', this.caminho+'anim_porta.png', this.caminho+'anim_porta.json');
        
        // GAMEPLAY
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD2OA03);

        this.load.audio('soundIntro', [this.caminho+'AV3_S2_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S2_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S2_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S2_OA3_RESUMO.mp3']);

        this.load.audio('unidade', [this.caminho+'AV3_S2_OA3_Px.mp3']);
        this.load.audio('dezena', [this.caminho+'AV3_S2_OA3_Py.mp3']);
        this.load.audio('centena', [this.caminho+'AV3_S2_OA3_Pz.mp3']);
       
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};