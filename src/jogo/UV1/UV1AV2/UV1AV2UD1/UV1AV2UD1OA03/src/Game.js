
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
        this.TEMPO_INTRO = 4500;
		this.TEMPO_INTRO2 = 24500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 5000;
        this.TEMPO_RESUMO = 15000;
        this.SOUND_VITORIA = 1000;
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
        this.isWrong = false;
		
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
        this.texto['initialText'] = "Vamos descobrir quantos itens \ntemos nos objetos abaixo?";
        this.texto['initialText2'] ="Por exemplo, nessas [duas árvores com maçãs]? \nQuantas maçãs tem nelas? É só contar quantas\n maçãs temos em cada árvore e depois juntar\n tudo! Fácil!";
        this.texto['imgResumo'] ="Pessoal, lembram quando aprendemos \na somar os números?";
        this.texto['imgResumo2'] ="";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Contem quantas bananas tem nos dois cachos e \ncliquem na quantidade correta!",
            "Contem quantas bolinhas de gude tem nos dois \nsaquinhos e cliquem na quantidade correta!",
            "Muito bom! Contem quantos carrinhos têm nas \nduas caixas juntas e cliquem na quantidade \ncorreta!"
        ];
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

            py += 32 + _lineHeight;

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
	
	livesCondition: function(){
		
		this.lives--;
		//this.levelAudio.stop();
		this.changingLevel = true;
        this.isWrong = true;
		
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
		
		switch(this.lives) {
            case 1: // mostra dica 1
				if(this.currentLevel >= 2){ 
					this.currentLevel--;
					console.log("level atual: "+this.currentLevel);
				}
				//this.sound.play('hitErro');
				this.updateLivesText();
                this.sound.play("soundDica");
				this.hideAndShowLevel(true);
            break;
            case 0: // toca som de resumo
				//this.sound.play('hitErro');
				this.updateLivesText();
                this.showResumo();
            break;
            default: // game over
            break;
        }
	},

    onGameButtonClick: function(elem) {
        if(this.clickable){
            console.log("onGameButtonClick");
            console.log(elem.name);
            if(elem.name==this.soma){
                console.log("correto");
                this.lettersCorrect++;
                this.clickable = false;
                this.dragOn = false;
                this.sound.play('hitAcerto');
                this.animationHit = true;
                //this.clickable = true;
                this.add.tween(elem.scale).to({x:0.75,y:0.75}, 100,Phaser.Easing.Linear.None, true);
                this.add.tween(elem).to({x:this.world.centerX + 98,y:410}, 500,Phaser.Easing.Linear.None, true);
                
                this.jr.play('comemora');
                this.bumba.play('comemora');
                this.createDelayTime(1000, function() {this.rightAnswer();}); // para o próximo nível  
            }else{
                console.log("errado");
                this.clickable = false;
                this.dragOn = false;
                
                this.sound.play('hitErro');
                this.createDelayTime(1000, function() {this.livesCondition();}); // para o próximo nível  
                this.add.tween(elem).to({x: elem.originX,y: elem.originY}, 500,Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.groupLevel.add(elem);
                    this.dragElem = null;
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
	
	showTextoIntro: function() {

        this.tutorialText = this.drawText(this.world.centerX+40, 30, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
    
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim(this.TEMPO_INTRO);

        this.soundIntro = this.sound.play("soundIntro");
		
		this.intro_anim = this.createAnimation( 180, 200, "intro", 0.8, 0.8);
		this.intro_anim.animations.add('play_intro', this.math.numberArray(0,56), 18, false);
		this.groupIntro.add(this.intro_anim);

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },
	
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
    
	 // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		this.add.tween(this.tutorialPlacar).to({y: -100}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.tutorialText = this.drawText(this.world.centerX, 25, this.texto['initialText2'], 22, "left");
            this.tutorialText.alpha = 0;
            this.add.tween(this.tutorialText).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.tutorialText);
        }, this);
		
       	this.createDelayTime(1800, function(){
			
			this.buttonTutorial = [];
			
			for( var i = 0; i <= (this.currentLevel + 1); i++ ){

				var position_y = 100 * i;
				
				var randomLetter = 5 + (i * 3);
				if( i < 2){
					this.buttonTutorial[i] = this.createButton( 250 , this.world.centerY + 150 + position_y , i, 100, false);
				} else {
					this.buttonTutorial[i] = this.createButton( 750 , this.world.centerY + 200 , i, 100, false);	
				}
				this.groupIntro.add(this.buttonTutorial[i]);
				this.buttonTutorial[i].frame = randomLetter;
				
			}
				
		});
		
		this.createDelayTime( 100, function() {
            this.showFinishedLiveTutorial();
        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

		this.intro_anim.animations.play('play_intro');
		this.createDelayTime( 7500, function(){
            this.arrow = this.add.sprite(this.world.centerX+100, this.world.centerY, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);
			this.add.tween(this.arrow).to({x: this.buttonTutorial[1].x + 30, y: this.buttonTutorial[1].y + 20}, 600, Phaser.Easing.Linear.None, true);
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
		
		this.createDelayTime( 11500, function(){
			
			this.add.tween(this.buttonTutorial[1]).to({x: 590, y:520}, 1200, Phaser.Easing.Linear.None, true);
			//this.add.tween(this.arrow).to({x: 620, y: 540}, 1200, Phaser.Easing.Linear.None, true);
			
		});
		
        this.createDelayTime( 16000, function() {
			
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
        this.tutorialText = this.drawText(this.world.centerX, 90, this.texto['imgResumo'], 22, "left");
        this.tutorialText.alpha = 0;
        

        dif =  this.world.centerX-220;

        this.tutorialText2 = this.add.sprite(dif, 90, '3macas');
        this.tutorialText2.alpha = 0;
        this.tutorialText2.anchor.set(0.5, 0.5);

        dif += this.tutorialText2.width+0;

        this.tutorialText3 = this.add.sprite(dif, 90, 'mais');
        this.tutorialText3.alpha = 0;
        this.tutorialText3.anchor.set(0.5, 0.5);

        dif += this.tutorialText3.width+50;

        this.tutorialText4 = this.add.sprite(dif, 90, '4macas');
        this.tutorialText4.alpha = 0;
        this.tutorialText4.anchor.set(0.5, 0.5);

        dif += this.tutorialText4.width-20;

        this.tutorialText5 = this.add.sprite(dif, 90, 'igual');
        this.tutorialText5.alpha = 0;
        this.tutorialText5.anchor.set(0.5, 0.5);

        dif += this.tutorialText5.width+90;

        this.tutorialText6 = this.add.sprite(dif, 90, '7macas');
        this.tutorialText6.alpha = 0;
        this.tutorialText6.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);
        this.groupIntro.add(this.tutorialText2);
        this.groupIntro.add(this.tutorialText3);
        this.groupIntro.add(this.tutorialText4);
        this.groupIntro.add(this.tutorialText5);
        this.groupIntro.add(this.tutorialText6);

        this.soundResumo = this.sound.play("soundResumo");

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(4000, function() {
            this.add.tween(this.tutorialText).to({alpha:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialText2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
            },this);
         });

        this.createDelayTime(7500, function() {
            this.add.tween(this.tutorialText3).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(8000, function() {
            this.add.tween(this.tutorialText4).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(9500, function() {
            this.add.tween(this.tutorialText5).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(11000, function() {

            this.add.tween(this.tutorialText6).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        });

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {
            this.add.tween(this.tutorialText2).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText3).to({alpha:0}, 600, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText4).to({alpha:0}, 700, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText5).to({alpha:0}, 800, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText6).to({alpha:0}, 900, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

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
		//this.levelAudio.stop();
		
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
        this.background = this.add.sprite( -300, -204, 'background');
        //this.background.height = 800;
		
		this.jr = this.createAnimation( 790, 330, "juninho_idle", 1.0, 1.0);
		this.jr.animations.add('idle', this.math.numberArray(0,49), 18, true);
		this.jr.animations.add('comemora', this.math.numberArray(50,100), 18, false);
		this.jr.animations.play('idle');
		
		this.bumba = this.createAnimation( 840, 370, "bumba_idle", 1.0, 1.0);
		this.bumba.animations.add('idle', this.math.numberArray(0,69), 18, true);
		this.bumba.animations.add('comemora', this.math.numberArray(70,83), 18, true);
		this.bumba.animations.play('idle');

        this.background_anim = this.add.sprite(-108, -66, 'capsulas');
        this.animBackground(this.background_anim);
    },

    animBackground:function(elem) {
        this.add.tween(elem).to({x: elem.x + 10, y: elem.y + 3}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
    },

    // level - mostrar proximo
    showNextLevel: function() {
        this.animBackground(this.background_anim);
        this.openLevel();

        if(!this.isWrong){
            this.add.tween(this.placar).to({y: -170}, 500, Phaser.Easing.Linear.None, true, 500);
              
        }
	   
		if( this.groupLevel != null ) this.groupLevel.removeAll();
		if( this.groupFront != null ) this.groupFront.removeAll();
		this.changingLevel = false;
        this.initLevel();
     
    },
	
	showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 20, this.questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        
        //this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.createDelayTime(700, function(){
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
            this.levelAudio = this.sound.play('pergunta_'+this.currentLevel+'_aud');
        }, this);
    },

    initLevel: function() {
		var time_to_begin = 0;
		console.log("current level: "+this.currentLevel);
        this.groupLevel = this.add.group();
         delay = 500;
        if(!this.isWrong){
             this.showQuestion(this.currentLevel); 
             this.groupLevel.add(this.imageQuestion);  

        }else{
            delay = 500;
        }

        this.isWrong = false;
		
		this.createDelayTime(delay, function(){
			
			this.buttonWord = [];
			this.level_image[0] = this.add.sprite(this.world.centerX + 140, 270, "level"+this.currentLevel+"_question");
			this.level_image[0].frame = 1;
			this.level_image[0].anchor.set(0.5,0.5);
			if(this.currentLevel == 1 ){
				this.level_image[0].y = 260;
				this.level_image[0].angle = 270;
			}
			this.groupLevel.add(this.level_image[0]);
			this.level_image[1] = this.add.sprite(this.world.centerX - 130, 270, "level"+this.currentLevel+"_question");
			this.level_image[1].frame = 0;
			this.level_image[1].anchor.set(0.5,0.5);
			if(this.currentLevel == 1 ){
				this.level_image[1].y = 290;
				this.level_image[1].angle = 270;
			}
			this.groupLevel.add(this.level_image[1]);
			this.level_image[2] = this.add.sprite(this.world.centerX - 110, 390, "pergunta_"+this.currentLevel+"_calc");
			this.level_image[2].scale.set(0.8,0.8);
			this.level_image[3] = this.add.sprite(this.world.centerX - 130, 378, "numbersChoice_holder");
			this.level_image[3].scale.set(1.5,1.4);
			this.groupLevel.add(this.level_image[3]);
			this.groupLevel.add(this.level_image[2]);
			this.level_image[4] = this.add.sprite(this.world.centerX + 65, 385, "numbersChoice");
			this.level_image[4].frame = 0;
			this.level_image[4].scale.set(0.7,0.7);
			this.groupLevel.add(this.level_image[4]);

			for( var i = 0; i < 3; i++ ){
				
				var randomLetter = 0;
				
				console.log("current level: "+(this.currentLevel + 1));
				
				var position_x = 130 + ( i * 120 );
				
				if(this.currentLevel == 1){
					if(i == 0)	randomLetter = 12;
					else if(i ==1) randomLetter = 10;
					else randomLetter = 14;	
                     this.soma = 12;
				} else if ( this.currentLevel == 2){
					if(i == 0)	randomLetter = 13;
					else if(i ==1) randomLetter = 11;
					else randomLetter = 15;	
                    this.soma = 13;	
				} else {
					if(i == 0)	randomLetter = 18;
					else if(i == 1) randomLetter = 16;
					else randomLetter = 20;	
                    this.soma = 18;	
				}
				
				if( i == 0 ){	
					this.buttonWord[i] = this.createButton( 250 + position_x , this.world.centerY + 200, 1, 100, true);
				}else{
					this.buttonWord[i] = this.createButton( 250 + position_x , this.world.centerY + 200, 0, 100, true);
				}
				
				this.buttonWord[i].frame = randomLetter;
                this.buttonWord[i].name = randomLetter;
				this.groupLevel.add(this.buttonWord[i]);
			
			}
			
			this.groupFront = this.add.group();
			
			this.createDelayTime(600, function(){
				this.clickable = true;
			});
				
		});
    },
	
    createButton: function( x, y, letterValue, time, canInteract) {
		
        var btn; 
		
		btn = this.add.button(x,y, "numbersChoice", null, this);
	
        btn.anchor.set(0.5,0.5); 
        btn.scale.set(0.8,0.8);
		btn.originX = x;
		btn.originY = y;
		btn.hitGroup = letterValue;
		
        if(canInteract) {
			btn.onInputDown.add(this.onGameButtonClick, this);
			btn.input.useHandCursor = true;
		}

        return btn;
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/   

    rightAnswer: function() { 
        console.log("rightAnswer");
        if(this.currentLevel == 1){
            if(this.lettersCorrect > 0){
                this.corrects++;
                this.saveCorrect();
                this.clickable = false;
                this.createDelayTime(100, function() {this.gotoNextLevel();}); // para o próximo nível   

            }
        } else if(this.currentLevel == 2){
            if(this.lettersCorrect > 0){
                this.corrects++;
                this.saveCorrect();
                this.clickable = false;
                this.createDelayTime(100, function() {this.gotoNextLevel();}); // para o próximo nível   
            }
        } else {
            if(this.lettersCorrect > 0){
                this.corrects++;
                this.saveCorrect();
                this.clickable = false;
                this.createDelayTime(100, function() {this.gotoNextLevel();}); // para o próximo nível  
            }
        }
    },

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
	}
};
