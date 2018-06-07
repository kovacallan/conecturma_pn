
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    

};

BasicGame.Game.prototype = {



	create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TOTAL_LEVEL = 3;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 19000;
        this.TEMPO_ERRO2 = 12500;
        this.TEMPO_ERRO1 = 2000;
        this.TEMPO_RESUMO = 24500;
        this.SOUND_VITORIA = 7000;
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

        this.lives = 2;
        this.points = 0;
        this.isWrong = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();


        //D70A01
        //---------------------------//
			this.groupLevel=[];
            this.numLevelItens = 0;
            this.numVazios = 0;
            this.numCheios = 0;
            this.drawItens =[];
			this.drawItensVazios =[];
            this.ItensVazios =[];
            this.movableNumbers=[];
			this.posicaoMovableNumbers=[];
			this.nivel =0;
			this.errou = false;
			this.numAcertos =0;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.elemLugar = false;
            this.dica = false;
            this.validar = [] ; // array para validar os tojolos colocados no  lugar 

        //---------------------------//
       
        this.createScene();

        this.showIntro();

        /* REMOVE INTRO E INICIA JOGO DIRETO */
        //this.initGame();
        //this.gameOverMacaco();

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

        this.registrarConclusao(true);
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

    createDelayTime: function(time, callback) {

        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */
    skipIntro: function() {
        this.time.events.removeAll();
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

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {

        var tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        var tutorialText2 = this.add.sprite( this.world.centerX+60, 110, 'initialText2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( 2500, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });   
        this.createDelayTime( 3000, function() {
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showLiveTutorial, this);
        });  
        

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true, 600).onComplete.add(this.showFinishedLiveTutorial, this);

        });
    },
    // resumo-fixa
    showResumo: function() {

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

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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

    // level-fixa
    gotoNextLevel: function() {

        this.currentLevel++;
        this.hideAndShowLevel(true);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
    },

    // fixa
    hideAndShowLevel: function(isWrong) {

        this.hideLevel(function() {

            //console.log(this.corrects);
            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {

                    this.isWrong = true;
                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showNextLevel();
                    });

                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }

            } else {
                this.gameOverMacaco(); // erro D70A01 22/04/15
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

    resetRandomLetter: function() { // mary
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
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

        //console.log(this.correctItem);
        for(var i = 1; i < this.spliceLetter.length; i++) {
            this.spliceLetter[i].push(this.correctItem._frameName);
        }
    }, 

    showCorrectName: function(gotoNext) {
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
    },

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },
	
	//D7OA01
	resetLevel:function(nivelJogo)
	{
		this.numLevelItens = 0;
		this.numVazios = 0;
		this.numCheios = 0;
		this.drawItens =[];
		this.drawItensVazios =[];
        this.ItensVazios =[];
		this.movableNumbers=[];
		this.posicaoMovableNumbers=[];
		this.validar = [];
		this.errou = false;
		if(nivelJogo!=0)
		{
			//console.log("nivel "+nivelJogo);
			this.createDelayTime(500, function() {
                 this.add.tween(this.groupLevel[nivelJogo]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
                 
				 if(this.groupLevel[this.nivel] != null) {
                    this.groupLevel[this.nivel].removeAll(true);
                 }
			}); 
		}
		
		this.nivel =0;
	},
	animClick:function(proximo)
    {
        this.click.x = this.arrow.x-35;
        this.click.y = this.arrow.y-35;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            //this.click.destroy(); 
			this.efeitoMouse(proximo);
        }, this);
    },
	efeitoMouse:function(passo)
	{
		switch(passo)
		{
			case 1:
				var x = this.posicaoMovableNumbers['3'][0]+this.movableNumbers[2].width/2+10;
				var y = this.posicaoMovableNumbers['3'][1]+this.movableNumbers[2].height/2+10;
				this.add.tween(this.arrow).to({x:x, y: y}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
					this.movableNumbers[2].frame = 1;
					this.animClick(2);
				}, this);
			break;
			case 2:
				var x = this.drawItensVazios[0].x;
				var y = this.drawItensVazios[0].y;
				var arrow_x = this.drawItensVazios[0].x+this.drawItensVazios[0].width/2+10;;
				var arrow_y = this.drawItensVazios[0].y+this.drawItensVazios[0].height/2+10;;
				
				this.add.tween(this.arrow).to({x:arrow_x, y:arrow_y}, 600, Phaser.Easing.Linear.None, true)
				this.add.tween(this.movableNumbers[2]).to({x:x, y: y}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
					this.movableNumbers[2].frame = 2;
					this.efeitoMouse(3);
				}, this);	
			break;
			case 3:
				var x = this.posicaoMovableNumbers['6'][0]+this.movableNumbers[2].width/2+10;
				var y = this.posicaoMovableNumbers['6'][1]+this.movableNumbers[2].height/2+10;
				this.add.tween(this.arrow).to({x:x, y: y}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
					this.movableNumbers[0].frame = 1;
					this.click.alpha = 1;
					this.animClick(4);
				}, this);
			break;
			case 4:
				var x = this.drawItensVazios[1].x;
				var y = this.drawItensVazios[1].y;
				var arrow_x = this.drawItensVazios[1].x+this.drawItensVazios[1].width/2+10;;
				var arrow_y = this.drawItensVazios[1].y+this.drawItensVazios[1].height/2+10;;
				
				this.add.tween(this.arrow).to({x:arrow_x, y:arrow_y}, 600, Phaser.Easing.Linear.None, true)
				this.add.tween(this.movableNumbers[0]).to({x:x, y: y}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
					this.movableNumbers[0].frame = 2;
					this.efeitoMouse(5);
				}, this);	
			break;
			case 5:
				var x = this.posicaoMovableNumbers['7'][0]+this.movableNumbers[1].width/2+10;
				var y = this.posicaoMovableNumbers['7'][1]+this.movableNumbers[1].height/2+10;
				this.add.tween(this.arrow).to({x:x, y: y}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
					this.movableNumbers[1].frame = 1;
					this.click.alpha = 1;
					this.animClick(6);
				}, this);
			break;
			case 6:
				var x = this.drawItensVazios[2].x;
				var y = this.drawItensVazios[2].y;
				var arrow_x = this.drawItensVazios[2].x+this.drawItensVazios[2].width/2+10;;
				var arrow_y = this.drawItensVazios[2].y+this.drawItensVazios[2].height/2+10;;
				
				this.add.tween(this.arrow).to({x:arrow_x, y:arrow_y}, 600, Phaser.Easing.Linear.None, true)
				this.add.tween(this.movableNumbers[1]).to({x:x, y: y}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
					this.movableNumbers[1].frame = 2;
					this.add.tween(this.arrow).to({alpha:0}, 400, Phaser.Easing.Linear.None, true, 800);
                    this.createDelayTime(1000, function() {
                         this.changeFredHappy();
                    });  
                   
				}, this);	
			break;
			
		}
	},
	getIndexOfK: function (arr, k){
        for(var i=0; i<arr.length; i++){
            var index = arr[i].indexOf(k);
            if (index > -1){
                return [i, index];
            }
        }
    },
    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
      
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },
    createSprite:function (img,nome,x,y,frame) {
        
        var sprite = this.add.sprite(x,y,img,frame);
        sprite.scale.set(0.7,0.7);
        sprite.name = nome;  
        ////console.log("posição x "+x+ " posição y "+y+ " width "+ nome);
        return sprite;

    },
	
	criarTijolosTutorial:function()
	{
		this.arrayNumeros = [2,3,4,5,6,7,8];
		this.itensVazios = [6,7,3];
		
        var x = 250;
        var posX = 400;
        var posY = 500;
        var cont=0;
		
        for(var i=0; i<this.arrayNumeros.length; i++){
            if(i%2==0) {y=300;} else{y=350;}
            var teste = this.itensVazios.indexOf(this.arrayNumeros[i]);
            if(teste!=-1)
            {
				// vazios 
				
                this.drawItensVazios[cont] = this.createSprite(this.arrayNumeros[i],this.arrayNumeros[i],x,y,0);
				this.groupIntro.add(this.drawItensVazios[cont]);
				cont++;
            }
            else{
                sprite = this.createSprite(this.arrayNumeros[i],this.arrayNumeros[i],x,y,2);
				this.groupIntro.add(sprite);
            }

            x+=70;
        }
        for(var i=0; i<this.itensVazios.length; i++){
           this.movableNumbers[i] =  this.createSprite(this.itensVazios[i],this.itensVazios[i],posX,posY);
           this.movableNumbers[i].frame = 2;
		   this.posicaoMovableNumbers[this.movableNumbers[i].name] = new Array(this.movableNumbers[i].x,this.movableNumbers[i].y);
           posX+=70;
		   this.groupIntro.add(this.movableNumbers[i]);
        }	
	},
	
    criarTijolos:function(nivel){
		//console.log("aqui "+nivel)
        var x = 250;
        var posX = 400;
        var posY = 500;
        var cont=0;
		
        for(var i=0; i<this.arrayNumeros.length; i++){
            if(i%2==0) {y=300;} else{y=350;}
            var teste = this.itensVazios.indexOf(this.arrayNumeros[i]);
            if(teste!=-1)
            {
				// vazios 
				this.ItensVazios[cont]= this.createSprite(this.arrayNumeros[i],this.arrayNumeros[i],x,y,0);
                this.groupLevel[nivel].add(this.ItensVazios[cont]);
                
                var auxX = 5;
                var auxY = this.ItensVazios[cont].height/4;

                this.drawItensVazios[cont] = this.createSprite("marca",this.arrayNumeros[i],x+auxX,y+auxY,0);
                this.drawItensVazios[cont].alpha = 0;
                this.groupLevel[nivel].add(this.drawItensVazios[cont]);

				cont++;
            }
            else{
                var sprite = this.createSprite(this.arrayNumeros[i],this.arrayNumeros[i],x,y,2);
				this.groupLevel[nivel].add(sprite);
            }

            x+=70;
        }
        for(var i=0; i<this.itensVazios.length; i++){
           this.movableNumbers[i] =  this.createSprite(this.itensVazios[i],this.itensVazios[i],posX,posY);
           this.movableNumbers[i].frame = 2;
           this.validar[this.movableNumbers[i].name] = false;
		   this.posicaoMovableNumbers[this.movableNumbers[i].name] = new Array(this.movableNumbers[i].x,this.movableNumbers[i].y);
		   this.groupLevel[nivel].add(this.movableNumbers[i]);
           posX+=70;
        }
		
		this.createDelayTime(500, function() {
		  //console.log(this.validar);
          this.inputMovableNumbers(1);
		
		});
    },

    inputMovableNumbers:function(tipo)
    {
        if(tipo==1)
        {
            for(var i = 0; i < this.movableNumbers.length; i++){ 
                this.movableNumbers[i].inputEnabled = true;
                this.movableNumbers[i].input.enableDrag(false, true);
                this.movableNumbers[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.movableNumbers[i].events.onDragStop.add(this.onStopDragNumber, this);
            }
        }
        if(tipo==2)
        {

            for(var i = 0; i < this.movableNumbers.length; i++){ 

                this.movableNumbers[i].inputEnabled = false;
                this.movableNumbers[i].input.reset();
            }
            

        }
    },

    onStartDragNumber: function(elem) {
        elem.frame = 1;
        //console.log(elem);
        this.world.bringToTop(elem);
        this.initialDragPoint = new Phaser.Point(elem.x,elem.y);
		//console.log("inicial ponto x -> "+elem.x);
		//console.log("inicial ponto y -> "+elem.y);
        
    },

    habilitarFisica:function()
    {
        //console.log(this.validar);

        for(var i = 0; i <this.drawItensVazios.length; i++)
        {
            var nome = this.drawItensVazios[i].name;
            if(!this.validar[nome])
            {
                //console.log(" fisica --> "+ nome);
                this.game.physics.enable(this.drawItensVazios[i], Phaser.Physics.ARCADE);
            }
            else
            {
                //console.log(" não fisica --> "+ nome);
            }
        }
    },

    testOverLap:function(elem)
    {
        for(var i = 0; i <this.drawItensVazios.length; i++){

            var nome = this.drawItensVazios[i].name;
            //console.log(" comparacao --> "+elem.name +" == "+ nome);
    
            var x1 = this.ItensVazios[i].x;
            //var x2 = this.drawItensVazios[i].x+this.drawItensVazios[i].width;
            var y1 = this.ItensVazios[i].y;
            //var y2 = this.drawItensVazios[i].y+this.drawItensVazios[i].height;
            //var auxy1 = y1-30;
            //var auxy2 = y2+30;

            if ((!this.validar[nome]) && (this.game.physics.arcade.overlap (elem,this.drawItensVazios[i])) ) {
                //console.log("---- overlap ---");
                //console.log(elem.name);
                if(elem.name==nome)
                {
                    ////console.log("no lugar");
                    if(this.numAcertos!=0)
                    {
                        //console.log(elem.name);
                        
                        this.validar[elem.name] = true;
                        this.elemLugar = elem.name;
                        this.numAcertos--;
                        elem.x=x1;
                        elem.y=y1;
                        elem.frame=2;
                        elem.inputEnabled = false;
                        elem.input.reset();
                        this.sound.play("hitAcerto");
                        
                        //console.log("certo "+this.validar[elem.name]);
                        
                        this.verifyCompleted();


                    }
                    return; 
                }
                else
                {
                    if(!this.validar[elem.name])
                    {
                        var x =this.posicaoMovableNumbers[elem.name][0];
                        var y =this.posicaoMovableNumbers[elem.name][1];
                        this.add.tween(elem).to({x:x,y:y},100, Phaser.Easing.Linear.None, true,200).onComplete.add(function() {
                            this.elemLugar = elem.name;
                            elem.frame=2;
                            elem.inputEnabled = false;
                            elem.input.reset();
                            this.sound.play("hitErro");
                            this.inputMovableNumbers(2);
                            //console.log(elem.name);
                            //console.log("errado "+this.validar[elem.name]);
                            this.wrongAnswer();
                        
                        }, this);
                    }
                    return; 
                    
                }

                //console.log("---- fim overlap ---");
            } 


        }


    },
	
	onStopDragNumber: function(elem, pointer) {
   
        this.game.physics.arcade.enable(elem); // habilitando a fisica no elemento 
        this.habilitarFisica(); // habilitar fisica nos elementos vazios 
        this.testOverLap(elem);// testando overlap 

        // para voltar ao seu lugar caso colocado em qualquer lugar do cenário 
        if(this.elemLugar!=elem.name)
        {
            var x =this.posicaoMovableNumbers[elem.name][0];
            var y =this.posicaoMovableNumbers[elem.name][1];
            this.add.tween(elem).to({x:x,y:y},100, Phaser.Easing.Linear.None, true,200).onComplete.add(function() {
                this.sound.play("hitErro");
                elem.frame=2;
                
            }, this); 
        }

        this.elemLugar=false;
    },

	verifyCompleted: function() {
        if(this.numAcertos <= 0) {       
            this.createDelayTime(100, function() {this.changeFredHappy();
                this.rightAnswer();
            });
            
        } else {
          
            this.stopSfx();
            console.log("need more " + this.numAcertos);
        }
    },
	changeFredHappy:function(){
		////console.log('fred!!!');
        this.fred.loadTexture('fred_happy', 0);
        this.fred.x = 741;
        this.fred.y = 180;
		var anim  = this.fred.animations.add('fred_happy');
		
        anim.onComplete.add(function() {
            this.changeFredIdlle();
        }, this);

        anim.play(15);


	},

    changeFredIdlle:function(){
        //this.fred.animations.stop(null, true);
        ////console.log('fred!!!');
        this.fred.loadTexture('fred_idle', 0);
        this.fred.x = 781;
        this.fred.y = 245;
        this.fred.animations.add('fred_idle');
        this.fred.animations.play('fred_idle', 15, true);
    },
	
	// FIM - D70A01
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {

        this.add.sprite( -360, -100, 'background');
        this.add.sprite( -300, -130, 'background1');
		this.fred = this.add.sprite( 781, 245, 'fred_idle',1);
		this.fred.animations.add('fred_idle');
		this.fred.animations.play('fred_idle', 15, true);
        
    },
	
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		this.criarTijolosTutorial();
		
		this.arrow = this.add.sprite(725,415, "arrow");
        this.arrow.scale.set(0.3,0.3);
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha=0;
        this.groupIntro.add(this.arrow);
		
		// animação de click 
        this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.groupIntro.add(this.click);

         // comprtamento 1 do mouse
		 
		this.createDelayTime(6000, function() {  
			this.add.tween(this.arrow).to({alpha:1}, 400, Phaser.Easing.Linear.None, true, 800);
			this.add.tween(this.arrow.scale).to({x:1,y:1}, 400, Phaser.Easing.Linear.None, true, 800).onComplete.add(function() {this.efeitoMouse(1);}, this);
        });
		//.onComplete.add(function() {elem.frame=2;}, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		this.createDelayTime(100, function() {
            //this.changeFredHappy();
			this.resetLevel(0);
            this.add.tween(this.groupIntro).to({alpha: 0},100, Phaser.Easing.Linear.None, true, 200).onComplete.add(this.initGame, this);
        });  
    },

    // resumo inicial
    showTextResumo: function() {

        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP1");
                }
                this.initLevel1((this.isWrong)?500:5000);
            break;
            case 2:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP2");
                }
                this.initLevel2(500);
            break;
            case 3:
                if(!this.isWrong) {
                    this.currentSound = this.sound.play("soundP3");
                }
                this.initLevel3(500);
            break;
        }

        this.isWrong = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 30, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;
        
        if(this.isWrong) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },
    hideQuestion: function() {

    },

    stopSfx: function() {
        if(this.currentSound != null) {
            this.currentSound.stop();
        } 

    },

    
	
    

    initLevel1: function(tempo) {

		console.log("****** NIVEL 1 ******");
		this.showQuestion(1);
		this.nivel = this.currentLevel;
		this.groupLevel[this.currentLevel] = this.add.group();
		//this.groupIntro = this.add.group();
		
		
		this.itens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        this.numLevelItens = 4;
        this.numVazios = 3;
		this.numAcertos= 3;
        this.numCheios = this.numLevelItens-this.numVazios;
        var primeiro_numero = parseInt(this.createRandomItens(this.itens,1));
        var fim_sequencia = parseInt(primeiro_numero) + (this.numLevelItens-1);
        this.arrayNumeros =[];
        var count = 0;
		
        for(var i=primeiro_numero; i<=fim_sequencia;i++)
        {
            //this.arrayNumeros[count] = new Array(2);
            this.arrayNumeros[count]= i;
            count++;
			
        }
		
        this.temp_array =  this.arrayNumeros.slice();
        this.itensVazios = [];
		
        for(var i=0; i<this.numVazios; i++){

            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
            this.retirarArrayElemento(item); 
            this.itensVazios.push(item);
			
        }
		//console.log("tempo: "+tempo);
		this.createDelayTime(tempo, function() {
                this.criarTijolos(this.nivel);
		}); 
	
    },

    initLevel2: function(tempo) {
		console.log("****** NIVEL 2 ******");
		this.showQuestion(2);
		this.nivel = this.currentLevel;
		this.groupLevel[this.currentLevel] = this.add.group();
		//this.groupIntro = this.add.group();
		
		
		this.itens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        this.numLevelItens = 5;
        this.numVazios = 4;
		this.numAcertos= 4;
        this.numCheios = this.numLevelItens-this.numVazios;
        var primeiro_numero = parseInt(this.createRandomItens(this.itens,1));
        var fim_sequencia = parseInt(primeiro_numero) + (this.numLevelItens-1);
        this.arrayNumeros =[];
        var count = 0;
		
        for(var i=primeiro_numero; i<=fim_sequencia;i++)
        {
            //this.arrayNumeros[count] = new Array(2);
            this.arrayNumeros[count]= i;
            count++;
			
        }
		
        this.temp_array =  this.arrayNumeros.slice();
        this.itensVazios = [];
		
        for(var i=0; i<this.numVazios; i++){

            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
            this.retirarArrayElemento(item); 
            this.itensVazios.push(item);
			
        }
		//console.log("tempo: "+tempo);
		this.createDelayTime(tempo, function() {
                this.criarTijolos(this.nivel);
		}); 
       
    },

    initLevel3: function(tempo) {
		console.log("****** NIVEL 3 ******");
		this.showQuestion(3);
		this.nivel = this.currentLevel;
		this.groupLevel[this.currentLevel] = this.add.group();
		//this.groupIntro = this.add.group();
		
		
		this.itens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        this.numLevelItens = 7;
        this.numVazios = 5;
		this.numAcertos= 5;
        this.numCheios = this.numLevelItens-this.numVazios;
        var primeiro_numero = parseInt(this.createRandomItens(this.itens,1));
        var fim_sequencia = parseInt(primeiro_numero) + (this.numLevelItens-1);
        this.arrayNumeros =[];
        var count = 0;
		
        for(var i=primeiro_numero; i<=fim_sequencia;i++)
        {
            //this.arrayNumeros[count] = new Array(2);
            this.arrayNumeros[count]= i;
            count++;
			
        }
		
        this.temp_array =  this.arrayNumeros.slice();
        this.itensVazios = [];
		
        for(var i=0; i<this.numVazios; i++){

            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
            this.retirarArrayElemento(item); 
            this.itensVazios.push(item);
			
        }
		//console.log("tempo: "+tempo);
		this.createDelayTime(tempo, function() {
                this.criarTijolos(this.nivel);
		}); 
    },

	rightAnswer: function() { 

        console.log("rightAnswer - 10 ");
        this.inputMovableNumbers(2);
        this.qtdErros = 0;
		this.corrects++;
        this.saveCorrect();
        //this.addPoints();
		var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
    },
    
    showDica:function()
    {
        if(this.dica){this.somDica = this.sound.play("soundDica");}
        //if(this.somDica.isPlaying){this.dica = false;}
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        var nivel=this.currentLevel;
		if(this.currentLevel > 1) {
            this.currentLevel--;
        }
	
		this.lives--;
		this.errors--;
	
        switch(this.lives) {
            case 1: // mostra dica 1
				this.resetLevel(nivel);
				this.hideLevel(function(){});
				this.createDelayTime(1000, function() {  
                    this.dica = true;  
                    this.showDica();
                });
                
                this.createDelayTime(1000, function() {    
                    this.dica = false;
                    this.createDelayTime(500, function() {this.hideAndShowLevel(true);}); // para o próximo nível
                }); // para o próximo nível 
            break;
            case 0: // toca som de resumo
				this.resetLevel(nivel);
				this.lives = 0;
                this.hideLevel(function(){});
                if(!this.dica){this.showResumo();}			
            break;
            default: // game over
            break;
        }
		this.updateLivesText();
        
    },
    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
