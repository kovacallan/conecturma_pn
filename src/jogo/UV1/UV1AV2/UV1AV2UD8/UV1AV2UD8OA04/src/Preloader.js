
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

        
        
        this.caminho = getPathFile(UV1AV2UD8OA04);
		// SCENE
        this.load.image('background', this.caminho+'background.png');

        // CHARACTER ANIMATION
        this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
        this.load.atlas('fred_happy', this.caminho+'anim_fred_happy.png', this.caminho+'anim_fred_happy.json');

        this.load.atlas('polly', this.caminho+'anim_polly.png', this.caminho+'anim_polly.json');
        this.load.atlas('polly_happy', this.caminho+'anim_polly_happy.png', this.caminho+'anim_polly_happy.json');

        this.load.atlas('juninho', this.caminho+'anim_juninho.png', this.caminho+'anim_juninho.json');
        this.load.atlas('juninho_happy', this.caminho+'anim_juninho_happy.png', this.caminho+'anim_juninho_happy.json');
        


        // GAMEPLAY

        this.load.atlas('P1_BREJO', this.caminho+'P1_BREJO.png', this.caminho+'P1_BREJO.json');
        this.load.atlas('P1_CRAVO', this.caminho+'P1_CRAVO.png', this.caminho+'P1_CRAVO.json');
        this.load.atlas('P1_FLORES', this.caminho+'P1_FLORES.png', this.caminho+'P1_FLORES.json');

        this.load.atlas('P2_BRAVURA', this.caminho+'P2_BRAVURA.png', this.caminho+'P2_BRAVURA.json');
        this.load.atlas('P2_CORAGEM', this.caminho+'P2_CORAGEM.png', this.caminho+'P2_CORAGEM.json');
        this.load.atlas('P2_GRATIDAO', this.caminho+'P2_GRATIDAO.png', this.caminho+'P2_GRATIDAO.json');

        this.load.atlas('P3_CROCODILO', this.caminho+'P3_CROCODILO.png', this.caminho+'P3_CROCODILO.json');
        this.load.atlas('P3_FRONTEIRA', this.caminho+'P3_FRONTEIRA.png', this.caminho+'P3_FRONTEIRA.json');
        this.load.atlas('P3_LIVRARIA', this.caminho+'P3_LIVRARIA.png', this.caminho+'P3_LIVRARIA.json');

        this.load.image('P1_MARCA', this.caminho+'P1_MARCA.png');
        this.load.image('P2_MARCA', this.caminho+'P2_MARCA.png');
        this.load.image('P3_MARCA', this.caminho+'P3_MARCA.png');
        this.load.image('P3_MARCA_1', this.caminho+'P3_MARCA_1.png');

        this.load.image('MARCA', this.caminho+'marca.png');

        this.caminho = getPathFile(SOUNDS_UV1AV2UD8OA04);

		this.load.audio('bravura', this.caminho+'UV1AV2S8OA4_bravura.mp3');
        this.load.audio('brejo', this.caminho+'UV1AV2S8OA4_brejo.mp3');
        this.load.audio('coragem', this.caminho+'UV1AV2S8OA4_coragem.mp3');

        this.load.audio('cravo', this.caminho+'UV1AV2S8OA4_cravo.mp3');
        this.load.audio('crocodilo', this.caminho+'UV1AV2S8OA4_crocodilo.mp3');
        this.load.audio('flores', this.caminho+'UV1AV2S8OA4_flores.mp3');

        this.load.audio('fronteira', this.caminho+'UV1AV2S8OA4_fronteira.mp3');
        this.load.audio('gratidao', this.caminho+'UV1AV2S8OA4_gratidao.mp3');
        this.load.audio('livraria', this.caminho+'UV1AV2S8OA4_livraria.mp3');

        this.load.audio('soundP1', this.caminho+'UV1AV2S8OA4_P1.mp3');
        this.load.audio('soundP2', this.caminho+'UV1AV2S8OA4_P2.mp3');
        this.load.audio('soundP3', this.caminho+'UV1AV2S8OA4_P3.mp3');

        this.load.audio('soundDica', this.caminho+'UV1AV2S8OA4_DICA.mp3');
        this.load.audio('soundFinal', this.caminho+'UV1AV2S8OA4_final.mp3');
        this.load.audio('soundResumo', this.caminho+'UV1AV2S8OA4_RESUMO.mp3');
        this.load.audio('soundIntro', this.caminho+'UV1AV2S8OA4_INTRO.mp3');
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};