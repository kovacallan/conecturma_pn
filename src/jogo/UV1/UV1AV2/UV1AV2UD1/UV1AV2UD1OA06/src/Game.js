

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
        this.TEMPO_INTRO = 13500;
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
		
		//this.rimaImg = this.add.sprite(100, 200,"frases_p3",5);
		//this.sound.play("frases_p3_5");

		
		this.createScene();
        // ------- AV2D1OA06 ----- //
        this.groupLevel = []; // salva tudo que compoe o nível 
        this.errou = false; // para a apresentacao show action
        this.nivelAnterior = 0;
		this.frases_rima  = []; // tamanho de 3 fases por nivel  de indice zero a dois Rodada 1
        this.frases_naorima  = []; // tamanho de 3 fases por nivel
        this.arquivoImg = "";
        this.initVars(); // variavies do jogo 
        // ------- fim AV2D1OA06 ----- //

        this.showIntro();
        // this.gameOverMacaco();
        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();
	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Olhem ali, pessoal! Tem mais arquivo \ncomprimido pedindo a nossa ajuda. ";
        this.texto['initialText2'] ="O arquivo grande está cheio de frases, mas \nprecisa organizá-las. Para isto, basta \nencontrarmos as frases que [rimam] e clicarmos \nnelas! Vejam:";
        this.texto['imgResumo'] ="Quando sabemos os [sons das palavras] fica bem \nfácil pra gente saber o que rima com o que, não é \nverdade? Mas já deu pra perceber que nem sempre \numa mesma letra tem o mesmo som sempre.";
        this.texto['imgResumo2'] ="A leitura em [voz alta] é que nos ajuda a \nidentificar os [sons parecidos]. \nJá fez alguma rima hoje?";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Para escutar, passem o mouse por cima!",
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

        this.spliceLetter.push( letters[n] );

        return letters[n];
    },

    createDelayTime: function(time, callback) {

        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */

    skipIntro: function() {
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
		
		if(this.tutorial)
		{
			this.resetLevel(this.currentLevel);
		}
	
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
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

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    // intro-fixa
    showKim: function() {
        var kim = this.createAnimation( this.world.centerX-320, 200, 'kim', 1,1);
        kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        kim.crop(rect);

        this.groupIntro.add(kim);

        this.add.tween(kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(5000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {

        var tutorialText = this.drawText(this.world.centerX+60, 70, this.texto['initialText'], 22, "left");
        tutorialText.alpha = 0;
		//tutorialText.scale.set(0.8, 0.8);
        //tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);
		
        this.showKim();

        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime(5000, function() {
           this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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

        this.hideLevel(function() {

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

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    //---- AV1AV2D1OA06 ---- //

    initVars:function(){// iniciação das variáveis do jogo
        this.rimaImg = 0; // guarda a imagem da frase que rima 
        this.nao_rimaImg = 0;// guarda a imagem da frase que não rima 
        this.rima = 0; // numero do objeto que rima
        this.nao_rima = 0;// numero do objeto que nao rima
        //this.frases_rima  = []; // tamanho de 3 fases por nivel
        //this.frases_naorima  = []; // tamanho de 3 fases por nivel
        
        this.lado = [0,1]; // para sortear em que lado fica a frase
        this.numLado1 = 0; // recebe o numero do lado sorteado 
        this.numLado2 = 0; // recebe o numero do lado sorteado 
        this.posicaoInit = [305,763];
        this.posicaoFinal = [390,621];
        this.temp_array = [];
        this.tutorial =false;

        this.posicaoInitImg = [0,0,0,0]; // salva a posicao inicial para a imagem aparecer 
        this.posicaoFinalImg = [0,0,0,0]; // salva a posicao final para a imagem aparecer 
        //this.arquivoImg = 0;// nome do arquivo para chamar as imagens de cada nivel 
        

        this.acertosNivel = 0;
		this.playSound = false; // para tocar um som de uma vez
		
		
		this.cestoRima = 0; // imagem da capsula que rima (marca)
        this.cestoNaoRima = 0; // imagem da capsula que não rima (marca)
		this.cestoRimaImg = 0; // imagem da capsula que rima  (real)
        this.cestoNaoRimaImg = 0; // imagem da capsula que não rima (real)
		this.som = null; // recebe o som que está tocando
		this.nivelCompleto=false;


        
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

    retirarArrayElemento:function(elem){ // retirar elementos do array
        var index = this.temp_array.indexOf(elem);
      
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },

    changeJuninhoHappy:function(){// troca a animação 
        ////console.log('fred!!!');
        this.juninho.loadTexture('juninho_happy', 0);
        this.juninho.x = 879;//879, 292
        this.juninho.y = 292;
        var anim  = this.juninho.animations.add('juninho_happy');
        
        anim.onComplete.add(function() {
            this.changeJuninhoIdlle();
        }, this);
        anim.play(15);
    },

    changeJuninhoIdlle:function(){// troca a animação 
        this.juninho.loadTexture('juninho', 0);
        this.juninho.x = 879;
        this.juninho.y = 292;
        this.juninho.animations.add('juninho');
        this.juninho.animations.play('juninho', 15, true);
    },
	
	changeFredHappy:function(){// troca a animação 
        ////console.log('fred!!!');
        this.fred.loadTexture('fred_happy', 0);
        this.fred.x = 26;
        this.fred.y = 215;
        var anim  = this.fred.animations.add('fred_happy');
        
        anim.onComplete.add(function() {
            this.changeFredIdlle();
        }, this);
        anim.play(15);
    },

    changeFredIdlle:function(){// troca a animação 
        this.fred.loadTexture('fred', 0);
        this.fred.x = 26; //26, 215
        this.fred.y = 215;
        this.fred.animations.add('fred');
        this.fred.animations.play('fred', 15, true);
    },


    createLevel:function(){// cria os elementos dos niveis 
        //console.log('*** createLevel ***');
        //console.log(this.posicaoInitImg);


        this.cestoRimaImg = this.add.sprite(134,447,'rima');
        this.cestoRimaImg.name = "rima"; 
    
		this.cestoNaoRimaImg = this.add.sprite(803,449,'nao_rima');
        this.cestoNaoRimaImg.name = "nao_rima"; 
		
		this.groupLevel[this.currentLevel].add(this.cestoRimaImg);
		this.groupLevel[this.currentLevel].add(this.cestoNaoRimaImg);
		
        // efeito 
        this.cestoRimaImg.alpha =0;
        this.cestoNaoRimaImg.alpha =0;
        
		
		this.cestoRimaImg.scale.set(0.5,0.5);
        this.cestoNaoRimaImg.scale.set(0.5,0.5);

        this.add.tween(this.cestoRimaImg).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.cestoNaoRimaImg).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);

        this.game.add.tween(this.cestoRimaImg).to({x:134,y:447}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this.cestoNaoRimaImg).to({x:803,y:449}, 1000, Phaser.Easing.Linear.None, true);

        // feito frases 
        this.rimaImg = this.add.sprite(this.posicaoInitImg[0], this.posicaoInitImg[1],this.arquivoImg,this.rima);
        this.nao_rimaImg = this.add.sprite(this.posicaoInitImg[2],this.posicaoInitImg[3],this.arquivoImg,this.nao_rima);
		
		this.groupLevel[this.currentLevel].add(this.rimaImg);
		this.groupLevel[this.currentLevel].add(this.nao_rimaImg);

        this.rimaImg.anchor.setTo(0.3, 0.3);
        this.rimaImg.scale.set(0.5, 0.5);
        this.rimaImg.angle -= 45;
        this.rimaImg.alpha = 0;
        this.rimaImg.name = "rima";
        this.rimaImg.sound = this.arquivoImg+"_"+this.rima.toString();
        
        this.nao_rimaImg.anchor.setTo(0.3, 0.3);
        this.nao_rimaImg.scale.set(0.5, 0.5);
        this.nao_rimaImg.angle += 45;
        this.nao_rimaImg.alpha = 0;
        this.nao_rimaImg.name = "nao_rima";
        this.nao_rimaImg.sound =  this.arquivoImg+"_"+this.nao_rima.toString();

        
        this.game.add.tween(this.rimaImg).to(
            { alpha: 1, angle: 0, x: this.posicaoFinalImg[0], y: this.posicaoFinalImg[1] }, 500, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this.rimaImg.scale).to({x:0.9,y:0.9}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(function() {}, this);

        
        this.game.add.tween(this.nao_rimaImg).to(
            { angle: 0, alpha: 1, x: this.posicaoFinalImg[2], y: this.posicaoFinalImg[3] }, 500, Phaser.Easing.Linear.None, true);
        
        this.game.add.tween(this.nao_rimaImg.scale).to({x:0.9,y:0.9}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
			if(!this.tutorial)
			{
				this.liberar(1);
			}
			else
			{
				this.arrow = this.add.sprite(493,184, "arrow");
				this.arrow.anchor.set(0.5,0.5);
				this.arrow.alpha=1;
				this.groupLevel[this.currentLevel].add(this.arrow);

				// animação de click 
				this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
				this.click.animations.add('idle', null, 18, true);
				this.groupLevel[this.currentLevel].add(this.click);
				
				this.createDelayTime(14000, function() {  
					this.efeitoMouse(1);

				});
			}
			
		}, this);
    },

    
    sorteio:function(){ 
        //console.log("*** sorteio ***");
        var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));   
        this.retirarArrayElemento(item); 
        //console.log(item);
        return item;
    },
	
	enventoMouse:function(elem) {
		console.log("----enventoMouse---");
			if(this.som == null){
				this.playSound = true;
				this.som = this.sound.play(elem.sound);
				this.add.tween(elem.scale).to({x:1.2,y:1.2}, 200, Phaser.Easing.Linear.None, true);
				this.som.onStop.add(function(){
					this.add.tween(elem.scale).to({x:0.9,y:0.9}, 200, Phaser.Easing.Linear.None, true);
					this.som = null;
					this.playSound = false;
				}, this);
			}
	},
	
	resetLevel:function(nivelJogo){
		console.log("***resetLevel***");
		
		this.createDelayTime(500, function() {
			 this.add.tween(this.groupLevel[nivelJogo]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
			 
			 if(this.groupLevel[nivelJogo] != null) {
				this.groupLevel[nivelJogo].removeAll(true);
			 }
		}); 
        this.nivel =0;
        this.initVars();
    },
	
	createTutorial:function(){
		this.groupLevel[this.currentLevel] = this.add.group();
		this.tutorial = true;
		
		//this.frases_rima  = [0]; // tamanho de 3 fases por nivel  de indice zero a dois Rodada 1
		//this.frases_naorima  = [1]; // tamanho de 3 fases por nivel
		this.arquivoImg = "frases_intro";
        
        // sorteia o lado (fred/juninho)
		//this.lado = [0,1]; // para sortear em que lado fica a frase
        //this.temp_array = this.lado.slice();
        this.numLado1 = 1;
        this.numLado2 = 0;

        this.posicaoInitImg = [this.posicaoInit[this.numLado1],220,this.posicaoInit[this.numLado2],220]; // salva a posicao inicial para a imagem aparecer 
        this.posicaoFinalImg = [this.posicaoFinal[this.numLado1],313,this.posicaoFinal[this.numLado2],313]; // salva a posicao final para a imagem aparecer 

        //this.temp_array = this.frases_rima.slice();
        this.rima = 0; // numero do objeto que rima
        //this.frases_rima = this.temp_array.slice();

        //this.temp_array = this.frases_naorima.slice();
        this.nao_rima = 1;// numero do objeto que nao rima
        //this.frases_naorima = this.temp_array.slice();

        //console.log("*** createTeste ***");
        //console.log(this.frases_rima);
        //console.log(this.frases_naorima);
		
		this.capsulas = this.add.sprite(137, 95, 'capsulas',0);
        this.capsulas.animations.add('capsulas', this.math.numberArray(0,56), 18, false);
        this.capsulas.animations.play('capsulas', 8, false);
		
		this.groupLevel[this.currentLevel].add(this.capsulas);
		
        this.createDelayTime(4000, function() {  
            this.createLevel();
	
        });
		
	},
	
	animClick:function(passo){
        this.click.x = this.arrow.x-35;
        this.click.y = this.arrow.y-35;
		this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
			this.efeitoMouse(passo);
            
        }, this);
    },
	
	efeitoMouse:function(passo){
		this.arrow.alpha=1;
		switch(passo)
		{
			case 1:
				this.game.add.tween(this.arrow).to({x:625,y:323}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
						this.animClick(2);
				}, this);
			break;
			case 2:
				this.createDelayTime(500, function() {  
						//this.efeitoMouse(1);
					
					this.game.add.tween(this.rimaImg).to({x:157,y:476}, 700, Phaser.Easing.Linear.None, true);
					
					this.game.add.tween(this.rimaImg.scale).to({x:0.5,y:0.5}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function() {
						
						this.add.tween(this.rimaImg).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function() {
							this.changeJuninhoHappy();
							this.changeFredHappy();
							this.efeitoMouse(3);
						}, this);

					}, this);
				});
			break;
			case 3:
				this.createDelayTime(2000, function() {  
					//this.game.add.tween(this.arrow).to({x:389,y:326}, 1000, Phaser.Easing.Cubic.In, true).onComplete.add(function() {
							//this.animClick(4);
					//}, this);
					this.efeitoMouse(4);
				});
			break;
			case 4:
				this.createDelayTime(500, function() {  
						//this.efeitoMouse(1);
					this.game.add.tween(this.nao_rimaImg).to({x:828,y:471}, 700, Phaser.Easing.Linear.None, true);
					//this.game.add.tween(this.arrow).to({x:828,y:471}, 700, Phaser.Easing.Cubic.In, true);
					this.game.add.tween(this.nao_rimaImg.scale).to({x:0.5,y:0.5}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function() {
						this.add.tween(this.arrow).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true);
						this.add.tween(this.nao_rimaImg).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function() {
							this.changeJuninhoHappy();
							this.changeFredHappy();
							//efeitoMouse(3);
							this.createDelayTime(1000, function() {  
								this.showFinishedLiveTutorial();
							});
						}, this);

					}, this);
				});
			break;
		}
		
	},
	
	liberar:function(modo,img){
        console.log("*** liberar ***");
        switch(modo)
        {
            case 1:
			
				this.nao_rimaImg.inputEnabled = true;
				this.nao_rimaImg.events.onInputDown.add(this.mouseInputDown, this);
				
				this.rimaImg.inputEnabled = true;
				this.rimaImg.events.onInputDown.add(this.mouseInputDown, this);
				
				this.rimaImg.input.useHandCursor = true;
				this.rimaImg.events.onInputOver.add(this.enventoMouse,this);
			
				this.nao_rimaImg.input.useHandCursor = true;
				this.nao_rimaImg.events.onInputOver.add(this.enventoMouse,this);
               
            break;
            case 2:
			
				this.nao_rimaImg.inputEnabled = false;
				this.nao_rimaImg.events.onInputDown.removeAll();
				this.nao_rimaImg.input.reset();
				
				this.rimaImg.inputEnabled = false;
				this.rimaImg.events.onInputDown.removeAll();
				this.rimaImg.input.reset();
				
            break;
            
            

        }   
    },
    
    mouseInputDown:function(elem){
        console.log("*** mouseInputDown ***");
        console.log(elem.name);
		if(this.playSound && this.som != null){
            this.som.stop();
        }
		if(elem.name==this.cestoRimaImg.name)
		{   
			console.log("RIMA CORRETO");
			this.liberar(2);
			this.sound.play("hitAcerto");
			this.changeJuninhoHappy();
			this.changeFredHappy();

			this.createDelayTime(100,function() {
				this.add.tween(this.rimaImg).to({x:134,y:447}, 700, Phaser.Easing.Cubic.In, true).onComplete.add(function() {
					this.add.tween(this.rimaImg.scale).to({x:0.5,y:0.5}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function() {
						this.add.tween(this.rimaImg).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
						this.rimaImg.destroy();
					}, this);
				}, this);	
				
				this.add.tween(this.nao_rimaImg).to({x:803,y:449}, 700, Phaser.Easing.Cubic.In, true).onComplete.add(function() {
					this.add.tween(this.nao_rimaImg.scale).to({x:0.5,y:0.5}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function() {
						this.add.tween(this.nao_rimaImg).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
						this.nao_rimaImg.destroy();
					}, this);
				}, this);	
				
			});
			
			this.createDelayTime(1500, function() {
				this.rightAnswer();
			});
					
				
				
		}else{
			console.log("errado");
			this.liberar(2);
			this.sound.play("hitErro");
			this.createDelayTime(1000, function() {
				this.wrongAnswer();
			});
		}
    },
    //---- AV1AV2D1OA06 ---- //
	
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.add.sprite( -113, -153, 'background');

        this.createAnimation( 7, 12, 'capsulas_background', 1,1);

        this.fred = this.add.sprite( 26, 215, 'fred',1);
        this.fred.animations.add('fred');
        this.fred.animations.play('fred', 15, true);

        this.juninho = this.add.sprite(879, 292, 'juninho',1);
        this.juninho.animations.add('juninho');
        this.juninho.animations.play('juninho', 15, true);

		//this.createTeste();  
		
        
        
    },

    

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		this.tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");//this.add.sprite( this.world.centerX, 80, 'initialText2');
        this.tutorialText2.alpha = 0;
        //this.tutorialText2.anchor.set(0.5, 0.5);
		this.groupIntro.add(this.tutorialText2);
		
		
        this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
		this.createTutorial();
        
        

        //this.createDelayTime( 4200, function() {}, this);
    },
	
	
    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        // remover tudo
		this.resetLevel(this.currentLevel);
        this.createDelayTime(1000, function() {
			this.add.tween(this.tutorialText2).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(
				function(){
					this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
				}
				, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
		
		var tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['imgResumo2'], 22, "left");
        tutorialText2.alpha = 0;
        //tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);
		
		this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		
		this.soundResumo = this.sound.play("soundResumo");
		
		this.createDelayTime( 15000, function() {
			this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
			this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        switch(this.currentLevel) {
            case 1:
                
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
					this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
					this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel2, this);
                }
            break;
            case 3:
                
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
					this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 50, this.questionList[num]);
        this.imageQuestion.alpha = 0;


        if(this.showCallToAction) {
            return;
        }
        
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {
		 
        console.log("***Nivel 1**** " + this.corrects);
		this.groupLevel[this.currentLevel] = this.add.group();
		
		if(this.nivelAnterior!=this.currentLevel)
        {
            this.frases_rima  = [0,1,2]; // tamanho de 3 fases por nivel  de indice zero a dois Rodada 1
            this.frases_naorima  = [3,4,5]; // tamanho de 3 fases por nivel
            this.arquivoImg = "frases_p1";
        }
        // sorteia o lado (fred/juninho)
		this.lado = [0,1]; // para sortear em que lado fica a frase
        this.temp_array = this.lado.slice();
        this.numLado1 = this.sorteio();
        this.numLado2 = this.sorteio();

        this.posicaoInitImg = [this.posicaoInit[this.numLado1],220,this.posicaoInit[this.numLado2],220]; // salva a posicao inicial para a imagem aparecer 
        this.posicaoFinalImg = [this.posicaoFinal[this.numLado1],313,this.posicaoFinal[this.numLado2],313]; // salva a posicao final para a imagem aparecer 

        this.temp_array = this.frases_rima.slice();
        this.rima = this.sorteio(); // numero do objeto que rima
        this.frases_rima = this.temp_array.slice();

        this.temp_array = this.frases_naorima.slice();
        this.nao_rima = this.sorteio();// numero do objeto que nao rima
        this.frases_naorima = this.temp_array.slice();

        //console.log(this.frases_rima);
        //console.log(this.frases_naorima);
		
		this.capsulas = this.add.sprite(137, 95, 'capsulas',0);
        this.capsulas.animations.add('capsulas', this.math.numberArray(0,30), 18, false);
        this.capsulas.animations.play('capsulas', 15, false).onComplete.add(function() {
            this.createLevel();
        }, this);
        
        this.groupLevel[this.currentLevel].add(this.capsulas);

    },

    initLevel2: function() {
		console.log("***Nivel 2**** " + this.corrects);
		
		this.groupLevel[this.currentLevel] = this.add.group();
		
		if(this.nivelAnterior!=this.currentLevel)
        {
            this.frases_rima  = [0,1,2]; // tamanho de 3 fases por nivel  de indice zero a dois Rodada 1
            this.frases_naorima  = [3,4,5]; // tamanho de 3 fases por nivel
            this.arquivoImg = "frases_p2";
        }
        // sorteia o lado (fred/juninho)
		this.lado = [0,1]; // para sortear em que lado fica a frase
        this.temp_array = this.lado.slice();
        this.numLado1 = this.sorteio();
        this.numLado2 = this.sorteio();

        this.posicaoInitImg = [this.posicaoInit[this.numLado1],220,this.posicaoInit[this.numLado2],220]; // salva a posicao inicial para a imagem aparecer 
        this.posicaoFinalImg = [this.posicaoFinal[this.numLado1],313,this.posicaoFinal[this.numLado2],313]; // salva a posicao final para a imagem aparecer 

        this.temp_array = this.frases_rima.slice();
        this.rima = this.sorteio(); // numero do objeto que rima
        this.frases_rima = this.temp_array.slice();

        this.temp_array = this.frases_naorima.slice();
        this.nao_rima = this.sorteio();// numero do objeto que nao rima
        this.frases_naorima = this.temp_array.slice();
		
        //console.log(this.frases_rima);
        //console.log(this.frases_naorima);
		
		this.capsulas = this.add.sprite(137, 95, 'capsulas',0);
        this.capsulas.animations.add('capsulas', this.math.numberArray(0,56), 18, false);
        this.capsulas.animations.play('capsulas', 15, false).onComplete.add(function() {
            this.createLevel();
        }, this);
		
		this.groupLevel[this.currentLevel].add(this.capsulas);
    },

    initLevel3: function() {
		console.log("***Nivel 3**** " + this.corrects);
		
		this.groupLevel[this.currentLevel] = this.add.group();
		
		if(this.nivelAnterior!=this.currentLevel)
        {
            this.frases_rima  = [0,1,2]; // tamanho de 3 fases por nivel  de indice zero a dois Rodada 1
            this.frases_naorima  = [3,4,5]; // tamanho de 3 fases por nivel
            this.arquivoImg = "frases_p3";
        }
        // sorteia o lado (fred/juninho)
		this.lado = [0,1]; // para sortear em que lado fica a frase
        this.temp_array = this.lado.slice();
        this.numLado1 = this.sorteio();
        this.numLado2 = this.sorteio();

        this.posicaoInitImg = [this.posicaoInit[this.numLado1],220,this.posicaoInit[this.numLado2],220]; // salva a posicao inicial para a imagem aparecer 
        this.posicaoFinalImg = [this.posicaoFinal[this.numLado1],313,this.posicaoFinal[this.numLado2],313]; // salva a posicao final para a imagem aparecer 

        this.temp_array = this.frases_rima.slice();
        this.rima = this.sorteio(); // numero do objeto que rima
        this.frases_rima = this.temp_array.slice();

        this.temp_array = this.frases_naorima.slice();
        this.nao_rima = this.sorteio();// numero do objeto que nao rima
        this.frases_naorima = this.temp_array.slice();

        //console.log(this.frases_rima);
        //console.log(this.frases_naorima);
		
		this.capsulas = this.add.sprite(137, 95, 'capsulas',0);
        this.capsulas.animations.add('capsulas', this.math.numberArray(0,56), 18, false);
        this.capsulas.animations.play('capsulas', 15, false).onComplete.add(function() {
            this.createLevel();
        }, this);
		
		this.groupLevel[this.currentLevel].add(this.capsulas);		
	},
	
	rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
		this.showCallToAction = false;
        //this.inputMovableNumbers(2);
        this.qtdErros = 0;
		this.corrects++;
        this.saveCorrect();
		//this.sound.play("hitAcerto");
		//this.showCallToAction = true;
        this.addPoints();
		this.nivelAnterior = this.currentLevel;
        this.nivel=this.currentLevel;
        this.resetLevel(this.nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
    },

	wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
		this.showCallToAction = true;
        this.nivel=this.currentLevel;
        this.nivelAnterior = this.currentLevel;
		if(this.currentLevel > 1) 
		{
			this.currentLevel--;
		}
  
        this.lives--;
        this.errors--;
		//this.sound.play("hitErro");
    
		switch(this.lives) {
            case 1: // mostra dica 1
				this.resetLevel(this.nivel);
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
				this.resetLevel(this.nivel);
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
