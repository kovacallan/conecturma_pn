
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator


    

};



BasicGame.Game.prototype = {


    create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TEMPO_INTRO = 9000;
        this.TEMPO_ERRO1 = 1000;
        this.SOUND_VITORIA = 6000;

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
		this.timer =0;
 
        this.createScene();
        
        // ------- AV2D3OA02 ----- //
        this.groupLevel = []; // salva tudo que compoe o nível 
        
        this.initVars(); // variavies do jogo 
        
        // carregado aqui para nao se repitir 
        //this.nivelAnterioir = 0;
        this.numPalavrasNivel =0;
        this.numPalavras1Level1 = [0,1,2];// numero das palavras 1
        this.numPalavras1Level2 = [0,1,2];// numero das palavras 1
        this.numPalavras2Level2 = [0,1,2];// numero das palavras 2
        this.numPalavras1Level3 = [0,1,2];// numero das palavras 1
        this.numPalavras2Level3 = [0,1,2];// numero das palavras 2
        this.numPalavras3Level3 = [0,1,2];// numero das palavras 3
        this.subLevel = 1; 
		this.tempo = true;

        // ------- fim AV2D3OA02 ----- //

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
        this.texto['initialText'] = "Quanta folha no chão da árvore \nda vida! Cada folha possui uma \n[sílaba], e cada montinho forma \numa [palavra].";
        this.texto['initialText2'] ="Será que sabemos quantas folhas temos por \nmontinho? Aqui digitamos o número dois e \npronto. Agora é com vocês. Atenção pois \nteremos 10 segundos, e a cada rodada teremos \nmais palavras formadas pelas folhas!";
        this.texto['imgResumo'] ="Nas sílabas das palavras desse jogo, podemos \nperceber que sempre temos uma consoante e \numa vogal juntas criando um som.";
        this.texto['imgResumo2'] ="Muitas palavras são formadas dessa forma, e \nassim fica bem mais fácil pra gente contar o \nnúmero de sílabas, não é verdade?";
         
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
        //this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
        this.game.time.events.add(time, callback, this)                     
        //this.game.time.events.start();
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */

    skipIntro: function() {
        this.skip = true;
        this.tutorial = false;
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        //console.log("*** skipIntro ***");
        
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
		this.tutorial = true;

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);
        
        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(
			function(){if(this.tutorial){this.showTextoIntro();}}
			, this);
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

        this.createDelayTime(11000, function() {
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
        //1
        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
        
        this.groupIntro.add(this.tutorialText);
        //2
        this.tutorialText2 =this.drawText(this.world.centerX, 40, this.texto['initialText2'], 22, "left"); 
        this.tutorialText2.alpha = 0;
        
        
        this.groupIntro.add(this.tutorialText2);
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim(11000);
        this.soundIntro = this.setDebugAudio("soundIntro");
        
        this.createDelayTime(11000, function() {
           this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
           this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
           .onComplete.add(
               function(){
                if(this.tutorial){this.showLiveTutorial();}
               }
           , this);
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
        //console.log("onStartDebugAudio");
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
		//para reposicionar as folhas apos a introducao 
		this.posicaoFolha = new Array(
                                [144,-20],
                                [129,58],
                                [280,204],
                                [90,343]
                            )
							
        
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
        this.add.tween(this.placar).to({y: -500}, 100, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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
        //this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function(isWrong) {
        console.log("*** hideAndShowLevel");
        this.hideLevel(function() {
            //console.log("currentLevel "+this.currentLevel);
            console.log("corrects "+this.corrects);
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                 //console.log("hideAndShowLevel");
                if(!this.showCallToAction)
                {   // modificado para este jogo 
                    this.add.tween(this.placar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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

    //---- AV1AV2D3OA02 ---- //

    initVars:function(){// iniciação das variáveis do jogo
        this.posicaoFolha = new Array(
                                [144,-20],
                                [129,58],
                                [280,204],
                                [90,343]
                            )
        this.silabasLevel1 = [];// silabas do nivel 1 
        this.silabasLevel2 = [];// silabas do nivel 2 
        this.silabasLevel3 = [];// silabas do nivel 3
        
        this.folhas = []; // imagens 
        this.letter="#";
        
        this.tutorial = false;
        this.numeroSilabas  = 0; 
        this.somPalavra = null;   
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

    resetRandomLetter: function() { 
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },

    efeitoFolhaIntro:function(elem,afastamento,angulo){
        console.log("*** this.efeitoFolhaIntro ***")
        this.game.add.tween(elem).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(elem.scale).to({x:0.5,y:0.5}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(elem).to({x:this.posicaoFolha[1][0]+afastamento,y:this.posicaoFolha[1][1]},1000, Phaser.Easing.Cubic.In, true)
        .onComplete.add(function() {//1
            this.game.add.tween(elem.scale).to({x:0.8,y:0.8},1000, Phaser.Easing.Linear.None, true);
            this.game.add.tween(elem).to({angle:angulo[0]},1000, Phaser.Easing.Cubic.In, true);
            this.game.add.tween(elem).to({x:this.posicaoFolha[2][0]+afastamento,y:this.posicaoFolha[2][1]},1000, Phaser.Easing.Cubic.In, true)
            .onComplete.add(function(){//2
                this.game.add.tween(elem).to({angle:angulo[1]},1000, Phaser.Easing.Cubic.In, true);
                this.game.add.tween(elem).to({x:this.posicaoFolha[3][0]+afastamento,y:this.posicaoFolha[3][1]},1000, Phaser.Easing.Cubic.In, true)
                .onComplete.add(function(){//3
                    this.game.add.tween(elem.scale).to({x:1,y:1}, 1000, Phaser.Easing.Linear.None, true);
                    //this.game.add.tween(elem.children[0].scale).to({x:1.1,y:1.1}, 1000, Phaser.Easing.Linear.None, true);
                    this.game.add.tween(elem).to({angle:angulo[2]},1000, Phaser.Easing.Cubic.In, true);
                }, this);
            }, this);
        }, this);
    },

    efeitoFolha:function(elem,afastamento,angulo){
        this.game.add.tween(elem).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(elem.scale).to({x:0.5,y:0.5}, 1000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(elem).to({x:this.posicaoFolha[1][0]+afastamento,y:this.posicaoFolha[1][1]},1000, Phaser.Easing.Cubic.In, true)
        .onComplete.add(function() {//1
            this.game.add.tween(elem.scale).to({x:0.8,y:0.8},1000, Phaser.Easing.Linear.None, true);
            this.game.add.tween(elem).to({angle:angulo[0]},1000, Phaser.Easing.Cubic.In, true);
            this.game.add.tween(elem).to({x:this.posicaoFolha[2][0]+afastamento,y:this.posicaoFolha[2][1]},1000, Phaser.Easing.Cubic.In, true)
            .onComplete.add(function(){//2
                this.game.add.tween(elem).to({angle:angulo[1]},1000, Phaser.Easing.Cubic.In, true);
                this.game.add.tween(elem).to({x:this.posicaoFolha[3][0]+afastamento,y:this.posicaoFolha[3][1]},1000, Phaser.Easing.Cubic.In, true)
                .onComplete.add(function(){//3
                    this.game.add.tween(elem.scale).to({x:1,y:1}, 1000, Phaser.Easing.Linear.None, true);
                    //this.game.add.tween(elem.children[0].scale).to({x:1.1,y:1.1}, 1000, Phaser.Easing.Linear.None, true);
                    this.game.add.tween(elem).to({angle:angulo[2]},1000, Phaser.Easing.Cubic.In, true);
                    if(!this.tutorial){
						//console.log("---------------------------")
						//console.log(elem.id);
						//console.log(this.numeroSilabas-1);
						if(elem.id==(this.numeroSilabas-1)){
							
							//this.createDelayTime(1000, function() {
								this.tempo = true;
								this.initKeyboard();
								this.imagemTeclado();
							//});
							
						}
                    }
                }, this);
            }, this);
        }, this);
    },

    imagemTeclado:function(){
		
        this.teclado = this.add.sprite( 644, 603, 'teclado');
        this.groupLevel[this.currentLevel].add(this.teclado);
        this.add.tween(this.teclado).to({y:388}, 500, Phaser.Easing.Linear.None, true);

        this.tecla_vazia = this.add.sprite(806,390, 'tecla_vazia');
        this.groupLevel[this.currentLevel].add(this.tecla_vazia);
        this.tecla_vazia.alpha = 0; 
        this.tecla_vazia.scale.set(0.3,0.3);
    },

    initKeyboard: function() {
		//console.log("initKeyboard "+this.tempo);
		this.letter="";
       
		//this.timer = this.game.time.create(true);
		//this.timer.add(totalTimer*1000, this.updateCounter, this);
		//this.timer.start();
        this.createTimer();
        this.game.input.keyboard.addCallbacks(this,null,null, this.onKeyPressed);
		
        
    },
    createTimer: function() {
        var totalTimer = 10;

        this.gameTimer = this.game.time.events.add(totalTimer*1000, this.updateCounter, this);

        this.textTimerShadow =  this.add.bitmapText(this.world.centerX,  540, "JandaManateeSolid", totalTimer.toString(), 48);
        this.textTimerShadow.tint = 0x010101;
        this.textTimer =        this.add.bitmapText(this.world.centerX+2,542, "JandaManateeSolid", totalTimer.toString(), 48);
    },
    updateTimer: function() {
        if(this.gameTimer) {
            //console.log(this.game.time.events.duration);
            var _time = parseInt(this.game.time.events.duration/1000)+1;
            this.textTimerShadow.text = this.textTimer.text = _time.toString();
        }
    },
    removeTimer: function() {

        if(this.gameTimer) {
            this.game.time.events.remove(this.gameTimer);
            this.gameTimer = null;
        }

        if(this.textTimerShadow != null) {
            this.textTimerShadow.destroy();
            this.textTimer.destroy();
        }

    },
    removeKeyboard: function() {
        this.game.input.keyboard.addCallbacks( this, null, null, null );
    },
    
    onKeyPressed: function(evt) { 

        //console.log("onKeyPressed"); 
        //console(this.letter); 
        if(this.letter.length<=1)
        {
            this.letter = evt;
            this.removeKeyboard();
            this.showLetra(2);
            this.verificar("onKeyPressed");    
        }
    },

    showKey: function(value,correto) { //(16) MOSTRA A LETRA DIGITADA 

        //console.log("showKey " + this.currentLevel);
        
        this.currentKey = this.add.bitmapText(838,385, "JandaManateeSolid", value.toString(), 80);
        //this.currentKey.x = 545-(this.currentKey.textWidth/4);
        this.currentKey.tint = '0x000000';
        this.groupLevel[this.currentLevel].add(this.currentKey);
        this.removeKeyboard();//(23)
    },

    showLetra:function(tipo){
          
        this.createDelayTime( 100, function() {
            //this.showKey(this.letter.toUpperCase(),false);
            this.add.tween(this.tecla_vazia).to({alpha:1}, 100, Phaser.Easing.Linear.None, true, 200);
            this.add.tween(this.tecla_vazia.scale).to({x:1,y:1}, 100, Phaser.Easing.Linear.None, true,200).onComplete.add(function () {this.showKey(this.letter.toUpperCase(),false);}, this);
        });  
    },

    verificar:function(func){
        //console.log("verificar "+ func);
        //this.game.time.events.stop();
		//this.timer.stop();
        if(this.letter==this.numeroSilabas.toString())
        {

            this.numPalavrasNivel--;

            //console.log(this.subLevel);
            this.sound.play(this.somPalavra);
            if(this.currentLevel>1)
            {

                 this.saveCorrect(parseInt(this.currentLevel/this.subLevel)*100, false);

                 this.subLevel++;

            }
            
            this.sound.play("hitAcerto");
            this.changeHappy(this.bumba,"bumba_happy","bumba",774, 117, 741, 117);
			this.tempo = false;
            console.log("CORRETO "+this.numPalavrasNivel);
            if(this.numPalavrasNivel==0){
                console.log("CORRETO rightAnswer "+this.numPalavrasNivel);
                this.createDelayTime(500, function() {
                    this.nivelAnterioir = this.currentLevel;
                    this.removeTimer();
                    this.rightAnswer();
					return;
               });
                
            }
            else{
                console.log("CORRETO Proxima");
                console.log(this.numPalavrasNivel);
                this.removeTimer(); 
                this.createDelayTime(500, function() {
                    this.nivelAnterioir = this.currentLevel;
                    this.resetLevel(this.currentLevel);
                    this.createDelayTime(500, function() {
                        this.showNextLevel();
                        return;
                    });
                });

                 
            }

        }
        else{

            console.log("ERRADO");
            this.nivelAnterioir = this.currentLevel;
            this.removeKeyboard();
            this.sound.play("hitErro");
            this.tempo = false;
            this.letter==""
            this.removeTimer();
            this.createDelayTime(500, function() {
                this. wrongAnswer();
				return;
            });    
        }
    },

    updateCounter: function() {
        console.log("**** updateCounter *****");
		if(this.tempo)
		{
			if(this.letter=="")
			{
				
				this.letter=-1;
				this.verificar("updateCounter");
			}
		}
    },

    changeHappy:function(elem, anim,anim2,x,y, x1, y1){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        
        anim.onComplete.add(function() {
            this.changeIdlle(elem,anim2,x1,y1);
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


    //---- AV1AV2D3OA03 ---- //

   
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        
        background = this.add.sprite( -394, -525, 'background');
        background.scale.set(0.9,0.9);
        //this.createAnimation(628, -169, 'bumba', 1,1);
        //this.bumba = this.add.sprite(628, -169,'bumba',1);

        this.arvore = this.add.sprite(671, -117, 'arvore_bumba');
        this.bumba = this.add.sprite(741, 117, 'bumba');
        this.bumba.animations.add('bumba');
        this.bumba.animations.play('bumba', 15, true);
	},
	
	
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
        console.log("showLiveTutorial");
       
		if(this.tutorial)
		{
			this.posicaoFolha = new Array(
									[344,200],
									[329,240],
									[480,290],
									[348,360]
								)

			this.folha = this.add.sprite(this.posicaoFolha[0][0],this.posicaoFolha[0][1], 'folhas',2);
			this.folha.scale.set(0.3,0.3);
			this.folha.alpha = 0;
			this.folha.addChild(this.game.make.sprite(30, 40,'silabas','sa'));
			
			this.folha1 = this.add.sprite(this.posicaoFolha[0][0]+110,this.posicaoFolha[0][1], 'folhas',3);
			this.folha1.scale.set(0.3,0.3);
			this.folha1.alpha = 0;
			this.folha1.addChild(this.game.make.sprite(30, 40,'silabas','po'));

			this.groupIntro.add(this.folha);
			this.groupIntro.add(this.folha1);

			this.createDelayTime(500, function() {
				angulo = [+45,+65,0];
				this.efeitoFolhaIntro(this.folha,0,angulo);
				
				angulo = [-45,-65,0];
				this.efeitoFolhaIntro(this.folha1,110,angulo);
			});

				this.createDelayTime(5500, function() {
				this.teclado = this.add.sprite( 644, 603, 'teclado');
				this.groupIntro.add(this.teclado);

				this.tecla = this.add.sprite(806,390, 'tecla2');
				this.groupIntro.add(this.tecla);
				this.tecla.alpha = 0; 
				this.tecla.scale.set(0.3,0.3);

				mao = this.add.sprite(610,600, 'mao');
				this.groupIntro.add(mao);
				//mao.alpha = 0; 
				//mao.scale.set(0.3,0.3);
                this.finishedTutotirial = true;
				this.add.tween(this.teclado).to({y:388}, 500, Phaser.Easing.Linear.None, true)
			   .onComplete.add(function(){
						this.add.tween(this.tecla).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
						this.add.tween(this.tecla.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true)
						.onComplete.add(function(){
								this.add.tween(mao).to({x:723,y:435}, 500, Phaser.Easing.Linear.None, true)
								.onComplete.add(function(){
									this.add.tween(this.tecla.scale).to({x:0.8,y:0.8}, 500, Phaser.Easing.Linear.None, true)
									.onComplete.add(function(){
                                        console.log("---> console <---");
                                        this.changeHappy(this.bumba,"bumba_happy","bumba",774, 117, 741, 117);
										this.add.tween(this.tecla.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true)
										.onComplete.add(function(){
                                            if(this.tutorial){
                                                this.soundIntro.onStop.add(function(){
                                                    if(this.finishedTutotirial){this.showFinishedLiveTutorial();}
                                                }, this);     
                                            }
										},this)
									},this)
								},this)
						},this)
					
				},this)
			});
		}   
    },
    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        this.finishedTutotirial = false;
        console.log("showFinishedLiveTutorial");
        if(this.tutorial){
            this.skipIntro();
        }
        
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 70, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        
        var tutorialText2 = this.drawText(this.world.centerX, 70, this.texto['imgResumo2'], 22, "left");
        tutorialText2.alpha = 0;
        //tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);
        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        
        this.soundResumo = this.sound.play("soundResumo");
        
        
        this.createDelayTime(11000, function() {
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

        console.log("**showQuestion**");
        this.imageQuestion = this.add.sprite(this.world.centerX, 50, "pergunta" + num);

        this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        //this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {
        console.log("***Nivel 1**** ");
		this.tutorial = false;
        this.groupLevel[this.currentLevel] = this.add.group();

        this.groupLevel[this.currentLevel].name = "***Nivel 1****";
        this.numPalavrasNivel =1;
        console.log("numero de palavras "+this.numPalavrasNivel)

        this.palavrasLevel1 = new Array(["sa","ci"],
                                        ["cu","ru","pi","ra"],
                                        ["na","tu","re","za"]
                                        )

       
        //console.log("palavras init: "+this.numPalavras1Level1);
        this.temp_array = this.numPalavras1Level1.slice();
        palavra = this.sorteio();
        this.somPalavra = this.currentLevel+"_"+this.subLevel+"_"+palavra;
        this.numPalavras1Level1 = this.temp_array.slice();
        //console.log("palavras rest: "+this.numPalavras1Level1);
        afastamento = 0;
        valoresAngulos = new Array([+45,+65,0],[-45,-65,0]);
        this.numeroSilabas = this.palavrasLevel1[palavra].length;
        for(var i=0; i<this.numeroSilabas; i++){
            x = this.posicaoFolha[0][0]+afastamento;
            y = this.posicaoFolha[0][1];

            if(i%2==0){ang = 0;}else{ang = 1;}

            this.folhas[i] = this.add.sprite(x,y,'folhas',3);
			this.folhas[i].id = i;
            this.folhas[i].scale.set(0.3,0.3);
            this.folhas[i].alpha = 0;
            this.folhas[i].addChild(this.game.make.sprite(30, 40,'silabas',this.palavrasLevel1[palavra][i]));
            angulo = [valoresAngulos[ang][0],valoresAngulos[ang][1],valoresAngulos[ang][2]];
            this.efeitoFolha(this.folhas[i],afastamento,angulo);
            afastamento+=110;
            this.groupLevel[this.currentLevel].add(this.folhas[i]);
        }
         
    },

    initLevel2: function() {
        console.log("***Nivel 2**** ");
        console.log("***Nivel 2 sub **** " + this.subLevel);
		this.tutorial = false;
        
        
        //this.groupLevel[this.currentLevel].name = "***Nivel 2****";

        this.palavrasLevel21 = new Array(["ma","to"],
                                            ["ma","ca","co"],
                                            ["sa","po"]
                                        )
        this.palavrasLevel22 = new Array(["ba","na","na"],
                                            ["pa","to"],
                                            ["gi","ra","fa"]
                                        )

        if(this.nivelAnterioir != this.currentLevel){
            this.numPalavrasNivel =2;
        }
        console.log("numero de palavras "+this.numPalavrasNivel)

        switch(this.subLevel)
        {
            case 1:
                this.groupLevel[this.currentLevel] = this.add.group();
                //console.log("palavras init: "+this.numPalavras1Level2);
                this.temp_array = this.numPalavras1Level2.slice();
                
                palavra = this.sorteio();
                
                this.somPalavra = this.currentLevel+"_"+this.subLevel+"_"+palavra;
                this.numPalavras1Level2 = this.temp_array.slice();
                //console.log("palavras rest: "+this.numPalavras1Level2);
                
                afastamento = 0;
                valoresAngulos = new Array([+45,+65,0],[-45,-65,0]);
            
                this.numeroSilabas = this.palavrasLevel21[palavra].length;
                
                for(var i=0; i<this.numeroSilabas; i++){
                    x = this.posicaoFolha[0][0]+afastamento;
                    y = this.posicaoFolha[0][1];

                    if(i%2==0){ang = 0;}else{ang = 1;}

                    this.folhas[i] = this.add.sprite(x,y,'folhas',3);
					this.folhas[i].id = i;
                    this.folhas[i].scale.set(0.3,0.3);
                    this.folhas[i].alpha = 0;
                    this.folhas[i].addChild(this.game.make.sprite(30, 40,'silabas',this.palavrasLevel21[palavra][i]));
                    angulo = [valoresAngulos[ang][0],valoresAngulos[ang][1],valoresAngulos[ang][2]];
                    this.efeitoFolha(this.folhas[i],afastamento,angulo);
                    afastamento+=110;
                    this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
            case 2:
                this.groupLevel[this.currentLevel] = this.add.group();
                //console.log("palavras init: "+this.numPalavras2Level2);
                this.temp_array = this.numPalavras2Level2.slice();
                
                palavra = this.sorteio();
                
                this.somPalavra = this.currentLevel+"_"+this.subLevel+"_"+palavra;
                this.numPalavras2Level2 = this.temp_array.slice();
                //console.log("palavras rest: "+this.numPalavras2Level2);
                
                afastamento = 0;
                valoresAngulos = new Array([+45,+65,0],[-45,-65,0]);
            
                this.numeroSilabas = this.palavrasLevel22[palavra].length;
                
                for(var i=0; i<this.numeroSilabas; i++){
                    x = this.posicaoFolha[0][0]+afastamento;
                    y = this.posicaoFolha[0][1];
                    //console(this.palavrasLevel22[palavra][i]);
                    if(i%2==0){ang = 0;}else{ang = 1;}

                    this.folhas[i] = this.add.sprite(x,y,'folhas',3);
					this.folhas[i].id = i;
                    this.folhas[i].scale.set(0.3,0.3);
                    this.folhas[i].alpha = 0;
                    this.folhas[i].addChild(this.game.make.sprite(30, 40,'silabas',this.palavrasLevel22[palavra][i]));
                    angulo = [valoresAngulos[ang][0],valoresAngulos[ang][1],valoresAngulos[ang][2]];

                    //console.log("*******");
                    //console.log(this.folhas[i]);

                    this.efeitoFolha(this.folhas[i],afastamento,angulo);
                    afastamento+=110;
                    this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
        }
        
    },
    initLevel3: function() {
        console.log("***Nivel 3**** ");
        console.log("***Nivel 3 sub **** " + this.subLevel);
        
        this.groupLevel[this.currentLevel] = this.add.group();
		this.tutorial = false;
        this.palavrasLevel31 = new Array(["la","go"],
                                            ["ra","po","sa"],
                                            ["hi","po","poo","ta","mo"]
                                        )
        this.palavrasLevel32 = new Array(["ca","ra","mu","jo"],
                                            ["ga","to"],
                                            ["lo","bo"]
                                        )
        this.palavrasLevel33 = new Array(["tu","ca","no"],
                                            ["go","ri","la"],
                                            ["ca","va","lo"]
                                        )

        if(this.nivelAnterioir != this.currentLevel){
            this.numPalavrasNivel =3;
        }

        console.log("numero de palavras "+this.numPalavrasNivel)

        switch(this.subLevel)
        {
            case 1:
                this.groupLevel[this.currentLevel] = this.add.group();
                //console.log("palavras init: "+this.numPalavras1Level3);
                this.temp_array = this.numPalavras1Level3.slice();
                
                palavra = this.sorteio();
                
                this.somPalavra = this.currentLevel+"_"+this.subLevel+"_"+palavra;
                this.numPalavras1Level3 = this.temp_array.slice();
                //console.log("palavras rest: "+this.numPalavras1Level3);
                
                afastamento = 0;
                valoresAngulos = new Array([+45,+65,0],[-45,-65,0]);
            
                this.numeroSilabas = this.palavrasLevel31[palavra].length;
                
                for(var i=0; i<this.numeroSilabas; i++){
                    x = this.posicaoFolha[0][0]+afastamento;
                    y = this.posicaoFolha[0][1];

                    if(i%2==0){ang = 0;}else{ang = 1;}

                    this.folhas[i] = this.add.sprite(x,y,'folhas',3);
					this.folhas[i].id = i;
                    this.folhas[i].scale.set(0.3,0.3);
                    this.folhas[i].alpha = 0;
                    this.folhas[i].addChild(this.game.make.sprite(30, 40,'silabas',this.palavrasLevel31[palavra][i]));
                    angulo = [valoresAngulos[ang][0],valoresAngulos[ang][1],valoresAngulos[ang][2]];
                    this.efeitoFolha(this.folhas[i],afastamento,angulo);
                    afastamento+=110;
                    this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
            case 2:
                this.groupLevel[this.currentLevel] = this.add.group();
                //console.log("palavras init: "+this.numPalavras2Level3);
                this.temp_array = this.numPalavras3Level3.slice();
                
                palavra = this.sorteio();
                
                this.somPalavra = this.currentLevel+"_"+this.subLevel+"_"+palavra;
                this.numPalavras2Level3 = this.temp_array.slice();
                //console.log("palavras rest: "+this.numPalavras2Level3);
                
                afastamento = 0;
                valoresAngulos = new Array([+45,+65,0],[-45,-65,0]);
            
                this.numeroSilabas = this.palavrasLevel32[palavra].length;
                
                for(var i=0; i<this.numeroSilabas; i++){
                    x = this.posicaoFolha[0][0]+afastamento;
                    y = this.posicaoFolha[0][1];

                    if(i%2==0){ang = 0;}else{ang = 1;}

                    this.folhas[i] = this.add.sprite(x,y,'folhas',3);
                    this.folhas[i].scale.set(0.3,0.3);
					this.folhas[i].id = i;
                    this.folhas[i].alpha = 0;
                    this.folhas[i].addChild(this.game.make.sprite(30, 40,'silabas',this.palavrasLevel32[palavra][i]));
                    angulo = [valoresAngulos[ang][0],valoresAngulos[ang][1],valoresAngulos[ang][2]];
                    this.efeitoFolha(this.folhas[i],afastamento,angulo);
                    afastamento+=110;
                    this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
            case 3:
                this.groupLevel[this.currentLevel] = this.add.group();
                //console.log("palavras init: "+this.numPalavras3Level3);
                this.temp_array = this.numPalavras3Level3.slice();
                
                palavra = this.sorteio();
                
                this.somPalavra = this.currentLevel+"_"+this.subLevel+"_"+palavra;
                this.numPalavras3Level3 = this.temp_array.slice();
                //console.log("palavras rest: "+this.numPalavras3Level3);
                
                afastamento = 0;
                valoresAngulos = new Array([+45,+65,0],[-45,-65,0]);
            
                this.numeroSilabas = this.palavrasLevel33[palavra].length;
                
                for(var i=0; i<this.numeroSilabas; i++){
                    x = this.posicaoFolha[0][0]+afastamento;
                    y = this.posicaoFolha[0][1];

                    if(i%2==0){ang = 0;}else{ang = 1;}

                    this.folhas[i] = this.add.sprite(x,y,'folhas',3);
					this.folhas[i].id = i;
                    this.folhas[i].scale.set(0.3,0.3);
                    this.folhas[i].alpha = 0;
                    this.folhas[i].addChild(this.game.make.sprite(30, 40,'silabas',this.palavrasLevel33[palavra][i]));
                    angulo = [valoresAngulos[ang][0],valoresAngulos[ang][1],valoresAngulos[ang][2]];
                    this.efeitoFolha(this.folhas[i],afastamento,angulo);
                    afastamento+=110;
                    this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
        }
    },
    
    resetLevel:function(nivel){
       
        //console.log("***resetLevel*** ");
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
			  this.initVars();
        }); 
    },
    
    
    rightAnswer: function() { 
        //console.log("rightAnswer - 10 ");
        //this.removeTimer();
        this.qtdErros = 0;
        this.corrects++;
        this.saveCorrect();
        //this.sound.play("hitAcerto");
        this.showCallToAction = false;
        this.addPoints();
        this.subLevel = 1; 
        var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(1500, function() {this.gotoNextLevel();}); // para o próximo nível
		
    },

    wrongAnswer: function() { 
        //console.log("wrongAnswer - 11 ");
        //this.removeTimer();
        var nivel=this.currentLevel;
        this.showCallToAction = true;
        
        if(this.currentLevel > 1) 
        {
            this.currentLevel--;
        }
		
		if(this.lives>0)
		{
			this.lives--;
			this.errors--;
		}
        this.subLevel = 1; 
        
        //this.sound.play("hitErro");
    
        switch(this.lives) {
            case 1: // mostra dica 1
                this.resetLevel(nivel);
				this.createDelayTime(700, function() {
					this.hideLevel(function() {
						this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
					});
				}); // para o próximo nível
            break;
            case 0: // toca som de resumo
                this.resetLevel(nivel);
                this.lives = 0; 
				this.createDelayTime(700, function() {
					this.hideLevel();
					this.showResumo();
				}); // para o próximo nível
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

        this.updateTimer();

    }
};
