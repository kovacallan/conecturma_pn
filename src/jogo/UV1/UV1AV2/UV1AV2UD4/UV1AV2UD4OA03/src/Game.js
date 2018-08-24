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
        this.TEMPO_INTRO = 6000;
		this.TEMPO_INTRO2 = 28000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 4700;
        this.TEMPO_RESUMO = 23000;
        this.SOUND_VITORIA = 3000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 60;
        this.UNDERLINE_SPACING = 20;
        /**************************** CONSTANTES JOGO ATUAL ************************************************/

        /* FUTURO XML */
        this.corrects = 0;
		this.lettersCorrect = 0;
        this.errors = 0;
        this.currentLevel = BasicGame.InitialLevel;
        this.listCorrects = [-1,-1,-1];
        this.listCompleted = [false,false,false];
        /* FUTURO XML */
        this.conclusaoEnviada = false;
        /* FUTURO XML */

        this.lives = 2;
		this.errorThreshold = 0;
		this.points = 0;
        this.showCallToAction = false;
		
		this.dragOn = false;
		this.dragElem;
		this.groupLevel;
		this.keyboard_click;
		this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

		this.background;
		this.soundWord; 
		this.changingLevel = false;
		this.doors = [];
		this.level_image = [];
		
		this.randomLetter;
		this.tutorialText;
		this.buttonWord = [];
		
		this.levelAudio;

        this.createScene();

        this.showIntro();

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();
		
	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Essa aventura deu fome! Poly e Saci \nencontraram [várias frutas] aqui e \nresolveram fazer uma brincadeira! ";
        this.texto['initialText2'] ="Se Poly tinha [4 maçãs] e deu [2] para o Saci, \ncom quantas ficou? Agora vamos contar \nas maçãs de Poly: 1, 2. E as maçãs do Saci: 1, 2. \nPoly ficou com [duas maçãs]!";
        //this.texto['initialText3'] ="A essa operação de tirar uma quantidade de \noutra chamamos subtração.";
        this.texto['imgResumo'] ="";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "",
            "",
            ""
        ];
    }   ,


    drawText: function(x,y,text, fontSize, align, lineHeight) {

        var _lineHeight = lineHeight || -2;
        var _align = align || "center";

        var textGroup = this.add.group();

        var _width = 0;

        var byLine = text.split("\n");

        var py = 0;

        for(var i = 0; i < byLine.length; i++) {

            var byColor = byLine[i].split(/(\[[^\]]+\])/gi);

            var px = 0;
            var textBase = this.add.sprite(0,0);

            for(var j = 0; j < byColor.length; j++) {
                
                var _color = 0xFBFBFB;
                var _text = byColor[j];
                if(byColor[j][0] == "[") {

                    _text = " " + byColor[j].replace(/[\[\]]/gi, "");
                    _color = 0xFFD200;

                } 

                var s = this.add.bitmapText(1+px,1+py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                s.tint = 0x010101;

                var t = this.add.bitmapText(px,py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                px += t.width;
                t.tint = _color;
                
                textBase.addChild(s);
                textBase.addChild(t);
            }
            textGroup.add(textBase);

            switch(_align) {
                case "left":
                    
                break;
                case "right":
                    textBase.x -= px;
                break;
                case "center":
                    textBase.x -= px*0.5;
                break;
            }

            py += textBase.height + _lineHeight;

            if(px > _width) {
                _width = px;
            }
        }

        textGroup.x = x;
        textGroup.y = y;

        switch(_align) {
            case "left":
                textGroup.x -= _width*0.5;
            break;
            case "right":
                textGroup.x += _width*0.5;
            break;
            case "center":
                
            break;
        }

        return textGroup;
    },



	keyPress: function(elem){

        if(!this.clickable) {
            return;
        }

		if(elem == this.right_result){
			this.levelContent[4] = this.add.image( 730, this.world.centerY + 100, 'numeros');
			this.levelContent[4].frame = this.right_result - 1;
			this.levelContent[4].anchor.set(0.5,0.5);
			this.groupLevel.add(this.levelContent[1]);
			this.groupLevel.add(this.levelContent[2]);
			this.groupLevel.add(this.levelContent[3]);
			this.groupLevel.add(this.levelContent[4]);
			this.clickable = false;
			this.sound.play('hitAcerto');
			this.poly.play('comemora');
			this.saci.play('comemora');
			this.animationHit = true;
			this.corrects++;
            this.saveCorrect();
			this.clickable = false;
			this.createDelayTime(1000, function(){
				this.gotoNextLevel();
			});
		} else {

            if(this.totalErrors > 0) {
                this.totalErrors--;
                this.sound.play('hitErro');
            } else {
                this.clickable = false;
                this.livesCondition();
            }
		}
	},
    /*********************************************************************************************************************/
    /* HUD  E BOTOES - INICIO */


    clickRestart:function() {
        this.sound.stopAll();
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
	
	livesCondition: function(){
		
		this.lives--;
		this.levelAudio.stop();
		this.changingLevel = true;
		
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
		
		switch(this.lives) {
            case 1: // mostra dica 1
				if(this.currentLevel >= 2){ 
					this.currentLevel--;
				}
				this.sound.play('hitErro');
				this.updateLivesText();
                this.sound.play("soundDica");
				this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
				this.sound.play('hitErro');
				this.updateLivesText();
                this.showResumo();
            break;
            default: // game over
            break;
        }
	},
	
    createDelayTime: function(time, callback) {
        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },
	
	 addPoints: function() {

        this.points += this.pointsByLevel[this.currentLevel];
		this.updatePointsText();

    },

    updatePointsText: function() {
        return;
        this.pointsTextShadow.text = this.points.toString();
        this.pointsTextShadow.x = 56 - 10;

        this.pointsText.setText(this.points.toString());
        this.pointsText.x = 55 - 10; // this.pointsText.width*0.5;
    },

   
    updateLivesText: function() {
        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */
	
	// Intro * INICIO *
	showIntro: function() {
        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);
	
        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },
	
	 showTextoIntro: function() {

        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");
	
        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },
	
	showKim: function() {
        var kim = this.createAnimation( this.world.centerX-320, 200, 'kim', 1,1);
        kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        kim.crop(rect);

        this.groupIntro.add(kim);

        this.add.tween(kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },
	 // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		
		this.buttonTutorial = [];
		
		this.tutorialText = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");
        this.tutorialText.alpha = 0;
       

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
				
		this.buttonTutorial[0] = this.createButton( 260 , this.world.centerY + 50, 100, 1);
		this.buttonTutorial[0].scale.set(0.5,0.5);
		this.buttonTutorial[1] = this.createButton( 340 , this.world.centerY + 50, 100, 1);
		this.buttonTutorial[1].scale.set(0.5,0.5);
		this.buttonTutorial[2] = this.createButton( 300 , this.world.centerY, 100, 1);
		this.buttonTutorial[2].scale.set(0.5,0.5);	
		this.buttonTutorial[3] = this.createButton( 300 , this.world.centerY + 100, 100, 1);
		this.buttonTutorial[3].scale.set(0.5,0.5);
		
		this.groupIntro.add(this.buttonTutorial[0]);
		this.groupIntro.add(this.buttonTutorial[1]);
		this.groupIntro.add(this.buttonTutorial[2]);
		this.groupIntro.add(this.buttonTutorial[3]);
	
		this.createDelayTime( 100, function() {
            this.showFinishedLiveTutorial();
        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {	

        //this.buttons[0].alpha = 0.7;
		
        // remover click
		
		this.createDelayTime( 3500, function(){
			this.add.tween(this.buttonTutorial[1]).to({x: 630, y: (this.world.centerY + 60) }, 1200, Phaser.Easing.Linear.None, true, 500)
			this.add.tween(this.buttonTutorial[3]).to({x: 550, y: (this.world.centerY + 60)}, 1200, Phaser.Easing.Linear.None, true, 500);
			this.add.tween(this.buttonTutorial[2]).to({x: 340, y: (this.world.centerY + 50)}, 1200, Phaser.Easing.Linear.None, true, 500);
		});
		
		this.createDelayTime( 8000, function(){
			this.buttonTutorial[4] = this.add.image(460, this.world.centerY + 60, "minus");
			this.buttonTutorial[4].anchor.set(0.5,0.5);	
			this.groupIntro.add(this.buttonTutorial[4]);
		});
		
		this.createDelayTime( 17000, function(){
			this.buttonTutorial[5] = this.add.image(490, this.world.centerY + 170, "operacao");
			this.buttonTutorial[5].anchor.set(0.5,0.5);	
			this.groupIntro.add(this.buttonTutorial[5]);
		});
		
		this.createDelayTime( this.TEMPO_INTRO2, function() {
            this.add.tween(this.groupIntro).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    setDebugAudio: function(audio) {
        this.debugAudio = this.sound.add(audio);
        this.debugAudio.onPlay.add(this.onStartDebugAudio, this);
        this.debugAudio.onStop.add(this.onStopDebugAudio, this);
        this.debugAudio.play();

        return this.debugAudio;
    },

    onStartDebugAudio: function() {
        console.log("onStartDebugAudio");
        this.input.onTap.add(this.onDebuAudio, this);
    },
    onDebuAudio: function() {
        var _timer = this.debugAudio.currentTime/100;
        console.log("Timer Audio:", Math.round(_timer)*100, "ms", this.input.x, this.input.y);
    },
    onStopDebugAudio: function() {
        var _timer = this.debugAudio.currentTime/100;
        console.log("Timer Audio Ended:", Math.round(_timer)*100, "ms");
        this.input.onTap.remove(this.onDebuAudio, this);
    },
	
    skipIntro: function() {
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
	
	// Intro * FINAL *
	// Resumo * INICIO *
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
	
	// resumo inicial
    showTextResumo: function() {
		
        this.soundResumo = this.setDebugAudio("soundResumo");
        this.tutorialText = this.add.sprite( this.world.centerX, 60, 'resumoText1');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);


        this.tutorialText2 = this.add.sprite( this.world.centerX, 60, 'resumoText2');
        this.tutorialText2.alpha = 0;
        this.tutorialText2.anchor.set(0.5, 0.5);
        this.groupIntro.add(this.tutorialText2);

        // resumoText2

        var t1 = this.add.sprite(this.world.centerX-160, 150, "resumo1");
        t1.anchor.set(0.5,0.5);
        t1.alpha = 0;
        this.groupIntro.add(t1);
        
        var t2 = this.add.sprite(this.world.centerX-20, 150, "resumo2");
        t2.anchor.set(0.5,0.5);
        t2.alpha = 0;
        this.groupIntro.add(t2);

        var t3 = this.add.sprite(this.world.centerX+130, 150, "resumo3");
        t3.anchor.set(0.5,0.5);
        t3.alpha = 0;
        this.groupIntro.add(t3);
		
		this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(9000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.add.tween(t1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 9000);
        this.add.tween(t2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 12000);
        this.add.tween(t3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 17000);

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(t1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(t2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(t3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			
            this.add.tween(this.tutorialText2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });

    },
	
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
		
    },

	// Resumo * FINAL *
	// Contadores - Vida e Pontos - * INICIO *
	
	// Contadores - Vida e Pontos - * FINAL *
	// Gameover * INICIO *
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
	
	gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },
	// Gameover * FINAL *
	
    // GAMESTART
    initGame: function() {
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
	
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
		
		this.groupbuttonWord = this.add.group();
		
		this.createDelayTime(500, function(){
			this.showNextLevel();
		});
    },
	
	// Auxiliares de level - passar, voltar, etc.

	gotoNextLevel: function() {
		
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
		this.changingLevel = true;
        this.currentLevel++;
        this.hideAndShowLevel(false);
    },
	
	hideAndShowLevel: function(isWrong) {

		this.lettersCorrect = 0;
		this.levelAudio.stop();
		
		if(this.corrects < this.TOTAL_LEVEL) {
			if(isWrong) {
				
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true)
				this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true)
				this.createDelayTime( this.TEMPO_ERRO1, function(){
					this.showNextLevel();
				});
				
			} else {
				
				this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
				
			}

		} else {
			this.groupLevel.add(this.poly);
			this.groupLevel.add(this.saci);
			this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
			this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
			this.gameOverMacaco();
		}
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
	
	bubblesMovement:function(obj) {
		this.randomAnim = this.rnd.integerInRange(1200,2000);
		this.add.tween(obj).to({y: obj.animUp}, this.randomAnim, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.bubblesMovementDown(obj)},this);
	},
	
	bubblesMovementDown:function(obj) {
			this.randomAnim = this.rnd.integerInRange(1200,2000);
			this.add.tween(obj).to({y: obj.animDown}, this.randomAnim, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.bubblesMovement(obj)},this);
	},

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        this.background = this.add.sprite( -440, -580, 'background');
		
		this.saci = this.add.sprite( 160, 180, "anim_poly");
		this.saci.animations.add('idle', this.math.numberArray(0,28), 18, true);
		this.saci.animations.add('comemora', this.math.numberArray(34,58), 18, false);
		this.saci.animations.play('idle');
		
		this.poly = this.add.sprite( 750, 280, "anim_saci");
		this.poly.animations.add('idle', this.math.numberArray(0,28), 18, true);
		this.poly.animations.add('comemora', this.math.numberArray(34,58), 18, false);
		this.poly.animations.play('idle');
    },


    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

		if( this.groupLevel != null ) this.groupLevel.removeAll();
		if( this.groupFront != null ) this.groupFront.removeAll();
		this.changingLevel = false;
        this.initLevel();
     
    },
	
	showQuestion: function() {
		this.createDelayTime( 1000, function(){
			this.levelAudio = this.sound.play('soundCallToAction');
		}, this);
    },

    initLevel: function() {
		
		var time_to_begin = 0;
		
		this.showQuestion();		
		
		this.createDelayTime( 1000, function(){
			this.groupLevel = this.add.group();
			
			this.buttonWord = [];
			var amount_minus = 0;
			
			switch(this.currentLevel){
				case 1:
					amount_minus = this.rnd.integerInRange(3,5);
                    this.totalErrors = 1;
				break;
				case 2:
					amount_minus = this.rnd.integerInRange(5,7);
                    this.totalErrors = 0;
				break;
				case 3:
					amount_minus = this.rnd.integerInRange(8,10);
                    this.totalErrors = 0;
				break;	
			}
			
			this.levelContent = [];
			
			var position_anchor = 0;
			
			for( var i = 0; i < 12; i++ ){
				
				var position_x;
				var position_y;
				
				if( i == 0 || i == 4 || i == 7 || i == 11 ){ position_anchor = 0; }
				
                if(i == 0) {
                    position_x = 310;
                    position_y = this.world.centerY + 10;
                } else if( i <= 4){
					position_x = 250 + ( position_anchor * 40 );
					position_y = this.world.centerY + 50;
				} else if( i <= 7){
					position_x = 270 + ( position_anchor * 40 );
					position_y = this.world.centerY + 90;
				} else {
					position_x = 250 + ( position_anchor * 40 );
					position_y = this.world.centerY + 130;	
				} 
					
				this.buttonWord[i] = this.createButton( position_x , position_y, 100);
							
				this.groupLevel.add(this.buttonWord[i]);
				
				position_anchor++;
				
			}
			
			this.levelContent[0] = this.add.sprite( 280, this.world.centerY + 210, 'numeros');
			this.levelContent[0].frame = 11;
			this.groupLevel.add(this.levelContent[0]);
			
			this.createDelayTime( 2000, function(){
				this.levelContent[1] = this.add.image( 430, this.world.centerY + 100, 'minus');
				this.levelContent[1].anchor.set(0.5,0.5);
				this.groupLevel.add(this.levelContent[1]);
			});
			
			var position_minus_y;
			
			this.createDelayTime( 3000, function(){
				
				var position_anchor_minus = 0;
				
				for( var i = 0; i < amount_minus; i++) {
					
					if( i == 3 || i == 6 ){ 
						position_anchor_minus = 0;
					}
					
					if( i < 3 ){
						position_minus_y = this.world.centerY + 150;
                    } else if ( i < 6) {
                        position_minus_y = this.world.centerY + 110;
                    } else {
                        position_minus_y = this.world.centerY + 70;
					}
					
					var random_pick = 11-i;
					var position_minus_x = 470 + ( position_anchor_minus * 40 );
					
					this.buttonWord[random_pick].taken = true;
					position_anchor_minus++;
					this.add.tween(this.buttonWord[random_pick]).to({x: position_minus_x,y: position_minus_y}, 510,Phaser.Easing.Linear.None, true);
						
				}
				
				this.levelContent[2] = this.add.sprite( 490, this.world.centerY + 210, 'numeros');
				this.levelContent[2].frame = amount_minus - 1;
				this.groupLevel.add(this.levelContent[2]);
			});
			
			this.createDelayTime( 4000, function(){
				this.levelContent[3] = this.add.image( 660, this.world.centerY + 100, 'equal');
				this.levelContent[3].anchor.set(0.5,0.5);
				this.groupLevel.add(this.levelContent[3]);
			});
					
			this.groupFront = this.add.group();
			
			this.createDelayTime( 10000, function(){
				this.right_result = 12 - amount_minus;
				this.clickable = true;
			});
				
		});
    },
	
    createButton: function( x, y, time, tutorial) {
		
        var btn; 
		
		if( tutorial == null ){
			btn = this.add.button(x,y, "abacaxi", null, this);
            btn.scale.set(0.9,0.9);
		} else {
			btn = this.add.button(x,y, "apple", null, this);
            btn.scale.set(0.3,0.3);
		}
        btn.anchor.set(0.3,0.3); 
		
		btn.originX = x;
		btn.originY = y;
		btn.taken = false;

        return btn;
    },
	
	tween_words: function( elem ){
		this.add.tween(elem.scale).to({x: 0.8,y: 0.8}, 510,Phaser.Easing.Linear.None, true);
	},

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {	

		if(this.changingLevel){
			this.clickable = false;
		}
		
		if( this.poly != null){
			this.poly.events.onAnimationComplete.add(function(){
				if(this.animationHit && this.corrects < this.TOTAL_LEVEL){
					this.saci.play('idle');
					this.poly.play('idle');
					this.animationHit = false;
				} else if ( this.animationHit ) {
					this.saci.play('comemora');
					this.poly.play('comemora');
				}
			}, this);
		}
		
	}
};
