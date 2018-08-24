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

        this.posicaoXvideo = 490; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 550; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-16,-16,"background");

        
        this.createAnimation( 164, 227, "iara", 1,1);
        this.createAnimation( -43, 411, "flor1",  1,1);
        this.createAnimation( 390, 260, "junior", 1,1);
        this.createAnimation( 673, 420, "flor2",  1,1);
        
        this.add.sprite(-123,-83,"backgroundFrente");

        this.createButton( 92,260,0.4,0.4, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));
        this.createButton(407,246,0.4,0.4, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(741,311,0.4,0.4, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(807,433,0.5,0.5, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(621,532,0.6,0.6, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2),true,658.9,545);
        this.createButton(297,487,0.6,0.6, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1));


    },  

    update: function () {



    }
};
