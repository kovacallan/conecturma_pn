BasicGame.Game = function (game) {

    this.initExtends();

    
    BasicGame.GameBase.call(game);
};

BasicGame.Game.prototype = Object.create(BasicGame.GameBase.prototype);
BasicGame.Game.prototype.constructor = BasicGame.Game;

BasicGame.Game.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Game.prototype[name] = this.extends[name];
    }
};

BasicGame.Game.prototype.extends = {
    create: function () {
        console.log("create map");
        console.log("create map");

        this.createMap();

        if(!this.verificaVideo()) {
            this.initGameMap();
            this.gameStarted = true;
        }

    },

    createScene: function() {

        //this.sound.play('backgroundMusic', 0.75, true);

        this.posicaoXvideo = 330; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 420; // muda posicionamento y do icone de video clipe;


        this.add.sprite(-110,-348,"background");

        this.createAnimation(208,156,"bumba", 1,1);
        this.createAnimation(162,184,"poly",  1,1);
        this.createAnimation(760,225,"fred",  1,1);
        this.createAnimation(846,259,"junior",1,1);

        this.add.sprite(-205,270,"background_frente");

        this.createButton(450,520,0.7,0.7, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,497.3,545);
        this.createButton(250,500,0.6,0.6, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(380,360,0.4,0.4, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(520,330,0.3,0.3, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(590,390,0.4,0.4, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(660,470,0.6,0.6, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));
    },  

    

	update: function () {



	}
};
