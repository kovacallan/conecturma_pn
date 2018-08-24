
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
        this.initVars(); // variavies do jogo 
        // ------- fim AV2D3OA01 ----- //

        this.createScene();

        this.showIntro();
        // this.gameOverMacaco();
        /* HUD */
        this.createBottomHud();
        this.createHud();


        //this.showResumo();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

    },

   


    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Todo mundo tem alguma coisa favorita. \nUma brincadeira, esporte, comida... \nVamos descobrir o que é favorito pela \nmaioria da galerinha? Montamos uma \ntabela em uma folha de papel:";
        this.texto['initialText2'] ="De um lado colocamos a atividade e do \noutro cada um marcou a que preferia. \nOlhando a tabela, temos que descobrir \no que foi escolhido pela maior parte \nda turminha! Vamos lá?";
        this.texto['imgResumo'] ="Uma tabela serve para organizar, comparar, \ndefinir preferências de um grupo de pessoas, \nentre outras coisas, tudo na forma escrita.";
        this.texto['imgResumo2'] ="Observem esta tabela, no lado [esquerdo]tem \nas [atividades] da Conecturma, dormir, comer \ne brincar. No lado [direito], cada personagem \nmarcou o que mais gosta de fazer.";
        this.texto['imgResumo3'] =" A maioria escolheu [brincar]! Vamos tentar \nnovamente! Vocês conseguem!";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Olhando a tabela, qual a [brincadeira] \nque a Conecturma mais gosta? \nMarquem a opção correta!",
            "Olhando a tabela, qual o [esporte] \nque a Conecturma mais gosta? ",
            "Olhando a tabela, qual a [comida] \nque a Conecturma mais gosta? "
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
        this.add.tween(elem.scale).to({x: 0.8, y: 0.8}, 100, Phaser.Easing.Linear.None, true);
    },
    //fixa
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 0.7, y: 0.7}, 100, Phaser.Easing.Linear.None, true);
    },

    /*createRandomItens: function(itens, num) {
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
    },*/

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

        this.createDelayTime(16500, function() {
            this.add.tween(this.kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        //1
        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 21, "left");
        this.tutorialText.alpha = 0;
        this.groupIntro.add(this.tutorialText);
        //2
        this.tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 21, "left");
        this.tutorialText2.alpha = 0;
        this.groupIntro.add(this.tutorialText2);
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim();
        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime(16500, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                if(this.tutorial){this.showLiveTutorial();}
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

        console.log("initGame");

        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

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

    //---- AV1AV2D5OA01 ---- //

    initVars:function(){// iniciação das variáveis do jogo
       
        this.tutorial = false;
        this.btn = [];
        this.imagem = []
        this.numOpacao = 0;
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
        switch(modo)
        {
            case 1:// para liberar 
                for(var i=0; i<this.btn.length;i++)
                {
                    this.btn[i].inputEnabled = true;
                    this.btn[i].events.onInputDown.add(this.mouseInputDown, this);

                    
                    this.btn[i].events.onInputOver.add(this.onButtonOver, this);
                    this.btn[i].events.onInputOut.add(this.onButtonOut, this);

                    if(!this.tutorial){
                        this.groupLevel[this.currentLevel].add(this.btn[i]);
                    }
                }
            break;
            case 2:// para travar em caso de erro
                for(var i=0; i<this.btn.length;i++)
                {
                    this.btn[i].events.onInputDown.removeAll();
                    this.btn[i].input.reset();
                }
            break;
            

        }   
    },
    
    mouseInputDown:function(elem){
        console.log("*** mouseInputDown ***");
        console.log(elem.id);

        if(elem.id==this.maisVotada[0][0]){
            console.log("correto");
            this.liberar(2);
            this.sound.play("hitAcerto");
            this.changeHappy(this.fred,"fred_happy","fred",795,122);
            this.createDelayTime(1000, function() {
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

    createEstrelas:function(){
        console.log("---createEstrelas---");
        y=0;x=0;
        for(i=0; i<3;i++){
            //console.log("--------------------");
            y = this.posicaoY[this.maisVotada[i][0]]; // valor da mais votada 
            //console.log("y: "+y);

            tam = this.maisVotada[i][2].length;
            //console.log("tam: "+tam);
            for(var j=0;j<tam;j++)
            {
                aux = this.maisVotada[i][2][j];
                //console.log("aux " + aux);

                if(aux!=-1){
                   x = this.posicaoX[aux]; 
                   //console.log("x " + x);
                   this.estrela[j] = this.add.sprite(x,y, 'estrela');
                   this.estrela[j].scale.set(0.5,0.5);
                   if(!this.tutorial){
                    this.groupLevel[this.currentLevel].add(this.estrela[j]);
                   }
                   else{
                    this.groupIntro.add(this.estrela[j]);
                   }
                   
                   this.add.tween(this.estrela[j].scale).to({x:1, y:1}, 1000, Phaser.Easing.Linear.None, true);
                }
            }
            //console.log("--------------------");
            if(i==2)
            {
                this.createDelayTime(1000, function() {
                    this.createBotoes();
                });
            }
        }
    },

    createBotoes:function(){
        console.log("---createBotoes---");
        // opcoes 
        // 0= peg-pega 1= amarelinha  2= cabra-cega
        
        posicao = [306,439,578,710,840];

        for(i=0; i<this.numOpacao;i++){
            this.btn[i] = this.add.sprite(posicao[i],900, 'cartas',this.imagem[i]);
            this.btn[i].scale.set(0.7,0.7); 
            this.btn[i].anchor.set(0.5,1);
            this.btn[i].id = i;
            this.add.tween(this.btn[i]).to({x:posicao[i], y:600}, 1000, Phaser.Easing.Linear.None, true);
            if(this.tutorial){
                this.groupIntro.add(this.btn[i]);  
            }
        }
        if(!this.tutorial){
            this.createDelayTime(1500, function() {
                this.liberar(1);
            });
        }
        else{

            this.createDelayTime(10000, function() {
                if(this.tutorial){
                    this.efeitoMouse();
                }
            });
            
        }   
    },

    animClick:function()
    {
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.arrow.alpha =0;
            this.click.destroy();
           
        }, this);
    },

    efeitoMouse:function(){
        this.arrow = this.add.sprite(510,390, 'arrow');
        this.groupIntro.add(this.arrow);
        this.arrow.alpha =0;

        this.click = this.add.sprite(0, 0, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.click.alpha = 0;
        this.groupIntro.add(this.click);
        console.log("yyyyy");
        this.add.tween(this.arrow).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            x = this.btn[2].x-30;
            y = this.btn[2].y-100;
            this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.animClick();
                this.add.tween(this.arrow).to({alpha:0}, 1500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    if(this.tutorial){this.showFinishedLiveTutorial();}
                },this)
            },this)
        },this)
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
    
   
    //---- AV1AV2D5OA01 ---- //

   
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        
        this.background = this.add.sprite( -321, -339, 'background');
        this.fred = this.add.sprite(795,122, 'fred',1);
        this.fred.animations.add('fred');
        this.fred.animations.play('fred', 15, true);
        
        //var x = this.addSpriteMeu('caderno3',170,246,0);
        //var y = this.addSpriteMeu('estrela',170,246,0);
        //x.scale.set(0.9,0.9);
        
        //this.initGame();

        //this.initLevel1();  
    },
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
        console.log("showLiveTutorial");
        
        //this.groupIntro.add(this.triangulo);
        this.maisVotada = [];
        this.numVotos = [];
        this.posicaoX = [378,456,537,612]; //coluna // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        this.posicaoY =[243,282,312,350,389]; // linha // 0= peg-pega 1= amarelinha  2= cabra-cega

        this.estrela = [];
        this.maisVotada[0] = new Array(3);
        this.maisVotada[1] = new Array(3);
        this.maisVotada[2] = new Array(3);

        this.maisVotada[0][0] = 0;
        this.maisVotada[1][0] = 1;
        this.maisVotada[2][0] = 2;

        this.maisVotada[0][1] = 2;
        this.maisVotada[1][1] = 1;
        this.maisVotada[2][1] = 1;

        this.maisVotada[0][2] = new Array(2);
        this.maisVotada[0][2][0] = 0;
        this.maisVotada[0][2][1] = 1;
        this.maisVotada[1][2] = new Array(1);
        this.maisVotada[1][2][0] = 2;
        this.maisVotada[2][2] = new Array(1);
        this.maisVotada[2][2][0] = 3;

        this.btn = [];
        this.imagem = [9,8,7];
        this.numOpacao = 3;

        this.caderno = this.add.sprite(-600,180, 'caderno3');
        this.groupIntro.add(this.caderno);

        this.add.tween(this.caderno).to({x: 170, y: 180}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
            function(){
                this.createEstrelas();
            }
        ,this)  
    },
    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        console.log("*** showFinishedLiveTutorial ***");
        
        this.createDelayTime(1000, function() {
            this.skipIntro();
        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 0;
        

        this.groupIntro.add(tutorialText);
        
        var tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['imgResumo2'], 22, "left");//this.add.sprite( this.world.centerX,110, 'imgResumo2');
        tutorialText2.alpha = 0;
    
        this.groupIntro.add(tutorialText2);


        var tutorialText3 = this.drawText(this.world.centerX, 30, this.texto['imgResumo3'], 22, "left");//this.add.sprite( this.world.centerX,110, 'imgResumo3');
        tutorialText3.alpha = 0;
       
        this.groupIntro.add(tutorialText3);

        var resumoQuadro = this.add.sprite( this.world.centerX,400, 'resumoQuadro');
        resumoQuadro.alpha = 0;
        resumoQuadro.anchor.set(0.5, 0.5);
        this.groupIntro.add(resumoQuadro);
        

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        
        this.soundResumo = this.setDebugAudio("soundResumo");
        
        this.createDelayTime(12500, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(resumoQuadro).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });
        this.createDelayTime(28000, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });
        

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(resumoQuadro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
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
        this.imageQuestion = this.drawText(this.world.centerX, 40, this.questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },
  
    
    initLevel1: function() {
        console.log("***Nivel 1**** " + this.corrects);
        //this.add.sprite(this.world.centerX, 150, "pergunta2");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.maisVotada = [];
        this.numVotos = [];
        this.posicaoX = [378,456,537,612]; //coluna // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        this.posicaoY =[243,282,312,350,389]; // linha // 0= peg-pega 1= amarelinha  2= cabra-cega

        this.estrela = [];
        this.maisVotada[0] = new Array(3);
        this.maisVotada[1] = new Array(3);
        this.maisVotada[2] = new Array(3);

        this.item = [0,1,2]; // 0= peg-pega 1= amarelinha  2= cabra-cega
        
        // sorteia a 1 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[0][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("mais votada: "+ this.maisVotada[0][0]);

        // sorteia a 2 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[1][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("segunda: "+ this.maisVotada[1][0]);

        // sorteia a 3 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[2][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("terceira: "+ this.maisVotada[2][0]);

        // sorteia o valor da mais votada [3 ou 2]

        maxValorVotos = [2,3,4];

        this.temp_array = maxValorVotos.slice();
        this.maisVotada[0][1] = this.sorteio();
        maxValorVotos = this.temp_array.slice();

        votosSorando = 4 - this.maisVotada[0][1];
        this.personagens = [0,1,2,3]; // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        
        console.log("*** "+ this.maisVotada[0][1] +" ***");

        this.btn = [];
        this.imagem = [0,1,2];
        this.numOpacao = 3;
        
        switch(votosSorando)
        {
            case 0: // 4 votos 
                // pontos 
                this.maisVotada[1][1] = 0;
                this.maisVotada[2][1] = 0;
                
                //personagens 
                this.maisVotada[0][2] = new Array(4);
                this.maisVotada[0][2][0] = 0;
                this.maisVotada[0][2][1] = 1;
                this.maisVotada[0][2][2] = 2;
                this.maisVotada[0][2][3] = 3;

                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = -1;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = -1;

                
            break;
            case 1: // 3 votos

                // pontos 
                this.maisVotada[1][1] = 1;
                this.maisVotada[2][1] = 0;

                this.temp_array = this.personagens.slice();
                p1 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p2 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p3 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p4 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.maisVotada[0][2] = new Array(3);
                this.maisVotada[0][2][0] = p1;
                this.maisVotada[0][2][1] = p2;
                this.maisVotada[0][2][2] = p3;
                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = p4;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = -1;

            break;
            case 2: // 2 votos 
                this.maisVotada[1][1] = 1;
                this.maisVotada[2][1] = 1;

                //personagens 

                this.temp_array = this.personagens.slice();
                p1 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p2 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p3 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p4 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.maisVotada[0][2] = new Array(2);
                this.maisVotada[0][2][0] = p1;
                this.maisVotada[0][2][1] = p2;
                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = p3;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = p4;
            break;
        }

        console.log(this.maisVotada);
        this.caderno = this.add.sprite(-600,180, 'caderno1');
        this.groupLevel[this.currentLevel].add(this.caderno);

        this.add.tween(this.caderno).to({x: 170, y: 180}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
            function(){
                this.createEstrelas();
            }
        ,this)
  
    },

    initLevel2: function() {
        console.log("***Nivel 2**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();

        this.maisVotada = [];
        this.numVotos = [];
        this.posicaoX = [378,456,537,612]; //coluna // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        this.posicaoY =[243,282,312,350,389]; // linha // 0= peg-pega 1= amarelinha  2= cabra-cega

        this.estrela = [];
        this.maisVotada[0] = new Array(3);
        this.maisVotada[1] = new Array(3);
        this.maisVotada[2] = new Array(3);

        this.item = [0,1,2,3]; // 0= futebol 1= volei  2= basquete 3=tenis 
        
        // sorteia a 1 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[0][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("mais votada: "+ this.maisVotada[0][0]);

        // sorteia a 2 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[1][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("segunda: "+ this.maisVotada[1][0]);

        // sorteia a 3 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[2][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("terceira: "+ this.maisVotada[2][0]);

        // sorteia o valor da mais votada [3 ou 2]

        maxValorVotos = [2,3,4];

        console.log("max voto: "+ maxValorVotos);

        this.temp_array = maxValorVotos.slice();
        this.maisVotada[0][1] = this.sorteio();
        maxValorVotos = this.temp_array.slice();

        votosSorando = 4 - this.maisVotada[0][1];
        this.personagens = [0,1,2,3]; // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        
        console.log("*** "+ this.maisVotada[0][1] +" ***");

        this.btn = [];
        this.imagem = [3,4,5,6];
        this.numOpacao =4;
        
        switch(votosSorando)
        {
            case 0: // 4 votos 
                // pontos 
                this.maisVotada[1][1] = 0;
                this.maisVotada[2][1] = 0;
                
                //personagens 
                this.maisVotada[0][2] = new Array(4);
                this.maisVotada[0][2][0] = 0;
                this.maisVotada[0][2][1] = 1;
                this.maisVotada[0][2][2] = 2;
                this.maisVotada[0][2][3] = 3;

                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = -1;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = -1;

                
            break;
            case 1: // 3 votos

                // pontos 
                this.maisVotada[1][1] = 1;
                this.maisVotada[2][1] = 0;

                this.temp_array = this.personagens.slice();
                p1 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p2 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p3 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p4 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.maisVotada[0][2] = new Array(3);
                this.maisVotada[0][2][0] = p1;
                this.maisVotada[0][2][1] = p2;
                this.maisVotada[0][2][2] = p3;
                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = p4;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = -1;

            break;
            case 2: // 2 votos 
                this.maisVotada[1][1] = 1;
                this.maisVotada[2][1] = 1;

                //personagens 

                this.temp_array = this.personagens.slice();
                p1 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p2 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p3 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p4 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.maisVotada[0][2] = new Array(2);
                this.maisVotada[0][2][0] = p1;
                this.maisVotada[0][2][1] = p2;
                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = p3;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = p4;
            break;
        }

        console.log(this.maisVotada);
        this.caderno = this.add.sprite(-600,180, 'caderno2');
        this.groupLevel[this.currentLevel].add(this.caderno);

        this.add.tween(this.caderno).to({x: 170, y: 180}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
            function(){
                this.createEstrelas();
            }
        ,this)        
    },

    
    initLevel3: function() {
        console.log("***Nivel 3**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();

        this.maisVotada = [];
        this.numVotos = [];
        this.posicaoX = [378,456,537,612]; //coluna // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        this.posicaoY =[243,282,312,350,389]; // linha // 0= peg-pega 1= amarelinha  2= cabra-cega

        this.estrela = [];
        this.maisVotada[0] = new Array(3);
        this.maisVotada[1] = new Array(3);
        this.maisVotada[2] = new Array(3);

        this.item = [0,1,2,3,4]; // 0= hambúrger 1= salada  2= pizza 3=sopa 4=macarão 
        
        // sorteia a 1 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[0][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("mais votada: "+ this.maisVotada[0][0]);

        // sorteia a 2 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[1][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("segunda: "+ this.maisVotada[1][0]);

        // sorteia a 3 mais votada 
        this.temp_array = this.item.slice();
        this.maisVotada[2][0] = this.sorteio();
        this.item  = this.temp_array.slice();

        console.log("terceira: "+ this.maisVotada[2][0]);

        // sorteia o valor da mais votada [3 ou 2]

        maxValorVotos = [2,3,4];

        console.log("max voto: "+ maxValorVotos);

        this.temp_array = maxValorVotos.slice();
        this.maisVotada[0][1] = this.sorteio();
        maxValorVotos = this.temp_array.slice();

        votosSorando = 4 - this.maisVotada[0][1];
        this.personagens = [0,1,2,3]; // 0 =Poly 1= Juninho 2=fred 3=Bumba 
        
        console.log("*** "+ this.maisVotada[0][1] +" ***");

        this.btn = [];
        this.imagem = [7,8,9,10,11];
        this.numOpacao =5;
        
        switch(votosSorando)
        {
            case 0: // 4 votos 
                // pontos 
                this.maisVotada[1][1] = 0;
                this.maisVotada[2][1] = 0;
                
                //personagens 
                this.maisVotada[0][2] = new Array(4);
                this.maisVotada[0][2][0] = 0;
                this.maisVotada[0][2][1] = 1;
                this.maisVotada[0][2][2] = 2;
                this.maisVotada[0][2][3] = 3;

                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = -1;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = -1;

                
            break;
            case 1: // 3 votos

                // pontos 
                this.maisVotada[1][1] = 1;
                this.maisVotada[2][1] = 0;

                this.temp_array = this.personagens.slice();
                p1 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p2 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p3 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p4 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.maisVotada[0][2] = new Array(3);
                this.maisVotada[0][2][0] = p1;
                this.maisVotada[0][2][1] = p2;
                this.maisVotada[0][2][2] = p3;
                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = p4;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = -1;

            break;
            case 2: // 2 votos 
                this.maisVotada[1][1] = 1;
                this.maisVotada[2][1] = 1;

                //personagens 

                this.temp_array = this.personagens.slice();
                p1 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p2 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p3 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.temp_array = this.personagens.slice();
                p4 = this.sorteio();
                this.personagens = this.temp_array.slice();

                this.maisVotada[0][2] = new Array(2);
                this.maisVotada[0][2][0] = p1;
                this.maisVotada[0][2][1] = p2;
                this.maisVotada[1][2] = new Array(1);
                this.maisVotada[1][2][0] = p3;
                this.maisVotada[2][2] = new Array(1);
                this.maisVotada[2][2][0] = p4;
            break;
        }

        console.log(this.maisVotada);
        this.caderno = this.add.sprite(-600,180, 'caderno3');
        this.groupLevel[this.currentLevel].add(this.caderno);

        this.add.tween(this.caderno).to({x: 170, y: 180}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(
            function(){
                this.createEstrelas();
            }
        ,this)  
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
