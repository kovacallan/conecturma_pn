
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
        this.TEMPO_INTRO = 9000;
        this.TEMPO_ERRO1 = 1000;
        this.SOUND_VITORIA = 5500;

        this.HAS_CALL_TO_ACTION = true;
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
        /* FUTURO XML */

        this.lives = 2;
        this.points = 0;
        this.showCallToAction = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();
		
		// ------- AV2D3OA06 ----- //
		this.arrayItens = [];
        this.groupLevel = []; // salva tudo que compoe o nível 
        this.errou = false; // para a apresentacao show action
		this.nivelAnterior = 0;
		this.tutorial = false;
        this.initVars(); // variavies do jogo 
		
        // ------- fim AV2D3OA06 ----- //
		//this.gradeGuia();
 
		this.createScene();

        this.showIntro();
        //this.showResumo();
        // this.gameOverMacaco();
        /* HUD */
		
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Que tal separar esses bichinhos \nda árvore da vida em [pares]?";
        this.texto['initialText2'] ="Aqui temos quatro deles segurando placas com \npalavras. Devemos colocar de um lado quem tem \npalavra começando com [letra maiúscula], e do \noutro quem tem palavra começando com [letra] \n[minúscula]. Nossa vez!";
        this.texto['imgResumo'] ="Sempre que a palavra que estivermos lendo \nfor um nome, não importa do que for, se de \numa pessoa,de uma lanchonete ou mesmo do \nseu cachorrinho, ela começará com a letra \n[maiúscula].";
        this.texto['imgResumo2'] = "Agora, se a palavra não estiver começando \numa frase e não for nome, é [minúscula] com \ncerteza!";
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "",
            "",
            ""
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

            //py += textBase.height + _lineHeight;
            py += 25 + _lineHeight;

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
        console.log("ok");
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

    //fixa
    onButtonOver: function(elem) {
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    //fixa
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },
    createDelayTime: function(time, callback) {

        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */

    skipIntro: function() {
		this.tutorial = false;
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        console.log("*** skipIntro ***");
        
        this.add.tween(this.groupIntro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    // intro-fixa
    showIntro: function() {
        this.groupIntro = this.add.group();
		this.tutorial =true;

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);
        
        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(
			function(){
				if(this.tutorial)
				{
					this.showTextoIntro();
				}
			}, this);
    },

    // intro-fixa
    /*showKim: function() {
        this.kim = this.createAnimation( this.world.centerX-320, 200, 'kim', 1,1);
        this.kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        this.kim.crop(rect);

        this.groupIntro.add(this.kim);

        this.add.tween(this.kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(4000, function() {
            this.add.tween(this.kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },*/

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

    // intro-fixa
    showTextoIntro: function() {
		
		console.log("*** showTextoIntro ***");
		//1
        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
		this.groupIntro.add(this.tutorialText);
		//2
		this.tutorialText2 = this.drawText(this.world.centerX, 10, this.texto['initialText2'], 22, "left");
        this.tutorialText2.alpha = 0;
		this.groupIntro.add(this.tutorialText2);
		//3
		
		
		this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim(4000);
        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime(4000, function() {
			this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(this.tutorialPlacar).to({y: -90}, 100, Phaser.Easing.Linear.None, true, 200).onComplete.add(
				function(){
					this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
					if(this.tutorial)
				   {
					   this.showLiveTutorial();
				   }
				}
			,this)

        });
		
		//this.createDelayTime(9000, function() {});
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
        console.log("Timer Audio:", Math.round(_timer)*100, "ms");
    },
    onStopDebugAudio: function() {
        this.input.onTap.remove(this.onDebuAudio, this);
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

    // pontuacao-fixa
    addPoints: function() {
        
        // this.updatePointsText();

    },
    // pontuacao-fixa
    updatePointsText: function() {
        return;
        this.pointsTextShadow.text = this.points.toString();
        this.pointsTextShadow.x = 56 - 10;

        this.pointsText.setText(this.points.toString());
        this.pointsText.x = 55 - 10; // this.pointsText.width*0.5;
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
		this.tutorial = false;
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
		this.showNextLevel();
    },
    // level-fixa
    gotoNextLevel: function() {
        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        //this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function() {
		console.log("hideAndShowLevel");
        this.hideLevel(function() {
			console.log("hideAndShowLevel "+this.currentLevel);
			console.log("hideAndShowLevel "+this.corrects);
            if(this.currentLevel <= 3 && this.corrects <= 3) {
				if(!this.showCallToAction)
				{
					//this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
					this.showNextLevel();
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

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    //---- AV1AV2D3OA04 ---- //

    initVars:function(){
		
		this.arrayItensErrados =[];
		this.temp_array=[];
		this.cesta = null;
		this.imagens = [];
		this.tutorial = false;
	},
	getRandomUniqueItem: function(list, level) {

        //console.log("---getRandomUniqueItem---");
        var letters = this.getNonRepeatLetter(list, level); // FRE
        //console.log("--> letters "+letters);
        var n = this.rnd.integerInRange(0,letters.length-1);
        //console.log("--> n " + n);

        //console.log("---getRandomUniqueItem---");

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
    resetRandomLetter: function() { 
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },
    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
      
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },
	sorteio:function(){    
        var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));   
        this.retirarArrayElemento(item); 
		return item;
    },
	onStartDragNumber: function(elem) {
		console.log("***onStartDragNumber***");
        //console.log(elem);
    },
	onStopDragNumber: function(elem){
		console.log("***onStopDragNumber***");
		this.game.physics.enable(elem, Phaser.Physics.ARCADE);
		this.game.physics.enable(this.maiuscula, Phaser.Physics.ARCADE);
		this.game.physics.enable(this.minuscula, Phaser.Physics.ARCADE);
		//console.log(elem);
		if(this.game.physics.arcade.overlap(elem,this.maiuscula)){
			if(elem.name==this.maiuscula.name){
				console.log("correto maicuscula");
				this.inputMovableNumbers(2,elem.img);	
				this.sound.play("hitAcerto");
				elem.x = this.troncoMaicuscula[0]+this.afatMaicuscula;
				this.afatMaicuscula+=40;
				elem.y = this.troncoMaicuscula[1];
				this.add.tween(elem.scale).to({x:0.7, y:0.7},500, Phaser.Easing.Linear.None, true);
				
				if(this.grilos>0)
				{
					this.grilos--;
				}
			
				if(this.grilos==0)
				{
					this.createDelayTime(1500, function() {
						this.rightAnswer();
					});
				}
				
				
				
			}else{
				console.log("errado maicuscula");
				this.inputMovableNumbers(3);//desabilitar o drag todos
				this.sound.play("hitErro");
				this.createDelayTime(1500, function() {
					this.wrongAnswer();
				});
				
			}	
		}else if(this.game.physics.arcade.overlap(elem,this.minuscula)){
			if(elem.name==this.minuscula.name){
				console.log("correto minuscula");
				this.inputMovableNumbers(2,elem.img);
				this.sound.play("hitAcerto");
				elem.x = this.troncoMinuscula[0]+this.afatMinuscula;
				this.afatMinuscula-=40;
				elem.y = this.troncoMinuscula[1];
				this.add.tween(elem.scale).to({x:0.7, y:0.7},500, Phaser.Easing.Linear.None, true);
				if(this.grilos>0)
				{
					this.grilos--;
				}
			
				if(this.grilos==0)
				{
					this.createDelayTime(1000, function() {
						this.rightAnswer();
					});
				}
			}else{
				console.log("errado minuscula");
				this.inputMovableNumbers(3);//desabilitar o drag todos
				this.sound.play("hitErro");
				this.createDelayTime(1000, function() {
					this.wrongAnswer();
				});
			}	
		}else{
			console.log("reposiciona");
			this.sound.play("hitErro");
			this.add.tween(elem).to({x:this.posicaoX[elem.id], y:this.posicaoY[elem.id]}, 100, Phaser.Easing.Linear.None, true);

		}
		
				
	},
	inputMovableNumbers:function(tipo,img){// habilita o drag em drop
		console.log("***inputMovableNumbers***")
        if(tipo==1)
        {  
            for(var i=0; i<this.imagens.length; i++)
            {
				this.game.physics.enable(this.imagens[i], Phaser.Physics.ARCADE);
                this.imagens[i].inputEnabled = true;
                this.imagens[i].input.enableDrag(false, true);
                this.imagens[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.imagens[i].events.onDragStop.add(this.onStopDragNumber, this);
				
            }
        }

        if(tipo==2) // desabilitar um 
        {
            this.imagens[img].inputEnabled = false;
            this.imagens[img].input.reset();
        }

        if(tipo==3) // desabilitar todas 
        {
            for(var i=0; i<this.imagens.length; i++)
            {
                this.imagens[i].inputEnabled = false;
                //this.imagens[i].input.reset();
            }
        }
    },
	
	animClick:function(proximo){
        console.log("*** animClick ****");
        this.click.alpha = 1;
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.efeitoIntro(proximo);
        }, this);
    },
    efeitoIntro:function(proximo){
        switch(proximo)
        {
            case 1:
                x1 = this.imagens[0].x+50;
                y1 = this.imagens[0].y+50;
               
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(2)},this)
                   
                    
            break;
            case 2:
            
                x = 735;
                y = 467;
                x1 = 735+50;
                y1 = 467+50;
                this.add.tween(this.imagens[0]).to({x:x, y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens[0].scale).to({x:0.7, y:0.7},500, Phaser.Easing.Linear.None, true)
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoIntro(3)},this)

            break;
            
            
            case 3:
                x1 = this.imagens[2].x+50;
                y1 = this.imagens[2].y+50;
               
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(4)},this)
                   
                    
            break;
            case 4:
            
                x = 735+40;
                y = 467;
                x1 = 735+50;
                y1 = 467+50;
                this.add.tween(this.imagens[2]).to({x:x, y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens[2].scale).to({x:0.7, y:0.7},500, Phaser.Easing.Linear.None, true);

                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoIntro(5)},this)

            break;
            
            case 5:
            
                
                x1 = this.imagens[1].x+50;
                y1 = this.imagens[1].y+50;
                this.createDelayTime(1000, function() {
                   this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(6)},this)

                });
                   
                    
            break;
            case 6:
            
                x = 187;
                y = 465;
                x1 = 187+50;
                y1 = 465+50;
                this.add.tween(this.imagens[1]).to({x:x, y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens[1].scale).to({x:0.7, y:0.7},500, Phaser.Easing.Linear.None, true);

                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoIntro(7)},this)

            break;
            
            case 7:
            
                
                x1 = this.imagens[3].x+50;
                y1 = this.imagens[3].y+50;
                //this.createDelayTime(2000, function() {
                   this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(8)},this)

                //});
                   
                    
            break;
            case 8:
            
                x = 187-40;
                y = 467;
                x1 = 187+50;
                y1 = 467+50;
                this.add.tween(this.imagens[3]).to({x:x, y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens[3].scale).to({x:0.7, y:0.7},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.showFinishedLiveTutorial();},this)

            break;
        }
        
        
    },
    //---- AV1AV2D3OA04 ---- //
	
 /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
 /*********************************************************************************************************************/
 /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {
        //var x = this.addSpriteMeu('background',-607, -884,0);
		this.background = this.add.sprite(-576, -959, 'background');
        //var x = this.addSpriteMeu('tronco',-207,335,0);
		this.tronco = this.add.sprite(-132,344, 'tronco');
		this.tronco.scale.set(0.8,1);
        //x.scale.set(0.8,1);
		
		
		//this.initLevel1();
		//this.initGame();
		

    },
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		console.log("***showLiveTutorial****");
		
		this.troncoMaicuscula = [735,462];
		this.troncoMinuscula = [187,465];
		this.afatMaicuscula = 0;
		this.afatMinuscula = 0;
		this.grilos = 4;
		
		if(this.nivelAnterior != this.currentLevel)
		{
			//this.disponiveisMaiuscala = [12,13,16,17,20,21,36,37,38];
			//this.disponiveisMinuscula = [14,15,18,19,22,23,42,43,44];
		}
		
		//this.letras = [0,1,0,1,0]; // 0 maicuscula 1 maiuscula
		posicao  = [0,1,2,3];
		this.posicaoX = [104,327,553,804];
		this.posicaoY = [150,170,170,130];
		
		item = [];
		nome = [];
		palavras = [17,14,20,18];

		letrasSorteadas = [];
		for(var i=0; i<this.grilos;i++){
		
			letrasSorteadas[i] = palavras[i];
			
		}
		
		x=-500;
		for(var i=0; i<this.grilos;i++){
		
			this.imagens[i] = this.createAnimation(x,300, 'grilo', 1,1);
			x+=100
			this.imagens[i].id = i;
			this.imagens[i].img = i;
			this.imagens[i].addChild(this.game.make.sprite(40, 30, 'palavras',letrasSorteadas[i]));
			this.imagens[i].children[0].scale.set(0.6,0.6);
			this.groupIntro.add(this.imagens[i]);
			
		}
		
		this.createDelayTime(1000, function() {
			//this.inputMovableNumbers(1);
			for(var i=0; i<this.grilos;i++){
				 
				 this.add.tween(this.imagens[i]).to({x:this.posicaoX[i], y:this.posicaoY[i]}, 100, Phaser.Easing.Linear.None, true);

			}
			
        });
		
		this.arrow = this.add.sprite( 570,420, 'arrow');
		this.click = this.add.sprite(0, 0, "clickAnimation");
		this.click.animations.add('idle', null, 18, true);
		this.click.alpha = 0;

		this.groupIntro.add(this.arrow);
		this.groupIntro.add(this.click);
		
		this.createDelayTime(10000, function() {
			this.efeitoIntro(1);
		});	
	
    },
	
	
	
    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		console.log("showFinishedLiveTutorial");
        
        this.createDelayTime(1000, function() {
			this.skipIntro();

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 1;
    
        this.groupIntro.add(tutorialText);
		
		var tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['imgResumo2'], 22, "left");
        tutorialText2.alpha = 0;

        this.groupIntro.add(tutorialText2);
		this.soundResumo = this.sound.play("soundResumo");
		
		this.createDelayTime(15000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });

		
        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    //this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
              
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    //this.showQuestion(2);
                    this.sound.play("soundP1").onStop.add(this.initLevel2, this);
                }
            break;
            case 3:
               
                if(this.showCallToAction) {
                    this.initLevel3();
                } else {
                     //this.showQuestion(3);
                    this.sound.play("soundP1").onStop.add(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.add.sprite(this.world.centerX, 50, "pergunta" + num);
        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },
	
    initLevel1: function() {
        console.log("***Nivel 1**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		
		this.troncoMaicuscula = [735,462];
		this.troncoMinuscula = [187,465];
		this.afatMaicuscula = 0;
		this.afatMinuscula = 0;
		this.grilos = 3;
		
		if(this.nivelAnterior != this.currentLevel)
		{
			this.disponiveisMaiuscala = [0,1,4,5,8,9];
			this.disponiveisMinuscula = [2,3,6,7,10,11];
		}
		
		this.letras = [0,1,0,1]; // 0 maicuscula 1 maiuscula
		posicao  = [0,1,2];
		this.posicaoX = [104,472,804];
		//this.posicaoY = [61,101,50];
        this.posicaoY = [150,170,140,130];
		
		item = [];
		nome = [];

		this.maiuscula = this.add.sprite(728,500, 'marca',0);
		this.maiuscula.name = "maicuscula";
		this.maiuscula.alpha = 0;
		
		this.minuscula = this.add.sprite(-20,502, 'marca',0);
		this.minuscula.name = "minuscula";
		this.minuscula.alpha = 0;
		
		this.groupLevel[this.currentLevel].add(this.maiuscula);
		this.groupLevel[this.currentLevel].add(this.minuscula);
		
		letrasSorteadas = [];
		for(var i=0; i<this.grilos;i++){
			this.temp_array = this.letras.slice();
			letrasSorteadas[i] = this.sorteio();
			this.letras = this.temp_array.slice();
			console.log(this.temp_array);
		}
		
		
		for(var i=0; i<this.grilos;i++){
			
			if(letrasSorteadas[i]==1){
				this.temp_array = this.disponiveisMinuscula.slice();
				item[i] = this.sorteio();
				nome[i] ="minuscula";
				this.disponiveisMinuscula = this.temp_array.slice();
				
			}
			if(letrasSorteadas[i]==0){
				this.temp_array = this.disponiveisMaiuscala.slice();
				item[i] = this.sorteio();
				nome[i] = "maicuscula";
				this.disponiveisMaiuscala = this.temp_array.slice();
			}
			
			this.temp_array =posicao.slice();
			pos = this.sorteio();
			posicao = this.temp_array.slice();
			
			this.imagens[i] = this.createAnimation(this.posicaoX[pos],this.posicaoY[pos], 'grilo', 1,1);
			this.imagens[i].name = nome[i];
			this.imagens[i].id = pos;
			this.imagens[i].img = i;
			this.imagens[i].addChild(this.game.make.sprite(40, 30, 'palavras',item[i]));
			this.imagens[i].children[0].scale.set(0.6,0.6);
			this.groupLevel[this.currentLevel].add(this.imagens[i]);
			
		}
		
		this.createDelayTime(2000, function() {
			
            this.imagens[0].inputEnabled = true;
            this.imagens[0].input.enableDrag(false, true);
            this.imagens[0].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[0].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[1].inputEnabled = true;
            this.imagens[1].input.enableDrag(false, true);
            this.imagens[1].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[1].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[2].inputEnabled = true;
            this.imagens[2].input.enableDrag(false, true);
            this.imagens[2].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[2].events.onDragStop.add(this.onStopDragNumber, this);
			
			
        });
	
    },
	
	
    initLevel2: function() {
		console.log("***Nivel 2**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		
		this.troncoMaicuscula = [735,462];
		this.troncoMinuscula = [187,465];
		this.afatMaicuscula = 0;
		this.afatMinuscula = 0;
		this.grilos = 4;
		
		if(this.nivelAnterior != this.currentLevel)
		{
			this.disponiveisMaiuscala = [12,13,16,17,20,21,36,37,38];
			this.disponiveisMinuscula = [14,15,18,19,22,23,42,43,44];
		}
		
		this.letras = [0,1,0,1,0]; // 0 maicuscula 1 maiuscula
		posicao  = [0,1,2,3];
		this.posicaoX = [104,327,553,804];
		//this.posicaoY = [61,100,101,50];
        this.posicaoY = [150,170,170,130];
		
		item = [];
		nome = [];

		this.maiuscula = this.add.sprite(728,491, 'marca',0);
		this.maiuscula.name = "maicuscula";
		this.maiuscula.alpha = 0;
		
		this.minuscula = this.add.sprite(-20,492, 'marca',0);
		this.minuscula.name = "minuscula";
		this.minuscula.alpha = 0;
		
		this.groupLevel[this.currentLevel].add(this.maiuscula);
		this.groupLevel[this.currentLevel].add(this.minuscula);
		
		letrasSorteadas = [];
		for(var i=0; i<this.grilos;i++){
			this.temp_array = this.letras.slice();
			letrasSorteadas[i] = this.sorteio();
			this.letras = this.temp_array.slice();
			console.log(this.temp_array);
		}
		
		
		for(var i=0; i<this.grilos;i++){
			
			if(letrasSorteadas[i]==1){
				this.temp_array = this.disponiveisMinuscula.slice();
				item[i] = this.sorteio();
				nome[i] ="minuscula";
				this.disponiveisMinuscula = this.temp_array.slice();
				
			}
			if(letrasSorteadas[i]==0){
				this.temp_array = this.disponiveisMaiuscala.slice();
				item[i] = this.sorteio();
				nome[i] = "maicuscula";
				this.disponiveisMaiuscala = this.temp_array.slice();
			}
			
			this.temp_array =posicao.slice();
			pos = this.sorteio();
			posicao = this.temp_array.slice();
			
			this.imagens[i] = this.createAnimation(this.posicaoX[pos],this.posicaoY[pos], 'grilo', 1,1);
			this.imagens[i].name = nome[i];
			this.imagens[i].id = pos;
			this.imagens[i].img = i;
			this.imagens[i].addChild(this.game.make.sprite(40, 30, 'palavras',item[i]));
			this.imagens[i].children[0].scale.set(0.6,0.6);
			this.groupLevel[this.currentLevel].add(this.imagens[i]);
			
		}
		
		this.createDelayTime(2000, function() {
			
            this.imagens[0].inputEnabled = true;
            this.imagens[0].input.enableDrag(false, true);
            this.imagens[0].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[0].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[1].inputEnabled = true;
            this.imagens[1].input.enableDrag(false, true);
            this.imagens[1].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[1].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[2].inputEnabled = true;
            this.imagens[2].input.enableDrag(false, true);
            this.imagens[2].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[2].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[3].inputEnabled = true;
            this.imagens[3].input.enableDrag(false, true);
            this.imagens[3].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[3].events.onDragStop.add(this.onStopDragNumber, this);
			
			
        });
		
    },

    initLevel3: function() {
		console.log("***Nivel 3**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		this.groupLevel[this.currentLevel] = this.add.group();
		
		this.troncoMaicuscula = [735,462];
		this.troncoMinuscula = [187,465];
		this.afatMaicuscula = 0;
		this.afatMinuscula = 0;
		this.grilos = 5;
		
		if(this.nivelAnterior != this.currentLevel)
		{
			this.disponiveisMaiuscala = [38,24,25,28,29,32,33,39,40,41];
			this.disponiveisMinuscula = [44,26,27,30,31,34,35,45,46,47];
		}
		
		this.letras = [0,1,0,1,0,1]; // 0 maicuscula 1 maiuscula
		posicao  = [0,1,2,3,4];
		this.posicaoX = [104,302,472,641,804];
		//this.posicaoY = [61,100,101,91,50];
        this.posicaoY = [150,170,170,130,50];
		
		item = [];
		nome = [];

		this.maiuscula = this.add.sprite(728,491, 'marca',0);
		this.maiuscula.name = "maicuscula";
		this.maiuscula.alpha = 0;
		
		this.minuscula = this.add.sprite(-20,492, 'marca',0);
		this.minuscula.name = "minuscula";
		this.minuscula.alpha = 0;
		
		this.groupLevel[this.currentLevel].add(this.maiuscula);
		this.groupLevel[this.currentLevel].add(this.minuscula);
		
		letrasSorteadas = [];
		for(var i=0; i<this.grilos;i++){
			this.temp_array = this.letras.slice();
			letrasSorteadas[i] = this.sorteio();
			this.letras = this.temp_array.slice();
			console.log(this.temp_array);
		}
		
		
		for(var i=0; i<this.grilos;i++){
			
			if(letrasSorteadas[i]==1){
				this.temp_array = this.disponiveisMinuscula.slice();
				item[i] = this.sorteio();
				nome[i] ="minuscula";
				this.disponiveisMinuscula = this.temp_array.slice();
				
			}
			if(letrasSorteadas[i]==0){
				this.temp_array = this.disponiveisMaiuscala.slice();
				item[i] = this.sorteio();
				nome[i] = "maicuscula";
				this.disponiveisMaiuscala = this.temp_array.slice();
			}
			
			this.temp_array =posicao.slice();
			pos = this.sorteio();
			posicao = this.temp_array.slice();
			
			this.imagens[i] = this.createAnimation(this.posicaoX[pos],this.posicaoY[pos], 'grilo', 1,1);
			this.imagens[i].name = nome[i];
			this.imagens[i].id = pos;
			this.imagens[i].img = i;
			this.imagens[i].addChild(this.game.make.sprite(40, 30, 'palavras',item[i]));
			this.imagens[i].children[0].scale.set(0.6,0.6);
			this.groupLevel[this.currentLevel].add(this.imagens[i]);
			
		}
		
		this.createDelayTime(2000, function() {
			
            this.imagens[0].inputEnabled = true;
            this.imagens[0].input.enableDrag(false, true);
            this.imagens[0].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[0].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[1].inputEnabled = true;
            this.imagens[1].input.enableDrag(false, true);
            this.imagens[1].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[1].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[2].inputEnabled = true;
            this.imagens[2].input.enableDrag(false, true);
            this.imagens[2].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[2].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[3].inputEnabled = true;
            this.imagens[3].input.enableDrag(false, true);
            this.imagens[3].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[3].events.onDragStop.add(this.onStopDragNumber, this);
			
			this.imagens[4].inputEnabled = true;
            this.imagens[4].input.enableDrag(false, true);
            this.imagens[4].events.onDragStart.add(this.onStartDragNumber, this);
			this.imagens[4].events.onDragStop.add(this.onStopDragNumber, this);
			
			
        });
		
		
	},
	
	resetLevel:function(nivel){
		
		console.log("***resetLevel***");
		
		this.createDelayTime(100, function() {
			 this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
			 
			 if(this.groupLevel[nivel] != null) {
				this.groupLevel[nivel].removeAll(true);
			 }
		}); 
        this.nivel =0;
		this.initVars();
		
	},
	
	
	rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        this.showCallToAction = false;
        this.qtdErros = 0;
		this.corrects++;
        this.saveCorrect();
		//this.sound.play("hitAcerto");
		//this.showCallToAction = true;
        //this.addPoints();
		this.nivelAnterior = this.currentLevel;
		var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
		
		
    },

	wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        this.showCallToAction = true;
        var nivel=this.currentLevel;
		this.nivelAnterior = this.currentLevel;
        this.nivelAnterior = this.currentLevel;
		
		if(this.currentLevel > 1) 
		{
			this.currentLevel--;
		}
		
  
		if(this.lives>0)
		{
			this.lives--;
			this.errors--;
		}
       
		//this.sound.play("hitErro");
    
		switch(this.lives) {
            case 1: // mostra dica 1
				this.resetLevel(nivel);
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
				this.resetLevel(nivel);
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
            default: // game over
            break;
        }
        this.updateLivesText();
        
    },

    onCompleteShowDica: function() {
        if(this.HAS_CALL_TO_ACTION) {
            this.showCallToAction = true;
            this.showNextLevel();
        } else {
            this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
        }
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
