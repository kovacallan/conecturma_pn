
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

        this.audiosprite = this.add.audioSprite("audiosprite");

        this.lives = 2;
        this.points = 0;
        this.showCallToAction = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();


        this.createScene();

        this.showIntro();
        //this.showResumo();

        this.input.onTap.add(function() {
            console.log(this.input.x, this.input.y);
        }, this);

        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);

        // this.gameOverMacaco();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();
	},

    textGame:function(){
        this.texto = new Array();
        this.texto['initialText'] = "A tremedeira foi tanta que o \ncomputador do Juninho acabou \nderrubando algumas coisas que \nestavam na mesa! Entre essas coisas \nestava um [quebra-cabeça] de palavras!";
        this.texto['initialText2'] ="Cada peça é uma sílaba. Temos que juntar sílaba por sílaba \naté o quebra-cabeça ficar montado. \nAo final teremos a imagem de um amigo do \n[Conecturma] que já conhecemos... Quem será?";
        this.texto['imgResumo'] ="Já sabíamos que as palavras se separam em sílabas, \ne que cada sílaba tem um som que é dado por uma \nvogal. A novidade agora é que podemos ter mais \nde uma vogal por sílaba! ";
        this.texto['imgResumo2'] ="Viram como o som de uma se une ao da outra vogal? \nElas formam um mesmo som, ou seja, uma mesma \nsílaba! "; 
        
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Hora da palavra que ficará na parte de [cima] \ndo quebra-cabeça. Vamos lá!",
            "E agora? Qual será a palavra que vai encaixar \n[abaixo] da que já temos?",
            "Três peças! Três sílabas! Só mais essas pecinhas \npra gente descobrir que desenho está por \ntrás das palavras!"
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

    // intro-fixa
    showTextoIntro: function() {

        var tutorialText = this.drawText(this.world.centerX+60, 30, this.texto['initialText'], 22, "left");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);

        this.showKim();

        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true, 500);
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
        console.log("Timer Audio:", Math.round(_timer)*100, "ms", this.input.x, this.input.y);
    },
    onStopDebugAudio: function() {
        var _timer = this.debugAudio.currentTime/100;
        console.log("Timer Audio:", Math.round(_timer)*100, "ms");
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

        this.add.tween(this.placar).to({y: -150}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function() {

        for(var i = 0; i < this.buttons.length; i++) {
            this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                elem.destroy();
            });
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
                this.add.tween(this.placar).to({y: -150}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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

    resetRandomLetter: function() {
        this.spliceLetter = [
            
        ];
    },

    getNonRepeatLetter: function(itens, num) {

        var _name = [];

        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }
        
        //console.log(this.spliceLetter);

        for(var i = 0; i < this.spliceLetter.length; i++) {
            var indx = _name.indexOf(this.spliceLetter[i]);
            if(indx >= 0) {
                _name.splice(indx,1);
            }
        }

        if(_name.length < 1) {
            //console.log("1 possible");
            return itens;
        }

        //console.log("possibles",_name);
        return _name;
    },

    limparNomes: function() {

        for(var i = 0; i < this.nameShadows.length; i++) {
            this.nameShadows[i].destroy();            
            this.nameTexts[i].destroy();            
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.groupName = this.add.group();
    },

    showName: function(name) {

        var Ypos = 10;

        this.limparNomes();

        for(var i = 0; i < name.length; i++) {

            var px = this.world.centerX - name.length*25 + i*this.LETTER_SPACING;

            //px = (name[i] == "_")? px + 10 : px;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            this.addLetter(px,py, name[i]);
        }

        //this.nameShadow.x = this.world.centerX - this.nameShadow.width*0.5+4;
        //this.nameText.x = this.world.centerX - this.nameText.width*0.5;
    },
    addLetter: function(x,y, letter) {


        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 75);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 75);

        shadow.x = x+4-shadow.width*0.5;
        name.x = x-name.width*0.5;

        this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        this.groupName.add(shadow);
        this.groupName.add(name);

        return [name,shadow];
    },

    removeButtonAction: function() {
        this.correctItem.input.useHandCursor = false;
        this.game.canvas.style.cursor = "default";
        this.correctItem.input.reset();
        
        this.correctItem.inputEnabled = false;
        this.correctItem.onInputOver.removeAll();
        this.correctItem.onInputOut.removeAll();
        this.correctItem.onInputUp.removeAll();

    }, 

    showCorrectName: function(gotoNext) {

        var itens = [];
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
    },

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.add.sprite( -93, -101, 'background');
        this.walterIdle = this.createAnimation( 27, 168, 'walterIdle', 1,1);
        this.walterHappy = this.createAnimation( 0, 170, 'walterHappy', 1,1);
        this.walterHappy.visible = false;
        this.walterHappy.animations.currentAnim.stop();
        this.walterHappy.animations.currentAnim.loop = false;

        //console.log(this.walterHappy.animations);
        this.walterHappy.animations.currentAnim.onComplete.add( function() {
            this.walterHappy.visible = false;
            this.walterIdle.visible = true;
        }, this);
        
    },

    playAnimation: function() {
        this.walterHappy.visible = true;
        this.walterIdle.visible = false;

        this.walterHappy.animations.currentAnim.play();
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.word1 = ["PA"];
        this.word2 = [null, "TE"];
        this.word3 = ["SAU", null, "DE"];

        this.createBoard();
        this.groupIntro.add(this.board);
        this.board.y = 100;

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-370, 470, ["PEIS",200,  0, 1,1], false, true) );
        this.buttons.push( this.createButton(this.world.centerX- 50, 470, ["NOI" ,  0, 87, 2,0], false, true) );
        this.buttons.push( this.createButton(this.world.centerX+200, 470, ["DA"  ,152,228, 3,1], false, true) );

        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[1]);
        this.groupIntro.add(this.buttons[2]);

        this.createDelayTime( 6000, function() {
            this.arrow = this.add.sprite(415, 315, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);

            var t = this.add.tween(this.arrow)
                .to({ x:272, y: 519}, 500, Phaser.Easing.Linear.None)
                .to({ x:855, y: 150}, 1500, Phaser.Easing.Linear.None)
                .to({ x:522, y: 555}, 500, Phaser.Easing.Linear.None)
                .to({ x:576, y: 268}, 1500, Phaser.Easing.Linear.None)
                .to({ x:784, y: 530}, 500, Phaser.Easing.Linear.None)
                .to({ x:737, y: 389}, 1500, Phaser.Easing.Linear.None);
            t.start();

            this.game.add.tween(this.buttons[0]).to({x:200+this.board.x, y:     this.board.y}, 1500, Phaser.Easing.Linear.None,true, 500);
            this.game.add.tween(this.buttons[1]).to({x:    this.board.x, y:  87+this.board.y}, 1500, Phaser.Easing.Linear.None,true,2500);
            this.game.add.tween(this.buttons[2]).to({x:152+this.board.x, y: 228+this.board.y}, 1500, Phaser.Easing.Linear.None,true,4500);

        });

        this.createDelayTime( 16000, function() {
            this.initGame()
        }, this);
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        click.animations.play('idle');

        this.buttons[0].alpha = 0.7;

        this.groupIntro.add(click);

        // remover click
        this.createDelayTime( 1400, function() {
            click.alpha = 0;
            click.destroy();
        });

        // remover tudo
        this.createDelayTime( 4000, function() {

            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 21, "left");

        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);
        this.groupIntro.add(tutorialText);

        var tutorialText2 =this.drawText(this.world.centerX, 30, this.texto['imgResumo2'], 21, "left"); //this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        this.add.tween( tutorialText).to({alpha: 1},  500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(15500, function() {
            this.add.tween( tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.soundResumo = this.setDebugAudio("soundResumo")

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },

    // level - mostrar proximo
    showNextLevel: function() {

        //this.openLevel();

        
        switch(this.currentLevel) {
            case 1:
                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play("soundP1").onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundP2").onStop.add(this.initLevel2, this);
                }
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.sound.play("soundP3").onStop.add(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        var position = 30;
        if(num===3){
            position = 20;
        }

        this.imageQuestion = this.drawText(this.world.centerX, position, this.questionList[num]);
        this.imageQuestion.alpha = 0;
        if(this.showCallToAction) {
        return;
        }
    
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    createBoard: function() {

        if(this.board) {
            this.board.destroy();
        } 
        this.board = this.add.sprite(500,140,"quadro");

        var p1 = [ [0,0], [200,0] ];
        for(var i = 0; i < this.word1.length; i++) {
            if(this.word1[i] != null) {
                var t1 = this.add.sprite(p1[i][0], p1[i][1], 'quebraCabeca', this.word1[i]);
                this.board.addChild(t1);
            }
        }
        var p2 = [ [0,87], [124,87] ];
        for(var i = 0; i < this.word2.length; i++) {
            if(this.word2[i] != null) {
                var t2 = this.add.sprite(p2[i][0], p2[i][1], 'quebraCabeca', this.word2[i]);
                this.board.addChild(t2);
            }
        }

        var p3 = [ [0,201], [152,228], [276,228] ];
        for(var i = 0; i < this.word3.length; i++) {
            if(this.word3[i] != null) {
                var t3 = this.add.sprite(p3[i][0], p3[i][1], 'quebraCabeca', this.word3[i]);
                this.board.addChild(t3);   
            }
        }
        return this.board;
    },

    resetBoard: function() {
        switch(this.currentLevel) {
            case 1:
                this.word1 = [];
                this.word2 = [];
                this.word3 = [];
            break;
            case 2:
                this.word2 = [];
                this.word3 = [];
            break;
            case 3:
                this.word3 = [];
            break;
        }

        this.createBoard();
    },

    initLevel1: function() {

        this.part1 = ["SA", "PA", "HE"];
        this.part2 = [
            ["BAO", 200,0, 1,1], 
            ["PEIS",200,0, 1,1], 
            ["ROI" ,200,0, 1,1]
        ];
        
        var n = this.rnd.integerInRange(0,2);
        
        var _correct = this.part2[n][0];

        this.part2.sort(function() {
          return .5 - Math.random();
        });

        var rect = new Phaser.Rectangle(680,145,60,70);


        this.word1 = [ this.part1[n] ];
        this.word2 = [];
        this.word3 = [];

        this.createBoard();

        this.numCorrects = 1;
        
        // fixo - criar sistema de botoes dentro do array
        //console.log(this.part2[0]);
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-350, 480, this.part2[0], this.part2[0][0]==_correct) );
        this.buttons.push( this.createButton(this.world.centerX- 90, 480, this.part2[1], this.part2[1][0]==_correct) );
        this.buttons.push( this.createButton(this.world.centerX+180, 480, this.part2[2], this.part2[2][0]==_correct) );

    },

    initLevel2: function() {

        this.part1 = [
            ["OU",  0,87, 2,0], 
            ["NOI", 0,87, 2,0], 
            ["CAI", 0,87, 2,0]

        ];
        this.part2 = [
            ["RO", 124,87, 2,1], 
            ["TE", 124,87, 2,1], 
            ["XA", 124,87, 2,1]
        ];
        
        var n = this.rnd.integerInRange(0,2);

        var _corrects = [this.part1[n][0], this.part2[n][0]];

        this.part2.push(this.part1[n]);

        this.part2.sort(function() {
          return .5 - Math.random();
        });

        if(!this.word1) {
            this.word1 = ["PA", "PEIS"];
        }
        this.word2 = [];
        this.word3 = [];

        this.createBoard();
        
        this.numCorrects = 2;

        console.log(this.part2);        
        // fixo - criar sistema de botoes dentro do array

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-370, 470, this.part2[0], _corrects.indexOf(this.part2[0][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX-350, 330, this.part2[1], _corrects.indexOf(this.part2[1][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX- 40, 470, this.part2[2], _corrects.indexOf(this.part2[2][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX+240, 470, this.part2[3], _corrects.indexOf(this.part2[3][0])>=0) );


    },

    initLevel3: function() {


        this.part1 = [
            ["SAU", 0,201, 3,0],
            ["VAI", 0,201, 3,0],
            ["RAI", 0,201, 3,0]
        ];
        this.part2 = [
            ["DA", 152,228, 3,1], 
            ["DA", 152,228, 3,1], 
            ["VO", 152,228, 3,1]
        ];
        this.part3 = [
            ["DE", 276,228, 3,2], 
            ["DE", 276,228, 3,2], 
            ["SO", 276,228, 3,2]
        ];
        
        var n = this.rnd.integerInRange(0,2);

        var _corrects = [ this.part1[n][0], this.part2[n][0], this.part3[n][0] ];

        var items = [ this.part1[n], this.part2[n], this.part3[n] ];
        if(n == 2) {
            items.push(this.part2[0]);
            items.push(this.part3[0]);
        } else {
            items.push(this.part2[2]);
            items.push(this.part3[2]);
        }

        
        items.sort(function() {
          return .5 - Math.random();
        });

        if(!this.word1) {
            this.word1 = ["PA", "PEIS"];
        }
        if(!this.word2) {
            this.word2 = ["NOI", "TE"];
        }
        this.word3 = [];

        this.createBoard();
        
        this.numCorrects = 3;

        console.log(items);        
        // fixo - criar sistema de botoes dentro do array

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-330, 480, items[0], _corrects.indexOf(items[0][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX-330, 330, items[1], _corrects.indexOf(items[1][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX-140, 480, items[2], _corrects.indexOf(items[2][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX+100, 480, items[3], _corrects.indexOf(items[3][0])>=0) );
        this.buttons.push( this.createButton(this.world.centerX+300, 480, items[4], _corrects.indexOf(items[4][0])>=0) );
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, cantInteract) {
        
        var btn = this.add.sprite(x,y, 'quebraCabeca', imagem[0]);
        btn.isCorrect = right;
        this.correctItem = btn;
        
        btn.alpha = 0;
        btn.correctPos = {x: imagem[1]+this.board.x, y: imagem[2]+this.board.y};

        //this.drawPoint(0xff0000,imagem[1]+this.board.x,imagem[2]+this.board.y);

        btn.wordPos = imagem;
        console.log("-8 "+btn.correctPos, imagem);

        if(cantInteract == undefined) {
            btn.inputEnabled = true;
            btn.input.enableDrag(false, true);
            btn.events.onDragStart.add(this.onStartDrag, this);
            btn.events.onDragStop.add(this.onStopDrag, this); 
        }


        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)

        return btn;
    },

    moveToBoard: function(elem) {

        this.add.tween(elem).to({x: elem.correctPos.x, y: elem.correctPos.y}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                
            this["word" + elem.wordPos[3] ][ elem.wordPos[4] ] = elem.wordPos[0];
            console.log(elem.wordPos, "word" + elem.wordPos[3], this["word" + elem.wordPos[3] ]);
            this.clickRightButton();

        }, this);
    },



    drawPoint:function(cor,x,y){ 
        //0xff0000
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(cor,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
    },

    createSprite:function(w,h,x,y) {

        // create a new bitmap data object
        var bmd = this.game.add.bitmapData(w,h);

        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,w,h);
        bmd.ctx.fillStyle = '#ff0000';
        bmd.ctx.fill();

        var sprite = this.game.add.sprite(x, y, bmd);
        sprite.alpha =0;

        return sprite;
    },

    checkOverlap:function(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },

    onStartDrag: function(elem) {
        this.initialPos = {x:elem.x, y:elem.y};

        this.pontoX1 = elem.correctPos.x;
        this.pontoX2 = elem.correctPos.x+elem.width;
        this.pontoY1 = elem.correctPos.y;
        this.pontoY2 = elem.correctPos.y+elem.height;

        //this.p = this.drawPoint(0xfff000,this.pontoX1,this.pontoY1);
        //this.p1 = this.drawPoint(0xfff000,this.pontoX1,this.pontoY2);

        //this.p2 = this.drawPoint(0x0000ff,this.pontoX2,this.pontoY1);
        //this.p3 = this.drawPoint(0x0000ff,this.pontoX2,this.pontoY2);

        this.sprLugar = this.createSprite(elem.width,elem.height,this.pontoX1,this.pontoY1);
    },

    onStopDrag: function(elem) {

        var border = 50;
        var _Overlap = false;

        console.log("--> "+elem.x, elem.y, elem.correctPos, elem.isCorrect);
        //console.log(elem.x + " > " + this.pontoX1 + " && " + elem.x + " < " + this.pontoX2);
        //console.log(elem.y + " > " + this.pontoY1 + " && " + elem.y + " < " + this.pontoY2);

        if(!_Overlap){
            if (this.checkOverlap(elem,this.sprLugar))
            {
                console.log('Drag the sprites. Overlapping: true');
                _Overlap = true;
                if(elem.isCorrect) {
                    console.log('*** no lugar certo ***');
                    console.log("***correct***");
                    this.sprLugar.destroy();
                    this.moveToBoard(elem);
                    return;
                    
                } else {
                    console.log('*** no lugar errado ***');
                    this.sprLugar.destroy();
                    this.clickWrongButton();
                    
                }

            }
            else
            {   this.sprLugar.destroy();
                this.clickWrongButton();
                console.log('Drag the sprites. Overlapping: false');
            }

        }

   

        /*if(elem.x > this.pontoX1 && elem.x < this.pontoX2) {
            if(elem.y > this.pontoY1 && elem.y < this.pontoY2) {
                if(elem.isCorrect) {
                    console.log("***correct***");
                    this.moveToBoard(elem);
                    return;
                } else {
                    console.log("***errado***");
                    //this.clickWrongButton();
                }
            }
        } else if(this.input.x >= 535 && this.input.x < 930) {
            console.log("***eeeeeeee***");
            if(this.input.y >= 165 && this.input.y < 450) {
                //this.clickWrongButton();
            }
        }*/

       
        /*if(elem.x > elem.correctPos.x-border && elem.x < elem.correctPos.x+border) {
            if(elem.y > elem.correctPos.y-border && elem.y < elem.correctPos.y+border) {
                if(elem.isCorrect) {
                    console.log("***correct***");
                    this.moveToBoard(elem);
                    return;
                } else {
                    //this.clickWrongButton();
                }
            }
        } else if(this.input.x >= 535 && this.input.x < 930) {
            if(this.input.y >= 165 && this.input.y < 450) {
                //this.clickWrongButton();
            }
        }*/



        // 535 165
        // 931 457
        this.add.tween(elem).to({x: this.initialPos.x, y: this.initialPos.y}, 200, Phaser.Easing.Linear.None, true);
    },


    // clicar botao correto
    clickRightButton: function() {


        this.sound.play("hitAcerto");

        if(this.numCorrects > 1) {
            this.numCorrects--;
        } else {
            
            this.playAnimation();
            /* FIXO */
            this.corrects++;
            this.saveCorrect();
            //this.sound.stopAll();
            this.clearButtons(true);
            this.addPoints();
            /* FIXO */
            this.showCorrectName(true);

            this.createBoard();
        }
    },

    // clicar botao errado
    clickWrongButton: function() {
        
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.clearButtons(false);

        this.resetBoard();
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
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
