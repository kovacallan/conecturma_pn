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
		
		
		
		
		// SCENE
		this.caminho = getPathFile(UV1AV2UD4OA02);

		this.load.image('background', this.caminho+'background.png');
		this.load.atlas('poly_anim', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlas('saci_anim', this.caminho+'anim_saci.png', this.caminho+'anim_saci.json');
		
		// GAMEPLAY
		
		this.load.image('tutorial_0', this.caminho+'tutorial_0.png');
		this.load.image('tutorial_1', this.caminho+'tutorial_1.png');
		this.load.image('tutorial_2', this.caminho+'tutorial_2.png');
		this.load.image('tutorial_3', this.caminho+'tutorial_3.png');
		
		this.load.atlas('palavras', this.caminho+'palavras.png', this.caminho+'palavras.json');
		this.load.image('holder', this.caminho+'holder.png');
		
		//p1
		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD4OA02);

		this.load.audio('pedra_1_0', this.caminho+'UV1AV2UD4OA2_P1_GRU.mp3');
		this.load.audio('pedra_1_1', this.caminho+'UV1AV2UD4OA2_P1_TA.mp3');
		
		this.load.audio('pedra_1_2', this.caminho+'UV1AV2UD4OA2_P1_PE.mp3');
		this.load.audio('pedra_1_3', this.caminho+'UV1AV2UD4OA2_P1_DRA.mp3');
		
		this.load.audio('pedra_1_4', this.caminho+'UV1AV2UD4OA2_P1_FO.mp3');
		this.load.audio('pedra_1_5', this.caminho+'UV1AV2UD4OA2_P1_LHA.mp3');
		
		this.load.audio('palavra_1_0', this.caminho+'UV1AV2UD4OA2_P1_GRUTA.mp3');
		this.load.audio('palavra_1_1', this.caminho+'UV1AV2UD4OA2_P1_PEDRA.mp3');
		this.load.audio('palavra_1_2', this.caminho+'UV1AV2UD4OA2_P1_FOLHA.mp3');
		
		//p2
		this.load.audio('pedra_2_6', this.caminho+'UV1AV2UD4OA2_P2_AR.mp3');
		this.load.audio('pedra_2_7', this.caminho+'UV1AV2UD4OA2_P2_VO.mp3');
		this.load.audio('pedra_2_8', this.caminho+'UV1AV2UD4OA2_P2_RE.mp3');
		
		this.load.audio('pedra_2_9', this.caminho+'UV1AV2UD4OA2_P2_RI.mp3');
		this.load.audio('pedra_2_10', this.caminho+'UV1AV2UD4OA2_P2_A.mp3');
		this.load.audio('pedra_2_11', this.caminho+'UV1AV2UD4OA2_P2_CHO.mp3');
		
		this.load.audio('pedra_2_12', this.caminho+'UV1AV2UD4OA2_P2_FLO.mp3');
		this.load.audio('pedra_2_13', this.caminho+'UV1AV2UD4OA2_P2_RES.mp3');
		this.load.audio('pedra_2_14', this.caminho+'UV1AV2UD4OA2_P2_TA.mp3');
		
		this.load.audio('palavra_2_0', this.caminho+'UV1AV2UD4OA2_P2_ARVORE.mp3');
		this.load.audio('palavra_2_1', this.caminho+'UV1AV2UD4OA2_P2_RIACHO.mp3');
		this.load.audio('palavra_2_2', this.caminho+'UV1AV2UD4OA2_P2_FLORESTA.mp3');
		
		
		//p3
		this.load.audio('pedra_3_15', this.caminho+'UV1AV2UD4OA2_P3_SA.mp3');
		this.load.audio('pedra_3_16', this.caminho+'UV1AV2UD4OA2_P3_MAM.mp3');
		this.load.audio('pedra_3_17', this.caminho+'UV1AV2UD4OA2_P3_BAI.mp3');
		this.load.audio('pedra_3_18', this.caminho+'UV1AV2UD4OA2_P3_A.mp3');
		
		this.load.audio('pedra_3_19', this.caminho+'UV1AV2UD4OA2_P3_EN.mp3');
		this.load.audio('pedra_3_20', this.caminho+'UV1AV2UD4OA2_P3_SO.mp3');
		this.load.audio('pedra_3_21', this.caminho+'UV1AV2UD4OA2_P3_LA.mp3');
		this.load.audio('pedra_3_22', this.caminho+'UV1AV2UD4OA2_P3_RA.mp3');
		this.load.audio('pedra_3_23', this.caminho+'UV1AV2UD4OA2_P3_DO.mp3');
		
		this.load.audio('pedra_3_24', this.caminho+'UV1AV2UD4OA2_P3_EN.mp3');
		this.load.audio('pedra_3_25', this.caminho+'UV1AV2UD4OA2_P3_TRE.mp3');
		this.load.audio('pedra_3_26', this.caminho+'UV1AV2UD4OA2_P3_VIS.mp3');
		this.load.audio('pedra_3_27', this.caminho+'UV1AV2UD4OA2_P3_TA.mp3');
		
		this.load.audio('palavra_3_0', this.caminho+'UV1AV2UD4OA2_P3_SAMAMBAIA.mp3');
		this.load.audio('palavra_3_1', this.caminho+'UV1AV2UD4OA2_P3_ENSOLARADO.mp3');
		this.load.audio('palavra_3_2', this.caminho+'UV1AV2UD4OA2_P3_ENTREVISTA.mp3');
			
		// BUTTONS
		
		this.load.audio('soundDica', this.caminho+'UV1AV2UD4OA2_DICA.mp3');
		this.load.audio('soundFinal', this.caminho+'UV1AV2UD4OA2_FINAL.mp3');
		this.load.audio('soundResumo', this.caminho+'UV1AV2UD4OA2_RESUMO.mp3');
		this.load.audio('soundIntro', this.caminho+'UV1AV2UD4OA2_INTRO.mp3');
		this.load.audio('soundCallToAction', this.caminho+'UV1AV2UD4OA2_CALL_TO_ACTION.mp3');

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
