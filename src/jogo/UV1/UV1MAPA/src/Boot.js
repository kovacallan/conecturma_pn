BasicGame = {
    score: 0,
    music: null,
    orientated: false,
    UV: 1,
    LEVELS: 2 // numero de niveis existente no mapa
};


BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {

        this.stage.backgroundColor = "#FFFFFF";

         this.caminho = getPathFileMapaUniverso(GLOBAL_MAPA); 
        
        this.load.atlas('preloader', this.caminho+'preloader.png', this.caminho+'preloader.json');

    },

    create: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.setMinMax( 250, 150, 1000, 600);

        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.scale.refresh();



        BasicGame.canStart = false;
        this.ready = false;

        BasicGame.isOnline = BasicGame.OfflineAPI.isOnlineMode();

        BasicGame.OnlineAPI.initialize(BasicGame.isOnline);
        BasicGame.OfflineAPI.setInitialLevel();

        BasicGame.maxAventuras = 0;


        var _this = this;

        BasicGame.OnlineAPI.verificarAcessoAventura (
            function(resposta) {

                console.log(resposta);
                BasicGame.maxAventuras = 0;
                var n = 0;
                
                for(var i = 0; i < resposta.aventurasAcessiveis.length; i++) {
                    n = BasicGame.OnlineAPI.getAVByName( resposta.aventurasAcessiveis[ i ] );
                    if(n > BasicGame.maxAventuras ) {
                        BasicGame.maxAventuras = n;
                        console.log(BasicGame.maxAventuras, n);

                    }
                }
                _this.initPreloader();
                BasicGame.canStart = true;
            },
            function(erro) {
                console.log(erro);
            }
        );

        if(!BasicGame.isOnline) {
            BasicGame.maxAventuras = 3;            
            this.initPreloader();
        }

    },
    initPreloader: function() {
        this.game.time.events.add(400, function() {
            this.state.start('Preloader');
        }, this);
    }

};