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
		this.caminho = getPathFile(UV1AV2UD3OA04);
		this.load.image('background', this.caminho+'background.png');


		// CHARACTER ANIMATION
		this.load.atlas('curupira', this.caminho+'anim_curupira.png', this.caminho+'anim_curupira.json');
		this.load.atlas('saci', this.caminho+'anim_saci.png', this.caminho+'anim_saci.json');
		this.load.atlas('curupira_happy', this.caminho+'anim_curupira_happy.png', this.caminho+'anim_curupira_happy.json');
		this.load.atlas('saci_happy', this.caminho+'anim_saci_happy.png', this.caminho+'anim_saci_happy.json');
		this.load.image('vegetacao', this.caminho+'vegetacao.png');
		
		this.load.atlas('cestas', this.caminho+'cesta.png', this.caminho+'cesta.json');
		this.load.atlas('palavras', this.caminho+'frutas_palavras.png', this.caminho+'frutas_palavras.json');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD3OA04);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD3OA4_P1.mp3']);
		this.load.audio('soundP1_0', [this.caminho+'UV1AV2UD3OA4_P1_KIWI.mp3']);
		this.load.audio('soundP1_1', [this.caminho+'UV1AV2UD3OA4_P1_CAQUI.mp3']);
		this.load.audio('soundP1_2', [this.caminho+'UV1AV2UD3OA4_P1_KIM.mp3']);
		this.load.audio('soundP1_3', [this.caminho+'UV1AV2UD3OA4_P1_CAROLINA.mp3']);
		this.load.audio('soundP1_4', [this.caminho+'UV1AV2UD3OA4_P1_KARAOKE.mp3']);
		this.load.audio('soundP1_5', [this.caminho+'UV1AV2UD3OA4_P1_MUSICA.mp3']);
		
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD3OA4_P2.mp3']);
		this.load.audio('soundP2_6', [this.caminho+'UV1AV2UD3OA4_P2_WIFI.mp3']);
		this.load.audio('soundP2_7', [this.caminho+'UV1AV2UD3OA4_P2_AVENTURA.mp3']);
		this.load.audio('soundP2_8', [this.caminho+'UV1AV2UD3OA4_P2_DIVERSAO.mp3']);
		this.load.audio('soundP2_9', [this.caminho+'UV1AV2UD3OA4_P2_WALDIR.mp3']);
		this.load.audio('soundP2_10', [this.caminho+'UV1AV2UD3OA4_P2_ANTONIO.mp3']);
		this.load.audio('soundP2_11', [this.caminho+'UV1AV2UD3OA4_P2_JOAO.mp3']);
		this.load.audio('soundP2_12', [this.caminho+'UV1AV2UD3OA4_P2_WALTER.mp3']);
		this.load.audio('soundP2_13', [this.caminho+'UV1AV2UD3OA4_P2_FRED.mp3']);
		this.load.audio('soundP2_14', [this.caminho+'UV1AV2UD3OA4_P2_JUNIOR.mp3']);
		
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD3OA4_P3.mp3']);
		this.load.audio('soundP3_15', [this.caminho+'UV1AV2UD3OA4_P3_YAKISOBA.mp3']);
		this.load.audio('soundP3_16', [this.caminho+'UV1AV2UD3OA4_P3_VERDURA.mp3']);
		this.load.audio('soundP3_17', [this.caminho+'UV1AV2UD3OA4_P3_SALADA.mp3']);
		this.load.audio('soundP3_18', [this.caminho+'UV1AV2UD3OA4_P3_SUCO.mp3']);
		this.load.audio('soundP3_19', [this.caminho+'UV1AV2UD3OA4_P3_YBARE.mp3']);
		this.load.audio('soundP3_20', [this.caminho+'UV1AV2UD3OA4_P3_IARA.mp3']);
		this.load.audio('soundP3_21', [this.caminho+'UV1AV2UD3OA4_P3_PATRICIA.mp3']);
		this.load.audio('soundP3_22', [this.caminho+'UV1AV2UD3OA4_P3_CAMILA.mp3']);
		this.load.audio('soundP3_23', [this.caminho+'UV1AV2UD3OA4_P3_YEMANJA.mp3']);
		this.load.audio('soundP3_24', [this.caminho+'UV1AV2UD3OA4_P3_TATIANA.mp3']);
		this.load.audio('soundP3_25', [this.caminho+'UV1AV2UD3OA4_P3_ANA.mp3']);
		this.load.audio('soundP3_26', [this.caminho+'UV1AV2UD3OA4_P3_LIA.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD3OA4_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD3OA4_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD3OA4_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD3OA4_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
