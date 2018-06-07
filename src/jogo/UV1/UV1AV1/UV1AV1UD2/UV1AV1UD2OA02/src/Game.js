
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator
};

BasicGame.Game.prototype = {

    create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TOTAL_LEVEL = 3;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 30000;
        this.TEMPO_ERRO2 = 15000;
        this.TEMPO_ERRO1 = 3000;
        this.TEMPO_RESUMO = 14000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 60;
        this.UNDERLINE_SPACING = 20;
        /**************************** CONSTANTES JOGO ATUAL ************************************************/

        /* FUTURO XML */
        this.corrects = 0;
        this.errors = 0;
        this.currentLevel = BasicGame.InitialLevel;
        this.listCorrects = [-1,-1,-1];
        this.listCompleted = [false,false,false];
        /* FUTURO XML */
        this.conclusaoEnviada = false;

        this.pointsByLevel = [0,200,300,500,500];

        this.lives = 2;
        this.points = 0;
        this.isWrong = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();


        this.createScene();

        this.showIntro();

        /* REMOVE INTRO E INICIA JOGO DIRETO */
        //this.initGame();

        /* HUD */
        this.createHud();
        this.createBottomHud();
        //this.createRepeatButton();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);

    },


    /*********************************************************************************************************************/
    /* -INICIO-   HUD E BOTOES */

    createRepeatButton: function() {
        this.repeat = this.add.button(40,this.world.height-40, 'repeatButton', this.clickRestart, this, 0,0,0);
        this.repeat.input.useHandCursor = true;
        this.repeat.anchor.set(0.5,0.5);

        this.repeat.onInputOver.add(this.onButtonOver, this);
        this.repeat.onInputOut.add(this.onButtonOut, this);
    },

    clickRestart:function() {
        this.tweens.removeAll();
        this.sound.stopAll();
        this.time.events.removeAll();
        this.state.start('Game');
    },

    createBottomHud: function() {
        this.groupBottom = this.add.group();

        var bg = this.groupBottom.create(0, this.game.height, "hud", "hudBottom");
        bg.anchor.set(0,1);

        this.soundButton = this.add.button(80,this.world.height-60, "hud", this.switchSound, this, 'soundOn','soundOn','soundOn','soundOn', this.groupBottom);

        var sTool = this.add.sprite(3,-35, "hud", "soundText");
        sTool.alpha = 0;
        this.soundButton.addChild(sTool);
        this.soundButton.input.useHandCursor = true;

        this.soundButton.events.onInputOver.add(this.onOverItem, this);
        this.soundButton.events.onInputOut.add(this.onOutItem, this);

        var back = this.add.button(10,this.world.height-110, "hud", this.backButton, this, 'backButton','backButton','backButton', 'backButton', this.groupBottom);
        back.input.useHandCursor = true;

        var sTool = this.add.sprite(8,-40, "hud", "backText");
        sTool.alpha = 0;
        back.addChild(sTool);

        back.events.onInputOver.add(this.onOverItem, this);
        back.events.onInputOut.add(this.onOutItem, this);
    },
    onOverItem: function(elem) {
        elem.getChildAt(0).alpha = 1;
    },
    onOutItem: function(elem) {
        elem.getChildAt(0).alpha = 0;
    },

    backButton: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(function() {

            this.time.events.removeAll();
            this.tweens.removeAll();
            this.tweenBack();
            
        }, this);

        this.registrarConclusao();
    },
    tweenBack: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + "MAPA/";
        }, this);
    },

    switchSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        var _frame = (this.game.sound.mute)? "soundOff" : "soundOn";
        this.soundButton.setFrames(_frame,_frame,_frame, _frame);
    },

    createHud: function() {

        this.add.sprite(0,0, "hud");

        this.livesTextShadow = this.add.bitmapText(111,36, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.livesText = this.add.bitmapText(110,35, "JandaManateeSolid", this.lives.toString(), 18);

        this.pointsTextShadow = this.add.bitmapText(51,102, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.pointsText = this.add.bitmapText(50,101, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);

        var _cVal = 0;// this.rnd.integerInRange(100,999);
        var coin = this.add.bitmapText(31,191, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        this.add.bitmapText(30,190, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
    },

    /* -FINAL-    HUD E BOTOES */
    /*********************************************************************************************************************/


    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES AUXILIARES GAMEPLAY */

    openLevel: function() {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }
        if(this.listCorrects[this.currentLevel-1] < 0) {
            this.listCorrects[this.currentLevel-1] = 0;
        }
    },

    saveCorrect: function(porc, completed) {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }

        var _completed = (completed==undefined || completed)?true:false;
        var _porc = porc || 100;

        if(_porc > this.listCorrects[this.currentLevel-1]) {
            this.listCorrects[this.currentLevel-1] = _porc;
        }

        if(!this.listCompleted[this.currentLevel-1]) {
            this.listCompleted[this.currentLevel-1] = _completed;
        }

        console.log("saveCorrect", this.listCorrects, this.listCompleted );
    },
    
    //fixa
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);
        return spr;
    },

    createAnimation1: function( x, y, name, scaleX, scaleY) {
        //this.animation1 = this.add.sprite(this.world.centerX-30, this.world.centerY-295, 'arvoreCresce');
        this.add.tween(this.animation1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        var _intervalo = [];
        for(var i=0; i<50; i++){
            _intervalo.push(i);
        }

        this.animation1.animations.add('idle', _intervalo, 18, false);
        this.animation1.animations.play('idle');
        this.animation1.scale.set( 1, 1);
        
        this.add.tween(this.arvoreMurcha).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        //this.showPolyRegador();
        return this.animation1;
    },

    createAnimation2: function( x, y, name, scaleX, scaleY) { 
        this.add.tween(this.animation1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.animation2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        //this.animation2 = this.add.sprite(this.world.centerX-30, this.world.centerY-295, 'arvoreCresce');
        var _intervalo = [];
        for(var i=50; i<95; i++){
            _intervalo.push(i);
        }

        this.animation2.animations.add('idle', _intervalo, 18, false);
        this.animation2.animations.play('idle');
        this.animation2.scale.set( 1, 1);
        
        //this.showPolyRegador();
        return this.animation2;
    },

    createAnimation3: function( x, y, name, scaleX, scaleY) { 
        this.add.tween(this.animation2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.animation3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        //this.animation3 = this.add.sprite(this.world.centerX-30, this.world.centerY-295, 'arvoreCresce');
        var _intervalo = [];
        for(var i=95; i<113; i++){
            _intervalo.push(i);
        }

        this.animation3.animations.add('idle', _intervalo, 18, false);
        this.animation3.animations.play('idle');
        this.animation3.scale.set( 1, 1);
        
        //this.showPolyRegador();
        return this.animation3;
    },

    //fixa
    onButtonOver: function(elem) {
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    //fixa
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            itens.splice(n,1);
        }
        return _itens;
    },

    getRandomUniqueItem: function(list, level) {

        var letters = this.getNonRepeatLetter(list, level); // FRE
        var n = this.rnd.integerInRange(0,letters.length-1);

        return letters[n];
    },

    createDelayTime: function(time, callback) {

        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */


    skipIntro: function() {
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },

    // intro-fixa
    showIntro: function() {
        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    // intro-fixa
    showKim: function() {
        var kim = this.add.sprite(this.world.centerX-320, 0, 'kim');

        var fIntro = Phaser.Animation.generateFrameNames("kim_", 0, 14, "", 3);
        var fLoop = Phaser.Animation.generateFrameNames("kim_", 15, 84, "", 3);

        kim.animations.add('intro', fIntro, 18, false);
        kim.animations.add('loop', fLoop, 18, true);

        kim.animations.play('intro').onComplete.add(function() {
            kim.animations.play('loop');
        }, this);

        this.groupIntro.add(kim);

        this.createDelayTime( 21000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        
        var tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        var tutorialText2 = this.add.sprite( this.world.centerX+60, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);
        this.groupIntro.add(tutorialText2);



        var florIntro = this.add.sprite( this.world.centerX-50, 400, 'florIntro');
        florIntro.alpha = 0;

        this.groupIntro.add(florIntro);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.add.tween(florIntro).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true, 2000);

        //cria a animação do teclado, mas deixa parada
        var tecladoA = this.createAnimation( this.world.centerX, 120, 'tecladoIntro', 1,1);
            tecladoA.anchor.set(0.5,0.5);
            tecladoA.alpha = 0;
            tecladoA.animations.stop();

        this.groupIntro.add(tecladoA);
        //inicia animação do teclado
        this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 12000);
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 12500).onComplete.add(function() {

            this.createDelayTime(8000, function() {

                this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

                this.add.tween(tecladoA).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
                
                this.createDelayTime( 4000, function() {
                    tecladoA.animations.play('idle', 50, false);
                    //tecladoA.animations.stop();
                });

            });
        }, this);

        //Oculta tudo da tela
        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tecladoA).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
            this.add.tween(florIntro).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true);
        });
    },

    
    // resumo-fixa
    showResumo: function() {
        
        this.soundResumo = this.sound.play("soundResumo");

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    // resumo-fixa
    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },



    // vidas-fixa
    updateLivesText: function() {
        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },

    // game over-fixa
   gameOverMacaco: function() {

        BasicGame.OfflineAPI.setCookieVictory();


        var bg = this.add.sprite(this.world.centerX, this.world.centerY, "backgroundWin");
        bg.anchor.set(0.5,0.5);
        bg.alpha = 0;

        var _animals = ["bumbaWin", "fredWin", "polyWin", "juniorWin"];


        var n = this.rnd.integerInRange(0, _animals.length-1);

        var pos = [510,550,520,525];

        var _name = _animals[n];


        var animal = this.createAnimation( this.world.centerX,pos[n], _name, 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,1);
        animal.alpha = 0;

        
        this.sound.play("soundFinal").onStop.add(function() {

            this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                animal.animations.play('idle');

                this.showTextVictory();

                this.add.tween(animal).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 4000).onComplete.add(function(){
                        
                    this.eventConclusao = new Phaser.Signal();
                
                    this.eventConclusao.addOnce(this.showEndButtons, this);
                
                    
                
                    this.registrarConclusao();
                    
                },this);
            }, this);
        }, this);
    },

    registrarConclusao: function(forcedOnError) {
        if(this.conclusaoEnviada) {
            return;
        }
        this.conclusaoEnviada = true;

        var _this = this;

        var _hasError = true;
        for(var i = 0; i < this.listCorrects.length; i++) {
            if(this.listCorrects[i] >= 0) {
                _hasError = false;
            }
        }
        if(_hasError) {
            this.eventConclusao.dispatch();
            return;
        }

        if(BasicGame.isOnline) {
            BasicGame.OnlineAPI.registrarConclusao(this.listCorrects, this.listCompleted, function(data) {            
                if(_this.eventConclusao) {
                    _this.eventConclusao.dispatch(data);
                }
            }, function(error) {
                console.log(error)
            });
        } else {
            
            _this.eventConclusao.dispatch();
        }
    },

    showTextVictory: function() {

        var pos = [
            [513,368],
            [505,420],
            [530,407],
            [500,360],
            [525,405]
        ];
        var _angle = [1,1,0,1,1];

        var _curr = this.rnd.integerInRange(0,4);

        if(_curr == 1) {
            _curr = 2;
        }

        this.sound.play("soundVitoria" + (_curr+1));

        
        var animal = this.createAnimation( pos[_curr][0], pos[_curr][1], "textoVitoria" + (_curr+1), 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,0.5);
        animal.animations.play('idle', 18, false);
        
    },

    createEndButton: function(x,y,scale) {
        var b = this.add.sprite(x, y, "hudVitoria", "botaoVitoria");
        b.anchor.set(0.5,0.5);
        b.scale.set(0.2,0.2);
        b.scaleBase = scale;
        b.alpha = 0;
        b.inputEnabled = true;
        b.input.useHandCursor = true;
        b.events.onInputOver.add(this.onOverEndButton, this);
        b.events.onInputOut.add(this.onOutEndButton, this);

        return b;
    },

    showEndButtons: function(resposta) {
        
                var _moedas = (resposta != null) ? resposta.moedas : 0;
                var _xp = (resposta != null) ? resposta.xp : 0;
                var _medalhas = (resposta != null) ? resposta.medalhas : 0;
        
                var light = this.add.sprite(-2000,50,"light");
                light.alpha = 1;
                /************************ b1 ******************************/
                var b1 = this.createEndButton(240, 150, 1);
        
                var i1 = this.add.sprite(0,-30,"hudVitoria", "vitoriaCoracao");
                i1.anchor.set(0.5,0.5);
                i1.alpha = 0;
                b1.addChild(i1);
                //this.add.tween(i1).to({alpha: 1, y: -40}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
        
                var t1 = this.add.bitmapText(0,0, "JandaManateeSolid", _xp.toString(), 40);
                t1.x = -t1.width*0.5;
                t1.y = -t1.height*0.3;
                b1.addChild(t1);
        
                var tt1 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn1");
                tt1.anchor.set(0.3,1);
                tt1.alpha = 0;
                b1.tooltip = tt1;
                b1.addChild(tt1);
        
                /************************ b2 ******************************/
                var b2 = this.createEndButton(100,150,1);
        
                var i2 = this.add.sprite(0,-27.5,"hudVitoria", "vitoriaGemasIcone");
                i2.anchor.set(0.5,0.5);
                i2.alpha = 0;
                b2.addChild(i2);
        
                var t2 = this.add.bitmapText(0,0, "JandaManateeSolid", _moedas.toString(), 40);
                t2.x = -t2.width*0.5;
                t2.y = -t2.height*0.3;
                b2.addChild(t2);
        
                var tt2 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn2");
                tt2.anchor.set(0.5,1);
                tt2.alpha = 0;
                b2.tooltip = tt2;
                b2.addChild(tt2);
                /************************ b4 ******************************/
                var b4 = this.createEndButton(900, 150, 0.65);
                b4.events.onInputUp.add(this.clickRestart, this);
        
                var i4 = this.add.sprite(0,0,"hudVitoria", "vitoriaRepetir");
                i4.anchor.set(0.5,0.5);
                b4.addChild(i4);
        
                var tt4 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn4");
                tt4.anchor.set(0.6,1);
                b4.addChild(tt4);
                tt4.alpha = 0;
                b4.tooltip = tt4;
                tt4.scale.set(1.4);
        
                this.add.tween(light).to({x:0}, 1100, Phaser.Easing.Linear.None, true, 1100);
        
                this.add.tween(b2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
                this.add.tween(b2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1100);
                this.add.tween(i2).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true, 1350);
                
                this.add.tween(b1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
                this.add.tween(b1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1600);
                this.add.tween(i1).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true, 1850);
        
                this.add.tween(b4).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
                this.add.tween(b4.scale).to({x:0.65,y:0.65}, 500, Phaser.Easing.Linear.None, true, 2200);
        
                
                /************************ Medalha ******************************/
        
                var light2 = this.add.sprite(-2000,340,"light");
                light2.alpha = 1;
        
                var eixoX = 25;
                var tempo = 2700;
                if(_medalhas != 0){ 
                    var textMedalha = this.add.bitmapText(-200,280, "JandaManateeSolidRed", "MEDALHAS", 30);
                    this.add.tween(textMedalha).to({x:45}, 500, Phaser.Easing.Linear.None, true, 2300);
                    for(var i = 0; i < _medalhas.length; i++){
                        if(i > 0){
                            var medalha = this.add.sprite(eixoX += 200,360,"medalha"+_medalhas[i].id);
                            medalha.alpha = 0
                            medalha.scale.set(0);
                            
                            this.add.tween(medalha).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, tempo=tempo + 250);
                            this.add.tween(medalha.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, tempo=tempo + 500);     
                        }
                        else{
                            var medalha = this.add.sprite(eixoX,360,"medalha"+_medalhas[i].id);
                            medalha.alpha = 0;
                            medalha.scale.set(0);
        
                            this.add.tween(medalha).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, tempo - 250);
                            this.add.tween(medalha.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, tempo);       
                        }
                    }
                    this.add.tween(light2).to({x:0}, 250, Phaser.Easing.Linear.None, true, 2600);
                    this.createDelayTime(8000, this.tweenBack);
                }
                else{
                   this.createDelayTime(5000, this.tweenBack); 
                }
            },

    onOverEndButton: function(elem) {
        var sc = elem.scaleBase * 1.1;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true);
    },
    onOutEndButton: function(elem) {
        var sc = elem.scaleBase;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 0}, 150, Phaser.Easing.Linear.None, true);
    },


    // level-fixa
    initGame: function() {


        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        
        this.animation1 = this.add.sprite(this.world.centerX-30, this.world.centerY-295, 'arvoreCresce');
        this.animation1.alpha = 0;

        this.animation2 = this.add.sprite(this.world.centerX-30, this.world.centerY-295, 'arvoreCresce');
        this.animation2.alpha = 0;

        this.animation3 = this.add.sprite(this.world.centerX-30, this.world.centerY-295, 'arvoreCresce');
        this.animation3.alpha = 0;

        this.showPolyRegador();

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.arvoreMurcha = this.add.sprite( this.world.centerX+150, 540, 'arvoreMurcha');
        this.computador = this.add.sprite( this.world.centerX-300, 400, 'computador');

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
            this.showNextLevel(true);
        }, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function(clearCorrect) {

        for(var i = 0; i < this.buttons.length; i++) {
            if(clearCorrect) {
                if(this.buttons[i].isCorrect == undefined || !this.buttons[i].isCorrect) {
                    this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                        elem.destroy();
                    });
                }
            } else {
                this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                    elem.destroy();
                });
            }
        }
    },

    showPolyRegador: function() {
        this.createAnimation( this.world.centerX+150, this.world.centerY-10, 'polyRegador', 1,1);
        /*
        poly.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        poly.crop(rect);

        this.add.tween(poly).to({x: this.world.centerX+150, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 400}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime( 3000, function() {
            this.add.tween(poly).to({x: this.world.centerX+500, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            //this.add.tween(poly).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });*/
    },

    // level-fixa
    gotoNextLevel: function() {
        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        this.hideLevel(function() {
            console.log(this.corrects);
            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {
                    this.sound.play("soundDica");

                    this.isWrong = true;
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showNextLevel(true);
                    });
                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        this.showNextLevel(true);
                    }, this);
                }
            } else {
                this.gameOverMacaco();
            }
        });
    },

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    resetRandomLetter: function() {
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },

    getNonRepeatLetter: function(itens, num) {

        var _name = [];

        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }

        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            if(_name.indexOf(this.spliceLetter[num]) >= 0) {
                _name.splice(i,1);
            }
        }

        if(_name.length < 1) {
            return itens;
        }
        return _name;
    },

    limparNomes: function() {

        for(var i = 0; i < this.nameShadows.length; i++) {
            this.nameShadows[i].destroy();            
            this.nameTexts[i].destroy();            
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.groupName = this.add.group();
    },

    showName: function(name) {

        var Ypos = 10;

        this.limparNomes();

        for(var i = 0; i < name.length; i++) {

            var px = this.world.centerX - name.length*25 + i*this.LETTER_SPACING;

            //px = (name[i] == "_")? px + 10 : px;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            this.addLetter(px,py, name[i]);
        }

        //this.nameShadow.x = this.world.centerX - this.nameShadow.width*0.5+4;
        //this.nameText.x = this.world.centerX - this.nameText.width*0.5;
    },
    addLetter: function(x,y, letter) {
        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 75);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 75);

        shadow.x = x+4-shadow.width*0.5;
        name.x = x-name.width*0.5;

        this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        this.groupName.add(shadow);
        this.groupName.add(name);

        return [name,shadow];
    },

    removeButtonAction: function() {
        this.correctItem.input.useHandCursor = false;
        this.game.canvas.style.cursor = "default";
        this.correctItem.input.reset();
        
        this.correctItem.inputEnabled = false;
        this.correctItem.onInputOver.removeAll();
        this.correctItem.onInputOut.removeAll();
        this.correctItem.onInputUp.removeAll();

        console.log(this.correctItem);
        for(var i = 1; i < this.spliceLetter.length; i++) {
            this.spliceLetter[i].push(this.correctItem._frameName);
        }
    }, 

    showCorrectName: function(gotoNext) {

        this.corrects++;
        this.saveCorrect();
        //this.addPoints();

        if(this.currentLevel == 1){
            this.createAnimation1();
        }else if(this.currentLevel == 2){
            this.createAnimation2();
        }else{
            this.createAnimation3();
        }



        this.hideLevel(function() {
            if(gotoNext) {
                this.createDelayTime( 2000, this.gotoNextLevel);
            }
        })

    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() { //finished
        this.add.sprite( -632.90, -229.25, 'background');
    },

    // resumo inicial
    showTextResumo: function() {
        var texto = this.add.sprite(this.world.centerX-260, this.world.centerY-240, 'resumoVogais');

        this.groupIntro.add(texto);

        texto.animations.add('idle', null, 18, false);
        texto.animations.play('idle');
        texto.scale.set( 1, 1);
        
        //tempo para desaparecer o resumo
        this.createDelayTime( this.TEMPO_RESUMO, function() {
            this.add.tween(texto).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.hideResumo();
        });
    },

    // level - mostrar proximo
    showNextLevel: function(hasSound) {

        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                if(hasSound && !this.isWrong) {
                    this.sound.play("soundP1");
                    this.showQuestion(1);
                }
                this.initLevel1((hasSound&&!this.isWrong)?7500:1000);
            break;
            case 2:
                if(hasSound && !this.isWrong) {
                    this.qtdErros = 0;
                    this.sound.play("soundP2");
                    this.showQuestion(2);
                }
                this.initLevel2((hasSound&&!this.isWrong)?7000:1000);
            break;
            case 3:
                if(hasSound && !this.isWrong) {
                    this.qtdErros = 0;
                    this.sound.play("soundP3");
                    this.showQuestion(3);
                }
                this.initLevel3((hasSound&&!this.isWrong)?7000:1000);
            break;
        }
        this.isWrong = false;
    },

    showFlower: function(typeFlower) {
        var buqueG = 0;
        var buqueP = 0;
        switch(typeFlower) {
            case 1:
                buqueG = this.add.sprite( this.world.centerX-110, 215, 'buqueG');
                buqueG.anchor.set(0.5,1);
                var t = this.add.tween(buqueG.scale)
                    .to({x: 1.2, y: 1.2}, 500, Phaser.Easing.Linear.None)
                    .to({x: 0.8, y: 0.8}, 1000, Phaser.Easing.Linear.None);
                t.start();
                this.createDelayTime( 2000, function() {
                    this.add.tween(buqueG.scale)
                        .to({x: 1.2, y: 1.2}, 500, Phaser.Easing.Linear.None);
                });
            break;
            case 2:
                buqueP = this.add.sprite( this.world.centerX+50, 215, 'buqueP');
                buqueP.anchor.set(0.5,1);
                var t = this.add.tween(buqueP.scale)
                    .to({x: 1.2, y: 1.2}, 500, Phaser.Easing.Linear.None)
                    .to({x: 0.8, y: 0.8}, 1000, Phaser.Easing.Linear.None);
                t.start();
            break;
        }
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 25, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.isWrong) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime( 6000, function() {
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        })
    },
    hideQuestion: function() {

    },

    initKeyboard: function() {
        this.game.input.keyboard.addCallbacks(this,null,null, this.onKeyPressed);
    },
    removeKeyboard: function() {
        this.game.input.keyboard.addCallbacks( this, null, null, null );
    },

    showKey: function(value,correto) {
        this.currentKey = this.add.bitmapText(this.world.centerX-200, 430, "JandaManateeSolid", value.toString(), 80);
        
        if(correto){
            this.currentKey.tint = 0x29a015;
        }else{
            this.currentKey.tint = 0xFF0000;
        }
        
        this.currentKey.alpha = 0;

        this.add.tween(this.currentKey).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime( 1000, function() {
            this.hideKey();
        })
    },

    hideKey: function() {
        this.add.tween(this.currentKey).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
    },

    onKeyPressed: function(elem) {
        //this.showKey(elem.toUpperCase());

        var _letra = elem.toUpperCase();

        var _letraCorreta = this.VOGAL_ATUAL.substr(5);
        //console.log(_letra, this.VOGAL_ATUAL, _letraCorreta);

        if(_letraCorreta == _letra){
            this.showKey(elem.toUpperCase(),true);
            this.rightAnswer();
        }else{
            this.showKey(elem.toUpperCase(),false);
            this.wrongAnswer();
        }
        this.removeKeyboard();
    },

    initLevel1: function(time) {
        if(!this.qtdRodadas || this.qtdRodadas == 0) {
            this.totalRodadas = this.qtdRodadas = 5;
        }

        if(!this.qtdErros || this.qtdErros == 0) {
            this.qtdErros = 3;
        }

        // para garantir que todas as vogais aparecerão
        if(this.qtdRodadas == 5){
            this.itens = ["typ2-A","typ2-E","typ2-I","typ2-O","typ2-U"];
        }

        this._letters = this.createRandomItens(this.itens, 1);

        this._letters.sort(function() {
            return .5 - Math.random();
        });

        this.VOGAL_ATUAL = this._letters[0];

        this.createDelayTime( time, function() {
            this.sound.play(this.VOGAL_ATUAL);
            this.initKeyboard();
        })
        this._letters.splice(0);
    },

    initLevel2: function(time) {
        if(!this.qtdRodadas || this.qtdRodadas == 0) {
            this.totalRodadas = this.qtdRodadas = 2;
        }

        if(!this.qtdErros || this.qtdErros == 0) {
            this.qtdErros = 1;
        }

        // para que as vogais não se repitam
        if(this.qtdRodadas == 2){ 
            this.itens = ["typ3-A","typ3-E","typ3-I","typ3-O","typ3-U"];
        }

        this._letters = this.createRandomItens(this.itens, 1);

        this._letters.sort(function() {
            return .5 - Math.random();
        });


        this.VOGAL_ATUAL = this._letters[0];

        this.createDelayTime( time, function() {
            this.sound.play(this.VOGAL_ATUAL);
            this.initKeyboard();
        })
        this._letters.splice(0);
    },

    initLevel3: function(time) {
        if(!this.qtdRodadas || this.qtdRodadas == 0) {
            this.totalRodadas = this.qtdRodadas = 2;
        }

        if(!this.qtdErros || this.qtdErros == 0) {
            this.qtdErros = 1;
        }

        // para que as vogais não se repitam
        if(this.qtdRodadas == 2){
            this.itens = ["typ1-A","typ1-E","typ1-I","typ1-O","typ1-U"];
        }

        this._letters = this.createRandomItens(this.itens, 1);

        this._letters.sort(function() {
            return .5 - Math.random();
        });

        this.VOGAL_ATUAL = this._letters[0];

        this.createDelayTime( time, function() {
            if((this.VOGAL_ATUAL.indexOf("U"))>-1){
                this.sound.play(this.VOGAL_ATUAL, 7);
            }else {
                this.sound.play(this.VOGAL_ATUAL);
            }
            this.initKeyboard();
        })
        this._letters.splice(0);
    },


    rightAnswer: function() {
        this.qtdRodadas--;

        var _calc = (this.totalRodadas - this.qtdRodadas) / this.totalRodadas * 100;
        
        console.log(this.qtdRodadas, this.qtdErros, _calc);
        this.saveCorrect(_calc, false);

        if(this.qtdRodadas <= 0) {
            /* FIXO */
            console.log("add correct");
            //this.sound.stopAll();
            this.sound.play("hitAcerto");
            /* FIXO */

            this.qtdErros = 0;
            this.showCorrectName(true);
        } else {
            this.sound.play("hitAcerto");
            this.verifyEndLevel();
        }
    },

    verifyEndLevel: function() {
        this.showNextLevel();
    },

    // resposta errada
    wrongAnswer: function(target) {
        console.log("Level "+this.currentLevel+" Vidas: "+this.lives+" Erros: "+this.qtdErros);
        this.qtdErros--; //contagem para cada nível separadamente
        this.qtdRodadas--;

        //this.sound.stopAll();
        this.sound.play("hitErro");

        console.log(this.qtdRodadas, this.qtdErros);

        if(this.qtdErros <= 0) {
            console.log("max errors");  
            this.lives--;
            if(this.currentLevel > 1){
                this.currentLevel--;
            }else{
                this.lives = 0;
            }
            this.errors--;
            this.qtdErros = 0;
            this.qtdRodadas = 0;
            
            switch(this.lives) {
                case 1: // mostra dica 1
                    this.hideAndShowLevel(true);
                break;
                case 0: // toca som de resumo
                    this.lives = 0;
                    this.hideLevel(function() {});
                    this.showResumo();
                break;
                default: // game over
                break;
            }
            this.updateLivesText();


        } else {
            this.createDelayTime(400, function() {
                //this.sound.play("soundDica");
            });

            this.createDelayTime(500, function() {
                if(this.qtdRodadas <= 0) {
                    this.showCorrectName(true);
                } else {
                    this.verifyEndLevel();
                }
            });
        }
        
    },



    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

    update: function () {



    }
};
