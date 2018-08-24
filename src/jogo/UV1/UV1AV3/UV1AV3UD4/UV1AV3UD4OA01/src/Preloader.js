
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

        //alterado caminho das imagens em função do jogo p/ tablets
        this.caminho = getPathFile(UV1AV3UD4OA01);
        console.log("Caminho das imagens e animações: " + this.caminho);

        // SCENE
        this.load.image('background', this.caminho +'background.png');
        this.load.image('cavalo', this.caminho +'cavalo.png');
        this.load.atlas('anim_cavalo', this.caminho +'anim_cavalo.png', this.caminho + 'anim_cavalo.json');
        this.load.image('img_resumo_1', this.caminho +'img_resumo_1.png');
        this.load.image('img_resumo_2', this.caminho +'img_resumo_2.png');
        
        //this.caminho = SOUNDS_UV1AV3UD4OA01;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD4OA01); 
        console.log(this.caminho);

        // SOUNDS
        this.load.audio('soundIntro', [this.caminho + 'AV3_S4_OA1_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho + 'AV3_S4_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho + 'AV3_S4_OA1_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho + 'AV3_S4_OA1_RESUMO.mp3']);
        this.load.audio('soundCallToAction', [this.caminho + 'AV3_S4_OA1_CtA.mp3']);
        this.load.audio('soundCavalinho', [this.caminho + 'AV3_S4_OA1_CAVALINHO.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};