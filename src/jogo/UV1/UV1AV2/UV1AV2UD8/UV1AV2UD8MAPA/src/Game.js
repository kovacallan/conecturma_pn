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

        this.createMap();

        if(!this.verificaVideo()) {
            this.initGameMap();
            this.gameStarted = true;
        }

    },

    createScene: function() {

        //this.sound.play('backgroundMusic', 0.75, true);

        this.posicaoXvideo = 590; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 600; // muda posicionamento y do icone de video clipe;

         this.add.sprite(-14,-9,"background");

        this.createAnimation(238,249,"fred",  1,1);
        this.createAnimation(124,323,"curupira",1,1);
        this.createAnimation(102,414,"saci", 1,1);
        this.createAnimation(202,433,"junior", 1,1);

        this.createAnimation(673,346,"boitata",  1,1);
        this.createAnimation(647,467,"fada1",  1,1);
        this.createAnimation(692,417,"fada2",  1,1);
        this.createAnimation(750,469,"fada3",  1,1);
        this.createAnimation(559,412,"poly",  1,1);
        this.createAnimation(652,428,"bumba",  1,1);

        this.createButton(693,271,0.5,0.5, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));
        this.createButton(584,280,0.5,0.5, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(162,243,0.4,0.4, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(357,282,0.5,0.5, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(453,431,0.6,0.6, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(317,525,0.7,0.7, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,364.3,545);

    },  

    update: function () {



    }
};

