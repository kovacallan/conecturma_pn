
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
        this.SOUND_VITORIA = 1500;

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
 
        
        
        // ------- AV2D5OA03 ----- //
        this.groupLevel = []; // salva tudo que compoe o nível 
        this.errou = false; // para a apresentacao show action
        this.nivelAnterior = 0;
        this.itens =[];
        this.initVars(); // variavies do jogo 
        // ------- fim AV2D5OA03 ----- //

        this.createScene();

        this.showIntro();
        // this.showResumo();
        // this.gameOverMacaco();
        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

    },

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "O Fred adora observar borboletas! \nAqui no alto da árvore temos várias! \nElas aparecem e depois algumas vão \nembora! ";
        this.texto['initialText2'] ="Por exemplo, aqui temos [5 borboletas], essas \nduas vão embora… quantas ficaram? [3] ! Clico \nno [3] que é o resultado certinho da subtração \ne espero mais borboletas! Vamos lá!";
        this.texto['imgResumo'] ="";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Se o Fred vê [10 borboletas] e ESTAS vão embora, \nquantas ele consegue ver?",
            "Se vê [15 borboletas] e ESTAS vão embora, \nquantas ele consegue ver?",
            "Se o Fred vê [20 borboletas] e ESTAS vão embora, \nquantas ele consegue ver?"
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

    

    createDelayTime: function(time, callback) {
        //this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
        this.game.time.events.add(time, callback, this)
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
        this.tutorial = true;

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);
        
        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500)
        .onComplete.add(function(){
            if(this.tutorial){this.showTextoIntro();}
        }
        , this);
    },

    // intro-fixa
    showKim: function() {
        this.kim = this.createAnimation( this.world.centerX-320, 200, 'kimAntiga', 1,1);
        this.kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        this.kim.crop(rect);

        this.groupIntro.add(this.kim);

        this.add.tween(this.kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(11000, function() {
            this.add.tween(this.kim).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        //1
        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
        this.groupIntro.add(this.tutorialText);
        //2
        this.tutorialText2 = this.drawText(this.world.centerX, 50, this.texto['initialText2'], 22, "left");
        this.tutorialText2.alpha = 0;
        this.groupIntro.add(this.tutorialText2);
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim();
        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime(11000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialText2).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true, 200).onComplete.add(function(){
                    if(this.tutorial){this.showLiveTutorial();}
                },this)
            },this)
        });
        
        /*this.createDelayTime(32000, function() {
            this.add.tween(this.tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            
        });*/

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

        console.log("*** initGame ***");

        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
        
    },
    
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
              this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
              
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

    //---- AV1AV2D5OA02 ---- //

    initVars:function(){// iniciação das variáveis do jogo
       
        this.tutorial = false;
        this.temp_array=[];
        this.borboletas = [];
        this.botoes = [];
       
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
      
        for (w=index; w<this.temp_array.length-1; w++)
        {
            this.temp_array[w] = this.temp_array[w+1];
        }
        this.temp_array.pop();
    },
    
    sorteio:function(){    
        var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));   
        this.retirarArrayElemento(item); 
        return item;
    },

    liberar:function(modo,img){
        console.log("*** liberar ***");
        switch(modo)
        {
            case 1:// para liberar boboletas caso precise  
                for(var i=0; i<this.borboletas.length;i++)
                {
                    this.borboletas[i].inputEnabled = true;
                    this.borboletas[i].events.onInputDown.add(this.mouseInputDown, this);
                    //this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
            case 2:// liberar botoes 
                for(var i=0; i<this.botoes.length;i++){
                    this.botoes[i].inputEnabled = true;
                    this.botoes[i].events.onInputDown.add(this.mouseInputDown, this);
                }
            break;
            case 3:// para travar botoes 
                for(var i=0; i<this.botoes.length;i++){
                    this.botoes[i].events.onInputDown.removeAll();
                    this.botoes[i].input.reset();
                }
            break;
            

        }   
    },
    
    mouseInputDown:function(elem){
        console.log("*** mouseInputDown ***");
        //console.log(elem.name);
        //console.log(elem.x);
        //console.log(elem.y);

        resultado = false;

        if(elem.name==this.resultado){
            console.log("correto");
            this.add.tween(elem.scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                this.add.tween(elem.scale).to({x:0.8,y:0.8}, 500, Phaser.Easing.Linear.None, true)
            },this);
            this.changeHappy(this.fred,"fred_happy","fred",74,199);
            this.liberar(3);
            this.sound.play("hitAcerto");
            this.createDelayTime(1000, function() {
                this.rightAnswer();
            });
        }else{
            console.log("errado");
            this.liberar(3);
            this.sound.play("hitErro");
            this.createDelayTime(1000, function() {
                this.wrongAnswer();
            });
        }
    },

    
    animClick:function(prox,img){
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.arrow.alpha = 0;
        }, this);
    },

    
    efeitoMouse:function(tipo){
        console.log("*** efeitoMouse ***");
        switch(tipo){
            case 1:

                x = this.botoes[0].x+15;
                y = this.botoes[0].y+25;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.botoes[0].scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                        this.add.tween(this.botoes[0].scale).to({x:0.8,y:0.8}, 500, Phaser.Easing.Linear.None, true)
                    },this);
                    this.animClick();
                    this.changeHappy(this.fred,"fred_happy","fred",74,199);
                    
                },this);

                this.createDelayTime(8000, function() {
                    if(this.tutorial){
                        this.showFinishedLiveTutorial();
                    }  
                });
            break;
        
        }
    },


    shuffle:function(array,tam) {
        tam = array.length;
        var currentIndex = tam, temporaryValue, randomIndex ;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    changeHappy:function(elem, anim,anim2,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        
        anim.onComplete.add(function() {
            this.changeIdlle(elem,anim2,x,y);
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

    createTutorial:function(){

        this.num_borboletas = 5;
        this.resultado = 3;
        this.numero =2;

        this.borboletas = [];

        this.posicaoX = [525,590,675,758,661];
        this.posicaoY = [400,323,264,394,433];
        this.posicao = [0,1,2,3,4];
        this.borboletasSaida = [0,1,2,3,4];
        
        num = 0;
        for(i=0;i<this.num_borboletas;i++){ 
            
            this.temp_array = this.posicao.slice();
            pos = this.sorteio();
            this.posicao = this.temp_array.slice();

            x = this.posicaoX[pos];
            y = this.posicaoY[pos];

            if(num==1 || num==0 || num==4){
                aux = 1300
            }else{
                aux = -300
            }

            this.borboletas[i] = this.createAnimation(aux,800,'borboleta_'+num, 1,1);
            this.borboletas[i].name = i;
            this.borboletas[i].id = num;
            if(num==4){num=0};
            num++;

            this.groupIntro.add(this.borboletas[i]);

            this.add.tween(this.borboletas[i]).to({x:x, y:y}, 2000, Phaser.Easing.Linear.None, true);
        }
        this.createDelayTime(1000, function() {
            this.placaOp = this.add.sprite(223,381, 'placa');
            op1 = this.add.sprite(252,410, 'numeros',this.num_borboletas);

            this.groupIntro.add(this.placaOp);
            this.groupIntro.add(op1);
        });

        this.createDelayTime(4000, function() {
            this.createVoo();
            op2 = this.add.sprite(307,412, 'numeros',21); // sinal de menos 
            op3 = this.add.sprite(369,410, 'numeros',this.numero);

            this.groupIntro.add(op2);
            this.groupIntro.add(op3);
        });

        this.createDelayTime(5000, function() {
            posicao = [183,298,411];
            this.botoes = [];

            this.botoes[0] = this.add.sprite(posicao[0],499, 'numeros_tecla',3);
            this.botoes[0].scale.set(0.8,0.8);
            this.groupIntro.add(this.botoes[0]);

            this.botoes[1] = this.add.sprite(posicao[1],499, 'numeros_tecla',4);
            this.botoes[1].scale.set(0.8,0.8);
            this.groupIntro.add(this.botoes[1]);

            this.botoes[2] = this.add.sprite(posicao[2],499, 'numeros_tecla',5);
            this.botoes[2].scale.set(0.8,0.8);
            this.groupIntro.add(this.botoes[2]);

            this.arrow = this.add.sprite(510,390, 'arrow');
            this.groupIntro.add(this.arrow);
            this.arrow.alpha =1;

            this.click = this.add.sprite(0, 0, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.alpha = 0;
            this.groupIntro.add(this.click);



        });
        
        this.createDelayTime(8000, function() {
            this.efeitoMouse(1);
        });

    },

    createBorboletas:function(){
        console.log("*** createBorboletas ***");
        this.borboletas = [];

        this.posicaoX = [865,865,307,350,471,376,448,573,482,591,637,546,727,693,709,828,870,804,754,887];
        this.posicaoY = [009,096,218,285,321,144,237,136,161,343,369,274,418,190,279,459,374,303,195,211];
        this.posicao = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        
        
        num = 0;
        for(i=0;i<this.num_borboletas;i++){ 
            
            this.temp_array = this.posicao.slice();
            pos = this.sorteio();
            this.posicao = this.temp_array.slice();

            x = this.posicaoX[pos];
            y = this.posicaoY[pos];

            if(num==1 || num==0 || num==4){
                aux = 1300
            }else{
                aux = -300
            }

            this.borboletas[i] = this.createAnimation(aux,800,'borboleta_'+num, 1,1);

            this.borboletas[i].name = i;
            this.borboletas[i].id = num;
            if(num==4){num=0};
            num++;

            this.add.tween(this.borboletas[i]).to({x:x, y:y}, 2000, Phaser.Easing.Linear.None, true);

            this.groupLevel[this.currentLevel].add(this.borboletas[i]);
        }
        //this.liberar(1);
    },

    createVoo:function(){
        console.log("*** createVoo ***");
        for(i=0;i<this.numero;i++){ 

            this.temp_array = this.borboletasSaida.slice();
            borboleta = this.sorteio();
            this.borboletasSaida = this.temp_array.slice();

            //console.log(this.borboletas[borboleta].id);
            if(this.borboletas[borboleta].id==1 || this.borboletas[borboleta].id==0 || this.borboletas[borboleta].id==4){
                this.add.tween(this.borboletas[borboleta]).to({x:-300, y:0}, 2000, Phaser.Easing.Linear.None, true);
            }else{
                this.add.tween(this.borboletas[borboleta]).to({x:1300, y:0}, 2000, Phaser.Easing.Linear.None, true);
            }

        }

    },

    createOpcaoes:function(){
        console.log("*** createOpcaoes ***");

        //console.log("num "+ this.numerosSaida);

        this.temp_array = this.numerosSaida.slice();
        this.retirarArrayElemento(this.resultado);
        this.numerosSaida = this.temp_array.slice();

        //console.log("num "+ this.numerosSaida);

        this.temp_array = this.numerosSaida.slice();
        num = this.sorteio();
        this.numerosSaida = this.temp_array.slice();

        this.temp_array = this.numerosSaida.slice();
        num1 = this.sorteio();
        this.numerosSaida = this.temp_array.slice();

        posicao = [183,298,411];
        this.botoes = [];

        numeros = [this.resultado,num,num1];

        numeros = this.shuffle(numeros);

        for(i=0; i<3; i++){
            this.temp_array = posicao.slice();
            pos = this.sorteio();

            this.botoes[i] = this.add.sprite(pos,499, 'numeros_tecla',numeros[i]);
            this.botoes[i].name = numeros[i];
            this.botoes[i].scale.set(0.8,0.8);

            posicao = this.temp_array.slice();

            this.groupLevel[this.currentLevel].add(this.botoes[i]);
        }

        this.createDelayTime(1000, function() {
            this.liberar(2);
        });
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
    
   
    //---- AV1AV2D5OA02 ---- //

   
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        
        this.background = this.add.sprite(-1167,-1099, 'background');
        this.fred = this.add.sprite(74,199, 'fred',1);
        this.fred.animations.add('fred');
        this.fred.animations.play('fred', 15, true);
        //this.initGame();
        //this.showResumo();
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
        console.log("showLiveTutorial");

        this.createDelayTime(1000, function() {
           if(this.tutorial){
             this.createTutorial();
           }
        });     
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        console.log("*** showFinishedLiveTutorial ***");
        
        this.createDelayTime(1000, function() {
            if(this.tutorial){
                this.skipIntro();
            } 
        });
    },

    // resumo inicial
    showTextResumo: function() {
        console.log("showTextResumo");
        var t1 = "Vamos relembrar: subtração é a operação\n onde tiramos uma quantidade de outra e\n ficamos com o que sobrou.";
        var tutorialText = this.drawText(this.world.centerX, 65, t1, 22, "center");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        var tutorialText2 = this.add.sprite(199,113, 'imgResumo2'); // 10 brigadeiros 
        tutorialText2.alpha = 0;
        //tutorialText2.anchor.set(0.5, 0.5);
        tutorialText2.scale.set(0.8, 0.8);

        this.groupIntro.add(tutorialText2);

        var tutorialText3 = this.add.sprite(388,129, 'imgResumo3');// - 
        tutorialText3.alpha = 0;
        //tutorialText3.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText3);

        var tutorialText4 = this.add.sprite(401,126, 'imgResumo4'); // 5 brigadeiros 
        tutorialText4.alpha = 0;
        //tutorialText4.anchor.set(0.5, 0.5);
        tutorialText4.scale.set(0.8, 0.8);

        this.groupIntro.add(tutorialText4);

        var tutorialText5 = this.add.sprite(549,131, 'imgResumo5'); // =
        tutorialText5.alpha = 0;
        //tutorialText5.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText5);

        var tutorialText6 = this.add.sprite(567,126, 'imgResumo4');// 5 brigadeiros 
        tutorialText6.alpha = 0;
        //tutorialText6.anchor.set(0.5, 0.5);
        tutorialText6.scale.set(0.8, 0.8);

        this.groupIntro.add(tutorialText6);


        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.soundResumo = this.sound.play("soundResumo");

        this.createDelayTime(10000, function() {
           this.add.tween(tutorialText).to({alpha:0},400, Phaser.Easing.Linear.None, true);
           this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(13000, function() {
           this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
           this.add.tween(tutorialText4).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(17000, function() {
           this.add.tween(tutorialText5).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
           this.add.tween(tutorialText6).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });
        
        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(tutorialText3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(tutorialText4).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(tutorialText5).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(tutorialText6).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)

            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        // comentado para este jogo 

        switch(this.currentLevel) {
            case 1:
                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.levelSound = this.sound.play("soundP1");
                    this.initLevel1();
                    // comentado para este jogo 
                    //this.sound.play("soundP1").onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.levelSound = this.sound.play("soundP2");
                    this.initLevel2();
                    // comentado para este jogo 
                    //this.sound.play("soundP2").onStop.add(this.initLevel2, this);

                }
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.levelSound = this.sound.play("soundP3");
                    this.initLevel3();
                    // comentado para este jogo 
                    //this.sound.play("soundP3").onStop.add(this.initLevel3, this);
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
        this.tutorial = false;

        this.num_borboletas = 10;

        this.numerosSaida = [1,2,3,4,5];
        this.borboletasSaida = [0,1,2,3,4,5,6,7,8,9];
        
        this.temp_array = this.numerosSaida.slice();
        this.numero = this.sorteio();
        this.numerosSaida = this.temp_array.slice();

        this.resultado = this.num_borboletas - this.numero ;

        //console.log("numero: "+this.numero );
        //console.log("resultado: "+this.resultado);

        this.createDelayTime(1000, function() {
            this.createBorboletas();
            this.placaOp = this.add.sprite(223,381, 'placa');
            op1 = this.add.sprite(252,410, 'numeros',this.num_borboletas);

            this.groupLevel[this.currentLevel].add(this.placaOp);
            this.groupLevel[this.currentLevel].add(op1);
        });

        this.createDelayTime(3000, function() {
            this.createVoo();
            op2 = this.add.sprite(307,412, 'numeros',21); // sinal de menos 
            op3 = this.add.sprite(369,410, 'numeros',this.numero);

            this.groupLevel[this.currentLevel].add(op2);
            this.groupLevel[this.currentLevel].add(op3);
        });

        if(this.showCallToAction){
            this.createDelayTime(4000, function() {
                this.createOpcaoes();
            });
        }else{
            this.levelSound.onStop.add(this.createOpcaoes, this);
        }       
    },

    initLevel2: function() {
        console.log("***Nivel 2**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();  
        this.tutorial = false;

        this.num_borboletas = 15;

        this.numerosSaida = [5,6,7,8,9,10];
        this.borboletasSaida = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        
        this.temp_array = this.numerosSaida.slice();
        this.numero = this.sorteio();
        this.numerosSaida = this.temp_array.slice();

        this.resultado = this.num_borboletas - this.numero ;

        //console.log("numero: "+this.numero );
        //console.log("resultado: "+this.resultado);

        this.createDelayTime(1000, function() {
            this.createBorboletas();
            this.placaOp = this.add.sprite(223,381, 'placa');
            op1 = this.add.sprite(252,410, 'numeros',this.num_borboletas);

            this.groupLevel[this.currentLevel].add(this.placaOp);
            this.groupLevel[this.currentLevel].add(op1);
        });

        this.createDelayTime(3000, function() {
            this.createVoo();
            op2 = this.add.sprite(307,412, 'numeros',21); // sinal de menos 
            op3 = this.add.sprite(369,410, 'numeros',this.numero);

            this.groupLevel[this.currentLevel].add(op2);
            this.groupLevel[this.currentLevel].add(op3);
        });

        if(this.showCallToAction){
            this.createDelayTime(4000, function() {
                this.createOpcaoes();
            });
        }else{
            this.levelSound.onStop.add(this.createOpcaoes, this);
        }
     
    },

    
    initLevel3: function() {
        console.log("***Nivel 3**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.tutorial = false;

        this.num_borboletas = 20;

        this.numerosSaida = [5,6,7,8,9,10];
        this.borboletasSaida = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        
        this.temp_array = this.numerosSaida.slice();
        this.numero = this.sorteio();
        this.numerosSaida = this.temp_array.slice();

        this.resultado = this.num_borboletas - this.numero ;

        //console.log("numero: "+this.numero );
        //console.log("resultado: "+this.resultado);

        this.createDelayTime(1000, function() {
            this.createBorboletas();
            this.placaOp = this.add.sprite(223,381, 'placa');
            op1 = this.add.sprite(252,410, 'numeros',this.num_borboletas);

            this.groupLevel[this.currentLevel].add(this.placaOp);
            this.groupLevel[this.currentLevel].add(op1);
        });

        this.numerosSaida = [12,11,7,8,9,10];

        this.createDelayTime(3000, function() {
            this.createVoo();
            op2 = this.add.sprite(307,412, 'numeros',21); // sinal de menos 
            op3 = this.add.sprite(369,410, 'numeros',this.numero);

            this.groupLevel[this.currentLevel].add(op2);
            this.groupLevel[this.currentLevel].add(op3);
        });
        if(this.showCallToAction){
            this.createDelayTime(4000, function() {
                this.createOpcaoes();
            });
        }else{
            this.levelSound.onStop.add(this.createOpcaoes, this);
        }
        
    },
    
    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(500, function() {
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
        //this.sound.play("hitAcerto");
        //this.showCallToAction = true;
        //this.addPoints();
        var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível   
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        var nivel=this.currentLevel;
        this.nivelAnterior = this.currentLevel;
         //this.sound.play("hitErro");
        
        if(this.currentLevel > 1) 
        {
            this.currentLevel--;
        }

        if(this.lives > 0) 
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
