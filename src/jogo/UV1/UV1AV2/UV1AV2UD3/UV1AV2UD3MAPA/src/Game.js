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

        this.posicaoXvideo = 530; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 520; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-917,-1345,"background");

        this.createAnimation(303,193,"bumba", 1,1);
        this.createAnimation(405,263,"junior",1,1);
        this.createAnimation(643,162,"poly",  1,1);
        this.createAnimation(720,180,"fred",  1,1);
        this.createAnimation(807,186,"anaconda", 1,1);
        this.createAnimation(755,281,"saci", 1,1);
        this.createAnimation(833,214,"curupira", 1,1);


        this.createButton( 66,272,0.4,0.4, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));
        this.createButton(162,320,0.4,0.4, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(125,462,0.6,0.6, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(292,417,0.5,0.5, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(524,273,0.5,0.5, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(600,380,0.6,0.6, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1));

    },  

    update: function () {



    }
};



