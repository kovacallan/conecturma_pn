
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
        this.TEMPO_INTRO = 2500;
		this.TEMPO_INTRO2 = 24500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 5000;
        this.TEMPO_RESUMO = 17000;
        this.SOUND_VITORIA = 5000;
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

		
		this.levelAudio;
		this.over_word = null;

        this.createScene();

        this.showIntro();

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();
		
	},



    /*********************************************************************************************************************/
    /* HUD  E BOTOES - INICIO */

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Estes arquivos estão \nmuito cheios! ";
        this.texto['initialText2'] ="Cada um deles tem uma letra na frente, R, X ou H. \nIsso significa que se a pasta for de uma letra \ndessas, mas tiver palavras com alguma das \noutras duas letras, ela precisa se livrar das \npalavras intrusas!";
        this.texto['initialText3'] ="Como na pasta da letra M, que não pode ter \npalavras com a letra N. Olhem só o que fazemos.";
        this.texto['imgResumo'] ="Muitas letras podem se parecer, mas precisamos \nestar atentos não só ao seu formato, mas também \nao seu som. Ler a palavra em voz alta nos ajuda a \nperceber a [diferença de sons] entre as letras.";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Vamos limpar a pasta da letra [R]! Ela não pode \nter palavras com as letras [X] e [H]!",
            "Hora da pasta [X]! Vamos tirar as palavras com \nas letras [R] e [H]! ",
            "Só falta a pasta [H]! Nada de palavras com as \nletras [R] e [X]!"
        ];
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
		this.clickable = false;
		
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
		
		switch(this.lives) {
            case 1: // mostra dica 1
				if(this.currentLevel >= 2){ 
					this.currentLevel--;
					console.log("level atual: "+this.currentLevel);
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

    // 
	onGameButtonClick: function(elem) {
		if(this.clickable){
			this.dragElem = elem;
			this.dragOn = true;
			this.groupFront.add(elem);	
		}
	},
	
	onGameButtonOver: function(elem) {
		if(this.clickable && this.dragOn == false){
			if(this.over_word == null){
                console.log("som 1");
				this.over_word = this.sound.play('pergunta_'+this.currentLevel+'_'+elem.imageValue);
                this.over_word.onStop.addOnce(function(){
                    this.over_word = null;   
                }, this);
			}

		}
	},
	
    createDelayTime: function(time, callback) {
        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },
	
	addPoints: function() {

        this.points += this.pointsByLevel[this.currentLevel];

        console.log("total de pontos: " + this.points);

        
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

        this.tutorialText = this.drawText(this.world.centerX, 110, this.texto['initialText'], 22, "left");
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
		
		this.tutorialText = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");
        this.tutorialText.alpha = 0;

        this.tutorialText2 = this.drawText(this.world.centerX, 70, this.texto['initialText3'], 22, "left");
        this.tutorialText2.alpha = 0;

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
        this.groupIntro.add(this.tutorialText2);

        this.createDelayTime(21000, function(){
            this.add.tween(this.tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialText2).to({alpha: 1}, 400, Phaser.Easing.Linear.None, true);
            },this)
        });
		
		this.level_folder = this.createAnimation( this.world.centerX - 180, 230, "intro_question", 1.0, 1.0);
		this.level_folder.animations.add('open', this.math.numberArray(0,29), 18, false);
		this.groupIntro.add(this.level_folder);
		
		this.createDelayTime(19000, function(){
			this.level_folder.animations.play('open');
		});
		
       	this.createDelayTime( 20200, function(){
			
			this.buttonTutorial = [];
			
			for( var i = 0; i <= 2; i++ ){
					
					switch(i) {
						case 0:
							this.buttonTutorial[i] = this.createButton( 485 , 275, 1, 27, 100, false, 350, this.world.centerY + 50);
							this.buttonTutorial[i].frame = 27;
							console.log("oi1");
							break;
						case 1:
							this.buttonTutorial[i] = this.createButton( 485 , 275, 0, 28, 100, false, 550, this.world.centerY + 130);
							this.buttonTutorial[i].frame = 28;
							console.log("oi2");
							break;
						case 2:
							this.buttonTutorial[i] = this.createButton( 485 , 275, 0, 29, 100, false, 600, this.world.centerY - 20);
							this.buttonTutorial[i].frame = 29;
							console.log("oi3");
							break;
						default:
							return;
					}
					this.groupIntro.add(this.buttonTutorial[i]);
				
				}
				
		});
		
		this.createDelayTime( 20300, function() {
			this.tween_words(this.buttonTutorial[0], false);
			this.tween_words(this.buttonTutorial[1], false);
			this.tween_words(this.buttonTutorial[2], true);
            this.showFinishedLiveTutorial();
        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		
		this.createDelayTime( 6500, function(){
			this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
			this.arrow.anchor.set(0.5,0.5);
			this.groupIntro.add(this.arrow);
			this.add.tween(this.arrow).to({x: this.buttonTutorial[1].x + 30, y: this.buttonTutorial[1].y + 20}, 600, Phaser.Easing.Linear.None, true);
		},this);

        //this.buttons[0].alpha = 0.7;
		
        // remover click
		
		this.createDelayTime( 7500, function(){
			
			var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
			click.animations.add('idle', null, 18, true);
			click.animations.play('idle');
			this.groupIntro.add(click);
			
			this.createDelayTime( 2400, function() {
				click.alpha = 0;
				click.destroy();
			});
		});
		
		this.createDelayTime( 10000, function(){
			
			this.add.tween(this.buttonTutorial[1]).to({x: 810, y:500}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
				this.add.tween(this.buttonTutorial[1].scale).to({x: 0.1, y: 0.1}, 500,Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonTutorial[1]).to({alpha: 0}, 700,Phaser.Easing.Linear.None, true);
			},this);
			this.add.tween(this.arrow).to({x: 840, y: 520}, 1200, Phaser.Easing.Linear.None, true);
			
		});
		
		this.createDelayTime( 12000, function(){
			this.add.tween(this.arrow).to({x: this.buttonTutorial[2].x + 30, y: this.buttonTutorial[2].y + 20}, 400, Phaser.Easing.Linear.None, true);
		});
		
		this.createDelayTime( 12600, function(){
			
			this.add.tween(this.buttonTutorial[2]).to({x: 810, y:500}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
				this.add.tween(this.buttonTutorial[2].scale).to({x: 0.1, y: 0.1}, 500,Phaser.Easing.Linear.None, true);
				this.add.tween(this.buttonTutorial[2]).to({alpha: 0}, 700,Phaser.Easing.Linear.None, true);
			},this);
			this.add.tween(this.arrow).to({x: 840, y: 520}, 1200, Phaser.Easing.Linear.None, true);
			
		});
		
        this.createDelayTime( 15000, function() {
			
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
		this.sound.stopAll();
        this.tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 21, "left");
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(this.tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

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
				this.createDelayTime( 7000, function(){
					this.showNextLevel();
				});
				
			} else {
				
				this.add.tween(this.groupFront).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
				
			}

		} else {
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
        this.background = this.add.sprite( -280, -180, 'background');
        this.background.height = 800;
		
		this.background_anim = this.createAnimation( 0, 0, "capsulas", 1.0, 1.0);
		this.background_anim.animations.add('play', this.math.numberArray(0,96), 18, true);
		this.background_anim.animations.play('play');
		
		this.imageQuestion = this.add.sprite(750, 470, "trash");
    },


    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

		this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500);
		if( this.groupLevel != null ) this.groupLevel.removeAll();
		if( this.groupFront != null ) this.groupFront.removeAll();
		this.changingLevel = false;
        this.initLevel();
     
    },
	
	hitmap: function(initialX, initialY, finalX, finalY, hitGroup){
		
		if( finalX >= this.dragElem.x && initialX <= this.dragElem.x && finalY >= this.dragElem.y && initialY <= this.dragElem.y && !this.game.input.activePointer.isDown && this.dragOn){
			if( hitGroup == this.dragElem.hitGroup ){
				console.log(" acerto ");
				this.lettersCorrect++;
				this.clickable = false;
				this.sound.play('hitAcerto');
				this.animationHit = true;
				this.add.tween(this.dragElem.scale).to({x: 0.1, y: 0.1}, 500,Phaser.Easing.Linear.None, true)
				this.add.tween(this.dragElem).to({alpha: 0}, 700,Phaser.Easing.Linear.None, true).onComplete.add(function(){
					this.clickable = true;
					this.dragElem.destroy();
				},this);
				this.dragOn = false;
			} else {
				console.log(" erro ");
				this.clickable = false;
				this.livesCondition();
				this.dragOn = false;
			}
			
		}
		
		if( finalX >= this.dragElem.x && initialX <= this.dragElem.x && finalY >= this.dragElem.y && initialY <= this.dragElem.y && this.dragOn){
			console.log("entro");	
		}
		
	},

    showQuestion: function(num) {
    this.imageQuestion = this.drawText(this.world.centerX, 50, this.questionList[num]);
    this.imageQuestion.alpha = 0;


    if(this.showCallToAction) {
        return;
    }
    
    this.createDelayTime( 1000, function(){
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
            this.levelAudio = this.sound.play('pergunta_'+this.currentLevel+'_aud');
        }, this);
    },
	
    initLevel: function() {
		
		var time_to_begin = 0;
		
		this.showQuestion(this.currentLevel);		
		console.log("current level: "+this.currentLevel);
		
		this.createDelayTime( 9000, function(){
			this.groupLevel = this.add.group();
			
			this.buttonWord = [];
			
			this.groupLevel.add(this.imageQuestion);
			
			this.level_folder = this.createAnimation( this.world.centerX - 180, 150, "level"+this.currentLevel+"_question", 1.0, 1.0);
			this.level_folder.animations.add('open', this.math.numberArray(0,29), 18, false);
			this.level_folder.animations.play('open');
			this.groupLevel.add(this.level_folder);
			
			var randomChoice = this.rnd.integerInRange(1,3);
			
			if(randomChoice == 1) randomChoice = 0;
			else if (randomChoice == 2) randomChoice = 3;
			else randomChoice = 6;
			
			randomChoice = randomChoice + (9 * (this.currentLevel - 1)); 
			
			this.createDelayTime( 1350, function(){
				for( var i = 0; i <= 2; i++ ){
					
					var selected_word = i + randomChoice;
					
					console.log("randomChoice: "+randomChoice);
					console.log("value "+i+": "+selected_word);
					
					switch(i) {
						case 0:
							this.buttonWord[i] = this.createButton( 485 , 195, 1, selected_word, 100, true, 350, this.world.centerY + 50);
							console.log("oi1");
							break;
						case 1:
							this.buttonWord[i] = this.createButton( 485 , 195, 0, selected_word, 100, true, 550, this.world.centerY + 130);
							console.log("oi2");
							break;
						case 2:
							this.buttonWord[i] = this.createButton( 485 , 195, 0, selected_word, 100, true, 600, this.world.centerY - 20);
							console.log("oi3");
							break;
						default:
							return;
					}
					
					this.buttonWord[i].frame = selected_word;
					this.groupLevel.add(this.buttonWord[i]);
				
				}
				
				for( var i = 0; i <= 2; i++ ){
				
					var tradeNum = this.rnd.integerInRange(0,2);
					var tradeNum2 = this.rnd.integerInRange(0,2);
					
					var tradeElem = this.buttonWord[tradeNum].frame;
					var tradeElem2 = this.buttonWord[tradeNum].hitGroup;
					var tradeElem3 = this.buttonWord[tradeNum].imageValue;
					
					this.buttonWord[tradeNum].frame = this.buttonWord[tradeNum2].frame;
					this.buttonWord[tradeNum].hitGroup = this.buttonWord[tradeNum2].hitGroup;
					this.buttonWord[tradeNum].imageValue = this.buttonWord[tradeNum2].imageValue;
					
					this.buttonWord[tradeNum2].frame = tradeElem;
					this.buttonWord[tradeNum2].hitGroup = tradeElem2;
					this.buttonWord[tradeNum2].imageValue = tradeElem3;
					/*
					var tradeElem = this.buttonWord[tradeNum];
					console.log("Valor do frame de "+tradeNum+" é de: "+this.buttonWord[tradeNum].frame);
					var tradeElem2 = this.buttonWord[tradeNum2];
					console.log("Valor do frame de "+tradeNum2+" é de: "+this.buttonWord[tradeNum2].frame);
					
					this.buttonWord[tradeNum].frame = this.buttonWord[tradeNum2].frame;
					this.buttonWord[tradeNum].hitGroup = this.buttonWord[tradeNum2].hitGroup;
					console.log("Novo valor do frame de "+tradeNum+" é de: "+this.buttonWord[tradeNum].frame);
					
					this.buttonWord[tradeNum2].frame = tradeElem.frame;
					this.buttonWord[tradeNum2].hitGroup = tradeElem.hitGroup;
					console.log("Novo valor do frame de "+tradeNum2+" é de: "+this.buttonWord[tradeNum2].frame);*/
				}
		
				this.tween_words(this.buttonWord[0], false);
				this.tween_words(this.buttonWord[1], false);
				this.tween_words(this.buttonWord[2], true);
			});
			
			this.groupFront = this.add.group();	
			
			this.createDelayTime( 3000, function(){
				this.clickable = true;
			});
		});
    },
	
    createButton: function( x, y, letterValue, image_value, time, canInteract, goToX, goToY) {
		
        var btn; 
		
		btn = this.add.button(x,y, "words", null, this);
	
        btn.anchor.set(0.5,0.5); 
        btn.scale.set(0.1,0.1);
		btn.originX = x;
		btn.originY = y;
		btn.hitGroup = letterValue;
		btn.imageValue = image_value;
		btn.go_x = goToX;
		btn.go_y = goToY;
		
        if(canInteract) {
			btn.onInputDown.add(this.onGameButtonClick, this);
			btn.onInputOver.add(this.onGameButtonOver, this);
			btn.input.useHandCursor = true;
		}

        return btn;
    },
	
	tween_words: function( elem, completed ){
		this.add.tween(elem).to({x: elem.go_x,y: elem.go_y}, 500,Phaser.Easing.Linear.None, true);	
			
		this.add.tween(elem.scale).to({x: 1.0,y: 1.0}, 510,Phaser.Easing.Linear.None, true);
	},

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {	

		if(this.changingLevel){
			this.clickable = false;
		}
		
		if( this.jr != null){
			this.jr.events.onAnimationComplete.add(function(){
				if(this.animationHit){
					console.log('go');
					this.jr.play('idle');
					this.bumba.play('idle');
					this.animationHit = false;
				}
			}, this);
		}

		
		if(this.dragOn){
			this.hitmap(750, 400, 900, 600, 0);
			if(this.game.input.activePointer.isDown){
				this.dragElem.x = this.input.mousePointer.x;
				this.dragElem.y = this.input.mousePointer.y;
			} else if (this.dragOn) {
				this.clickable = false;
				this.sound.play('hitErro');
				this.add.tween(this.dragElem).to({x: this.dragElem.go_x,y: this.dragElem.go_y}, 500,Phaser.Easing.Linear.None, true).onComplete.add(function(){
					this.groupLevel.add(this.dragElem);
					this.dragElem = null;
					this.clickable = true;
				}, this);
				this.dragOn = false;
			}
		}
		
		if(this.currentLevel == 1){
			if(this.lettersCorrect > 1){
				this.corrects++;
                this.saveCorrect();
				this.clickable = false;
				this.gotoNextLevel();
			}
		} else if(this.currentLevel == 2){
			if(this.lettersCorrect > 1){
				this.corrects++;
                this.saveCorrect();
				this.clickable = false;
				this.gotoNextLevel();
			}
		} else {
			if(this.lettersCorrect > 1){
				this.corrects++;
                this.saveCorrect();
				this.clickable = false;
				this.gotoNextLevel();
			}
		}
	}
};
