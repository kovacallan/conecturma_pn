
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
		//this.gradeGuia();
 
		this.createScene();
		
        // ------- AV2D3OA04 ----- //
		this.arrayItens = [];
        this.groupLevel = []; // salva tudo que compoe o nível 
        this.errou = false; // para a apresentacao show action
		this.nivelAnterior = 0;
		this.tutorial = false;
        this.initVars(); // variavies do jogo 
		
        // ------- fim AV2D3OA01 ----- //

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
        this.texto['initialText'] = "Nossos amigos têm que pensar rápido para \nnão virarem flores, e nós também, mas para \npoder ajudá-los! Para isso vamos prestar \natenção e descobrir qual a resposta para \nas perguntas que serão feitas! ";
        this.texto['imgResumo'] ="Já aprendemos que quando juntamos objetos, \nisso se chama soma. Se temos [três balas] e \nganhamos [três balas], basta contarmos para \nsaber quantas teremos. Nesse caso, [3 balas + 3] \n[balas = 6 balas]! Basta prestar atenção e contar!";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Poly tinha estas balas e ganhou mais estas \nbalas de Juninho. Com quantas balas ela ficou? \nDigitem o resultado no seu teclado!",
            "Fred tem estas bolinhas de gude e Juninho tem \nestas bolinhas de gude. Ele juntaram suas \nbolinhas de gude para jogar. Quantas bolinhas \nde gude eles tem juntos?",
            "Bumba tem estas bananas, subiu na bananeira e \npegou mais estas bananas. Com quantas \nbananas Bumba ficou?"
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
		this.tutorial =false;
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        this.startAllAnimations();
		console.log("skipIntro");
		
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
				if(this.tutorial){
					this.showTextoIntro();
				}
            }
		, this);
    },

    // intro-fixa
    /*
    showKim: function() {
        this.kim = this.createAnimation( this.world.centerX-320, 200, 'kim', 1,1);
        this.kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        this.kim.crop(rect);

        this.groupIntro.add(this.kim);

        this.add.tween(this.kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        //this.createDelayTime(8000, function() {
            //this.add.tween(this.kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        //});
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

    stopAllAnimations: function() {
        for(var i = 0; i < this.listAnimations.length; i++) {
            this.listAnimations[i].animations.paused = true;
        }
    },

    startAllAnimations: function() {
        for(var i = 0; i < this.listAnimations.length; i++) {
            this.listAnimations[i].animations.paused = false;
        }
    },

    // intro-fixa
    showTextoIntro: function() {
		
		console.log("*** showTextoIntro ***");
		//1
        this.tutorialText = this.drawText(this.world.centerX+60, 30, this.texto['initialText'], 19, "left");
        this.tutorialText.alpha = 0;
		this.groupIntro.add(this.tutorialText);
		
		this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim(8000);
        this.soundIntro = this.setDebugAudio("soundIntro");
      
		this.createDelayTime(16000, function() {
            console.log("*** vai ***");
            if(this.tutorial){
                this.skipIntro();
            }
        });
        
        //this.soundIntro.onStop.add(function(){this.skipIntro();}, this);
		
			//console.log("liberar");

        //this.soundIntro.onStop.addOnce(function(){
            //this.skipIntro();
        //}, this);
			
		
		
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

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    /*clearButtons: function(clearCorrect) {

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
    },*/

    // level-fixa
    gotoNextLevel: function() {
        this.currentLevel++;
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
    hideAndShowLevel: function() {
		console.log("hideAndShowLevel");
        this.hideLevel(function() {
			console.log("hideAndShowLevel "+this.currentLevel);
			console.log("hideAndShowLevel "+this.corrects);
            if(this.currentLevel <= 3 && this.corrects <= 3) {
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

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    //---- AV1AV2D3OA05 ---- //

    initVars:function(){
		
		this.temp_array=[];
		this.soma =0;
		this.imagens = [];
		this.tutorial = false;
		this.numeros = [];
		this.letter="";
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
	initKeyboard: function() {
		console.log("initKeyboard "+this.tempo);
		this.letter="";
        this.game.input.keyboard.addCallbacks(this,null,null, this.onKeyPressed);
    },
	
	removeKeyboard: function() {
        this.game.input.keyboard.addCallbacks( this, null, null, null );
    },
    
    onKeyPressed: function(evt) { 

        console.log("onKeyPressed"); 
        //console(this.letter); 
        if(this.letter.length<=1)
        {
            this.letter = evt;
            this.removeKeyboard();
            //this.showLetra(2);
			this.showKey(this.letter);
            
			this.createDelayTime(1000, function() {
				this.verificar(); 
			});
        }
    },

    showKey: function(value) { //(16) MOSTRA A LETRA DIGITADA 

        console.log("showKey " + this.currentLevel);
        
        this.currentKey = this.add.bitmapText(250,320, "JandaManateeSolid", value.toString(), 80);
        //this.currentKey.x = 545-(this.currentKey.textWidth/4);
        this.currentKey.tint = '0x000000';
        this.groupLevel[this.currentLevel].add(this.currentKey);
        this.removeKeyboard();
    },
	verificar:function(){
		if(this.letter==this.soma){
			console.log("correto");
			
			this.sound.play("hitAcerto");
			this.changeHappy(this.fred, 'fred_happy','fred',540,262);
            this.changeHappy(this.walter, 'walter_happy','walter',667,338);
            this.changeHappy(this.poly, 'poly_happy','poly',737,380);
			this.createDelayTime(500, function() {
				this.rightAnswer();
			});
			
		}else{
			console.log("errado");
			this.sound.play("hitErro");
			this.createDelayTime(1500, function() {
				this.wrongAnswer();
			});
			
		}
			
	},
	
	changeHappy:function(elem, anim,anim2,x,y){
        elem.oldX = elem.x;
        elem.oldY = elem.y;
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        
        anim.onComplete.add(function() {
            this.changeIdlle(elem,anim2,elem.oldX,elem.oldY);
        }, this);
        anim.play(15);
    },

    changeIdlle:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 15, true);
    },
	/*//-------------------------function--------------------//
    gradeGuia:function(){
        this.line = [];
        var x = 0;
        var aux = this.world.width/10;
        for(var linhas=0; linhas<=10; linhas++)
        {
            this.line[linhas] = new Phaser.Line(x, 0, x, this.world.height);
            x += aux;
        }

        this.col = [];
        var y = 0;
        var aux = this.world.height/6;
        for(var cols=0; cols<=6; cols++)
        {
            this.col[cols] = new Phaser.Line(0, y, this.world.width, y);
            y += aux;
        }
    },

    addSpriteMeu:function(sprite,x,y,frame){
        if(frame=='#')
        {
            spr = this.game.add.sprite(x,y, sprite);
        }
        else{spr = this.game.add.sprite(x,y, sprite,frame);}
        
        this.enableDragDrop(spr);
        return spr;
    },

    enableDragDrop:function(elem){
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStart, this);
        elem.events.onDragStop.add(this.onDragStop, this);
    },

    onDragStart:function(sprite, pointer) {

        //this.result = "Dragging " + sprite.key;
    },

    onDragStop:function (sprite, pointer) {

        this.result = sprite.key + " dropped at x:" + sprite.x + " y: " + sprite.y;
        //this.result = sprite.key + " mouse at x:" + pointer.x + " y: " + pointer.y;
    },
    render:function() {

       

        for(var i=0; i<=10; i++)
        {
             this.game.debug.geom(this.line[i]);
        }
       for(var i=0; i<=6; i++)
       {
             this.game.debug.geom(this.col[i]);
       }

        this.game.debug.text(this.result, 10, 20);
    },
	//-------------------------function--------------------//*/
    
    //---- AV1AV2D3OA05 ---- //
	
 /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
 /*********************************************************************************************************************/
 /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
	
		this.background = this.add.sprite( -24, -14, 'background');
		this.add.sprite(52,277, 'placa');
		//var x = this.addSpriteMeu('numeros',100,300,0);

        this.listAnimations = [];
	
		this.fred = this.add.sprite(569,264, 'fred',1);
		this.fred.animations.add('fred');
        this.fred.animations.play('fred', 15, true);
        
        this.walter = this.add.sprite(667,343, 'walter',1);
        this.walter.animations.add('walter');
        this.walter.animations.play('walter', 15, true);
        
        this.poly = this.add.sprite(757,380, 'poly',1);
        this.poly.animations.add('poly');
        this.poly.animations.play('poly', 15, true);
        
        this.listAnimations.push( this.fred );
        this.listAnimations.push( this.walter );
        this.listAnimations.push( this.poly );
		//this.initGame();
	

    },
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		console.log("***showLiveTutorial****");
		//this.showFinishedLiveTutorial();
    },
    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		console.log("showFinishedLiveTutorial");
        
        this.createDelayTime(1000, function() {
			this.add.tween(this.tutorialText2).to({alpha:0},1000, Phaser.Easing.Linear.None, true).onComplete.add(
				function(){
					//this.createDelayTime(1000, function() {
						this.add.tween(this.tutorialPlacar).to({y: -300}, 2000, Phaser.Easing.Linear.None, true,1000).onComplete.add(function(){
							this.add.tween(this.groupIntro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
						}, this);
					//});
				}
				, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 1;
        //tutorialText.anchor.set(0.5, 0.5);
        
		this.groupIntro.add(tutorialText);
		this.soundResumo = this.sound.play("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level

        switch(this.currentLevel) {
            case 1:
                this.imgY = 20;
                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.som = this.sound.play("soundP1");
					this.initLevel1();
                }
            break;
            case 2:
                this.imgY = 10;
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.som = this.sound.play("soundP2");
					this.initLevel2();
                }
            break;
            case 3:
                this.imgY = 40;
                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
					this.som = this.sound.play("soundP3");
					this.initLevel3();                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 30, this.questionList[num]);
        this.imageQuestion.alpha = 0;
        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },
	
    initLevel1: function() {
        console.log("***Nivel 1**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		this.numeros =[1,2,3];
		
		this.temp_array = this.numeros.slice();
		
		num = this.sorteio();
		num2 = this.sorteio();
		
		this.soma = num+num2;
		
		numero = this.game.add.sprite(50,347,"numeros", num);
		numero.alpha =0;
		sinalsoma = this.game.add.sprite(100,347,"numeros",0);
		sinalsoma.alpha =0;
		numero2 = this.game.add.sprite(150,347,"numeros",num2);
		numero2.alpha =0;
		sinaligual = this.game.add.sprite(200,347,"numeros",11);
		sinaligual.alpha =0;
		
		this.groupLevel[this.currentLevel].add(numero);
		this.groupLevel[this.currentLevel].add(sinalsoma);
		this.groupLevel[this.currentLevel].add(numero2);
		this.groupLevel[this.currentLevel].add(sinaligual);
		
		
		
		this.createDelayTime(1500, function() {  
            this.add.tween(numero).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime(3000, function() {  
            this.add.tween(numero2).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(sinalsoma).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime(6000, function() {  
            this.add.tween(sinaligual).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		if(!this.errou){
			this.som.onStop.add(function(){
			console.log("liberar");
			this.initKeyboard();
			}, this);
		}else{
			this.initKeyboard();
			this.errou = false;
		}
		
		
		
		
	
    },
	
	
    initLevel2: function() {
		console.log("***Nivel 2**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		
		this.numeros =[1,2,3,4];
		
		this.temp_array = this.numeros.slice();
		
		num = this.sorteio();
		num2 = this.sorteio();
		
		this.soma = num+num2;
		
		numero = this.game.add.sprite(50,347,"numeros", num);
		numero.alpha =0;
		sinalsoma = this.game.add.sprite(100,347,"numeros",0);
		sinalsoma.alpha =0;
		numero2 = this.game.add.sprite(150,347,"numeros",num2);
		numero2.alpha =0;
		sinaligual = this.game.add.sprite(200,347,"numeros",11);
		sinaligual.alpha =0;
		
		this.groupLevel[this.currentLevel].add(numero);
		this.groupLevel[this.currentLevel].add(sinalsoma);
		this.groupLevel[this.currentLevel].add(numero2);
		this.groupLevel[this.currentLevel].add(sinaligual);
		
		
		
		this.createDelayTime(1500, function() {  
            this.add.tween(numero).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime(4000, function() {  
            this.add.tween(numero2).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(sinalsoma).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime(9000, function() {  
            this.add.tween(sinaligual).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		if(!this.errou){
			this.som.onStop.add(function(){
			console.log("liberar");
			this.initKeyboard();
			}, this);
		}else{
			this.initKeyboard();
			this.errou = false;
		}
	
    },

    initLevel3: function() {
		console.log("***Nivel 3**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		
		this.numeros =[1,2,3,4,5];
		
		this.temp_array = this.numeros.slice();
		
		num = this.sorteio();
		num2 = this.sorteio();
		
		this.soma = num+num2;
		
		numero = this.game.add.sprite(50,347,"numeros", num);
		numero.alpha =0;
		sinalsoma = this.game.add.sprite(100,347,"numeros",0);
		sinalsoma.alpha =0;
		numero2 = this.game.add.sprite(150,347,"numeros",num2);
		numero2.alpha =0;
		sinaligual = this.game.add.sprite(200,347,"numeros",11);
		sinaligual.alpha =0;
		
		this.groupLevel[this.currentLevel].add(numero);
		this.groupLevel[this.currentLevel].add(sinalsoma);
		this.groupLevel[this.currentLevel].add(numero2);
		this.groupLevel[this.currentLevel].add(sinaligual);
		
		
		
		this.createDelayTime(1500, function() {  
            this.add.tween(numero).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime(5000, function() {  
            this.add.tween(numero2).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(sinalsoma).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		this.createDelayTime(8000, function() {  
            this.add.tween(sinaligual).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        });
		
		if(!this.errou){
			this.som.onStop.add(function(){
			console.log("liberar");
			this.initKeyboard();
			}, this);
		}else{
			this.initKeyboard();
			this.errou = false;
		}
		
	
	
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
        this.qtdErros = 0;
		this.corrects++;
		this.saveCorrect();
		//this.showCallToAction = true;
        //this.addPoints();
		this.nivelAnterior = this.currentLevel;
		var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
		
		
    },

	wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        var nivel=this.currentLevel;
		this.nivelAnterior = this.currentLevel;
        this.nivelAnterior = this.currentLevel;
		this.errou = true; 
		if(this.currentLevel > 1) 
		{
			this.currentLevel--;
		}
		
  
		if(this.lives>0)
		{
			this.lives--;
			this.errors--;
		}
       
		
    
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
