
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

        this.caminho = getPathFile(UV1AV3UD1OA01);
        
        // SCENE
        this.load.image('background',this.caminho+'background.png');
        //this.load.image('frontground',this.caminho+'frontground.png');

        // CHARACTER ANIMATION
        this.load.atlas('bumba_anim', this.caminho+'anim_bumba_idle.png',this.caminho+'anim_bumba_idle.json');
        this.load.atlas('bumba_anim_happy',this.caminho+'anim_bumba_comemora.png',this.caminho+'anim_bumba_comemora.json');

        this.load.atlas('valor',this.caminho+'valor.png',this.caminho+'valor.json');
        this.load.atlas('dinheiro',this.caminho+'dinheiro.png',this.caminho+'dinheiro.json');
        this.load.atlas('acai',this.caminho+'acai.png',this.caminho+'acai.json');
        
        

        // GAMEPLAY
        //this.load.image('placa',this.caminho+'placa.png');
        //this.load.image('ordinal',this.caminho+'ordinal.png');
        //this.load.atlas('numbers',this.caminho+'numbers.png',this.caminho+'numbers.json');

        //this.caminho = SOUNDS_UV1AV3UD1OA1;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD1OA01); 

       console.log(this.caminho)
        this.load.audio('soundIntro', [this.caminho+'AV3_S1_OA1_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S1_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S1_OA1_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S1_OA1_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S1_OA1_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S1_OA1_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S1_OA1_P3.mp3']);
        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};