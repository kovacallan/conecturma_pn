
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
        this.TEMPO_INTRO = 8500;
		this.TEMPO_INTRO2 = 10500;
        this.TEMPO_ERRO1 = 4000;
        this.TEMPO_RESUMO = 41000;
        this.SOUND_VITORIA = 100;
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
		this.tutorialText;
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
		this.buttonTutorial = [];
		this.level_number;
		this.keyboard_click;
		this.input.keyboard.addCallbacks(this, null, null, this.keyPress);
		
		this.randomLetter;
		this.tutorialText;
		this.buttonWord = [];
		this.tutorial_img = [];

        this.totalSubNiveis = [null,2,0,0];
        this.SubNiveis = [null,1,0,0];
		
		this.levelAudio;
        
        this.createScene();

        this.showIntro();
        //this.showResumo();

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();
		
	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Já aprendemos o que é a subtração. \nQuando perdemos ou damos algo, \nnós subtraímos.";
        this.texto['initialText2'] ="Por exemplo, se temos [10 peixinhos] na lagoa \ne [4] vão embora, temos [6 peixinhos]. Viram só \ncomo fizemos a continha? Agora vamos \npraticar!";
        this.texto['imgResumo'] ="Como vimos no exemplo, subtrair é dar, \nperder, usar apenas uma parte. ";
        this.texto['imgResumo2'] ="Se temos [18 bananas], [5 estão verdes], e queremos saber \nquantas estão maduras, basta desenharmos as 18 \nbananas e riscarmos 5. Agora, contamos quantas \nsobraram. Sobraram [13 bananas]!";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Se eu tenho [8 peixes] na lagoa e este número de \npeixes nada para longe, com quantos peixes \nficamos? Digitem a resposta no teclado \nnumérico!",
            "Se eu tenho [12 peixes] na lagoa e este número de \npeixes nada para longe, com quantos peixes \nficamos? ",
            "Se eu tenho [15 peixes] na lagoa e este número de \npeixes nada para longe, com quantos peixes \nficamos? ",
            "Se eu tenho [20 peixes] na lagoa e este número de \npeixes nada para longe, com quantos peixes \nficamos? "
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

    showKey: function(value) {

        console.log("***showKey***");
        
        this.currentKey = this.add.bitmapText( this.background_leafs[2].x -85, this.background_leafs[1].y + 260, "JandaManateeSolid", value.toString(), 50);
        this.currentKey.tint = '0xA2FF43';
        this.groupLevel.add(this.currentKey);
        
    },
	
	keyPress: function(elem){
        console.log(elem);
		if( this.clickable ){
			if(elem == this.right_result){
				this.clickable = false;
				this.sound.play('hitAcerto');
				this.animationHit = true;
				
                
				this.clickable = false;
				this.buttonWord[5] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 280, 0, 100, false);
				this.buttonWord[5].frame = this.right_result;
				this.buttonWord[5].anchor.set(0.5, 0.5);
				this.groupLevel.add(this.buttonWord[5]);
				//this.createDelayTime(1000, function(){
					///this.gotoNextLevel();
				//});
                if(this.totalSubNiveis[this.currentLevel]>0){
                    this.totalSubNiveis[this.currentLevel]--;
                    this.SubNiveis[this.currentLevel]++;
                }

                if(this.totalSubNiveis[this.currentLevel]==0){
                    this.saveCorrect();
                    this.createDelayTime(3000, this.clickRightAnswer); // para o próximo nível 
                }else{
                    this.saveCorrect(this.totalSubNiveis[this.currentLevel] * 50, false);
                    this.createDelayTime(3000, function(){
                        this.imageQuestion.alpha = 0;
                        this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
                    });
                    
                    this.createDelayTime(4000, this.showNextLevel); // para o próximo nível 
                }
			} else {
				this.clickable = false;
                this.totalSubNiveis = [null,2,0,0];
                this.SubNiveis = [null,1,0,0];
                //this.buttonWord[5] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 280, 0, 100, false);
                //this.buttonWord[5].frame = elem;
                //this.buttonWord[5].anchor.set(0.5, 0.5);
                this.showKey(elem);
                
                this.createDelayTime(1000, function(){
                    this.livesCondition();
                });
				
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

        this.groupHud = this.add.group();

        this.add.sprite(0,0, "hud", 0, this.groupHud);

        this.livesTextShadow = this.add.bitmapText(111,36, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.groupHud.add(this.livesTextShadow);

        this.livesText = this.add.bitmapText(110,35, "JandaManateeSolid", this.lives.toString(), 18);
        this.groupHud.add(this.livesText);

        this.pointsTextShadow = this.add.bitmapText(51,102, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.groupHud.add(this.pointsTextShadow);

        this.pointsText = this.add.bitmapText(50,101, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.groupHud.add(this.pointsText);

        
        var coin = this.add.bitmapText(31,191, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        this.groupHud.add(coin);

        var xpt = this.add.bitmapText(30,190, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        this.groupHud.add(xpt);
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
	
    clickRightAnswer: function() { 
        console.log("--rightAnswer--");
        this.corrects++;
        this.createDelayTime(500, this.gotoNextLevel ); // para o próximo nível   
    },

	livesCondition: function(){
		
		this.lives--;
		this.levelAudio.stop();
		this.changingLevel = true;

        this.showBackground(1);
        this.imageQuestion.alpha = 0;
        this.showCallToAction = false;
		
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
		
		switch(this.lives) {
            case 1: // mostra dica 1
				if(this.currentLevel >= 2){ 
					this.currentLevel--;
				}
				this.sound.play('hitErro');
				this.updateLivesText();
                this.sound.play("soundDica");
                this.createDelayTime(2500, function(){
                    this.hideAndShowLevel(true);
                });
				
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

        //this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);
	
        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },
	
	showTextoIntro: function() {

        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");//this.add.sprite( this.world.centerX+60, 110, 'initialText');
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        //this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");
	
        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },
	
	showKim: function() {
        this.kim = this.createAnimation( this.world.centerX-320, 200, 'kimAntiga', 1,1);
        this.kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        this.kim.crop(rect);

        //this.groupIntro.add(kim);

        this.add.tween(this.kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },
	 // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.peixe = this.createAnimation(800, 700, "peixe", 1.0, 1.0);
        this.peixe1 = this.createAnimation(955, -50, "peixe1", 1.0, 1.0);
        this.peixe2 = this.createAnimation(355, -360, "peixe2", 1.0, 1.0);
        
       
        this.groupIntro.add(this.peixe);
        this.groupIntro.add(this.peixe1);
        this.groupIntro.add(this.peixe2);

        this.background_leafs[0] = this.add.sprite( 150, 100, 'folhas');
        this.background_leafs[0].angle = 35;
        this.background_leafs[0].scale.set(0.6, 0.6);
        this.background_leafs[0].anchor.set(0.5, 0.5);
        this.background_leafs[0].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs[0].animations.play('idle');
        
        this.background_leafs[1] = this.add.sprite( 810, 210, 'folhas');
        this.background_leafs[1].angle = 180;
        this.background_leafs[1].scale.set(0.7, 0.7);
        this.background_leafs[1].anchor.set(0.5, 0.5);
        this.background_leafs[1].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs[1].animations.play('idle');


        this.background_leafs[2] = this.add.sprite( 320, 410, 'folhas');
        this.background_leafs[2].angle = -44;
        this.background_leafs[2].scale.set(1.0, 1.0);
        this.background_leafs[2].anchor.set(0.5, 0.5);
        this.background_leafs[2].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs[2].animations.play('idle');
        
        this.background_trees = this.add.sprite( -300, -250, 'background_trees');

        this.groupIntro.add(this.background_leafs[0]);
        this.groupIntro.add(this.background_leafs[1]);
        this.groupIntro.add(this.background_leafs[2]);
        this.groupIntro.add(this.background_trees);
        
        this.lotus = this.add.sprite(777,151, 'lotus');
        this.groupIntro.add(this.lotus);

         this.add.tween(this.peixe).to({x:-200,y:-200}, 7000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.peixe.angle -=180;
            this.add.tween(this.peixe).to({x:800,y:900}, 6000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.peixe.destroy();
            },this)
        },this);

        this.add.tween(this.peixe1).to({x:71,y:600}, 7000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.peixe1.angle -=180;
            this.add.tween(this.peixe1).to({x:955,y:-200}, 6000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.peixe1.destroy();
            },this)
        },this);

        this.add.tween(this.peixe2).to({x:395,y:600}, 7000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.peixe2.angle -=180;
            this.add.tween(this.peixe2).to({x:355,y:-360}, 6000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.peixe2.destroy();
            },this)
        },this);


		
		this.tutorialText =this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left"); //this.add.sprite( this.world.centerX, 110, 'initialText2');
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.world.bringToTop(this.tutorialPlacar);
        this.world.bringToTop(this.tutorialText);
        //this.groupIntro.add(this.tutorialText);
		
       	this.createDelayTime( 1800, function(){
			
			this.levelContent = [];
			
			this.levelContent[0] = this.add.sprite( this.world.centerX + 200, this.world.centerY + 200, "intro_keyboard");
			this.levelContent[0].anchor.set(0.5,0.5);
			this.levelContent[0].scale.set(0.8,0.8);
			this.levelContent[0].alpha = 0;
			
			this.levelContent[1] = this.add.sprite( this.world.centerX + 200, this.world.centerY + 210, "intro_button");
			this.levelContent[1].anchor.set(0.5,0.5);
			this.levelContent[1].scale.set(0.8,0.8);
			this.levelContent[1].alpha = 0;
			
			this.levelContent[2] = this.add.sprite( this.world.centerX + 160, this.world.centerY + 250, "intro_dedo");
			this.levelContent[2].anchor.set(0.5,0.5);
			this.levelContent[2].scale.set(0.8,0.8);
			this.levelContent[2].alpha = 0;
			
			this.groupIntro.add(this.levelContent[0]);
			this.groupIntro.add(this.levelContent[1]);
			this.groupIntro.add(this.levelContent[2]);
			
			this.buttonTutorial[0] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 170, 0, 100, false);  
			this.buttonTutorial[0].frame = 10;
			this.buttonTutorial[0].anchor.set(0.5, 0.5);
			
			this.buttonTutorial[1] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 210, 0, 100, false);
			this.buttonTutorial[1].frame = 4;
			this.buttonTutorial[1].anchor.set(0.5, 0.5);
			
			this.buttonTutorial[2] = this.add.sprite( this.background_leafs[2].x - 125, this.background_leafs[1].y + 210, "menos");
			this.buttonTutorial[2].anchor.set(0.5, 0.5);
			
			this.buttonTutorial[3] = this.add.sprite( this.background_leafs[2].x - 75, this.background_leafs[1].y + 250, "barra");
			this.buttonTutorial[3].anchor.set(0.5, 0.5);
					
			this.groupIntro.add(this.buttonTutorial[0]);
			this.groupIntro.add(this.buttonTutorial[1]);
			this.groupIntro.add(this.buttonTutorial[2]);
			this.groupIntro.add(this.buttonTutorial[3]);
			
				
		});
		
		this.createDelayTime( 3000, function() {
            this.showFinishedLiveTutorial();
        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {	
		
		this.createDelayTime( 4500, function(){
			this.buttonTutorial[4] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 280, 0, 100, false);
			this.buttonTutorial[4].frame = 6;
			this.buttonTutorial[4].anchor.set(0.5, 0.5);
			this.groupIntro.add(this.buttonTutorial[4]);
            
			
			this.add.tween(this.levelContent[0]).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true, 500);
			
		},this);

        //this.buttons[0].alpha = 0.7;
		
        // remover click
		
		this.createDelayTime( 6500, function(){
	
			this.add.tween(this.levelContent[1]).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true, 500);
			this.add.tween(this.levelContent[2]).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true, 500);
			
		});
		
		this.createDelayTime( 7700, function(){
			var click = this.add.sprite(this.levelContent[2].x+20, this.levelContent[2].y-65, "clickAnimation");
			click.animations.add('idle', null, 18, true);
			click.animations.play('idle');
			this.groupIntro.add(click);
			
			this.createDelayTime( 2400, function() {
				click.alpha = 0;
				click.destroy();
			});
		});
		
		this.createDelayTime( this.TEMPO_INTRO2, function() {
            this.groupIntro.add(this.tutorialText);
            this.groupIntro.add(this.kim);
            this.groupIntro.add(this.tutorialPlacar);
			
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);

        });
    },
	
    skipIntro: function() {

        this.groupIntro.add(this.tutorialText);
        this.groupIntro.add(this.kim);
        this.groupIntro.add(this.tutorialPlacar);

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
    },
	
	// resumo inicial
    showTextResumo: function() {
		this.sound.stopAll();
		this.soundResumo = this.sound.play("soundResumo");
        this.tutorialText = this.drawText(this.world.centerX, 70, this.texto['imgResumo'], 22, "left");

        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);
		
		this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		
		this.createDelayTime( 7500, function() {
			
			this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
				this.tutorialText = null;
				this.tutorialText = this.drawText(this.world.centerX, 5, this.texto['imgResumo2'], 19, "left");
                //this.add.sprite( this.world.centerX, 60, 'resumo_img2');
				this.tutorialText.alpha = 0;
				//this.tutorialText.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				
			}, this);

        });
		
		this.createDelayTime( 8500, function() {	
			this.drawResumo(1, this.world.centerX - 200);
        });
		
		this.createDelayTime( 20500, function() {	
			this.drawResumo(2, this.world.centerX - 90);
        });
		
		this.createDelayTime( 21500, function() {	
			this.drawResumo(3, this.world.centerX + 10);
        });
		
		this.createDelayTime( 23500, function() {	
			this.drawResumo(4, this.world.centerX + 100 );
        });
		
		this.createDelayTime( 26500, function() {	
			this.drawResumo(5, this.world.centerX + 200);
        });
		
		this.createDelayTime( 29000, function() {
			this.hideResumo();
		});
    },
	
	drawResumo: function(number, position){
			this.tutorial_img[number - 1] = null;
			this.tutorial_img[number - 1] = this.add.sprite( position, 165, 'resumo_tutorial'+number);
			this.tutorial_img[number - 1].alpha = 0;
			this.tutorial_img[number - 1].anchor.set(0.5, 0.5);
			this.add.tween(this.tutorial_img[number - 1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.tutorial_img[number - 1]);
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
        this.add.tween(this.tutorialText).to({alpha:0},100, Phaser.Easing.Linear.None, true);
        this.add.tween(this.groupIntro).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true).onComplete.add( this.gameOverLose, this );	
    },

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
	
    initGame: function() {
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
	
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
		
		this.groupbuttonWord = this.add.group();

        this.groupLevel = this.add.group();
		
		this.createDelayTime(500, function(){
			this.showNextLevel();
		});
    },
	
	// Auxiliares de level - passar, voltar, etc.

	gotoNextLevel: function() {
		this.imageQuestion.alpha = 0;
		this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
		this.changingLevel = true;
        this.currentLevel++;
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
        //console.log("***hideAndShowLevel***");

        this.hideLevel(function() {
            console.log("____________ ");
            console.log("currentLevel "+this.currentLevel);
            console.log("corrects "+this.corrects);
            console.log("____________ ");
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                if(!this.showCallToAction)
                {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }
                else
                {
                    this.showNextLevel();
                }
            } else {
                this.gameOverMacaco();
            }
        });
    },
	
	/*hideAndShowLevel: function(isWrong) {

		this.lettersCorrect = 0;
		this.levelAudio.stop();
		
		if(this.corrects < this.TOTAL_LEVEL) {
			if(isWrong) {
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true)
				this.createDelayTime( this.TEMPO_ERRO1, function(){
					this.showNextLevel();
				});
				
			} else {
				this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
			}

		} else {
			this.add.tween(this.groupLevel).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
			this.gameOverMacaco();
		}
    },*/

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

    createPeixe:function(){

        if(this.currentLevel==1){
            switch(this.SubNiveis[1]){
                case 1:
                    num_peixes = 8;
                break;
                case 2:
                    num_peixes = 12;
                break;
            }
        }
        if(this.currentLevel==2){
            num_peixes = 15;
        }
        if(this.currentLevel==3){
            num_peixes = 20; 
        }

        this.tipo = ["peixe","peixe1","peixe","peixe1","peixe","peixe1","peixe","peixe1","peixe","peixe1","peixe1","peixe","peixe1","peixe","peixe1","peixe","peixe1","peixe","peixe1","peixe1"];
        this.posicaoX = [598,498,983,1081,588,822,106,-2,478,558,528,943,1001,1181,1281,648,862,762,702,888];
        this.posicaoY = [-88,-88,333,210,600,620,330,435,-88,-88,-58,383,250,300,310,640,660,680,700,780];
        this.angulo = [-180,-40,-70,+50,+40,+120,+110,-140,-180,-40,-40,-70,+50,-70,+50,+40,+120,+50,+110,+110];
        this.descolamentoY = [+450,+350,0,0,-250,-230,0,0,+450,+350,+370,0,0,0,0,-250,-230,-250,-230,-250];
        this.descolamentoX = [0,0,-340,-340,0,0,+510,+510,0,0,0,-200,-210,-290,-300,0,0,0,0,0];

        this.peixes = [];
        this.temp_peixes = []; 

        for(i=0;i<num_peixes;i++){
            this.peixes[i] = this.createAnimation(this.posicaoX[i],this.posicaoY[i], this.tipo[i], 1.0, 1.0);
            this.peixes[i].angle = this.angulo[i];
            this.peixes[i].scale.set(0.7,0.7);
            this.groupLevel.add(this.peixes[i]);

            x1 = this.peixes[i].x+this.descolamentoX[i];
            y1= this.peixes[i].y+this.descolamentoY[i];
            this.add.tween(this.peixes[i]).to({x:x1,y:y1}, 2000, Phaser.Easing.Linear.None, true);
        }
    },

    createSaida:function(num){
        this.descolamentoY = [1000,1000,0,0,-1000,-1000,0,0,1000,1000,1000,0,0,0,0,-1000,-1000,-1000,-1000,-1000];
        this.descolamentoX = [0,0,-1500,-1500,0,0,1500,1500,0,0,0,-1500,-1500,-1500,-1500,0,0,-1500,-1500,0,0,0];
        for(i=0;i<num;i++){


            x1 = this.peixes[i].x + this.descolamentoX[i];
            y1= this.peixes[i].y + this.descolamentoY[i];
            this.add.tween(this.peixes[i]).to({x:x1,y:y1}, 2000, Phaser.Easing.Linear.None, true);
        }
    },

    createCenario:function(){

        this.background_leafs[0] = this.add.sprite( 150, 100, 'folhas');
        this.background_leafs[0].angle = 35;
        this.background_leafs[0].scale.set(0.6, 0.6);
        this.background_leafs[0].anchor.set(0.5, 0.5);
        this.background_leafs[0].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs[0].animations.play('idle');
        
        this.background_leafs[1] = this.add.sprite( 810, 210, 'folhas');
        this.background_leafs[1].angle = 180;
        this.background_leafs[1].scale.set(0.7, 0.7);
        this.background_leafs[1].anchor.set(0.5, 0.5);
        this.background_leafs[1].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs[1].animations.play('idle');


        this.background_leafs[2] = this.add.sprite( 320, 410, 'folhas');
        this.background_leafs[2].angle = -44;
        this.background_leafs[2].scale.set(1.0, 1.0);
        this.background_leafs[2].anchor.set(0.5, 0.5);
        this.background_leafs[2].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs[2].animations.play('idle');
        
        this.background_trees = this.add.sprite( -300, -250, 'background_trees');

        this.lotus = this.add.sprite(777,151, 'lotus');



        this.groupLevel = this.add.group();
        
        this.createPeixe();

        this.groupLevel.add(this.background_leafs[0]);
        this.groupLevel.add(this.background_leafs[1]);
        this.groupLevel.add(this.background_leafs[2]);
        this.groupLevel.add(this.background_trees);
        this.groupLevel.add(this.lotus);

              
        this.world.bringToTop(this.placar);
        this.world.bringToTop(this.imageQuestion);
        this.world.bringToTop(this.groupHud);
        this.world.bringToTop(this.groupBottom);

    },

    showBackground:function(alpha){
        this.background_leafs1[0].alpha = alpha;
        this.background_leafs1[1].alpha = alpha;
        this.background_leafs1[2].alpha = alpha;
        this.background_trees1.alpha = alpha;
        this.lotus1.alpha = alpha;
    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
		
		this.background_leafs1 = [];
        this.background_leafs = [];

        this.groupBackground = this.add.group();
	
        this.background = this.add.sprite( -250, -400, 'background');

        this.background_leafs1[0] = this.add.sprite( 150, 100, 'folhas');
        this.background_leafs1[0].angle = 35;
        this.background_leafs1[0].scale.set(0.6, 0.6);
        this.background_leafs1[0].anchor.set(0.5, 0.5);
        this.background_leafs1[0].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs1[0].animations.play('idle');
        
        this.background_leafs1[1] = this.add.sprite( 810, 210, 'folhas');
        this.background_leafs1[1].angle = 180;
        this.background_leafs1[1].scale.set(0.7, 0.7);
        this.background_leafs1[1].anchor.set(0.5, 0.5);
        this.background_leafs1[1].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs1[1].animations.play('idle');


        this.background_leafs1[2] = this.add.sprite( 320, 410, 'folhas');
        this.background_leafs1[2].angle = -44;
        this.background_leafs1[2].scale.set(1.0, 1.0);
        this.background_leafs1[2].anchor.set(0.5, 0.5);
        this.background_leafs1[2].animations.add('idle', this.math.numberArray(0,20), 18, true);
        this.background_leafs1[2].animations.play('idle');
        
        this.background_trees1 = this.add.sprite( -300, -250, 'background_trees');
        this.lotus1 = this.add.sprite(777,151, 'lotus');
    },


    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();
		
		if( this.groupLevel != null ) this.groupLevel.removeAll();
		this.changingLevel = false;
        this.showBackground(0);

        if(this.currentLevel==1){
            switch(this.SubNiveis[1]){
                case 1:
                    this.showQuestion(1); 
                break;
                case 2:
                    this.showQuestion(2); 
                break;
            }
        }
        if(this.currentLevel==2){
            this.showQuestion(3); 
        }
        if(this.currentLevel==3){
            this.showQuestion(4); 
        }

        
		this.createCenario();
        this.initLevel();
     
    },
	
	showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 30, this.questionList[num]);
       // this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;
        this.delay = 6000;

        if(this.currentLevel==1){
            switch(this.SubNiveis[1]){
                case 1:
                this.delay = 15000;
                break;
                case 2:
                    this.delay = 11000;
                break;
            }
        }
        if(this.currentLevel==2){
            this.delay = 10000;
        }
        if(this.currentLevel==3){
            
            this.delay = 10000;
        }

        if(this.showCallToAction) {
            this.delay = 6000;
            return;
        }

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500);
		this.createDelayTime( 1500, function(){
        	this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			this.levelAudio = this.sound.play('pergunta_'+num+'_aud');
		}, this);
    },

    initLevel: function() {
		
		var time_to_begin = 0;
		this.showCallToAction = false;

        //1 e 2 - nivel 1
        //3 - nivel 2
        //4 - nivel 3
        //this.showQuestion(this.currentLevel); 

        console.log("nivel: "+this.currentLevel);
        //console.log("total sub: "+this.totalSubNiveis[this.currentLevel]);
        console.log("sub Nivel: "+this.SubNiveis[this.currentLevel]);
        console.log("pontos: "+this.corrects);


        if(this.currentLevel==1){
            switch(this.SubNiveis[1]){
                case 1:
                    //this.showQuestion(1); 
                    this.level_number = 8;
                    this.random_number = this.rnd.integerInRange(1,7);
                    
                break;
                case 2:
                    //this.showQuestion(2); 
                    this.level_number = 12;
                    this.random_number = this.rnd.integerInRange(5,8);
                break;
            }
        }
        if(this.currentLevel==2){
            //this.showQuestion(3); 
            this.level_number = 15;
            this.random_number = this.rnd.integerInRange(7,10);
        }
        if(this.currentLevel==3){
            //this.showQuestion(4); 
            this.level_number = 20;
            this.random_number = this.rnd.integerInRange(11,14);
        }

		this.right_result = this.level_number - this.random_number;
		
		this.createDelayTime( 100, function(){
			
			
			//this.groupLevel.add(this.imageQuestion);
				
			this.buttonWord[0] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 170, 0, 100, false);
			this.buttonWord[0].anchor.set(0.5, 0.5);
			this.buttonWord[0].frame = this.level_number;
			this.buttonWord[1] = this.createButton( this.background_leafs[2].x -65, this.background_leafs[1].y + 210, 0, 100, false);
			this.buttonWord[1].anchor.set(0.5, 0.5);
			this.buttonWord[1].frame = this.random_number;
			this.buttonWord[1].alpha = 0;
			this.buttonWord[2] = this.add.sprite( this.background_leafs[2].x - 125, this.background_leafs[1].y + 210, "menos");
			this.buttonWord[2].anchor.set(0.5, 0.5);
			this.buttonWord[3] = this.add.sprite( this.background_leafs[2].x - 75, this.background_leafs[1].y + 250, "barra");
			this.buttonWord[3].anchor.set(0.5, 0.5);
					
			this.groupLevel.add(this.buttonWord[0]);
			this.groupLevel.add(this.buttonWord[1]);
			this.groupLevel.add(this.buttonWord[2]);
			this.groupLevel.add(this.buttonWord[3]);
			
			this.createDelayTime( 5000, function(){
				this.add.tween(this.buttonWord[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                this.createSaida(this.random_number);
			});
			console.log(this.delay);
			this.createDelayTime(this.delay, function(){
				this.clickable = true;
			});
		});
				
    },
	
    createButton: function( x, y, letterValue, time, canInteract) {
		
        var btn; 
		
		btn = this.add.button(x,y, "numbers", null, this);
	
        btn.anchor.set(0.5,0.5); 
		btn.scale.set(0.8,0.8);
		btn.hitGroup = letterValue;
		
        if(canInteract) {
			btn.onInputDown.add(this.onGameButtonClick, this);
			btn.input.useHandCursor = true;
		}

        return btn;
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        
    

	update: function () {	
		
		if(this.changingLevel){
			this.clickable = false;
		}
		

		
	}
};
