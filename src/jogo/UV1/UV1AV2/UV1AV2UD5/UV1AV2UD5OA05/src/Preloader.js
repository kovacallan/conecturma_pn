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

        

	
		// SCENE
		this.caminho = getPathFile(UV1AV2UD5OA05);

		this.load.image('background', this.caminho+'background.png');


		// CHARACTER ANIMATION
		this.load.atlas('formiga', this.caminho+'formiga.png', this.caminho+'formiga.json');
		this.load.atlas('num_formigas', this.caminho+'num_formigas.png', this.caminho+'num_formigas.json');

		// GAMEPLAY

		this.load.image('marca', this.caminho+'marca.png');

		this.load.image('resumo4', this.caminho+'resumo_4.png');
		this.load.image('resumo5', this.caminho+'resumo_5.png');
		this.load.image('resumo6', this.caminho+'resumo_6.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD5OA05);

		this.load.audio('soundP1', this.caminho+'UV1AV2UD5OA5_P1.mp3');
		this.load.audio('soundP2', this.caminho+'UV1AV2UD5OA5_P2.mp3');
		this.load.audio('soundP3', this.caminho+'UV1AV2UD5OA5_P3_e_4.mp3');

		this.load.audio('soundDica', this.caminho+'UV1AV2UD5OA5_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD5OA5_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD5OA5_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD5OA5_INTRO.mp3');

		this.load.audio('1', this.caminho+'UV1AV2UD5OA5_P_1.mp3');
		this.load.audio('2', this.caminho+'UV1AV2UD5OA5_P_2.mp3');
		this.load.audio('3', this.caminho+'UV1AV2UD5OA5_P_3.mp3');
		this.load.audio('4', this.caminho+'UV1AV2UD5OA5_P_4.mp3');
		this.load.audio('5', this.caminho+'UV1AV2UD5OA5_P_5.mp3');
		this.load.audio('6', this.caminho+'UV1AV2UD5OA5_P_6.mp3');
		this.load.audio('7', this.caminho+'UV1AV2UD5OA5_P_7.mp3');
		this.load.audio('8', this.caminho+'UV1AV2UD5OA5_P_8.mp3');
		this.load.audio('9', this.caminho+'UV1AV2UD5OA5_P_9.mp3');
		this.load.audio('10', this.caminho+'UV1AV2UD5OA5_P_10.mp3');
		this.load.audio('11', this.caminho+'UV1AV2UD5OA5_P_11.mp3');
		this.load.audio('12', this.caminho+'UV1AV2UD5OA5_P_12.mp3');
		this.load.audio('13', this.caminho+'UV1AV2UD5OA5_P_13.mp3');
		this.load.audio('14', this.caminho+'UV1AV2UD5OA5_P_14.mp3');
		this.load.audio('15', this.caminho+'UV1AV2UD5OA5_P_15.mp3');
		this.load.audio('16', this.caminho+'UV1AV2UD5OA5_P_16.mp3');
		this.load.audio('17', this.caminho+'UV1AV2UD5OA5_P_17.mp3');
		this.load.audio('18', this.caminho+'UV1AV2UD5OA5_P_18.mp3');
		this.load.audio('19', this.caminho+'UV1AV2UD5OA5_P_19.mp3');
		this.load.audio('20', this.caminho+'UV1AV2UD5OA5_P_20.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
