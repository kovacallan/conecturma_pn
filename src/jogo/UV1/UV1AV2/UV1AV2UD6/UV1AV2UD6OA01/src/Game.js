
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
        this.TOTAL_LEVEL = 5;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 11500;
		this.TEMPO_INTRO2 = 10500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1500;
        this.TEMPO_RESUMO = 41000;
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
		
		this.randomLetter;
		this.tutorialText;
		this.buttonWord = [];

        this.totalSubNiveis = [null,2,2,0];
        this.SubNiveis = [null,1,1,0];
        this.groupLevel = [null,1,2,3]; // salva tudo que compoe o nível 
		
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

    /*********************************************************************************************************************/
    /* HUD  E BOTOES - INICIO */
    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Iara e Juninho estão a caminho do \nlago encantado. Para passar o \ntempo, resolveram brincar de [medir] \nas coisas usando somente o [olhar]. ";
        this.texto['initialText2'] ="Vejam só: precisamos escolher qual a árvore \nmais baixa entre essas duas, só olhando. E é... \nessa aqui! Vamos continuar!";
        this.texto['imgResumo'] ="Existem várias maneiras de medirmos as coisas. \nPodemos usar réguas, metros, e também podemos \nusar uma ferramenta poderosa, o nosso olhar!";
        this.texto['imgResumo2'] ="Olhem as figuras a seguir. O Juninho é [mais] \n[baixo] que o Fred, então o Fred é [mais alto] que \no Juninho.";
        this.texto['imgResumo3'] ="A ponte da direita é [mais larga] que a \nponte da esquerda, que é [mais estreita]. ";
        this.texto['imgResumo4'] ="A maçã está [mais perto] do computador \ndo que a banana, que está [mais longe].";

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Qual desses dois personagens da Conecturma \né o [mais alto]? Cliquem!",
            "Qual desses dois animais é o [menor]? Cliquem!",
            "Qual desses objetos é o [mais largo]? Cliquem!",
            "Qual o objeto que está [mais próximo]? Cliquem!",
            "E qual o objeto está [mais longe]? Cliquem!"
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

    //this.createDelayTime( 500, function(){this.gotoNextLevel()},this); 

    clickRightAnswer: function() { 
        console.log("--rightAnswer--");
        this.corrects++;
        this.createDelayTime(500, this.gotoNextLevel ); // para o próximo nível   
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

    // 
	onGameButtonClick: function(elem) {
		if(this.clickable){
			if(elem.hitGroup == 1){
				this.clickable = false;
				this.sound.play('hitAcerto');
				this.animationHit = true;
				this.juninho.play('comemora');
                
				this.clickable = false;
				
				this.createDelayTime(100, function(){
					if(this.random_switch == 1){
						this.changeLevelAnim(0);
					} else {
						this.changeLevelAnim(1);
					}
				});

                
                if(this.totalSubNiveis[this.currentLevel]>0){
                    this.totalSubNiveis[this.currentLevel]--;
                    this.SubNiveis[this.currentLevel]++;
                }

                if(this.totalSubNiveis[this.currentLevel]==0){
                    this.saveCorrect();
                    this.createDelayTime(3000, this.clickRightAnswer); // para o próximo nível 
                }else{
                    this.saveCorrect(this.totalSubNiveis[this.currentLevel] * 50, false);
                    this.createDelayTime(1500, function(){
                        this.imageQuestion.alpha = 0;
                        this.add.tween(this.placar).to({y: -400}, 1000, Phaser.Easing.Linear.None, true, 500);
                    });
                    this.createDelayTime(3000, this.showNextLevel); // para o próximo nível 
                }
			} else {
				this.clickable = false;
                this.totalSubNiveis = [null,2,2,0];
                this.SubNiveis = [null,1,1,0];
				this.livesCondition();
			}
		}
	},
	
	changeLevelAnim: function(number_to_change){
		this.add.tween(this.buttonWord[number_to_change]).to({y: 840}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){	
			if(number_to_change == 1){
                this.game.add.tween(this.levelContent[number_to_change]).to({ x: - 100},1000, Phaser.Easing.Linear.InOut, true, 0);
                this.game.add.tween(this.levelContent[0]).to({ x: this.world.centerX},1000, Phaser.Easing.Linear.none, true, 0);
                this.game.add.tween(this.buttonWord[0]).to({ x: this.world.centerX + 36},1000, Phaser.Easing.Linear.none, true, 0);
			} 
            else {
    			this.game.add.tween(this.levelContent[number_to_change]).to({ x: + 1100},1000, Phaser.Easing.Linear.InOut, true, 0);
    			this.game.add.tween(this.levelContent[1]).to({ x: this.world.centerX},1000, Phaser.Easing.Linear.none, true, 0);
    			this.game.add.tween(this.buttonWord[1]).to({ x: this.world.centerX - 36},1000, Phaser.Easing.Linear.none, true, 0);
			}
			
			this.game.add.tween(this.levelContent[number_to_change]).to({ y: 100 },1000,  Phaser.Easing.Cubic.In, true, 0);
			
		},this);
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

        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");//this.add.sprite( this.world.centerX+60, 110, 'initialText');
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

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
	
	showKim: function() {
        var kim = this.createAnimation( this.world.centerX-320, 200, 'kimAntiga', 1,1);
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
		
		this.tutorialText = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");//this.add.sprite( this.world.centerX, 110, 'initialText2');
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
		
       	this.createDelayTime( 1800, function(){
			
			this.levelContent = [];
			
			this.levelContent[0] = this.add.sprite( this.world.centerX - 200, 300, "left_fish");
			this.levelContent[0].animations.add('idle', this.math.numberArray(0,29), 18, true);
			this.levelContent[0].animations.play('idle');
			this.levelContent[0].anchor.set(0.5,0.5);
			this.levelContent[0].scale.set(0.8,0.8);
			this.levelContent[1] = this.add.sprite( this.world.centerX + 200, 300, "right_fish");
			this.levelContent[1].animations.add('idle', this.math.numberArray(0,29), 18, true);
			this.levelContent[1].animations.play('idle');
			this.levelContent[1].anchor.set(0.5,0.5);
			this.levelContent[1].scale.set(0.8,0.8);
			
			this.groupIntro.add(this.levelContent[0]);
			this.groupIntro.add(this.levelContent[1]);
			
			this.random_switch = this.rnd.integerInRange(0,1);
			
			for( var i = 0; i < 2; i++ ){
				
				if(i == 0){ 
					this.buttonWord[i] = this.createButton( this.levelContent[0].x +35, this.levelContent[0].y + 140, 0, 100, false)
					this.buttonWord[i].frame = 10;
				} else {
					this.buttonWord[i] = this.createButton( this.levelContent[1].x -33, this.levelContent[1].y + 139, 1, 100, false);
					this.buttonWord[i].frame = 11;
				}
					
				this.groupIntro.add(this.buttonWord[i]);
				
			}
				
		});
		
		this.createDelayTime( 3000, function() {
            this.showFinishedLiveTutorial();
        }, this);

    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {	
		
		this.createDelayTime( 6500, function(){
			this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
			this.arrow.anchor.set(0.5,0.5);
			this.groupIntro.add(this.arrow);
			this.add.tween(this.arrow).to({x: this.buttonWord[1].x + 30, y: this.buttonWord[1].y + 20}, 600, Phaser.Easing.Linear.None, true);
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
		this.soundResumo = this.sound.play("soundResumo");
        this.tutorialText =  this.drawText(this.world.centerX, 50, this.texto['imgResumo'], 22, "left");
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);
		
		this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		
		this.createDelayTime( 12600, function() {
			
			this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
				this.tutorialText = null;
				this.tutorialText = this.drawText(this.world.centerX, 10, this.texto['imgResumo2'], 22, "left");//this.add.sprite( this.world.centerX, 40, 'resumo_img2');
				//this.tutorialText.scale.set(0.8, 0.8);
				this.tutorialText.alpha = 0;
				//this.tutorialText.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				
				this.tutorial_img = null;
				this.tutorial_img = this.add.sprite( this.world.centerX, 140, 'resumo_1');
				//this.tutorial_img.scale.set(0.7, 0.7);
				this.tutorial_img.alpha = 0;
				this.tutorial_img.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorial_img).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			}, this);

        });
		
		
		this.createDelayTime( 22500, function() {
			
			this.add.tween(this.tutorial_img).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true)
			this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
				this.tutorialText = null;
				this.tutorialText = this.drawText(this.world.centerX, 10, this.texto['imgResumo3'], 22, "left");//this.add.sprite( this.world.centerX, 40, 'resumo_img3');
				//this.tutorialText.scale.set(0.9, 0.9);
				this.tutorialText.alpha = 0;
				//this.tutorialText.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				
				this.tutorial_img = null;
				this.tutorial_img = this.add.sprite( this.world.centerX, 140, 'resumo_2');
				this.tutorial_img.scale.set(0.6, 0.6);
				this.tutorial_img.alpha = 0;
				this.tutorial_img.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorial_img).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			}, this);

        });
		
		this.createDelayTime( 29800, function() {
			
			this.add.tween(this.tutorial_img).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true)
			this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
				this.tutorialText = null;
				this.tutorialText = this.drawText(this.world.centerX, 10, this.texto['imgResumo4'], 22, "left");//this.add.sprite( this.world.centerX, 40, 'resumo_img4');
				//this.tutorialText.scale.set(0.8, 0.8);
				this.tutorialText.alpha = 0;
				//this.tutorialText.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				
				this.tutorial_img = null;
				this.tutorial_img = this.add.sprite( this.world.centerX, 140, 'resumo_3');
				this.tutorial_img.scale.set(0.7, 0.7);
				this.tutorial_img.alpha = 0;
				this.tutorial_img.anchor.set(0.5, 0.5);
				this.add.tween(this.tutorial_img).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			}, this);
			
        });

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( 37000, function() {
			
			this.add.tween(this.tutorial_img).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
			
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
            this.groupLevel = this.add.group();
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
        this.background = this.add.sprite( -200, -250, 'background');
		
		this.juninho = this.add.sprite( 690, 220, "juninho_anim");
		this.juninho.alpha = 1.0;
		this.juninho.scale.set( 1.0, 1,0);
		this.juninho.animations.add('idle', this.math.numberArray(0,29), 18, true);
		this.juninho.animations.add('comemora', this.math.numberArray(30,59), 18, false);
		this.juninho.animations.play('idle');
    },


    // level - mostrar proximo
    showNextLevel: function() {
        this.lettersCorrect = 0;
        //this.levelAudio.stop();

        this.openLevel();

		this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500);
		if( this.groupLevel != null ) this.groupLevel.removeAll();
		if( this.groupFront != null ) this.groupFront.removeAll();
		this.changingLevel = false;
        this.initLevel();
     
    },
	
	showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 50, this.questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }

		this.createDelayTime( 1000, function(){
        	this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
			this.levelAudio = this.sound.play('pergunta_'+num+'_aud');
		}, this);
    },

    initLevel: function() {
		
		var time_to_begin = 0;

		
		//this.showQuestion(this.currentLevel);
        delay=100;

        console.log("nivel: "+this.currentLevel);
        //console.log("total sub: "+this.totalSubNiveis[this.currentLevel]);
        console.log("sub Nivel: "+this.SubNiveis[this.currentLevel]);
        console.log("pontos: "+this.corrects);
        

        if(this.currentLevel==1){
            switch(this.SubNiveis[1]){
                case 1:
                    delay = 6000;
                    this.showQuestion(1);
                break;
                case 2:
                    delay = 5000;
                    this.showQuestion(2);
                break;
            }
        }
        if(this.currentLevel==2){
            switch(this.SubNiveis[2]){
                case 1:
                    delay = 4000;
                    this.showQuestion(3);
                break;
                case 2:
                    delay = 5000;
                    this.showQuestion(4);
                break;
            }
        }
        if(this.currentLevel==3){
            delay = 4000;
            this.showQuestion(5);
        }

		this.createDelayTime(delay, function(){
			this.groupLevel = this.add.group();
			
			this.buttonWord = [];
			this.levelContent = [];
			
			this.levelContent[0] = this.add.sprite( this.world.centerX - 200, 700, "left_fish");
			this.levelContent[0].animations.add('idle', this.math.numberArray(0,29), 18, true);
			this.levelContent[0].animations.play('idle');
			this.levelContent[0].anchor.set(0.5,0.5);
			this.levelContent[0].scale.set(0.8,0.8);
			this.levelContent[1] = this.add.sprite( this.world.centerX + 200, 700, "right_fish");
			this.levelContent[1].animations.add('idle', this.math.numberArray(0,29), 18, true);
			this.levelContent[1].animations.play('idle');
			this.levelContent[1].anchor.set(0.5,0.5);
			this.levelContent[1].scale.set(0.8,0.8);
			
			this.groupLevel.add(this.levelContent[0]);
			this.groupLevel.add(this.levelContent[1]);
			
			this.groupLevel.add(this.imageQuestion);
			
			this.random_switch = this.rnd.integerInRange(0,1);
			
			for( var i = 0; i < 2; i++ ){
				
				if(i == 0){ 
					this.buttonWord[i] = this.createButton( this.levelContent[0].x +35, this.levelContent[0].y + 140, 0, 100, true)
					this.buttonWord[i].frame = 8;
				} else {
					this.buttonWord[i] = this.createButton( this.levelContent[1].x -33, this.levelContent[1].y + 139, 1, 100, true);
					this.buttonWord[i].frame = 9;
				}

                if(this.currentLevel==1){
                    switch(this.SubNiveis[1]){
                        case 1:
                            (i == 0)? this.buttonWord[i].frame = 0 : this.buttonWord[i].frame = 1;
                        break;
                        case 2:
                            (i == 0)? this.buttonWord[i].frame = 3 : this.buttonWord[i].frame = 2;
                        break;
                    }
                }
                if(this.currentLevel==2){
                    switch(this.SubNiveis[2]){
                        case 1:
                            (i == 0)? this.buttonWord[i].frame = 4 : this.buttonWord[i].frame = 5;
                        break;
                        case 2:
                            (i == 0)? this.buttonWord[i].frame = 6 : this.buttonWord[i].frame = 7;
                        break;
                    }
                }
                if(this.currentLevel==3){
                    (i == 0)? this.buttonWord[i].frame = 8 : this.buttonWord[i].frame = 9; // nivel 3
                }
					
				this.groupLevel.add(this.buttonWord[i]);
				
			}
			
			if(this.random_switch == 0){
				var tradeElem = this.buttonWord[0].frame;
				var tradeElem2 = this.buttonWord[0].hitGroup;
				
				this.buttonWord[0].frame = this.buttonWord[1].frame;
				this.buttonWord[0].hitGroup = this.buttonWord[1].hitGroup;
				
				this.buttonWord[1].frame = tradeElem;
				this.buttonWord[1].hitGroup = tradeElem2;	
			}
			
			this.createDelayTime(2000, function(){
				this.add.tween(this.levelContent[0]).to({y: 300}, 700, Phaser.Easing.Linear.None, true, 500);
				this.add.tween(this.levelContent[1]).to({y: 300}, 700, Phaser.Easing.Linear.None, true, 500);
				this.add.tween(this.buttonWord[0]).to({y: 440}, 700, Phaser.Easing.Linear.None, true, 500);
				this.add.tween(this.buttonWord[1]).to({y: 440}, 700, Phaser.Easing.Linear.None, true, 500);
			});
				
				this.groupFront = this.add.group();
				
				this.clickable = true;
			});
				
    },
	
    createButton: function( x, y, letterValue, time, canInteract) {
		
        var btn; 
		
		btn = this.add.button(x,y, "placa", null, this);
	
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
		
		if( this.juninho != null){
			this.juninho.events.onAnimationComplete.add(function(){
				if(this.animationHit){
					this.juninho.play('idle');
					this.animationHit = false;
				}
			}, this);
		}
		
	}
};
