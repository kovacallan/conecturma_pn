
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

        this.caminho = getPathFile(UV1AV3UD2OA04);

        
        this.load.image('background', this.caminho+'background.png');
        this.load.image('cesta', this.caminho+'cesta.png');
        
        this.load.atlas('anim_guri', this.caminho+'anim_guri.png', this.caminho+'anim_guri.json');
        this.load.atlas('anim_guri_happy', this.caminho+'anim_guri_comemora.png', this.caminho+'anim_guri_comemora.json');
        
        this.load.atlas('letras', this.caminho+'letras.png', this.caminho+'letras.json');
        this.load.atlas('pinhas', this.caminho+'pinha.png', this.caminho+'pinha.json');
        
        
        // GAMEPLAY

        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD2OA04);

        this.load.audio('soundIntro', [this.caminho+'AV3_S2_OA4_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S2_OA4_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S2_OA4_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S2_OA4_RESUMO.mp3']);

        this.load.audio('soundP1', [this.caminho+'AV3_S2_OA4_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'AV3_S2_OA4_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'AV3_S2_OA4_P3.mp3']);
       
        
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};