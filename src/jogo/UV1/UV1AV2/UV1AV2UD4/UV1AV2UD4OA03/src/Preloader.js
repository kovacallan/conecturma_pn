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

		this.caminho = getPathFile(UV1AV2UD4OA03);

		this.load.image('resumoText1', this.caminho+'resumo_img.png');
		this.load.image('resumoText2', this.caminho+'resumo_img2.png');


		this.load.image('resumo1', this.caminho+'resumo_img-1.png');
		this.load.image('resumo2', this.caminho+'resumo_img-2.png');
		this.load.image('resumo3', this.caminho+'resumo_img-3.png');

		
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('anim_poly', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlas('anim_saci', this.caminho+'anim_saci.png', this.caminho+'anim_saci.json');
		
		// GAMEPLAY
		
		this.load.atlas('numeros', this.caminho+'numeros.png', this.caminho+'numeros.json');
		
		this.load.image('abacaxi', this.caminho+'abacaxi.png');
		this.load.image('apple', this.caminho+'apple.png');
		this.load.image('equal', this.caminho+'equal.png');
		this.load.image('minus', this.caminho+'minus.png');
		this.load.image('operacao', this.caminho+'operacao.png');
		
		// BUTTONS
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD4OA03);

		this.load.audio('soundDica', this.caminho+'UV1AV2UD4OA5_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD4OA5_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD4OA5_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD4OA5_INTRO.mp3');
		this.load.audio('soundCallToAction', this.caminho+'UV1AV2UD4OA5_CALL_TO_ACTION.mp3');

	
	},


	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
