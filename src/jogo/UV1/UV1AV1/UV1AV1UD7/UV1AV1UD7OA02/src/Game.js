
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
        this.TEMPO_INTRO = 5100;
		this.TEMPO_INTRO2 = 13500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 5000;
        this.TEMPO_RESUMO = 17500;
        this.SOUND_VITORIA = 5500;
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
		this.errorThreshold = 0;
		;this.points = 0;
        this.showCallToAction = false;

		this.dragElem;
		this.dragOn = false;
		this.dragElemDestroy = false;

        this.nameShadows = [];
        this.nameTexts = [];
		this.background;
		this.soundWord;
		this.letters = [];
		this.words = [];
		this.wordsCorrect = 0;
		this.changingLevel = false;
		
		this.randomLetter;
		this.tutorialText;
		this.mainBubbles = [];

        this.tempo = 0; // para inicializar nivel no tempo certo após o audio.
        this.errou = false;// para não fazer o tempo em caso de repetiçã de nivel.
        this.isWrong = false;
        this.countBubbles = 0; // contador das bolhas 
		
		this.robo;
		
		this.levelAudio;

        this.createScene();

        this.showIntro();
        this.resetRandomLetter();
        this.L = [];// array das imagens com a letra l 
        this.S = [];// array das imagens com a letra s
        this.Z = [];// array das imagens com a letra z

        this.posX =0;
        this.posY =0;

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //this.music = this.sound.play('backgroundMusic', 0.75, true);
		//this.music.loop = true;

	},



    /*********************************************************************************************************************/
    /* -INICIO-   HUD E BOTOES */


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

        this.livesTextShadow = this.add.bitmapText(111,-100, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.livesText = this.add.bitmapText(110,-100, "JandaManateeSolid", this.lives.toString(), 18);

        this.pointsTextShadow = this.add.bitmapText(81,82, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.pointsText = this.add.bitmapText(80,81, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);

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
	onButtonClick: function(elem) {
        //console.log("onButtonClick");
    	if(!this.dragElemDestroy){
            this.posX =elem.x;
            this.posY =elem.y;
			this.dragElem = elem;
			//console.log("click!");
			this.dragOn = true;
			this.drawFront(true);
		}
	},
	onButtonOver: function(elem) {
	
	},
	drawFront: function(bool){
		if(bool){
			this.groupFront.add(this.dragElem);	
		} else {
			this.groupLevel.add(this.dragElem);
			this.dragElem.inputEnabled = true;
		}
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
		
		this.robo = this.createAnimation( 800, 200, "robot_idle", 1, 1);
		this.robo.alpha = 0;
		
		this.add.tween(this.robo).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

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

        this.tutorialText = this.add.sprite( this.world.centerX+60, 110, 'initialText');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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
		this.add.tween(this.groupLevel).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ this.groupLevel.removeAll(); }, this);
		this.add.tween(this.groupFront).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ this.groupFront.removeAll(); }, this);
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

        console.log('-------------------------- ' +_medalhas);

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
                    var medalha = this.add.sprite(eixoX += 200,360,"medalha"+_medalhas[i]);
                    medalha.alpha = 0
                    medalha.scale.set(0);
                    
                    this.add.tween(medalha).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, tempo=tempo + 250);
                    this.add.tween(medalha.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, tempo=tempo + 500);     
                }
                else{
                    var medalha = this.add.sprite(eixoX,360,"medalha"+_medalhas[i]);
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
	    //this.resetRandomLetter();
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(
            function(){
                this.initPalavras();
                this.bubblesInit();
                this.showNextLevel();
            },
             this);
        
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


	bubblesInit:function(){
        //console.log("bubblesInit");

        this.posX =0;
        this.posY =0;

        this.groupMainBubbles = this.add.group();
        
        this.mainBubbles[0] = this.createButton(370, this.world.centerY+60, "L", 100, false, this.world.centerY+45, this.world.centerY + 75);
        this.mainBubbles[1] = this.createButton(500, this.world.centerY+30, "S", 100, false, this.world.centerY + 15, this.world.centerY + 45);
        this.mainBubbles[2] = this.createButton(630, this.world.centerY+60, "Z", 100, false, this.world.centerY+45, this.world.centerY + 75);
        
        this.groupMainBubbles.add( this.mainBubbles[0] );
        this.groupMainBubbles.add( this.mainBubbles[1] );
        this.groupMainBubbles.add( this.mainBubbles[2] );

        this.bubblesMovement(this.mainBubbles[0]);
        this.bubblesMovement(this.mainBubbles[1]);
        this.bubblesMovement(this.mainBubbles[2]);
    },

	bubblesMovement:function(obj) {
		this.randomAnim = this.rnd.integerInRange(1200,2000);
		this.add.tween(obj).to({y: obj.animUp}, this.randomAnim, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.bubblesMovementDown(obj)},this);
	},
	
	bubblesMovementDown:function(obj) {
			this.randomAnim = this.rnd.integerInRange(1200,2000);
			this.add.tween(obj).to({y: obj.animDown}, this.randomAnim, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.bubblesMovement(obj)},this);
	},
	
    // level-fixa
    gotoNextLevel: function() {

        this.currentLevel++;
		this.changingLevel = true;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    

    // fixa
    hideAndShowLevel: function(isWrong) {
        //console.log("hideAndShowLevel");
        this.hideLevel(function() {
            //console.log(isWrong);
            if(this.corrects < this.TOTAL_LEVEL) {
                if(isWrong) {
					
					this.createDelayTime( 4800, function(){
						//this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.showNextLevel()}, this);
                        this.isWrong = true;
                        this.showNextLevel();
					});

                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
					this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
					this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
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

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },
    resetRandomLetter: function() { // mary
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },


    resetLevel:function(){
        this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.groupLevel.removeAll()}, this);
        this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.groupFront.removeAll()}, this);
    },

    retirarArrayElemento:function(temp_array,elem){

        switch(temp_array){
            case "L":
                var index = this.L.indexOf(elem);
                for (i=index; i<this.L.length-1; i++)
                {
                    this.L[i] = this.L[i+1];
                }
                this.L.pop();  
            break;
            case "S":
                var index = this.S.indexOf(elem);
                for (i=index; i<this.S.length-1; i++)
                {
                    this.S[i] = this.S[i+1];
                }
                this.S.pop();  
            break;
            case "Z":
                var index = this.Z.indexOf(elem);
                for (i=index; i<this.Z.length-1; i++)
                {
                    this.Z[i] = this.Z[i+1];
                }
                this.Z.pop();  
            break;
        }
        
    },

    RandomItem: function(temp_array) {

        //console.log("getRandomUniqueItem");
        switch(temp_array){
            case "L":
                var n = this.rnd.integerInRange(0,this.L.length-1);
                //console.log("L--> "+this.L[n]);
                return this.L[n];
            break;
            case "S":
                var n = this.rnd.integerInRange(0,this.S.length-1);
                //console.log("S--> "+this.S[n]);
                return this.S[n];
            break;
            case "Z":
                var n = this.rnd.integerInRange(0,this.Z.length-1);
                //console.log("Z--> "+this.Z[n]);
                return this.Z[n];
            break;
        }
    },
    
    


    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.background = this.add.sprite( -460, -140, 'background');
        this.background.height = 800;
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        //console.log("showLiveTutorial");
		
		this.tutorialText = this.add.sprite( this.world.centerX, 110, 'initialText2');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.initPalavras();

        this.add.tween(this.tutorialText).to({alpha: 1},500, Phaser.Easing.Linear.None, true, 100);

        this.groupIntro.add(this.tutorialText);
		
        this.buttons = [];
        this.buttons[0] = this.createButton(370, this.world.centerY+60, "L", 100, false, this.world.centerY+45, this.world.centerY + 75);
		this.buttons[1] = this.createButton(500, this.world.centerY+30, "S", 100, false, this.world.centerY + 15, this.world.centerY + 45);
		this.buttons[2] = this.createButton(630, this.world.centerY+60, "Z", 100, false, this.world.centerY+45, this.world.centerY + 75);	
		this.buttons[3] = this.createButton(this.world.centerX, this.world.centerY+200, "Z12", 100, false, null, null, 1);
		this.buttons[4] = this.createButton(this.world.centerX - 100, this.world.centerY+200, "S", 100, false, null, null, 1);
		this.buttons[5] = this.createButton(this.world.centerX + 100, this.world.centerY+200, "L", 100, false, null, null, 1);
		this.buttons[3].alpha = 0;
		this.buttons[4].alpha = 0;
		this.buttons[5].alpha = 0;

		this.bubblesMovement(this.buttons[0]);
		this.bubblesMovement(this.buttons[1]);
		this.bubblesMovement(this.buttons[2]);		
		
		this.groupIntro.add(this.buttons[1]);
        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[2]);
		this.groupIntro.add(this.buttons[3]);
		this.groupIntro.add(this.buttons[4]);
        this.groupIntro.add(this.buttons[5]);
		
		this.createDelayTime( 4800, function() {
            
			this.add.tween(this.buttons[3]).to({alpha: 1}, 400, Phaser.Easing.Linear.None, true)
			this.add.tween(this.buttons[4]).to({alpha: 1}, 400, Phaser.Easing.Linear.None, true)
			this.add.tween(this.buttons[5]).to({alpha: 1}, 400, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this)

        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		
		this.createDelayTime( 11000, function(){
			this.add.tween(this.tutorialPlacar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
			this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
			this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
			this.arrow.anchor.set(0.5,0.5);
			this.groupIntro.add(this.arrow);
			this.add.tween(this.arrow).to({x: this.world.centerX+10, y: this.world.centerY+180}, 1200, Phaser.Easing.Linear.None, true);
		},this);

        //this.buttons[0].alpha = 0.7;
		
        // remover click
		
		this.createDelayTime( 13500, function(){
			
			var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
			click.animations.add('idle', null, 18, true);
			click.animations.play('idle');
			this.groupIntro.add(click);
			
			this.createDelayTime( 2400, function() {
				click.alpha = 0;
				click.destroy();
			});
		});
		
		this.createDelayTime( 21000, function() {
            this.add.tween(this.buttons[3]).to({x: this.world.centerX+120, y: this.world.centerY+70}, 750, Phaser.Easing.Linear.None, true);
			this.add.tween(this.arrow).to({x: this.world.centerX +140, y: this.world.centerY+30}, 750, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime( 22500, function() {
           this.add.tween(this.arrow).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
        });

		/*this.createDelayTime( 4000, function() {
           this.add.tween(this.buttons[0]).to({x: this.world.centerX - 12, y: this.world.centerY+215}, 750, Phaser.Easing.Linear.None, true);
        });
		this.createDelayTime( 4800, function() {
           this.add.tween(this.buttons[4]).to({x: this.world.centerX + 115, y: this.world.centerY+215}, 750, Phaser.Easing.Linear.None, true);
        });
		this.createDelayTime( 7500, function() {
           this.buttons[0].frame = 1;
		   this.buttons[2].frame = 1;
		   this.buttons[4].frame = 1;
        });*/
        // remover tudo
		
		this.createDelayTime( 23500, function() {

            this.add.tween(this.buttons[3]).to({alpha: 0}, 550, Phaser.Easing.Linear.None, true);
			this.add.tween(this.buttons[2].scale).to({x: 1.2, y:1.2}, 550, Phaser.Easing.Linear.None, true);

        });
		
        this.createDelayTime( 26500, function() {

            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(this.buttons[3]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[4]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(this.buttons[5]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        this.tutorialText = this.add.sprite( this.world.centerX, 90, 'imgResumo');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(this.tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

    },

    drawPoint:function(cor,x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(cor,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();

        //graphics.moveTo(0, 0);
        //graphics.lineStyle(5, 0xFFFFFF, 1);
        //graphics.lineTo(x, y);
    },
	
	checkWords: function(){
		
		if(this.mainBubbles[0] != null & this.mainBubbles[1] != null && this.mainBubbles[2] != null){

            x1 = this.input.mousePointer.x-10;
            x2 = this.input.mousePointer.x+10;

            y1 = this.input.mousePointer.y-10;
            y2 = this.input.mousePointer.y+10;

            b1x1 = this.mainBubbles[0].x - 65;
            b1x2 = this.mainBubbles[0].x + this.mainBubbles[0].width - 15;

            b2x1 = this.mainBubbles[1].x - 65;
            b2x2 = this.mainBubbles[1].x + this.mainBubbles[0].width - 15;

            b3x1 = this.mainBubbles[2].x - 65;
            b3x2 = this.mainBubbles[2].x + this.mainBubbles[0].width - 15;

            b1y1 = this.mainBubbles[0].y - 140;
            b1y2 = this.mainBubbles[0].y + 40;

            b2y1 = this.mainBubbles[1].y - 140;
            b2y2 = this.mainBubbles[1].y + 40;

            b3y1 = this.mainBubbles[2].y - 140;
            b3y2 = this.mainBubbles[2].y + 40;


            

            
                
			if(this.game.input.activePointer.isDown && this.dragElem != null && this.dragOn){
                
				this.dragElem.x = this.input.mousePointer.x;
				this.dragElem.y = this.input.mousePointer.y + 50;	
				
			} //else if( this.input.mousePointer.x >= this.mainBubbles[0].x - 40 && this.input.mousePointer.x <= (this.mainBubbles[0].x + this.mainBubbles[0].width - 30) && this.input.mousePointer.y >= this.mainBubbles[0].y - 100 && this.input.mousePointer.y <= (this.mainBubbles[0].y + 20) && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				else if( (x1 >= b1x1) && (x2 <= (b1x2)) && (y1>= (b1y1)) && (y2 <= (b1y2))&& this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
                console.log(0, this.mainBubbles[0].group, this.dragElem.group);

                

				if(this.mainBubbles[0].group == this.dragElem.group){

                    //this.drawPoint(0xffffff,b1x1,b1y1);
                    //this.drawPoint(0x000000,b1x1,b1y2);

                    //this.drawPoint(0xffffff,b1x2,b1y1);
                    //this.drawPoint(0x000000,b1x2,b1y2);

                    //this.drawPoint(0x0000ff,x1,y1);
                    //this.drawPoint(0xff0000,x1,y2);

                    //this.drawPoint(0x00ffff,x2,y1);
                    //this.drawPoint(0xffff00,x2,y2);
				
					this.dragElemDestroy = true;
					this.sound.play('hitAcerto');
					this.wordsCorrect += 1;
                    this.countBubbles +=1;
					this.mainBubbles[0].sizeIncrease += 0.08;
					this.add.tween(this.mainBubbles[0].scale).to({x:this.mainBubbles[0].sizeIncrease,y:this.mainBubbles[0].sizeIncrease}, 500, Phaser.Easing.Linear.None, true, 100);
					this.add.tween(this.dragElem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100).onComplete.add(function(){ 
						this.dragElem.destroy();
						this.dragElem = null;
						this.dragElemDestroy = false;
					},this);
					this.dragOn = false;
					
				} else {
					this.errorThreshold += 1;
                    console.log('hitErro', this.errorThreshold);

                    //this.drawPoint(0xffffff,b1x1,b1y1);
                    //this.drawPoint(0x000000,b1x1,b1y2);

                    //this.drawPoint(0xffffff,b1x2,b1y1);
                    //this.drawPoint(0x000000,b1x2,b1y2);

                    //this.drawPoint(0x0000ff,x1,y1);
                    //this.drawPoint(0xff0000,x1,y2);

                    //this.drawPoint(0x00ffff,x2,y1);
                    //this.drawPoint(0xffff00,x2,y2);

					this.sound.play('hitErro');
                    this.countBubbles +=1;
                    // para sumir 
                    this.add.tween(this.dragElem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100).onComplete.add(function(){ 
                        this.dragElem.destroy();
                        this.dragElem = null;
                        this.dragElemDestroy = false;
                    },this);
                    // 

					this.dragOn = false;
				}
				
			} //else if( this.input.mousePointer.x >= this.mainBubbles[1].x - 40 && this.input.mousePointer.x <= (this.mainBubbles[1].x + this.mainBubbles[1].width - 30) && this.input.mousePointer.y >= this.mainBubbles[1].y - 100 && this.input.mousePointer.y <= (this.mainBubbles[1].y + 20) && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				else if( (x1 >= b2x1) && (x2 <= (b2x2))&& (y1 >= (b2y1)) && (y2 <= (b2y2)) && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
                console.log(1, this.mainBubbles[1].group, this.dragElem.group);
				if(this.mainBubbles[1].group == this.dragElem.group){

                    //this.drawPoint(0xffffff,b2x1,b2y1);
                    //this.drawPoint(0x000000,b2x1,b2y2);

                    //this.drawPoint(0xffffff,b2x2,b2y1);
                    //this.drawPoint(0x000000,b2x2,b2y2);

                    //this.drawPoint(0x0000ff,x1,y1);
                    //this.drawPoint(0xff0000,x1,y2);

                    //this.drawPoint(0x00ffff,x2,y1);
                    //this.drawPoint(0xffff00,x2,y2);
				
					this.dragElemDestroy = true;
					this.sound.play('hitAcerto');
					this.wordsCorrect += 1;
                    this.countBubbles +=1;
					this.mainBubbles[1].sizeIncrease += 0.08;
					this.add.tween(this.mainBubbles[1].scale).to({x:this.mainBubbles[1].sizeIncrease,y:this.mainBubbles[1].sizeIncrease}, 500, Phaser.Easing.Linear.None, true, 100);
					this.add.tween(this.dragElem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100).onComplete.add(function(){ 
						this.dragElem.destroy();
						this.dragElem = null;
						this.dragElemDestroy = false;
					},this);
					this.dragOn = false;
					
				} else {
					this.errorThreshold += 1;
                    console.log('hitErro', this.errorThreshold);

                    //this.drawPoint(0xffffff,b2x1,b2y1);
                    //this.drawPoint(0x000000,b2x1,b2y2);

                    //this.drawPoint(0xffffff,b2x2,b2y1);
                    //this.drawPoint(0x000000,b2x2,b2y2);

                    //this.drawPoint(0x0000ff,x1,y1);
                    //this.drawPoint(0xff0000,x1,y2);

                    //this.drawPoint(0x00ffff,x2,y1);
                    //this.drawPoint(0xffff00,x2,y2);

					this.sound.play('hitErro');
                    this.countBubbles +=1;

                    // para sumir 
                    this.add.tween(this.dragElem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100).onComplete.add(function(){ 
                        this.dragElem.destroy();
                        this.dragElem = null;
                        this.dragElemDestroy = false;
                    },this);
                    // 

					this.dragOn = false;
				}
				
			} //else if( this.input.mousePointer.x >= this.mainBubbles[2].x - 40 && this.input.mousePointer.x <= (this.mainBubbles[2].x + this.mainBubbles[2].width - 30) && this.input.mousePointer.y >= this.mainBubbles[2].y - 100 && this.input.mousePointer.y <= (this.mainBubbles[2].y + 20) && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
				else if( (x1 >= (b3x1)) && (x2 <= (b3x2)) && (y1 >= (b3y1)) && (y2 <= (b3y2)) && this.dragOn && !this.game.input.activePointer.isDown && this.dragElem != null){
                console.log(2, this.mainBubbles[2].group, this.dragElem.group);
				if(this.mainBubbles[2].group == this.dragElem.group){
					
					this.dragElemDestroy = true;
					this.sound.play('hitAcerto');

                    //this.drawPoint(0xffffff,b3x1,b3y1);
                    //this.drawPoint(0x000000,b3x1,b3y2);

                    //this.drawPoint(0xffffff,b3x2,b3y1);
                    //this.drawPoint(0x000000,b3x2,b3y2);

                    //this.drawPoint(0x0000ff,x1,y1);
                    //this.drawPoint(0xff0000,x1,y2);

                    //this.drawPoint(0x00ffff,x2,y1);
                    //this.drawPoint(0xffff00,x2,y2);

					this.wordsCorrect += 1;
                    this.countBubbles +=1;

					this.mainBubbles[2].sizeIncrease += 0.08;
					this.add.tween(this.mainBubbles[2].scale).to({x:this.mainBubbles[2].sizeIncrease,y:this.mainBubbles[2].sizeIncrease}, 500, Phaser.Easing.Linear.None, true, 100);
					this.add.tween(this.dragElem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100).onComplete.add(function(){ 
						this.dragElem.destroy();
						this.dragElem = null;
						this.dragElemDestroy = false;
					},this);
					this.dragOn = false;
					
				} else {
					this.errorThreshold += 1;
                    console.log('hitErro', this.errorThreshold);

                    //this.drawPoint(0xffffff,b3x1,b3y1);
                    //this.drawPoint(0x000000,b3x1,b3y2);

                    //this.drawPoint(0xffffff,b3x2,b3y1);
                    //this.drawPoint(0x000000,b3x2,b3y2);

                    //this.drawPoint(0x0000ff,x1,y1);
                    //this.drawPoint(0xff0000,x1,y2);

                    //this.drawPoint(0x00ffff,x2,y1);
                    //this.drawPoint(0xffff00,x2,y2);


					this.sound.play('hitErro');
                    this.countBubbles +=1;

                    // para sumir 
                    this.add.tween(this.dragElem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100).onComplete.add(function(){ 
                        this.dragElem.destroy();
                        this.dragElem = null;
                        this.dragElemDestroy = false;
                    },this);
                    // 

					this.dragOn = false;
				}
				
			} else if( this.dragOn && this.dragElem != null) {
                //console.log("else if ultimo");
                this.sound.play('hitErro');
                this.dragElem.x =  this.posX;
                this.dragElem.y =  this.posY; 
				this.drawFront(false);
				this.dragElem = null;
				this.dragOn = false;

               
				
			}
		}	
	},
	
	livesCondition: function(){
		switch(this.lives) {
            case 1: // mostra dica 1
				if(this.currentLevel >= 2){ 
					this.currentLevel--;
					//console.log("level atual: "+this.currentLevel);
				}
				this.sound.play('hitErro');
				this.updateLivesText();
                this.resetLevel();
                this.hideLevel();
                this.createDelayTime(100, function() {this.sound.play("soundDica");}, this);
                this.createDelayTime(4100, function() {this.hideAndShowLevel(true);}, this);
				
            break;
            case 0: // toca som de resumo
				this.sound.play('hitErro');
				this.updateLivesText();
				//this.sound.stopAll();
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
            default: // game over
            break;
        }
		this.wordsCorrect = 0;
		this.errorThreshold = 0;
	},

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
		// Cria os botoes principais
		
        switch(this.currentLevel) {
            case 1:
                if(!this.isWrong) {
				  //console.log("corrects: "+this.corrects);
                  this.levelAudio = this.sound.play("soundP1");
                }
                this.initLevel1();
            break;
            case 2:
                if(!this.isWrong) {
				   //console.log("corrects: "+this.corrects);
                    this.levelAudio = this.sound.play("soundP2");
                    if(this.groupLevel != null) {
                        this.groupLevel.removeAll();
                    }
                    if(this.groupFront != null) {
				        this.groupFront.removeAll();
                    }
                }
                this.initLevel2();
            break;
            case 3:
                if(!this.isWrong) {
					//console.log("corrects: "+this.corrects);
                    this.levelAudio = this.sound.play("soundP3");
					if(this.groupLevel != null) {
                        this.groupLevel.removeAll();
                    }
                    if(this.groupFront != null) {
                        this.groupFront.removeAll();
                    }
                }
                this.initLevel3();
            break;
        }
		this.changingLevel = false;
        this.isWrong = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 50, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.isWrong) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initPalavras:function(){
        this.L = [1,2,3,4,5,6,7,8,9,10,11,12];// array das imagens com a letra l
        this.S = [1,2,3,4,5,6,7,8,9,10,11,12];// array das imagens com a letra l
        this.Z = [1,2,3,4,5,6,7,8,9,10,11,12];// array das imagens com a letra l
       
    },


    initLevel1: function() {
		
        this.showQuestion(1);
        this.initPalavras();

        console.log("initLevel1");
        
        if(this.errou){this.tempo = 500;}else{this.tempo = 4000;} // tempo do audio 
        //console.log("tempo--> " + this.tempo);

        this.createDelayTime(this.tempo, function(){
            
			this.groupLevel = this.add.group();
			
			// fixo - criar sistema de botoes dentro do array
			this.buttonsLvl1 = [];
			
			this.buttonsLvl1[0] = this.createButton( 600, 400, "S", 100, true, null, null, 1);
			this.buttonsLvl1[0].alpha = 0;
			this.buttonsLvl1[1] = this.createButton( 600, 400, "L", 100, true, null, null, 1);
			this.buttonsLvl1[1].alpha = 0;
			this.buttonsLvl1[2] = this.createButton( 600, 400, "Z", 100, true, null, null, 1);
			this.buttonsLvl1[2].alpha = 0;
				
			for(var i=0; i<=3; i++){
				var randAux = this.rnd.integerInRange(0,2);
				var randAux2 = this.rnd.integerInRange(0,2);
				
				var btnAux = this.buttonsLvl1[randAux];
				var btnAux2 = this.buttonsLvl1[randAux2];
				
				this.buttonsLvl1[randAux] = btnAux2;
				this.buttonsLvl1[randAux2] = btnAux;
			}
				
			this.groupLevel.add(this.buttonsLvl1[1]);
			this.groupLevel.add(this.buttonsLvl1[0]);
			this.groupLevel.add(this.buttonsLvl1[2]);
			
			this.groupLevel.xy(0, this.world.centerX +100, this.world.centerY + 200);
			this.groupLevel.xy(1, this.world.centerX, this.world.centerY + 200);
			this.groupLevel.xy(2, this.world.centerX -100, this.world.centerY + 200);
			 
			this.createDelayTime(100, function() {
			 
				this.add.tween(this.buttonsLvl1[0]).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[1]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[2]).to({alpha: 1}, 750, Phaser.Easing.Linear.None, true);
	
			}, this);
			this.groupFront = this.add.group();
		});

        this.errou = false;
    },

   

    initLevel2: function() {
		this.showQuestion(2);
        this.initPalavras();

        console.log("initLevel2");

        if(this.errou){this.tempo = 500;}else{this.tempo = 4000;} // tempo do audio  
        this.countBubbles=0;// limite 6 

		this.createDelayTime(this.tempo, function(){
            
			this.groupLevel = this.add.group();
			
			// fixo - criar sistema de botoes dentro do array
			this.buttonsLvl1 = [];
			
			this.buttonsLvl1[0] = this.createButton( 600, 400, "S", 100, true, null, null, 1);
			this.buttonsLvl1[0].alpha = 0;
			this.buttonsLvl1[1] = this.createButton( 600, 400, "S", 100, true, null, null, 1);
			this.buttonsLvl1[1].alpha = 0;
			this.buttonsLvl1[2] = this.createButton( 600, 400, "L", 100, true, null, null, 1);
			this.buttonsLvl1[2].alpha = 0;
			this.buttonsLvl1[3] = this.createButton( 600, 400, "L", 100, true, null, null, 1);
			this.buttonsLvl1[3].alpha = 0;
			this.buttonsLvl1[4] = this.createButton( 600, 400, "Z", 100, true, null, null, 1);
			this.buttonsLvl1[4].alpha = 0;
			this.buttonsLvl1[5] = this.createButton( 600, 400, "Z", 100, true, null, null, 1);
			this.buttonsLvl1[5].alpha = 0;
			
			for(var i=0; i<=4; i++){
				var randAux = this.rnd.integerInRange(0,5);
				var randAux2 = this.rnd.integerInRange(0,5);
				
				var btnAux = this.buttonsLvl1[randAux];
				var btnAux2 = this.buttonsLvl1[randAux2];
				
				this.buttonsLvl1[randAux] = btnAux2;
				this.buttonsLvl1[randAux2] = btnAux;
			}
				
			this.groupLevel.add(this.buttonsLvl1[1]);
			this.groupLevel.add(this.buttonsLvl1[0]);
			this.groupLevel.add(this.buttonsLvl1[2]);
			this.groupLevel.add(this.buttonsLvl1[3]);
			this.groupLevel.add(this.buttonsLvl1[4]);
			this.groupLevel.add(this.buttonsLvl1[5]);
			
			this.groupLevel.xy(0, 250, 500);
			this.groupLevel.xy(1, 380, 500);
			this.groupLevel.xy(2, 510, 500);
			this.groupLevel.xy(3, 640, 500);
			this.groupLevel.xy(4, 770, 500);
			this.groupLevel.xy(5, 340, 600);
			
			this.createDelayTime(100, function() {
			 
				this.add.tween(this.buttonsLvl1[0]).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[1]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[2]).to({alpha: 1}, 750, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[3]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[4]).to({alpha: 1}, 750, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[5]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
	
			}, this);
			this.groupFront = this.add.group();
		});

        this.errou = false;
    },

    initLevel3: function() {
		this.showQuestion(3);
        this.initPalavras();
        console.log("initLevel3");
        this.countBubbles=0;// limite 9 
    
        if(this.errou){this.tempo = 500;}else{this.tempo = 3000;} // tempo do audio  
        //console.log("tempo--> " + this.tempo);

		this.createDelayTime(this.tempo, function(){
			this.groupLevel = this.add.group();
			
			// fixo - criar sistema de botoes dentro do array
			this.buttonsLvl1 = [];
			
			this.buttonsLvl1[0] = this.createButton( 600, 400, "S", 100, true, null, null, 1);
			this.buttonsLvl1[0].alpha = 0;
			this.buttonsLvl1[1] = this.createButton( 600, 400, "S", 100, true, null, null, 1);
			this.buttonsLvl1[1].alpha = 0;
			this.buttonsLvl1[2] = this.createButton( 600, 400, "L", 100, true, null, null, 1);
			this.buttonsLvl1[2].alpha = 0;
			this.buttonsLvl1[3] = this.createButton( 600, 400, "L", 100, true, null, null, 1);
			this.buttonsLvl1[3].alpha = 0;
			this.buttonsLvl1[4] = this.createButton( 600, 400, "Z", 100, true, null, null, 1);
			this.buttonsLvl1[4].alpha = 0;
			this.buttonsLvl1[5] = this.createButton( 600, 400, "Z", 100, true, null, null, 1);
			this.buttonsLvl1[5].alpha = 0;
			this.buttonsLvl1[6] = this.createButton( 600, 400, "Z", 100, true, null, null, 1);
			this.buttonsLvl1[6].alpha = 0;
			this.buttonsLvl1[7] = this.createButton( 600, 400, "S", 100, true, null, null, 1);
			this.buttonsLvl1[7].alpha = 0;
			this.buttonsLvl1[8] = this.createButton( 600, 400, "L", 100, true, null, null, 1);
			this.buttonsLvl1[8].alpha = 0;
			
			for(var i=0; i<=5; i++){
				var randAux = this.rnd.integerInRange(0,8);
				var randAux2 = this.rnd.integerInRange(0,8);
				
				var btnAux = this.buttonsLvl1[randAux];
				var btnAux2 = this.buttonsLvl1[randAux2];
				
				this.buttonsLvl1[randAux] = btnAux2;
				this.buttonsLvl1[randAux2] = btnAux;
			}
				
			this.groupLevel.add(this.buttonsLvl1[1]);
			this.groupLevel.add(this.buttonsLvl1[0]);
			this.groupLevel.add(this.buttonsLvl1[2]);
			this.groupLevel.add(this.buttonsLvl1[3]);
			this.groupLevel.add(this.buttonsLvl1[4]);
			this.groupLevel.add(this.buttonsLvl1[5]);
			this.groupLevel.add(this.buttonsLvl1[6]);
			this.groupLevel.add(this.buttonsLvl1[7]);
			this.groupLevel.add(this.buttonsLvl1[8]);
			
			this.groupLevel.xy(0, 250, 500);
			this.groupLevel.xy(1, 380, 500);
			this.groupLevel.xy(2, 510, 500);
			this.groupLevel.xy(3, 640, 500);
			this.groupLevel.xy(4, 770, 500);
			this.groupLevel.xy(5, 320, 580);
			this.groupLevel.xy(6, 450, 580);
			this.groupLevel.xy(7, 580, 580);
			this.groupLevel.xy(8, 710, 580);
			
			this.createDelayTime(100, function() {
			 
				this.add.tween(this.buttonsLvl1[0]).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[1]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[2]).to({alpha: 1}, 750, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[3]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[4]).to({alpha: 1}, 750, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[5]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[6]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[7]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonsLvl1[8]).to({alpha: 1}, 720, Phaser.Easing.Linear.None, true);
	
			}, this);
			this.groupFront = this.add.group();
		});
    
        this.errou = false;
    },
	//criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, time, canInteract, yDown, yUp, frame) {
		
        var btn;
		if(imagem == "Z12"){
            //console.log("Z12");
			btn = this.add.button(x,y, imagem, null, this);	
		} else {

            //console.log("botoes");
        
            switch(imagem){
                case "L":
                    //console.log("-> L");
                    this.randomLetter = parseInt(this.RandomItem(imagem));
                break;
                case "S":
                    //console.log("-> s");
                    this.randomLetter = parseInt(this.RandomItem(imagem));
                break;
                case "Z":
                    //console.log("-> z");
                   this.randomLetter = parseInt(this.RandomItem(imagem));
                break;
                default:
                    this.randomLetter = this.rnd.integerInRange(1,12);
                break;
            }

            this.retirarArrayElemento(imagem,this.randomLetter); 
            btn = this.add.button(x,y, imagem+""+this.randomLetter, null, this);    
		}
		if(frame == null || frame == undefined){
			btn.frame = 0;
			btn.sizeIncrease = 0.6;
		} else {
			btn.frame = frame;
			if( frame == 1) {
				btn.sizeIncrease = 0.8;
			} else {
				btn.sizeIncrease = 0.6;
			}
		}
	
        btn.anchor.set(0.5,1);
        btn.alpha = 1;
        btn.scale.set(btn.sizeIncrease,btn.sizeIncrease);
		
		btn.animDown = yDown;
		btn.animUp = yUp;
		btn.group = ""+imagem;
		
        if(canInteract) {
			btn.onInputDown.add(this.onButtonClick, this);
			btn.onInputOver.add(this.onButtonOver, this);
			btn.input.useHandCursor = true;
			btn.name = ""+imagem;
			btn.group = imagem;
		}
       // this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time);

        return btn;
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {
		
		this.checkWords();
		
		if( this.currentLevel <= 1 ){
	
			if(this.wordsCorrect == 3){
				this.corrects++;
                this.saveCorrect();
				this.wordsCorrect = 0;
				this.gotoNextLevel();
			}
			
			if(this.errorThreshold >= 1){
				this.lives--;
                this.errou = true;
				this.livesCondition();
			}
				
		}
		
		if( this.currentLevel == 2 ){
	
            if(this.errorThreshold >= 2){
                this.lives--;
                this.errou = true;
                this.livesCondition();
            }

			if((this.countBubbles==6)){
				this.corrects++;
                this.saveCorrect();
				this.wordsCorrect = 0;
				this.gotoNextLevel();
			}
			
				
		}
		
		//if(this.dragElem != null) console.log("DragElem name: "+this.dragElem.name);
		
		if( this.currentLevel == 3 ){
	
            if(this.errorThreshold >= 4) {
                this.lives--;
                this.errou = true;
                this.livesCondition();
            }
                
			if(this.countBubbles==9){
				this.corrects++;
                this.saveCorrect();
				this.wordsCorrect = 0;
				this.gotoNextLevel();
			}
			
		}
	}
};
