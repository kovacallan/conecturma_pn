
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
        this.caminho = getPathFile(UV1AV3UD4OA03);
        console.log("Caminho das imagens e animações: " + this.caminho);

        // IMAGES AND ANIMATIONS
        this.load.image('background', this.caminho +'background.png');
        this.load.image('img_resumo_1', this.caminho +'img_resumo_1.png');
        this.load.image('img_resumo_2', this.caminho +'img_resumo_2.png');
        this.load.image('mascara', this.caminho +'mascara_1.png');
        this.load.image('forma_geometrica_1', this.caminho +'forma_geometrica_1.png');
        this.load.image('forma_geometrica_2', this.caminho +'forma_geometrica_2.png');
        this.load.image('forma_geometrica_3', this.caminho +'forma_geometrica_3.png');
        this.load.image('forma_geometrica_4', this.caminho +'forma_geometrica_4.png');
        this.load.image('forma_plana_1', this.caminho +'forma_plana_1.png');
        this.load.image('forma_plana_2', this.caminho +'forma_plana_2.png');
        this.load.image('forma_plana_3', this.caminho +'forma_plana_3.png');
        this.load.image('forma_plana_4', this.caminho +'forma_plana_4.png');
        this.load.atlas('tatu_keep_alive', this.caminho +'tatu_keep_alive.png', this.caminho + 'tatu_keep_alive.json');
        this.load.atlas('tatu_erro', this.caminho +'tatu_erro.png', this.caminho + 'tatu_erro.json');
        this.load.atlas('tatu_erro_1', this.caminho +'tatu_erro_1.png', this.caminho + 'tatu_erro_1.json');
        this.load.atlas('tatu_erro_2', this.caminho +'tatu_erro_2.png', this.caminho + 'tatu_erro_2.json');
        this.load.atlas('tatu_erro_3', this.caminho +'tatu_erro_3.png', this.caminho + 'tatu_erro_3.json');
        this.load.atlas('tatu_erro_4', this.caminho +'tatu_erro_4.png', this.caminho + 'tatu_erro_4.json');
    
        //alterado caminho das imagens em função do jogo p/ tablets
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD4OA03); 
        console.log(this.caminho);
       
        // SOUNDS
        this.load.audio('soundIntro', [this.caminho + 'AV3_S4_OA3_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho + 'AV3_S4_OA3_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho + 'AV3_S4_OA3_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho + 'AV3_S4_OA3_RESUMO.mp3']);
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};