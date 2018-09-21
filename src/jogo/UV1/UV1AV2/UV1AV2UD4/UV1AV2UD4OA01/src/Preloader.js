
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

        
		
		this.caminho = getPathFile(UV1AV2UD4OA01);

		this.load.image('resumo', this.caminho+'resumo_img.png');
		this.load.image('resumo2', this.caminho+'resumo_img2.png');
		this.load.image('arrow', this.caminho+'arrow.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('saci_anim', this.caminho+'saci_anim.png', this.caminho+'saci_anim.json');
		this.load.image('holder', this.caminho+'holder.png');
		
		// GAMEPLAY
		
		this.load.atlas('objects', this.caminho+'objetos.png', this.caminho+'objetos.json');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD4OA01);

		this.load.audio('pergunta_aud_1', this.caminho+'UV1AV2UD4OA1_P1.mp3');
		this.load.audio('pergunta_aud_2', this.caminho+'UV1AV2UD4OA1_P2.mp3');
		this.load.audio('pergunta_aud_3', this.caminho+'UV1AV2UD4OA1_P3.mp3');
		this.load.audio('pergunta_aud_4', this.caminho+'UV1AV2UD4OA1_P4.mp3');
		
		// BUTTONS
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD4OA1_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD4OA1_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD4OA1_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD4OA1_INTRO.mp3');

		
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
	

};
