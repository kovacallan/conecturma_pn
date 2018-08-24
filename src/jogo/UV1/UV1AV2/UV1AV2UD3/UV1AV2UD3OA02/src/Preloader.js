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

		//INITIAL
		this.caminho = getPathFile(UV1AV2UD3OA02);

		this.load.image('teclado', this.caminho+'teclado.png');
		this.load.image('tecla2', this.caminho+'tecla2.png');
		this.load.image('mao', this.caminho+'mao.png');
		this.load.image('arvore_bumba', this.caminho+'arvore_bumba.png');

		this.load.image('tecla_vazia', this.caminho+'tecla_vazia.png');
		
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('bumba', this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
		this.load.atlas('bumba_happy', this.caminho+'anim_bumba_happy.png', this.caminho+'anim_bumba_happy.json');
		this.load.atlas('folha1', this.caminho+'anim_folha1.png', this.caminho+'anim_folha1.json');
		this.load.atlas('silabas', this.caminho+'silabas.png', this.caminho+'silabas.json');
		this.load.atlas('folhas', this.caminho+'folhas.png', this.caminho+'folhas.json');

		
		// GAMEPLAY
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD3OA02);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD3OA2_CALL_TO_ACTION.mp3']);
	

		this.load.audio('1_1_0', [this.caminho+'UV1AV2UD3OA2_P_SACI.mp3']);
		this.load.audio('1_1_1', [this.caminho+'UV1AV2UD3OA2_P_CURUPIRA.mp3']);
		this.load.audio('1_1_2', [this.caminho+'UV1AV2UD3OA2_P_NATUREZA.mp3']);
		
		this.load.audio('2_1_0', [this.caminho+'UV1AV2UD3OA2_P_MATO.mp3']);
		this.load.audio('2_1_1', [this.caminho+'UV1AV2UD3OA2_P_MACACO.mp3']);
		this.load.audio('2_1_2', [this.caminho+'UV1AV2UD3OA2_P_SAPO.mp3']);
		this.load.audio('2_2_0', [this.caminho+'UV1AV2UD3OA2_P_BANANA.mp3']);
		this.load.audio('2_2_1', [this.caminho+'UV1AV2UD3OA2_P_PATO.mp3']);
		this.load.audio('2_2_2', [this.caminho+'UV1AV2UD3OA2_P_GIRAFA.mp3']);

		this.load.audio('3_1_0', [this.caminho+'UV1AV2UD3OA2_P_LAGO.mp3']);
		this.load.audio('3_1_1', [this.caminho+'UV1AV2UD3OA2_P_RAPOSA.mp3']);
		this.load.audio('3_1_2', [this.caminho+'UV1AV2UD3OA2_P_HIPOPOTAMO.mp3']);

		this.load.audio('3_2_0', [this.caminho+'UV1AV2UD3OA2_P_CARAMUJO.mp3']);
		this.load.audio('3_2_1', [this.caminho+'UV1AV2UD3OA2_P_GATO.mp3']);
		this.load.audio('3_2_2', [this.caminho+'UV1AV2UD3OA2_P_LOBO.mp3']);

		this.load.audio('3_3_0', [this.caminho+'UV1AV2UD3OA2_P_TUCANO.mp3']);
		this.load.audio('3_3_1', [this.caminho+'UV1AV2UD3OA2_P_GORILA.mp3']);
		this.load.audio('3_3_2', [this.caminho+'UV1AV2UD3OA2_P_CAVALO.mp3']);
	
		this.load.audio('soundDica', [this.caminho+'UV1AV2UD3OA2_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD3OA2_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD3OA2_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD3OA2_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
