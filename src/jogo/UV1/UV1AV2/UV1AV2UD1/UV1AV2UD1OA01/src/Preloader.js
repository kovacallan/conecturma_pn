
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
        ///this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
		
		// SCENE

		this.caminho = getPathFile(GLOBAL);
		this.load.image('capsulas', this.caminho+'background_anim_UV1AV2UD1.png');


		this.caminho = getPathFile(UV1AV2UD1OA01);

		this.load.image('background', this.caminho+'background.png');

		// GAMEPLAY
		this.load.image('imgPainel', this.caminho+'panelHolder.png');
		this.load.image('imgGrade', this.caminho+'numbersPanel.png');
		this.load.image('imgGradeNum', this.caminho+'panelHolderNumbers.png');
		this.load.image('marca', this.caminho+'marca.png');
		

		//animações 
		this.load.atlas('bumba', this.caminho+'bumba_anim.png', this.caminho+'bumba_anim.json');
		this.load.atlas('juninho', this.caminho+'juninho_anim.png',this.caminho+'juninho_anim.json');
		this.load.atlas('poly', this.caminho+'poly_anim.png', this.caminho+'poly_anim.json');

		this.load.atlas('bumba_happy', this.caminho+'bumba_anim_happy.png', this.caminho+'bumba_anim_happy.json');
		this.load.atlas('juninho_happy', this.caminho+'juninho_anim_happy.png', this.caminho+'juninho_anim_happy.json');
		this.load.atlas('poly_happy', this.caminho+'poly_anim_happy.png', this.caminho+'poly_anim_happy.json');

		this.load.atlas('numeros', this.caminho+'numbers.png', this.caminho+'numbers.json');
		//this.load.image('capsulas', this.caminho+'background_anim.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV2UD1OA01);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV2UD1OA1_CALLtoACTION.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV2UD1OA1_CALLtoACTION.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV2UD1OA1_CALLtoACTION.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV2UD1OA1_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV2UD1OA1_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV2UD1OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV2UD1OA1_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
