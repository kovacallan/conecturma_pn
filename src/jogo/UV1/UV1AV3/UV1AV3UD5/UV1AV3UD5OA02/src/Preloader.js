
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

        this.caminho = getPathFile(UV1AV3UD5OA02);
        // SCENE
        this.load.image('background', this.caminho+'background.png');
        this.load.image('nuvem-pequena', this.caminho+'nuvem-pequena.png');

        this.load.atlas('nuvens', this.caminho+'nuvens.png', this.caminho+'nuvens.json');
        this.load.atlas('nuvem', this.caminho+'nuvem.png', this.caminho+'nuvem.json');
        this.load.atlas('menino', this.caminho+'menino.png', this.caminho+'menino.json');
        this.load.atlas('chuva', this.caminho+'chuva.png', this.caminho+'chuva.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD5OA02);

        this.load.audio('soundIntro', [this.caminho+'AV3_S5_OA2_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho+'AV3_S5_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho+'AV3_S5_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho+'AV3_S5_OA2_RESUMO.mp3']);      

        this.load.audio('soundP', [this.caminho+'AV3_S5_OA2_CtA.mp3']);

        this.load.audio('soundP1_DO', [this.caminho+'AV3_S5_OA2_P1_DO.mp3']);
        this.load.audio('soundP1_LHA', [this.caminho+'AV3_S5_OA2_P1_LHA.mp3']);
        this.load.audio('soundP1_LI', [this.caminho+'AV3_S5_OA2_P1_LI.mp3']);
        this.load.audio('soundP1_2', [this.caminho+'AV3_S5_OA2_P1_LIQUIDO.mp3']);
        this.load.audio('soundP1_MO', [this.caminho+'AV3_S5_OA2_P1_MO.mp3']);
        this.load.audio('soundP1_1', [this.caminho+'AV3_S5_OA2_P1_MOLHADO.mp3']);
        this.load.audio('soundP1_QUI', [this.caminho+'AV3_S5_OA2_P1_QUI.mp3']);
        this.load.audio('soundP1_SO', [this.caminho+'AV3_S5_OA2_P1_SO.mp3']);
        this.load.audio('soundP1_3', [this.caminho+'AV3_S5_OA2_P1_SOLIDO.mp3']);
        this.load.audio('soundP2_CHEN', [this.caminho+'AV3_S5_OA2_P2_CHEN.mp3']);
        this.load.audio('soundP2_EN', [this.caminho+'AV3_S5_OA2_P2_EN.mp3']);
        this.load.audio('soundP2_3', [this.caminho+'AV3_S5_OA2_P2_ENCHENTE.mp3']);
        this.load.audio('soundP2_GUEI', [this.caminho+'AV3_S5_OA2_P2_GUEI.mp3']);
        this.load.audio('soundP2_MAN', [this.caminho+'AV3_S5_OA2_P2_MAN.mp3']);
        this.load.audio('soundP2_2', [this.caminho+'AV3_S5_OA2_P2_MANGUEIRA.mp3']);
        this.load.audio('soundP2_NEI', [this.caminho+'AV3_S5_OA2_P2_NEI.mp3']);
        this.load.audio('soundP2_RA', [this.caminho+'AV3_S5_OA2_P2_RA.mp3']);
        this.load.audio('soundP2_TE', [this.caminho+'AV3_S5_OA2_P2_TE.mp3']);
        this.load.audio('soundP2_TOR', [this.caminho+'AV3_S5_OA2_P2_TOR.mp3']);
        this.load.audio('soundP2_1', [this.caminho+'AV3_S5_OA2_P2_TORNEIRA.mp3']);
        this.load.audio('soundP3_A', [this.caminho+'AV3_S5_OA2_P3_A.mp3']);
        this.load.audio('soundP3_CHE', [this.caminho+'AV3_S5_OA2_P3_CHE.mp3']);
        this.load.audio('soundP3_DU', [this.caminho+'AV3_S5_OA2_P3_DU.mp3']);
        this.load.audio('soundP3_FO', [this.caminho+'AV3_S5_OA2_P3_FO.mp3']);
        this.load.audio('soundP3_I', [this.caminho+'AV3_S5_OA2_P3_I.mp3']);
        this.load.audio('soundP3_LE', [this.caminho+'AV3_S5_OA2_P3_LE.mp3']);
        this.load.audio('soundP3_MAN', [this.caminho+'AV3_S5_OA2_P3_MAN.mp3']);
        this.load.audio('soundP3_NAR', [this.caminho+'AV3_S5_OA2_P3_NAR.mp3']);
        this.load.audio('soundP3_SAN', [this.caminho+'AV3_S5_OA2_P3_SAN.mp3']);
        this.load.audio('soundP3_3', [this.caminho+'AV3_S5_OA2_P3_SANDUICHE.mp3']);
        this.load.audio('soundP3_TA', [this.caminho+'AV3_S5_OA2_P3_TA.mp3']);
        this.load.audio('soundP3_1', [this.caminho+'AV3_S5_OA2_P3_TAMANDUA.mp3']);
        this.load.audio('soundP3_TE', [this.caminho+'AV3_S5_OA2_P3_TE.mp3']);
        this.load.audio('soundP3_2', [this.caminho+'AV3_S5_OA2_P3_TELEFONAR.mp3']);

        this.caminho = getPathFile(GLOBAL_FONT);

        this.load.bitmapFont('lucky-64', this.caminho+'lucky-64.png',  this.caminho+"lucky-64.fnt");
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};
