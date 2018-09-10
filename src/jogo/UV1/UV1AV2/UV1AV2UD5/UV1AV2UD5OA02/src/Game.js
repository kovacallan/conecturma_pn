
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
 
        
        
        // ------- AV2D3OA01 ----- //
        this.groupLevel = []; // salva tudo que compoe o nível 
        this.errou = false; // para a apresentacao show action
        this.nivelAnterior = 0;
        this.itens =[];
        this.initVars(); // variavies do jogo 
        // ------- fim AV2D3OA01 ----- //

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
        this.texto['initialText'] = "Chegamos rapidinho aqui na copa, \nheim? Olhem como as folhas são \nlindas em seus galhos...";
        this.texto['initialText2'] ="Nesse as folhas só podem ter letras. Temos que \ntirar do galho as folhas que possuem qualquer \noutro símbolo  clicando pra que elas caiam. \nVamos fazer o mesmo com os outros galhos? ";
        this.texto['imgResumo'] ="Esse galho é de folhas de letras, então se \nnão for uma delas, não pode estar aqui. \nQue tal cantar a musiquinha do alfabeto \npra lembrar?";
         
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
        this.kim = this.createAnimation( this.world.centerX-320, 200, 'kim', 1,1);
        this.kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        this.kim.crop(rect);

        this.groupIntro.add(this.kim);

        this.add.tween(this.kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(6000, function() {
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
        this.tutorialText2 = this.drawText(this.world.centerX, 10, this.texto['initialText2'], 22, "left");
        this.tutorialText2.alpha = 0;
        this.groupIntro.add(this.tutorialText2);
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim();
        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime(6000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                //this.add.tween(this.kim).to({y: -300}, 100, Phaser.Easing.Linear.None, true, 500)
                this.add.tween(this.tutorialPlacar).to({y: -120}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.tutorialText2).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true, 200).onComplete.add(function(){
                        if(this.tutorial){this.showLiveTutorial();}
                    },this)
                },this)
            },this)
            
            
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

        console.log("initGame");

        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        // modificada para este jogo
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
        this.showNextLevel();
    },
    
    gotoNextLevel: function() {

        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        // comentado para estes jogo 
        //this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function() {
        // comentado para estes jogo 
        /*this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {
              this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
              
            } else {
                this.gameOverMacaco();
            }
        });*/

        if(this.currentLevel <= 3 && this.corrects <= 2) {
            this.showNextLevel();
        } else {
            this.gameOverMacaco();
        }
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
        this.folhas = [];
        this.numFolhas = 0;
        this.acertos = 0;
        this.temp_array=[];
       
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

    liberar:function(modo,img){
        console.log("*** liberar ***");
        switch(modo)
        {
            case 1:// para liberar 
                for(var i=0; i<this.folhas.length;i++)
                {
                    this.folhas[i].inputEnabled = true;
                    this.folhas[i].events.onInputDown.add(this.mouseInputDown, this);
                    this.groupLevel[this.currentLevel].add(this.folhas[i]);
                }
            break;
            case 2:// para travar em caso de erro
                for(var i=0; i<this.folhas.length;i++)
                {
                    this.folhas[i].events.onInputDown.removeAll();
                    this.folhas[i].input.reset();
                }
            break;
            case 3:// para travar em caso de erro
                //for(var i=0; i<this.folhas.length;i++)
                //{
                    this.folhas[img].events.onInputDown.removeAll();
                    this.folhas[img].input.reset();
                //}
            break;
            

        }   
    },
    
    mouseInputDown:function(elem){
        console.log("*** mouseInputDown ***");
        //console.log(elem.name);

        resultado = false;

        for(i=0; i<this.rodadaCorreta[this.item].length;i++){
            //console.log("elem: "+elem.name + " item: "+this.rodadaCorreta[this.item][i]);
            if(elem.name==this.rodadaCorreta[this.item][i])
            {
                console.log("correto");
                this.liberar(3,elem.id);
                this.sound.play("hitAcerto");

                this.add.tween(elem).to({y:800},2000, Phaser.Easing.Linear.None, true);
                this.game.add.tween(elem).to({angle: 180},2000, Phaser.Easing.Cubic.In, true, 100 + 400 * i, false);
                console.log("ACERTOS: "+this.acertos);
                if(this.acertos>0){
                    this.acertos--;
                }
                console.log("ACERTOS: "+this.acertos);
                if(this.acertos==0){
                    console.log("ultimo correto");
                     this.liberar(2);
                    this.createDelayTime(1000, function() {
                        this.rightAnswer();
                    });
                }

                resultado =true;
            }
        }

        if(!resultado){
            console.log("errado");
            this.liberar(2);
            this.sound.play("hitErro");
            this.createDelayTime(1000, function() {
                this.wrongAnswer();
            });
        }
    },

    createFolhasTutorial:function(){

        for(i=0; i<7;i++){
            
            this.folhas[i] = this.add.sprite(posicaoX[i],posicaoY[i], 'folhas_vazias',i);
            if(i<this.numFolhas){
                this.folhas[i].addChild(this.game.make.sprite(posicaoFilhosX[i],posicaoFilhosY[i],'simbolos',this.rodada[this.item][i]));
                this.folhas[i].name  = this.rodada[this.item][i];
                this.folhas[i].id  = i;
            }
            else{
                this.folhas[i].name  = "vazia";
            } 
            this.folhas[i].alpha = 0;
            this.add.tween(this.folhas[i]).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.folhas[i]);  
        }

        this.createDelayTime(8000, function() {
            if(this.tutorial){this.efeitoMouse(1);}
        });
    },

    createFolhas:function(){
        //count = this.numFolhas+1;
        for(i=0; i<8;i++){
            
            this.folhas[i] = this.add.sprite(posicaoX[i],posicaoY[i], 'folhas_vazias',i);
            if(i<this.numFolhas){
                this.folhas[i].addChild(this.game.make.sprite(posicaoFilhosX[i],posicaoFilhosY[i],'simbolos',this.rodada[this.item][i]));
                this.folhas[i].name  = this.rodada[this.item][i];
                this.folhas[i].id  = i;
            }
            else{
                this.folhas[i].name  = "vazia";
            } 
            this.folhas[i].alpha = 0;
            this.add.tween(this.folhas[i]).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
        }

        this.createDelayTime(1000, function() {
            this.liberar(1);
        });

    },

    animClick:function(prox,img)
    {
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.caiFolha(img);
            this.efeitoMouse(prox);
        }, this);
    },

    caiFolha:function(img){
        console.log("*** caiFolha ***");
        this.add.tween(img).to({y:800},2000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(img).to({angle: 180},2000, Phaser.Easing.Cubic.In, true, 100 + 400 * i, false);
    },
    efeitoMouse:function(tipo){
        console.log("*** efeitoMouse ***");
        switch(tipo){
            case 1:
                this.arrow = this.add.sprite(510,390, 'arrow');
                this.groupIntro.add(this.arrow);
                this.arrow.alpha =1;

                this.click = this.add.sprite(0, 0, "clickAnimation");
                this.click.animations.add('idle', null, 18, true);
                this.click.alpha = 0;

                this.groupIntro.add(this.click);

                x = this.folhas[1].x+55;
                y = this.folhas[1].y+35;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(2,this.folhas[1]);
                },this);

                //this.rodadaCorreta[0] =new Array(31,33,36);
            break;
            case 2:
                x = this.folhas[5].x+15;
                y = this.folhas[5].y+35;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(3,this.folhas[5]);
                },this);
            break;
            case 3:
                x = this.folhas[4].x+35;
                y = this.folhas[4].y+35;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(4,this.folhas[4]);
                },this);
            break;
            case 4:
                this.createDelayTime(2000, function() {
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
    
    
   
    //---- AV1AV2D5OA02 ---- //

   
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        
        this.background = this.add.sprite(-354,-554, 'background');
        
        //var x = this.addSpriteMeu('background',-321, -339);
        //var y = this.addSpriteMeu('estrela',170,246,0);
        //x.scale.set(0.9,0.9);
        
        //this.initGame();

        //this.initLevel1();  
    },
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
        console.log("showLiveTutorial");
        this.folhas = [];
        posicaoX = [853,80,527,324,215,116,357];
        posicaoY = [74,466,151,320,266,251,178];
        
        this.numFolhas = 6;
        this.acertos = 2;

        posicaoFilhosX = [35,70,20,15,35,15,35];
        posicaoFilhosY = [20,20,10,40,60,60,5];

        this.item = 0;

        this.rodada = [];
        this.rodada[0] = new Array(0,31,20,14,36,33);
        this.rodadaCorreta = [];
        this.rodadaCorreta[0] =new Array(31,33,36);

        this.createFolhasTutorial();
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
        var tutorialText =this.drawText(this.world.centerX, 50, this.texto['imgResumo'], 22, "left"); //this.add.sprite( this.world.centerX,110, 'imgResumo');
        tutorialText.alpha = 0;
        
        this.groupIntro.add(tutorialText);
        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        
        this.soundResumo = this.sound.play("soundResumo");
        
        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        // comentado para este jogo 
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
        this.tutorial = false;

        this.folhas = [];
        posicaoX = [853,80,527,324,215,116,357,655];
        posicaoY = [74,466,151,320,266,251,178,64];
        this.numFolhas = 6;
        this.acertos = 2;

        posicaoFilhosX = [35,70,20,15,35,15,35,35];
        posicaoFilhosY = [20,20,10,40,60,60,5,25];

        if(this.nivelAnterior != this.currentLevel)
        {
            this.itens = [0,1,2];
        }

        console.log("this.itens" + this.itens);
        this.temp_array = this.itens.slice();
        console.log("this.itens t" + this.temp_array);
        this.item = this.sorteio();

        console.log(this.item);
        this.itens = this.temp_array.slice();

        //this.item = 2;

        this.rodada = [];
        this.rodada[0] = new Array(0,20,4,14,33,36);
        this.rodada[1] = new Array(8,20,14,0,31,37);
        this.rodada[2] = new Array(4,14,0,8,28,38);

        this.rodadaCorreta = [];
        this.rodadaCorreta[0] = new Array(33,36);
        this.rodadaCorreta[1] = new Array(31,37);
        this.rodadaCorreta[2] = new Array(28,38);
        this.shuffle(this.rodada[this.item]);

        //console.log(this.rodada);

        this.createFolhas();
        
    },

    initLevel2: function() {
        console.log("***Nivel 2**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();  
        this.tutorial = false;

        this.folhas = [];
        posicaoX = [853,80,527,324,215,116,357,655];
        posicaoY = [74,466,151,320,266,251,178,64];
        this.numFolhas = 7;
        this.acertos = 3;

        posicaoFilhosX = [35,70,20,15,35,15,35,35];
        posicaoFilhosY = [20,20,10,40,60,60,5,25];

        if(this.nivelAnterior != this.currentLevel)
        {
            this.itens = [0,1,2];
        }

        this.temp_array = this.itens.slice();
        this.item = this.sorteio();
        this.itens = this.temp_array.slice();

        //this.item = 2;

        this.rodada = [];
        this.rodada[0] = new Array(1,17,15,25,32,39,40);
        this.rodada[1] = new Array(24,13,21,2,27,29,43);
        this.rodada[2] = new Array(18,3,5,6,30,34,42);

        this.rodadaCorreta = [];
        this.rodadaCorreta[0] = new Array(32,39,40);
        this.rodadaCorreta[1] = new Array(27,29,43);
        this.rodadaCorreta[2] = new Array(30,34,42);
        this.shuffle(this.rodada[this.item]);

        
        this.createFolhas();
    },

    
    initLevel3: function() {
        console.log("***Nivel 3**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.tutorial = false;

        this.folhas = [];
        posicaoX = [853,80,527,324,215,116,357,655];
        posicaoY = [74,466,151,320,266,251,178,64];
        this.numFolhas = 8;
        this.acertos = 4;

        posicaoFilhosX = [35,70,20,15,35,15,35,35];
        posicaoFilhosY = [20,20,10,40,60,60,5,25];

        if(this.nivelAnterior != this.currentLevel)
        {
            this.itens = [0,1,2];
        }

        this.temp_array = this.itens.slice();
        this.item = this.sorteio();
        this.itens = this.temp_array.slice();

        //this.item = 2;

        this.rodada = [];
        this.rodada[0] = new Array(16,4,9,0,35,43,45,33);
        this.rodada[1] = new Array(5,8,20,22,32,28,30,44);
        this.rodada[2] = new Array(7,12,4,0,31,29,46,45);

        this.rodadaCorreta = [];
        this.rodadaCorreta[0] = new Array(35,43,45,33);
        this.rodadaCorreta[1] = new Array(32,28,30,44);
        this.rodadaCorreta[2] = new Array(31,29,46,45);
        this.shuffle(this.rodada[this.item]);


        this.createFolhas();
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
        this.showCallToAction = false;
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
        this.showCallToAction = true;
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
