
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
    
        //alterado caminho das imagens em função do jogo p/ tablets
        this.caminho = getPathFile(UV1AV3UD5OA01);
        console.log("Caminho das imagens e animações: " + this.caminho);

        // ANIMATIONS AND IMAGES
        this.load.image('background', this.caminho +'background.png');
        this.load.image('cesto', this.caminho +'cesto.png');
        this.load.image('fruta_1', this.caminho +'fruta_1.png'); // MORANGO
        this.load.image('fruta_2', this.caminho +'fruta_2.png'); // CAJU
        this.load.image('fruta_3', this.caminho +'fruta_3.png'); // MAÇA
        this.load.image('fruta_4', this.caminho +'fruta_4.png'); // PERA
        this.load.image('fruta_5', this.caminho +'fruta_5.png'); // CARAMBOLA
        this.load.atlas('guri_1_keep_alive', this.caminho +'guri_1_keep_alive.png', this.caminho + 'guri_1_keep_alive.json');
        this.load.atlas('guri_2_keep_alive', this.caminho +'guri_2_keep_alive.png', this.caminho + 'guri_2_keep_alive.json');
        this.load.atlas('guri_1_happy', this.caminho +'guri_1_happy.png', this.caminho + 'guri_1_happy.json');
        this.load.atlas('guri_2_happy', this.caminho +'guri_2_happy.png', this.caminho + 'guri_2_happy.json');
        
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD5OA01); 

        //alterado caminho das imagens em função do jogo p/ tablets
        console.log("Caminho dos sons: " + this.caminho);

        // SOUNDS
        this.load.audio('soundIntro', [this.caminho + 'AV3_S5_OA1_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho + 'AV3_S5_OA1_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho + 'AV3_S5_OA1_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho + 'AV3_S5_OA1_RESUMO.mp3']);
        this.load.audio('soundCallToAction', [this.caminho + 'AV3_S5_OA1_CtA.mp3']);
        this.load.audio('soundEstatico', [this.caminho + 'AV3_S5_OA1_ESTATICA.mp3']);

    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};