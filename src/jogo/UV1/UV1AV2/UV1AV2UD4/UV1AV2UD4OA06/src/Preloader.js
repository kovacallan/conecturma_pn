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
		this.caminho = getPathFile(UV1AV2UD4OA06);

		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('saci_anim', this.caminho+'anim_saci.png', this.caminho+'anim_saci.json');
		this.load.atlas('poly_anim', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.spritesheet('placa', this.caminho+'placa.png', 232, 82);
		
		// GAMEPLAY
		
		this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
		this.load.atlas('palavras_question', this.caminho+'palavras_question.png', this.caminho+'palavras_question.json');
		
		this.load.image('intro_0', this.caminho+'intro_0.png');
		this.load.image('intro_1', this.caminho+'intro_1.png');
		this.load.image('intro_2', this.caminho+'intro_2.png');
		
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD4OA06);

		this.load.audio('soundP1', this.caminho+'UV1AV2UD4OA6_P1.mp3');
		this.load.audio('soundP2', this.caminho+'UV1AV2UD4OA6_P2.mp3');
		this.load.audio('soundP3', this.caminho+'UV1AV2UD4OA6_P3.mp3');
		
		this.load.audio('pergunta_1_0_0', this.caminho+'UV1AV2UD4OA6_P1_CEU.mp3');
		this.load.audio('pergunta_1_1_0', this.caminho+'UV1AV2UD4OA6_P1_PA.mp3');
		this.load.audio('pergunta_1_2_0', this.caminho+'UV1AV2UD4OA6_P1_CHULE.mp3');
		this.load.audio('pergunta_1_0_1', this.caminho+'UV1AV2UD4OA6_P1_TERRA.mp3');
		this.load.audio('pergunta_1_1_1', this.caminho+'UV1AV2UD4OA6_P1_PAZ.mp3');
		this.load.audio('pergunta_1_2_1', this.caminho+'UV1AV2UD4OA6_P1_SAPATO.mp3');
		
		this.load.audio('pergunta_1_0', this.caminho+'UV1AV2UD4OA6_P1_CHAPEU.mp3');
		this.load.audio('pergunta_1_1', this.caminho+'UV1AV2UD4OA6_P1_CHA.mp3');
		this.load.audio('pergunta_1_2', this.caminho+'UV1AV2UD4OA6_P1_PE.mp3');
		
		this.load.audio('pergunta_2_0_0', this.caminho+'UV1AV2UD4OA6_P2_FRANCES.mp3');
		this.load.audio('pergunta_2_1_0', this.caminho+'UV1AV2UD4OA6_P2_VOO.mp3');
		this.load.audio('pergunta_2_2_0', this.caminho+'UV1AV2UD4OA6_P2_VOCE.mp3');
		this.load.audio('pergunta_2_0_1', this.caminho+'UV1AV2UD4OA6_P2_XADREZ.mp3');
		this.load.audio('pergunta_2_1_1', this.caminho+'UV1AV2UD4OA6_P2_IDIOMA.mp3');
		this.load.audio('pergunta_2_2_1', this.caminho+'UV1AV2UD4OA6_P2_ATOR.mp3');
		this.load.audio('pergunta_2_3_1', this.caminho+'UV1AV2UD4OA6_P2_VOAR.mp3');
		this.load.audio('pergunta_2_4_1', this.caminho+'UV1AV2UD4OA6_P2_COMER.mp3');
		this.load.audio('pergunta_2_5_1', this.caminho+'UV1AV2UD4OA6_P2_CABIDE.mp3');
		
		this.load.audio('pergunta_2_0', this.caminho+'UV1AV2UD4OA6_P2_PORTUGUES.mp3');
		this.load.audio('pergunta_2_1', this.caminho+'UV1AV2UD4OA6_P2_VOVO.mp3');
		this.load.audio('pergunta_2_2', this.caminho+'UV1AV2UD4OA6_P2_BEBE.mp3');
		
		this.load.audio('pergunta_3_0_0', this.caminho+'UV1AV2UD4OA6_P3_CAPITAO.mp3');
		this.load.audio('pergunta_3_1_0', this.caminho+'UV1AV2UD4OA6_P3_MACA.mp3');
		this.load.audio('pergunta_3_2_0', this.caminho+'UV1AV2UD4OA6_P3_CHAO.mp3');
		this.load.audio('pergunta_3_0_1', this.caminho+'UV1AV2UD4OA6_P3_BONE.mp3');
		this.load.audio('pergunta_3_1_1', this.caminho+'UV1AV2UD4OA6_P3_SOMBRA.mp3');
		this.load.audio('pergunta_3_2_1', this.caminho+'UV1AV2UD4OA6_P3_TENIS.mp3');
		this.load.audio('pergunta_3_3_1', this.caminho+'UV1AV2UD4OA6_P3_LAR.mp3');
		this.load.audio('pergunta_3_4_1', this.caminho+'UV1AV2UD4OA6_P3_SOFA.mp3');
		this.load.audio('pergunta_3_5_1', this.caminho+'UV1AV2UD4OA6_P3_CAMA.mp3');
		
		this.load.audio('pergunta_3_0', this.caminho+'UV1AV2UD4OA6_P3_CORACAO.mp3');
		this.load.audio('pergunta_3_1', this.caminho+'UV1AV2UD4OA6_P3_AMANHA.mp3');
		this.load.audio('pergunta_3_2', this.caminho+'UV1AV2UD4OA6_P3_CAMINHAO.mp3');
		
		// BUTTONS
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD4OA6_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD4OA6_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD4OA6_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD4OA6_INTRO.mp3');

		this.load.audio('hitErro', 		 [this.caminho+'Hit_Erro.mp3']);
		this.load.audio('hitAcerto', 	 [this.caminho+'Hit_Acerto.mp3']);
		this.load.audio('soundVitoria1', [this.caminho+'vitoria_demais.mp3']);
		this.load.audio('soundVitoria2', [this.caminho+'vitoria_muito_bem.mp3']);
		this.load.audio('soundVitoria3', [this.caminho+'parabens_conecturma.mp3']);
		this.load.audio('soundVitoria4', [this.caminho+'vitoria_uau.mp3']);
		this.load.audio('soundVitoria5', [this.caminho+'vitoria_vamos_em_frente.mp3']);
		this.load.audio('soundParabens', [this.caminho+'vitoria_isso_ai.mp3']);

		this.load.audio('backgroundMusic', [this.caminho+'looping_jogo.mp3']);

		this.caminho = getPathFile(GLOBAL_FONT);

		this.load.bitmapFont('lucky_shadow_64', this.caminho+'lucky_shadow_64.png', this.caminho+'lucky_shadow_64.fnt');
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }
};
