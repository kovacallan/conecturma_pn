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

        this.posicaoXvideo = 320; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 580; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-240,-420,"background");
        //var  v = this.addSpriteMeu("buttonBg",139,100,0);
        //v.scale.set(0.3,0.3);
        /*this.addSpriteMeu("bumba",156,374,0);
        this.addSpriteMeu("poly",89,360,0);
       
        this.addSpriteMeu("junior",260,363,0);*/
        
        this.createAnimation(139,285,"fred",  1,1);
        this.createAnimation(156,374,"bumba", 1,1);
        this.createAnimation(89,360,"poly",  1,1);
        this.createAnimation(260,363,"junior",1,1);

        this.createButton(355,524,0.6,0.6, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,392.9,544);
        this.createButton(406,331,0.3,0.3, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2),true,415.7,341);
        this.createButton(343,215,0.2,0.2, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3),true,343.3,225);
        this.createButton(573,308,0.3,0.3, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4),true,582.7,318);
        this.createButton(741,361,0.6,0.6, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(673,66,0.3,0.3, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6),true,682.7,76);
       
    }, 

};
