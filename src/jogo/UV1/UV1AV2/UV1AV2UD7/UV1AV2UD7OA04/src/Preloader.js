
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

        
        
        this.caminho = getPathFile(UV1AV2UD7OA04);

        // SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        //this.load.atlas('sprites', this.caminho+'sprites.png', this.caminho+'sprites.json');
        this.load.atlas('bumba', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
        this.load.atlas('bumba_happy', this.caminho+'anim_bumba_happy.png', this.caminho+'anim_bumba_happy.json');
        this.load.atlas('cartaz', this.caminho+'cartaz.png', this.caminho+'cartaz.json');
        this.load.atlas('letras', this.caminho+'letras.png', this.caminho+'letras.json');

        //this.load.image('imgResumo', this.caminho+'resumo_img.png');
        this.load.image('marca', this.caminho+'marca.png');
        
        this.caminho = getPathFile(SOUNDS_UV1AV2UD7OA04);

        this.load.audio('soundP1', this.caminho+'UV1AV2S7OA4_P1.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S7OA4_P2.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S7OA4_P3.mp3');

        //Quando / Quase / Água /
        this.load.audio('quando', this.caminho+'UV1AV2S7OA4_quando.mp3');
        this.load.audio('quase', this.caminho+'UV1AV2S7OA4_quase.mp3');
        this.load.audio('agua', this.caminho+'UV1AV2S7OA4_agua.mp3');

        this.load.audio('conseguimos', this.caminho+'UV1AV2S7OA4_conseguimos.mp3');
        this.load.audio('conseguir', this.caminho+'UV1AV2S7OA4_conseguir.mp3');
        this.load.audio('fogueira', this.caminho+'UV1AV2S7OA4_fogueira.mp3');
        this.load.audio('porque', this.caminho+'UV1AV2S7OA4_porque.mp3');
        this.load.audio('que', this.caminho+'UV1AV2S7OA4_que.mp3');

        this.load.audio('quem', this.caminho+'UV1AV2S7OA4_quem.mp3');
        this.load.audio('quer', this.caminho+'UV1AV2S7OA4_quer.mp3');
        this.load.audio('querer', this.caminho+'UV1AV2S7OA4_querer.mp3');
        this.load.audio('queridos', this.caminho+'UV1AV2S7OA4_queridos.mp3');
        this.load.audio('aqui', this.caminho+'UV1AV2S7OA4_aqui.mp3');
    


        this.load.audio('soundDica', this.caminho+'UV1AV2S7OA4_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S7OA4_FINAL.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S7OA4_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S7OA4_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};