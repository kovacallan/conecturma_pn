
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
        
        this.caminho = getPathFile(UV1AV2UD2OA05);

        //this.load.image('initialText', this.caminho+'initialText.png');
        //this.load.image('initialText2', this.caminho+'initialText2.png');
        this.load.atlas('animTutorial', this.caminho+'anim_tutorial.png', this.caminho+'anim_tutorial.json');

        
        // SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        this.load.atlas('anim_fred',    this.caminho+'anim_fred.png',     this.caminho+'anim_fred.json');
        this.load.atlas('anim_poly',    this.caminho+'anim_poly.png',     this.caminho+'anim_poly.json');
        this.load.atlas('anim_walter',  this.caminho+'anim_walter.png',   this.caminho+'anim_walter.json');
        this.load.atlas('formas',       this.caminho+'formas.png',        this.caminho+'formas.json');


        // GAMEPLAY
        //this.load.image('pergunta1', this.caminho+'texto_p1.png');
        //this.load.image('pergunta2', this.caminho+'texto_p2.png');
        //this.load.image('pergunta3', this.caminho+'texto_p3.png');


        //this.load.image('imgResumo', this.caminho+'resumo_img.png');
        this.load.atlas('resumoAnim', this.caminho+'resumo_anim.png', this.caminho+'resumo_anim.json');

        this.caminho = getPathFileSound(SOUNDS_UV1AV2UD2OA05);

        this.load.audio('soundP1', [this.caminho+'UV1AV2UD2OA5_P1.mp3']);
        this.load.audio('soundP2', [this.caminho+'UV1AV2UD2OA5_P2.mp3']);
        this.load.audio('soundP3', [this.caminho+'UV1AV2UD2OA5_P3.mp3']);

        this.load.audio('soundDica', [this.caminho+'UV1AV2UD2OA5_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'UV1AV2UD2OA5_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'UV1AV2UD2OA5_RESUMO.mp3']);
        this.load.audio('soundIntro', [this.caminho+'UV1AV2UD2OA5_INTRO.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};