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

        


		//INITIAL
		this.caminho = getPathFile(UV1AV2UD6OA03);
	
		this.load.atlas('peixe', this.caminho+'anim_peixe.png', this.caminho+'anim_peixe.json');
		this.load.atlas('peixe1', this.caminho+'anim_peixe1.png', this.caminho+'anim_peixe1.json');
		this.load.atlas('peixe2', this.caminho+'anim_peixe2.png', this.caminho+'anim_peixe2.json');
		
		

		this.load.image('resumo_tutorial1',this.caminho+'resumo_tutorial1.png');
		this.load.image('resumo_tutorial2',this.caminho+'resumo_tutorial2.png');
		this.load.image('resumo_tutorial3',this.caminho+'resumo_tutorial3.png');
		this.load.image('resumo_tutorial4',this.caminho+'resumo_tutorial4.png');
		this.load.image('resumo_tutorial5',this.caminho+'resumo_tutorial5.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('background_trees', this.caminho+'cenario.png');
		this.load.atlas('folhas', this.caminho+'vitoria_regia.png', this.caminho+'vitoria_regia.json');
		this.load.image('lotus', this.caminho+'lotus.png');

		// GAMEPLAY
		//this.load.atlas('peixe3', this.caminho+'peixe.png', this.caminho+'peixe.json');
		//this.load.atlas('peixe1', this.caminho+'peixe1.png', this.caminho+'peixe1.json');
		//this.load.atlas('peixe2', this.caminho+'peixe2.png', this.caminho+'peixe2.json');
		
		
		this.load.atlas('numbers', this.caminho+'numbers.png', this.caminho+'numbers.json');
		this.load.image('menos', this.caminho+'menos.png');
		this.load.image('barra', this.caminho+'barra.png');
		
		// BUTTONS
		
		this.load.image('intro_keyboard',this.caminho+'mc_teclado.png');
		this.load.image('intro_button',this.caminho+'tecla6.png');
		this.load.image('intro_dedo',this.caminho+'dedo.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD6OA03);

		this.load.audio('pergunta_1_aud', this.caminho+'UV1AV2UD6OA3_P1.mp3');
		this.load.audio('pergunta_2_aud', this.caminho+'UV1AV2UD6OA3_P2.mp3');
		this.load.audio('pergunta_3_aud', this.caminho+'UV1AV2UD6OA3_P3.mp3');
		this.load.audio('pergunta_4_aud', this.caminho+'UV1AV2UD6OA3_P4.mp3');
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD6OA3_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD6OA3_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD6OA3_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD6OA3_INTRO.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
