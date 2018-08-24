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

        this.posicaoXvideo = 370; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 420; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-654,-252,"background");

        /*
            Comentado por problemas de perfomance no Windows 7.
        */
        this.background_anim = this.createAnimation( 0, 0, "capsulas", 1.0, 1.0);
        this.background_anim.animations.add('play', this.math.numberArray(0,96), 18, true);
        this.background_anim.animations.play('play');

        this.createAnimation(5,318,"junior",1,1);
        this.createAnimation(81,343,"bumba", 1,1);
        this.createAnimation(818,340,"poly",  1,1);
        this.createAnimation(886,358,"fred",  1,1);

        this.createAnimation(495, 84,"robo",  1,1);

        this.createButton(440,420,0.5,0.5, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));
        this.createButton(660,415,0.5,0.5, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(750,505,0.5,0.5, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(235,405,0.4,0.4, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(319,543,0.6,0.6, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2),true,356.9,545);
        this.createButton(550,538,0.7,0.7, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,597.3,545);
    },  

    




};