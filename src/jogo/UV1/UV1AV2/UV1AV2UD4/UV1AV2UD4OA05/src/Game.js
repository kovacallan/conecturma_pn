
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
        this.TEMPO_INTRO = 11500;
		this.TEMPO_INTRO2 = 12500;
        this.TEMPO_RESUMO = 21000;
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

		this.background;
		this.soundWord; 
		this.changingLevel = false;
		this.doors = [];
		this.level_image = [];
		
		this.randomLetter;
		this.tutorialText;
		this.buttonWord = [];
		

        this.createScene();

        this.showIntro();


        this.totalLevel1 = 2;
        this.totalLevel2 = 1;
        this.totalLevel3 = 3;

        this.currentLocalLevel = 0;


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true); 
        this.textGame();
		
	},


    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Nossa! Poly e o Saci estão passando por \num lugar cheinho de pedras coloridas \ne brilhantes! O Saci já quis logo pegar \nalgumas para a sua coleção.";
        this.texto['initialText2'] ="As pedras têm formato de poliedros, umas \nparecem esferas, outras paralelepípedos \ne outras parecem cubos. Nós iremos ajudar \no Saci a escolher a pedra que está sendo \npedida.";
        this.texto['imgResumo'] ="";
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = new Array();
        this.questionList[0] = null;
        this.questionList[11] =  "Vamos clicar na pedra em formato \nde [paralelepípedo]!";
        this.questionList[12] = "Vamos clicar nas pedras em formato \nde [esfera]!";
        this.questionList[2] = "Vamos clicar nas pedras em formato \nde [cubo]!";
        this.questionList[3] = "Cliquem na opção onde o nome \ndos [poliedros] está junto da imagem correta!";
    },


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
	

	onGameButtonOver: function(elem) {
		if(this.clickable){
			if( elem.setting != null){
				this.add.tween(this.buttonWord[elem.setting].scale).to({x: 1.0, y:1.0}, 200, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonImg[elem.setting].scale).to({x: 1.0, y:1.0}, 200, Phaser.Easing.Linear.None, true);
			} else {
				this.add.tween(elem.scale).to({x: 1.0, y:1.0}, 200, Phaser.Easing.Linear.None, true);	
			}
		}
	},
	
	onGameButtonOut: function(elem) {
		if(this.clickable){
			if( elem.setting != null){
				this.add.tween(this.buttonWord[elem.setting].scale).to({x: 0.8, y:0.8}, 200, Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonImg[elem.setting].scale).to({x: 0.8, y:0.8}, 200, Phaser.Easing.Linear.None, true);
			} else {
				this.add.tween(elem.scale).to({x: 0.8, y:0.8}, 200, Phaser.Easing.Linear.None, true);	
			}
		}
	},
	
    createDelayTime: function(time, callback) {
        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
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

        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 21, "left");
        this.tutorialText.alpha = 0;
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");
		
		//this.intro_play = this.createAnimation( -300, 100, "intro", 1.0, 1.0);
		//this.intro_play.animations.add('start', this.math.numberArray(0,54), 18, false);
		//this.intro_play.play('start');
	
        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },
	
    showKim: function(delay) {
        var kim = this.add.sprite(this.world.centerX-320, 0, 'kim');

        var fIntro = Phaser.Animation.generateFrameNames("kim_", 0, 14, "", 3);
        var fLoop = Phaser.Animation.generateFrameNames("kim_", 15, 84, "", 3);

        kim.animations.add('intro', fIntro, 18, false);
        kim.animations.add('loop', fLoop, 18, true);

        kim.animations.play('intro').onComplete.add(function() {

            kim.animations.play('loop');
        }, this);

        this.groupIntro.add(kim);

        this.createDelayTime( delay || this.TEMPO_INTRO, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });

        return kim;
    },


	 // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		
		//this.groupIntro.add(this.poly);
		//this.groupIntro.add(this.saci);
		
		this.tutorialText = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
		
       	this.createDelayTime( 1800, function(){
			
			this.levelContent = [];
				
				this.levelContent[0] = this.add.sprite( this.world.centerX + 150, 700, "placa");
				this.levelContent[0].anchor.set(0.5,0.5);
				this.levelContent[1] = this.add.sprite( this.world.centerX + 150, 700, "pergunta_2_form");
				this.levelContent[1].anchor.set(0.5,0.5);
				
				this.add.tween(this.levelContent[0]).to({y: 360}, 1000, Phaser.Easing.Linear.None, true, 500);
				this.add.tween(this.levelContent[1]).to({y: 360}, 1000, Phaser.Easing.Linear.None, true, 500);
				
				this.groupIntro.add(this.levelContent[0]);
				this.groupIntro.add(this.levelContent[1]);
			
			this.buttonTutorial = [];
			
			for( var i = 0; i < 3; i++ ){

				var position_x = 250 + ( i * 140 );
					
					if(i == 0)	randomLetter = 3;
					else if(i ==1) randomLetter = 5;
					else randomLetter = 6;		
					
					if( this.currentLevel != 4){
						if( i == 0 ){	
							this.buttonTutorial[i] = this.createButton( 250 + position_x , this.world.centerY + 230, 1, 100, false);
						}else{
							this.buttonTutorial[i] = this.createButton( 250 + position_x , this.world.centerY + 230, 0, 100, false);
						}
						
						this.buttonTutorial[i].frame = randomLetter;
						
					}
					
					this.groupIntro.add(this.buttonTutorial[i]);
				
			}
			
			this.tween_words(this.buttonTutorial[0]);
			this.tween_words(this.buttonTutorial[1]);
			this.tween_words(this.buttonTutorial[2]);
				
		});
		
		this.createDelayTime( 3000, function() {
            this.showFinishedLiveTutorial();
        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {	
		
		this.createDelayTime( 7500, function(){
			this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
			this.arrow.anchor.set(0.5,0.5);
			this.groupIntro.add(this.arrow);
			this.add.tween(this.arrow).to({x: this.buttonTutorial[0].x + 30, y: this.buttonTutorial[0].y + 20}, 600, Phaser.Easing.Linear.None, true);
		},this);

        //this.buttons[0].alpha = 0.7;
		
        // remover click
		
		this.createDelayTime( 9500, function(){
			
			var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
			click.animations.add('idle', null, 18, true);
			click.animations.play('idle');
			this.groupIntro.add(click);
			
			this.createDelayTime( 2400, function() {
				click.alpha = 0;
				click.destroy();
			});
		});
		
		this.createDelayTime( this.TEMPO_INTRO2, function() {
			
            this.add.tween(this.groupIntro).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },
	
    skipIntro: function() {
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
	
	drawCharacters: function(){
		this.poly = this.add.sprite( 190, 330, "poly_anim");
	
		this.poly.animations.add('idle', this.math.numberArray(0,29), 18, true);
		this.poly.animations.add('comemora', this.math.numberArray(30,59), 18, false)
		this.poly.animations.play('idle');
		
		this.saci = this.add.sprite(140, 370, "saci_anim");
		
		this.saci.animations.add('idle', this.math.numberArray(0,29), 18, true);
		this.saci.animations.add('comemora', this.math.numberArray(30,59), 18, false).onComplete.add(function() {
            this.poly.play('idle');
            this.saci.play('idle');
        }, this);
		this.saci.animations.play('idle');
		
		
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

        
        if(this.groupLevel) {
    		this.add.tween(this.groupLevel).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ 
                this.groupLevel.removeAll(); 
            }, this);
        }
        if(this.groupFront) {
    		this.add.tween(this.groupFront).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ 
                this.groupFront.removeAll(); 
            }, this);
        }
    },
	
	// resumo inicial
    showTextResumo: function() {
		
		this.soundResumo = this.sound.play("soundResumo");
        this.tutorialText = this.add.sprite( this.world.centerX, 40, 'resumoImg');
        this.tutorialText.alpha = 0;
        this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);
		
		this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		
		this.createDelayTime( 3500, function() {

			this.tutorial_img = this.add.sprite( this.world.centerX, 120, 'resumo_1');
			this.tutorial_img.alpha = 0;
			this.tutorial_img.anchor.set(0.5, 0.5);
			this.add.tween(this.tutorial_img).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.tutorial_img);
        });
		
		
		this.createDelayTime( 10500, function() {
			
			this.add.tween(this.tutorial_img).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
				this.tutorial_img = null;
				this.tutorial_img = this.add.sprite( this.world.centerX, 120, 'resumo_2');
				this.tutorial_img.alpha = 0;
				this.tutorial_img.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorial_img).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                this.groupIntro.add(this.tutorial_img);
			}, this);

        });
		
		this.createDelayTime( 16500, function() {
			
			this.add.tween(this.tutorial_img).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
				this.tutorial_img = null;
				this.tutorial_img = this.add.sprite( this.world.centerX, 120, 'resumo_3');
				this.tutorial_img.alpha = 0;
				this.tutorial_img.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorial_img).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				this.groupIntro.add(this.tutorial_img);
			}, this);
			
        });

        this.soundResumo.onStop.add(function() {
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },
	
    skipResumo: function() {
        if(this.soundResumo != null) {
            this.soundResumo.onStop.removeAll(this);
            this.soundResumo.stop();
        }
        this.tweens.removeAll();
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
    /*gameOverMacaco: function() {
		
        BasicGame.OfflineAPI.setCookieVictory();

        this.sound.play("soundFinal");

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
		
		this.createDelayTime(3000,function(){
			if(this.groupLevel != null){this.groupLevel.removeAll();}
			if(this.groupFront != null){this.groupFront.removeAll();}
			//this.poly.destroy();
			//this.saci.destroy();
			this.add.tween(this.poly).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true,this.SOUND_VITORIA);
			this.add.tween(this.saci).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true,this.SOUND_VITORIA);
			this.add.tween(bg).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA);
			this.add.tween(animal).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA+500).onComplete.add(function() {
                this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
                this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
				animal.animations.play('idle');
	
				this.showTextVictory();
	
                this.eventConclusao = new Phaser.Signal();
                this.eventConclusao.addOnce(this.showEndButtons, this);

                this.registrarConclusao();
	
			}, this);
		});
    },*/

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
		
		
		this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },
	
	// Auxiliares de level - passar, voltar, etc.

	gotoNextLevel: function() {
		
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);

        if(this.currentLocalLevel == 0) {
            this.currentLevel++;
        }

        this.hideAndShowLevel(false);
    },
	
	hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    hideAndShowLevel: function() {

        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {

                if(this.currentLevel == 3 && this.currentLocalLevel > 0) {
                    this.showNextLevel();
                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }
            } else {
                this.gameOverMacaco();
            }
        });
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
        this.background = this.add.sprite( -400, -970, 'background');

        this.drawCharacters();
    },


    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        this.currentLocalLevel++;

        console.log("init level " + this.currentLevel + ' - ' + this.currentLocalLevel);

        switch(this.currentLevel) {
            case 1:

                var _levelNum = this.currentLevel+""+this.currentLocalLevel;
                
                this.showQuestion(_levelNum);

                this.sound.play('pergunta_'+_levelNum+'_aud').onStop.add(this['initlevel' + _levelNum], this);
                this.showPlaca("pergunta_"+_levelNum+"_form");


            break;
            case 2:

                this.showQuestion(2);

                this.sound.play('pergunta_2_aud').onStop.add(this.initlevel2, this);
                this.showPlaca("pergunta_2_form");

            break;
            case 3:

                if(this.currentLocalLevel == 1) {
                    this.showQuestion(3);
                    this.sound.play('pergunta_3_aud').onStop.add(this.initlevel3, this);
                } else {
                    this.initlevel3();
                }


            break;
        }
     
    },
	
	showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 50, this.questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
		
    	this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
    },

    showPlaca: function(name) {
        this.shapeBoard = this.add.sprite( this.world.centerX + 150, 700, "placa");
        this.shapeBoard.anchor.set(0.5,0.5);
        
        var p = this.add.sprite( 0, 0, name);
        p.anchor.set(0.5,0.5);
        this.shapeBoard.addChild(p);
        
        this.add.tween(this.shapeBoard).to({y: 300}, 500, Phaser.Easing.Linear.None, true);
    },

    initlevel11: function() {
        
        this.buttons = [];
        var _letters = [5,4,0];

        _letters.sort(function() {
          return .5 - Math.random();
        });

        for(var i = 0; i < 3; i++) {
            this.buttons.push( this.createButtonForm( 500 + 170*i, this.world.centerY + 200, _letters[i], _letters[i]==5) );
        }

    },
    initlevel12: function() {
        this.buttons = [];
        var _letters = [6,0,1];

        _letters.sort(function() {
          return .5 - Math.random();
        });

        for(var i = 0; i < 3; i++) {
            this.buttons.push( this.createButtonForm( 500 + 170*i, this.world.centerY + 200, _letters[i], _letters[i]==6) );
        }
    },
    initlevel2: function() {

        this.buttons = [];
        var _letters = [3,2,1];

        _letters.sort(function() {
          return .5 - Math.random();
        });

        for(var i = 0; i < 3; i++) {
            this.buttons.push( this.createButtonForm( 500 + 170*i, this.world.centerY + 200, _letters[i], _letters[i]==3) );
        }
    },
    initlevel3: function() {
        
        var _n = this.currentLocalLevel-1;

        this.buttons = [];

        // no, no, no, cubo, cubo, paral, esfe, paral
        var _corrects = [3,5,6];
        var _wordFrames = [0,1,2];

        var _wrongs = [
            [0,1,2], // [0,1,2,5,6,7],
            [0,1,2], // [0,1,2,3,4,6],
            [0,1,2] // [0,1,2,3,4,5,7]
        ];


        // cubo, paral, esfe

        var _letters = [ [_corrects[_n], _wordFrames[_n] ] ];

        _wordFrames.splice(_n,1);

        //console.log(_letters);

        for(var i = 0; i < 2; i++) {
            var n = this.rnd.integerInRange(0, _wrongs[_n].length-1);
            _letters.push( [
                _wrongs[_n][n], 
                _wordFrames[i] 
            ] );

            _wrongs[_n].splice(n,1);
        }

        _letters.sort(function() {
          return .5 - Math.random();
        });

        console.log(_letters);

        this.buttons.push( this.createButtonForm( 500, this.world.centerY+130, _letters[0][0], _letters[0][0]==_corrects[_n], _letters[0][1] ) );
        this.buttons.push( this.createButtonForm( 670, this.world.centerY- 20, _letters[1][0], _letters[1][0]==_corrects[_n], _letters[1][1] ) );
        this.buttons.push( this.createButtonForm( 840, this.world.centerY+130, _letters[2][0], _letters[2][0]==_corrects[_n], _letters[2][1] ) );


    },

    createButtonForm: function( x, y, letter, isCorrect, word, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn = this.add.button(x,y, "formas", (isCorrect) ? this.clickRightButton : this.clickWrongButton, this, letter,letter,letter,letter);
        
        if( word != null ) {
            
            console.log("word", letter, isCorrect, word);

            var _word = this.add.sprite(0,50, "palavras", word);
            _word.anchor.set(0.5, 0);
            _word.scale.set(0.7,0.7);
            btn.addChild(_word);
        }

        
    
        btn.anchor.set(0.5,0.5);
        btn.scale.set(0.5,0.5);

        btn.inputEnabled = _canInteract;
        

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
                btn.onInputOver.add(this.onButtonOver, this);
                btn.onInputOut.add(this.onButtonOut, this);
            }
        }, this);

        return btn;
    },

    onButtonOver: function(elem) {
        if(elem.alpha < 1) {
            return;
        }
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    onButtonOut: function(elem) {
        if(elem.alpha < 1) {
            return;
        }
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },


    clickRightButton: function(elem) {
        if(elem.alpha < 1) {
            return;
        }
        console.log(elem.frame);

        this.sound.play('hitAcerto');        

        this.poly.play('comemora');
        this.saci.play('comemora');

        if(this.currentLocalLevel >= this['totalLevel'+this.currentLevel]) {

            this.currentLocalLevel = 0;
            this.corrects++;
            this.saveCorrect();

        } else {

            var _porc = this.currentLocalLevel / this['totalLevel'+this.currentLevel] * 100;
            this.saveCorrect(parseInt(_porc), false);
        }
        

        this.clearButtons();

        this.gotoNextLevel();
    },

    clickWrongButton: function(elem) {
        if(elem.alpha < 1) {
            return;
        }

        this.lives--;
        
        this.currentLocalLevel = 0;
        
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);

        this.clearButtons();
        
        switch(this.lives) {
            case 1: // mostra dica 1
                if(this.currentLevel > 1){ 
                    this.currentLevel--;
                }
                this.sound.play('hitErro');
                this.updateLivesText();
                this.sound.play("soundDica").onStop.add(function() {
                    this.hideAndShowLevel(true);
                }, this);
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

    clearButtons: function() {

        if(this.shapeBoard && this.shapeBoard != null) {
            this.add.tween(this.shapeBoard).to({y: 700, alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                elem.destroy();
                this.shapeBoard = null;
            });
        }

        for(var i = 0; i < this.buttons.length; i++) {
            this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                elem.destroy();
            });
        }
    },
	
    createButton: function( x, y, letterValue, time, canInteract, words) {
		
        var btn; 
		
		if( words != null ) btn = this.add.button(x,y, "palavras", null, this);
		else btn = this.add.button(x,y, "formas", null, this);
	
        btn.anchor.set(0.5,0.5); 
		if(words != null) btn.scale.set(0.8,0.8);
		else btn.scale.set(0.1,0.1);
		btn.hitGroup = letterValue;
		
        if(canInteract) {
			btn.onInputDown.add(this.onGameButtonClick, this);
			btn.onInputOver.add(this.onGameButtonOver, this);
			btn.onInputOut.add(this.onGameButtonOut, this);
			btn.input.useHandCursor = true;
		}

        return btn;
    },
	
	tween_words: function( elem ){
		this.add.tween(elem.scale).to({x: 0.8,y: 0.8}, 510,Phaser.Easing.Linear.None, true);
	},

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {	

		
	}
};
