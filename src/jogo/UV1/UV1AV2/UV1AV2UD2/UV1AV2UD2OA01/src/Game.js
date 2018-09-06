
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
        this.TEMPO_INTRO = 15500;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 15000;
        this.SOUND_VITORIA = 5500;
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


        this.pointsByLevel = [0,200,300,500,500];

        this.lives = 2;
        this.points = 0;
        this.showCallToAction = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();


        this.createScene();

        this.showIntro();

        // this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

        //this.showHandTutorial();

	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "À noite, o Saci usa as estrelas do céu \npara saber como chegar na Árvore \nda Vida. Um grupo de estrelas forma \no que chamamos de constelação. \nVamos conhecer algumas?";
        this.texto['initialText2'] ="Vejam, as estrelas têm números! Mas de dois em \ndois ou de três em três números, um sumiu! \nVamos ajudar a completar os números que estão \nfaltando?";
        this.texto['imgResumo'] ="Podemos contar os números de diferentes \nformas: de 1 em 1, de 2 em 2, de 3 em 3… Aqui \nestamos escrevendo os números de 2 em 2 e \nde 3 em 3. Vamos tentar de novo. \nVocês conseguem!";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Digitem os números que estão faltando nas \nestrelas! Completem contando de duas em duas \nestrelas.",
            "Mais números faltando! Completem contando \nde duas em duas estrelas.",
            "Digitem os números que estão faltando. \nCompletem contando de 3 em 3 estrelas.",
            "Digitem os números que estão faltando. \nCompletem contando de 3 em 3 estrelas."
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

        var tutorialText = this.drawText(this.world.centerX+60, 40, this.texto['initialText'], 22, "left");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialPlacar).to({y: -110}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
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

        this.points += this.pointsByLevel[this.currentLevel];

        console.log("total de pontos: " + this.points);

        
        this.updatePointsText();

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
    hideAndShowLevel: function(isWrong) {

        this.hideLevel(function() {

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {

                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        //this.showCallToAction = true;
                        //this.showNextLevel();
                        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                    });

                } else {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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
            //cosnole.log("1 possible");
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

        console.log(this.correctItem);
        for(var i = 1; i < this.spliceLetter.length; i++) {
            //this.spliceLetter.push(this.correctItem._frameName);
        }
    }, 

    showCorrectName: function(gotoNext) {

        var itens = [];

        for(var i = 0; i < this.buttons.length; i++) {
            this.game.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100*i);
        }
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        } else {
            this.hideLevel(function() {
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
            });
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

        this.add.sprite( -455, -150, 'background');

        this.star1 = this.add.sprite(501, 185, "bgStar");
        this.star1.anchor.set(0.5,0.5);
        this.add.tween(this.star1.scale).to({x:0.5, y: 0.5}, 1500, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.star2 = this.add.sprite(591, 293, "bgStar");
        this.star2.anchor.set(0.5,0.5);
        this.add.tween(this.star2.scale).to({x:0.5, y: 0.5}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.star3 = this.add.sprite(855, 50, "bgStar");
        this.star3.anchor.set(0.5,0.5);
        this.add.tween(this.star3.scale).to({x:0.5, y: 0.5}, 600, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.star4 = this.add.sprite(445, 282, "bgStar");
        this.star4.anchor.set(0.5,0.5);
        this.star4.scale.set(0.5,0.5);
        this.add.tween(this.star4.scale).to({x:0.1, y: 0.1}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.star5 = this.add.sprite(668, 210, "bgStar");
        this.star5.anchor.set(0.5,0.5);
        this.star5.scale.set(0.5,0.5);
        this.add.tween(this.star5.scale).to({x:0.1, y: 0.1}, 700, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.star6 = this.add.sprite(871, 275, "bgStar");
        this.star6.anchor.set(0.5,0.5);
        this.star6.scale.set(0.8,0.8);
        this.add.tween(this.star6.scale).to({x:0.1, y: 0.1}, 600, Phaser.Easing.Linear.None, true, 0, -1, true);
        
        this.saciIdle = this.createAnimation( 16, 280, 'saciIdle', 1,1);
        this.saciHappy = this.createAnimation( 26, 260, 'saciHappy', 1,1);
        this.saciHappy.animations.stop('idle');
        this.saciHappy.visible = false;
        console.log(this.saciHappy.animations.currentAnim);
        this.saciHappy.animations.currentAnim.onComplete.add(function() {
            this.saciHappy.visible = false;
            this.saciIdle.visible = true;
        }, this);
    },

    playSaci: function() {
        this.saciIdle.visible = false;
        this.saciHappy.visible = true;
        this.saciHappy.animations.play('idle', null, false);
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        var tutorialText = this.drawText(this.world.centerX, 15, this.texto['initialText2'], 22, "left");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(tutorialText).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);

        this.groupIntro.add(tutorialText);

        this.itemsCorrect = [];
        this.buttons = [];

        this.buttons.push( this.createButton(167, 217, 15, 2, false, 1000));
        this.buttons.push( this.createButton(261, 205,  0, 4, false, 1100));
        this.buttons.push( this.createButton(375, 218,-10, 6, false, 1200));
        this.buttons.push( this.createButton(428, 287,-20, 8, true,  1300));
        this.buttons.push( this.createButton(536, 335,-10,10, false, 1400));
        this.buttons.push( this.createButton(624, 320, 20,12, false, 1500));

        for(var i = 0; i < this.buttons.length; i++) {
            this.groupIntro.add(this.buttons[i]);
        }

        this.createDelayTime( 11000, this.showHandTutorial, this);
    },

    showHandTutorial: function() {
        console.log("end");

        var tecla = this.add.sprite(800,450, "tecla");
        tecla.scale.set(2,2);
        tecla.alpha = 0;
        this.add.tween(tecla).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.groupIntro.add(tecla);

        var maoTutorial = this.add.sprite(600,800, "maoTutorial");

        this.groupIntro.add(maoTutorial);

        this.add.tween(maoTutorial).to({x: 730, y: 470}, 1500, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            this.sound.play("hitAcerto");

            this.showAnimateButton(this.buttons[3]);
            this.add.tween(tecla).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 1500);
            this.add.tween(maoTutorial).to({x: 600, y: 800}, 500, Phaser.Easing.Linear.None, true, 2000).onComplete.add(this.initGame, this);

        }, this);

        // this.add.tween(this.arrow).to({x:this.world.centerX-120, y: 150}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);
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
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left"); //this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        this.soundResumo.onStop.addOnce(function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        }, this);
        // tempo para mostrar o tutorial das letras
        
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        switch(this.currentLevel) {
            case 1:
                if(!this.showCallToAction) {
                    this.sound.play("soundP1");
                }
                this.initLevel( 2, 2, 1, 7000 );
            break;
            case 2:

                if(!this.showCallToAction) {
                    this.sound.play("soundP2");
                }
                this.secRound = false;
                this.initLevel( 2, 2, 1, 5000 );
                
            break;
            case 3:
                if(!this.secRound) {
                    console.log("part 1");
                    if(!this.showCallToAction) {
                        this.sound.play("soundP3");
                    }
                    this.initLevel( 3, 1, 2, 6000 );
                } else {
                    console.log("part 2");
                    if(!this.showCallToAction) {
                        this.sound.play("soundP4");
                    }
                    this.initLevel( 3, 3, 2, 5000 );
                }
            break;

        }
        this.showCallToAction = false;
    },

    showQuestion: function() {

        var _numQuest = this.currentLevel;
        if(this.secRound) {
            _numQuest = 4;
        }

        this.imageQuestion =this.drawText(this.world.centerX, 30, this.questionList[_numQuest]); 
        //this.imageQuestion.anchor.set(0.5,0);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initKeyboard: function() {
        //console.log("can use kayboad");
        this.removeKeyText();

        this.game.time.events.add(1000, function() {
            this.keysPressed = "";
            this.keyboardText = this.add.bitmapText(this.world.centerX, 500, "JandaManateeSolid", this.keysPressed, 72);
            this.keyboardText.anchor.set(0.5,0.5);
            this.keyboardText.tint = 0xCC6633;

            this.game.input.keyboard.addCallbacks(this,null,null, this.onKeyPressed);
        }, this);
    },

    removeKeyboard: function() {
        this.game.input.keyboard.addCallbacks( this, null, null, null );
    },

    removeKeyText: function() {
        if(this.keyboardText) {
            this.add.tween(this.keyboardText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                this.keyboardText.destroy();
            }, this);
        }
    },

    onKeyPressed: function(elem) {

        this.keysPressed += elem.toString();
        this.keyboardText.text = this.keysPressed;

        
        if(this.keyEvent) {
            this.time.events.remove(this.keyEvent, this);
        }

        var _num = parseInt(this.keysPressed);
        var _indx = this.itemsCorrect.indexOf(_num);
        if(_indx>=0 || this.keysPressed.length >= 2) {
            this.validateKeys();
            return;
        }
        
        this.keyEvent = this.time.events.add(2000, this.validateKeys, this);        
    },
    validateKeys: function() {
        console.log("validating", this.keysPressed);

        this.removeKeyboard();

        var _num = parseInt(this.keysPressed);
        var _indx = this.itemsCorrect.indexOf(_num);
        if(_indx>=0) {

            this.itemsCorrect.splice(_indx, 1);

            for(var i = 0; i < this.buttons.length; i++) {
                if(this.buttons[i].numValue == _num) {
                    this.showAnimateButton(this.buttons[i]);
                }
            }

            if(this.itemsCorrect.length == 0) {
                console.log("gotoNextLevel");
                this.removeKeyText();
                this.clickRightButton();
            } else {
                console.log("does nothing");
                this.sound.play("hitAcerto");
                this.initKeyboard();
            }

        } else {
            this.maxErrors--;
            if(this.maxErrors <= 0) {
                console.log("error");
                this.removeKeyText();
                this.clickWrongButton();
            } else {
                this.sound.play("hitErro");
                this.initKeyboard();   
            }
            // this.initKeyboard();
        }
    },

    showAnimateButton: function(elem) {
        elem.loadTexture("estrelaNormal");
        elem.letter.visible = true;
        elem.letter.alpha = 0;

        this.add.tween(elem.letter).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
    },

    initLevel: function(multiplier, numCorrects, maxErrors, delay) {

        console.log("--> nivel: "+ this.currentLevel);

        var initial = this.rnd.integerInRange(1,10);
        
        this.numCorrects = numCorrects;
        this.maxErrors = maxErrors;

        
        var _letters = [];
        for(var i = 0; i < 6; i++) {
            _letters.push(i < numCorrects);
        }

        _letters = _letters.sort(function() {
          return .5 - Math.random();
        });

        console.log(_letters);

        this.showQuestion();
        
        this.itemsCorrect = [];
        
        this.buttons = [];

        this.buttons.push( this.createButton(167, 217, 15, initial+multiplier*0, _letters[0], delay+000));
        this.buttons.push( this.createButton(261, 205,  0, initial+multiplier*1, _letters[1], delay+100));
        this.buttons.push( this.createButton(375, 218,-10, initial+multiplier*2, _letters[2], delay+200));
        this.buttons.push( this.createButton(428, 287,-20, initial+multiplier*3, _letters[3], delay+300));
        this.buttons.push( this.createButton(536, 335,-10, initial+multiplier*4, _letters[4], delay+400));
        this.buttons.push( this.createButton(624, 320, 20, initial+multiplier*5, _letters[5], delay+500));

        this.createDelayTime(delay+500, this.initKeyboard);

    },

    
    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, angle, num, canInteract, delay) {

        var btn;

        var name = this.add.bitmapText(0,0, "JandaManateeSolid", num.toString(), 36);
        name.tint = 0xCC6633;
        if(canInteract) {
            btn = this.add.sprite(x+300,y+30, 'estrelaLimpa');
            name.visible = false;
            this.itemsCorrect.push(num);
        } else {
            btn = this.add.sprite(x+300,y+30, 'estrelaNormal');
        }

        name.x = -name.width*0.5;
        name.y = -name.height-10;

        btn.anchor.set(0.5,0.5);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);
        btn.angle = angle;
        btn.addChild(name);
        btn.numValue = num;
        btn.letter = name;

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, delay);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, delay);

        return btn;
    },
    // clicar botao correto
    clickRightButton: function() {

        this.playSaci();

        this.sound.play("hitAcerto");

        if(this.currentLevel < 3 || (this.currentLevel == 3 && this.secRound)) {
            /* FIXO */
            this.corrects++;
            this.saveCorrect();
            //this.sound.stopAll();
            this.addPoints();
            this.showCorrectName(true);
        /* FIXO */
        } else {
            this.saveCorrect(50,false);
            this.secRound = true;
            this.showCorrectName(false);
        }

    },

    // clicar botao errado
    clickWrongButton: function(target) {
        
        /* FIXO */
        
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.clearButtons(false);
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.sound.play("soundDica");
                this.hideAndShowLevel(true);
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
        /* FIXO */
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

	update: function () {



	}
};
