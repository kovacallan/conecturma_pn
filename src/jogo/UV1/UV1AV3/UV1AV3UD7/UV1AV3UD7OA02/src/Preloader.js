
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
        
        // ANIMATIONS AND IMAGES    
        this.caminho = getPathFile(UV1AV3UD7OA02);

        this.load.image('background', this.caminho +'background.png');
        this.load.image('apontador', this.caminho +'apontador.png');
        this.load.image('borracha', this.caminho +'borracha.png'); 
        this.load.image('caneta', this.caminho +'caneta.png'); 
        this.load.image('pincel', this.caminho +'pincel.png'); 
        this.load.image('lapis', this.caminho +'lapis.png');
        this.load.image('regua', this.caminho +'regua.png'); 
        this.load.image('regua_2', this.caminho +'regua_2.png'); 

        this.load.image('rabisco_bumba', this.caminho +'rabisco_macaco.png'); 
        this.load.image('rabisco_trovao', this.caminho +'rabisco_raio.png'); 
        this.load.image('rabisco_sorriso', this.caminho +'rabisco_sorriso.png'); 

        // SOUNDS        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD7OA02); 

        this.load.audio('soundIntro', [this.caminho + 'AV3_S7_OA2_INTRO.mp3']);
        this.load.audio('soundFinal', [this.caminho + 'AV3_S7_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho + 'AV3_S7_OA2_RESUMO.mp3']);
        this.load.audio('P1_0', [this.caminho + 'AV3_S7_OA2_P1_1.mp3']);
        this.load.audio('P1_1', [this.caminho + 'AV3_S7_OA2_P1_2.mp3']);
        this.load.audio('P1_2', [this.caminho + 'AV3_S7_OA2_P1_3.mp3']);
        this.load.audio('P2_0', [this.caminho + 'AV3_S7_OA2_P2_1.mp3']);
        this.load.audio('P2_1', [this.caminho + 'AV3_S7_OA2_P2_2.mp3']);
        this.load.audio('P2_2', [this.caminho + 'AV3_S7_OA2_P2_3.mp3']);
        this.load.audio('P3_0', [this.caminho + 'AV3_S7_OA2_P3_1.mp3']);
        this.load.audio('P3_1', [this.caminho + 'AV3_S7_OA2_P3_2.mp3']);
        this.load.audio('P3_2', [this.caminho + 'AV3_S7_OA2_P3_3.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};