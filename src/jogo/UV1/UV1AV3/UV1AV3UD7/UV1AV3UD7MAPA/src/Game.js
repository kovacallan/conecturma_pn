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
        console.log("***> create map" + this.verificaVideo());
        if(!this.verificaVideo()) {
            this.initGameMap();
            this.gameStarted = true;
        }

    },

    createScene: function() {

        //this.sound.play('backgroundMusic', 0.75, true);

        this.posicaoXvideo = 527; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 548; // muda posicionamento y do icone de video clipe;

        var b = this.add.sprite(-332,-376,"background");
        b.scale.set(0.8,0.8);

        this.createAnimation(260,281,"indio",1,1);
        this.createAnimation(183,290,"india1",1,1);
        this.createAnimation(97,262,"poly",1,1);
        this.add.sprite(339,276,"india2");


        this.createButton(158,514,0.75,0.75, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,210,550);
        this.createButton(385,462,0.5,0.5, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(596,459,0.5,0.5, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(760,396,0.45,0.45, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4),true,770,411);
        this.createButton(801,519,0.75,0.75, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5),true,853,550);
        this.createButton(944,329,0.3,0.3, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));
       
    }, 

};


    