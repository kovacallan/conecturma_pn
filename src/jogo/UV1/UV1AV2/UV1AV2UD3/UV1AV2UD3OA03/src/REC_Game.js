
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
        this.click = true;

        //this.gradeGuia();
        this.initVars();// inicialiacao varaiveis 
        this.createScene();
		this.testeTutorial = false;
        this.showIntro();
		

        //this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Esta aventura está um show, \nou talkshow! Nesse desafio, \ntemos que ajudar nossos amigos \na chegar do outro lado do lago, \nao pé da Árvore da vida.";
        this.texto['initialText2'] ="Para dificultar, alguns números estão \nfaltando. Precisamos descobrir \nquais os números que estão faltando \npara nossos amigos poderem chegar \ndo outro lado.";
        this.texto['imgResumo'] ="";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = new Array();
        this.questionList[0] = null;
        this.questionList[1] = "Cliquem nos números que estão faltando \n na trilha, entre os números [1] e [10].";
        this.questionList[12] ="Cliquem nos números que estão faltando \n entre os números [10] e [20].";
        this.questionList[2] ="Cliquem nos números que estão faltando \n entre os números [20] e [30].";
        this.questionList[22] ="Esse é um grande desafio! Cliquem \nnos números que estão faltando \nentre os números [30] e [40].";
        this.questionList[3] ="Quase lá! Cliquem nos números que \n estão faltando entre os números [40] e [50].";
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
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true).onComplete.add(
		function(){
			if(this.testeTutorial){this.limparSubnivel();}
			this.createDelayTime(1000, function() {  
                this.initGame();
			});
			
		}, this);
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
		this.groupLevel[this.currentLevel] = this.add.group();

        this.tutorial = true;

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(
            function(){
                if(this.tutorial)
                {
                    this.showTextoIntro();
                }  
            }, this);
    },
    // intro-fixa
    /*showKim: function() {
        var kim = this.createAnimation( this.world.centerX-320, 200, 'kimAntiga', 1,1);
        kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        kim.crop(rect);

        this.groupIntro.add(kim);

        this.add.tween(kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(15000, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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

        var tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        tutorialText.alpha = 0;
    
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.groupIntro.add(tutorialText);

        this.showKim(15000);

        var tutorialText2 = this.drawText(this.world.centerX, 40, this.texto['initialText2'], 22, "left");
        tutorialText2.alpha = 0;
    
        this.groupIntro.add(tutorialText2);
        this.soundIntro = this.sound.play("soundIntro");

        //this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
 

        this.createDelayTime(15000, function() {
            //this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            .onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    if(this.tutorial){this.showLiveTutorial()}
                }, this);
            }, this);
        });
    },
    // resumo-fixa
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

        //this.points += this.pointsByLevel[this.currentLevel];

        //console.log("total de pontos: " + this.points);

        
        //this.updatePointsText();
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

        this.sound.play("soundFinal");

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

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA+500).onComplete.add(function() {
            animal.animations.play('idle');

            this.showTextVictory();

            this.eventConclusao = new Phaser.Signal();
            this.eventConclusao.addOnce(this.showEndButtons, this);

            this.registrarConclusao();

        }, this);
    },

    registrarConclusao: function() {
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

        /************************ b1 ******************************/
        var b1 = this.createEndButton(70,540,1);

        var i1 = this.add.sprite(0,-10,"hudVitoria", "vitoriaSetaCima");
        i1.anchor.set(0.5,0.5);
        i1.alpha = 0;
        b1.addChild(i1);
        this.add.tween(i1).to({alpha: 1, y: -40}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);

        var t1 = this.add.bitmapText(0,0, "JandaManateeSolid", _moedas.toString(), 40);
        t1.x = -t1.width*0.5;
        t1.y = -t1.height*0.5;
        b1.addChild(t1);

        var tt1 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn1");
        tt1.anchor.set(0.3,1);
        tt1.alpha = 0;
        b1.tooltip = tt1;
        b1.addChild(tt1);

        /************************ b2 ******************************/
        var b2 = this.createEndButton(180, 540, 1);

        var i2 = this.add.sprite(0,-20,"hudVitoria", "vitoriaGemasIcone");
        i2.anchor.set(0.5,0.5);
        b2.addChild(i2);

        var t2 = this.add.bitmapText(0,0, "JandaManateeSolid", _xp.toString(), 40);
        t2.x = -t2.width*0.5;
        t2.y = -t2.height*0.5;
        b2.addChild(t2);

        var tt2 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn2");
        tt2.anchor.set(0.5,1);
        tt2.alpha = 0;
        b2.tooltip = tt2;
        b2.addChild(tt2);

        /************************ b4 ******************************/
        var b4 = this.createEndButton(940, 550, 0.65);
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



        this.add.tween(b1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(b1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 500);


        this.add.tween(b2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 700);
        this.add.tween(b2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 700);

        this.add.tween(b4).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(b4.scale).to({x:0.65,y:0.65}, 500, Phaser.Easing.Linear.None, true, 1100);



        this.createDelayTime(5000, this.tweenBack);
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

        this.initVars();

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
		console.log("*** gotoNextLevel ***");
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
		console.log("*** hideAndShowLevel ***");
        this.hideLevel(function() {

            if(this.currentLevel <=3 && this.corrects <= 2) {
                if(isWrong) {

                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;
                        this.showNextLevel();
                        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    
    //----------------AV2D3OA03--------------------//
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
   
	mouseInputDown:function(elem){
		console.log("mouseInputDown");
		// teste logico 
		//console.log("ELEMENTO: "+elem.name);
		//console.log("NUM RODADA: "+this.numerosVazios[this.rodada]);
		this.nivelAnterior = this.currentLevel;
		this.nivelsubNivel = this.subNivel;
		
		//console.log("SUBNIVEL ANTERIOR SET "+ this.nivelsubNivel);
				
		
		if(elem.name==this.numerosVazios[this.rodada]) 
		{
			console.log("CORRETO");
			this.sound.play("hitAcerto");
			this.efeitoRodadaCorreta(this.rodada);
			if(this.acertos>0)
			{
				this.acertos--;
			}
			else{this.acertos=0;}
			console.log("ACERTOS "+this.acertos);
			//console.log("TESTE SUBNIVEL "+ this.subNivel +" < "+this.totalSubNivel);
			if(this.subNivel<=this.totalSubNivel)
			{
				//console.log("TESTE RODADA "+ this.rodada +" < "+this.totalRodasdas);
				if(this.rodada <this.totalRodasdas){
					this.rodada++;
					if(this.acertos>0)
					{
						
						console.log("CORRETO PROXIMO");
						switch(this.currentLevel)
						{
							case 1:
								this.initLevel1();
							break;
							case 2:
								this.initLevel2();
							break;
							case 3:
								this.initLevel3();
							break;
						}
					}
				}else{
					this.subNivel++;
					
					if(this.subNivel<=this.totalSubNivel)
					{
						console.log("CORRETO PROXIMO SUBNIVEL");
						this.limparSubnivel();
						this.createDelayTime(3000, function() {
							this.chamadaSubNivel();
							
						});
					}
					if(this.subNivel>this.totalSubNivel){
						console.log("*** CORRETO RIGTH ***");
						this.limparSubnivel();
						this.createDelayTime(3000, function() {
							this.rightAnswer();
							
						});
						
					}
				}
			}else{
				console.log("CORRETO RIGTH");
				this.rightAnswer();
				
			}
		}else{
			console.log("ERRADO");
            this.blockBotoes();
            this.sound.play("hitErro");
            if(this.tolerancia==0)
            {
                console.log("ERRO FINAL");
               
                this.limparSubnivel();
                this.createDelayTime(3000, function() {
                    this.wrongAnswer();
                    
                });
               
            }
            if(this.tolerancia>0)
            {
                console.log("TOLERANCIA");
                this.tolerancia--;
            }
		}

	},
	
	resetLevel:function(nivel){
		console.log("***resetLevel***");
		this.initVars();
	},

    crescente:function(index1, index2){
        return index1 - index2;
    },

    initVars:function(){
        // ________initVars____ 
        this.nivelAnterior = 0;
        this.nivelsubNivel = 0;
        this.subNivel = 0;
        this.totalSubNivel = 0;
        this.rodada =0;
        this.totalRodasdas = 0;
        this.arrayNumeros = [];
        this.temp_array = [];
        this.totalNumerosLevel = 0;
        this.imagemsNumeros =[];
        this.brilhos = [];
        this.numerosVazios = [];
        this.numerosVaziosImg = [];
        this.numerosVaziosId = [];
        this.acertos = 0;
        this.groupLevel=[];
        this.numeroInicial =0;
        this.tutorial = false;
		this.testeTutorial=false;
        //_____________________
    },
    
    initRodada:function(){
        this.add.tween(this.imagemsNumeros[this.brilhos[this.rodada].imagem]).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[this.rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[this.rodada].scale).to({x: 0.5, y: 0.5}, 800, Phaser.Easing.Linear.None, true)
        .onComplete.add(
            function(){
                this.add.tween(this.brilhos[this.rodada]).to({alpha:0}, 800, Phaser.Easing.Linear.None, true)
                .onComplete.add(
                    function(){
                       this.add.tween(this.brilhos[this.rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true); 
                    }
                ,this)
            }
        ,this);
    },
    
    efeitoRodadaCorreta:function(rodada){
        console.log("***efeitoRodadaCorreta***");

        this.changeHappy(this.iara,"iara_happy","iara",70,115);
        
        x = this.imagemsNumeros[this.brilhos[rodada].imagem].x;
        y = this.imagemsNumeros[this.brilhos[rodada].imagem].y;
        
        spr = this.add.sprite(x,y, 'numeros',this.brilhos[rodada].imagem);
        this.imagemsNumeros.push(spr);
        this.groupLevel[this.currentLevel].add(spr);
        this.brilhos[rodada].destroy();
        //console.log(this.brilhos[this.rodada]);
    },
    
    limparSubnivel:function(){
        console.log("***limparSubnivel***");
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[this.currentLevel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[this.currentLevel] != null) {
                this.groupLevel[this.currentLevel].removeAll(true);
             }
            if(!this.tutorial){
                this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function(){
                    this.add.tween(this.placar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);
					this.add.tween(this.quadro).to({alpha:0}, 700, Phaser.Easing.Linear.None, true);
                },this)
            }else{
                this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.quadro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);
            }
        }); 
    },
    
    chamadaSubNivel:function(){
        console.log("***chamadaSubNivel***");
        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500)
        .onComplete.add(function(){
            img = this.currentLevel.toString()+this.subNivel.toString();
            console.log("imagem " +img);
            this.showQuestion(img);
            som = "soundP"+img;
            this.sound.play(som).onStop.add(function(){
                switch(this.currentLevel)
                {
                    case 1:
                        this.initLevel1();
                    break;
                    case 2:
                        this.initLevel2();
                    break;
                    case 3:
                        this.initLevel3();
                    break;
                }   
            }, this);

            
        }, this);
        
    },

    testeNumerosVazios:function(i,pos){
        //console.log("*** testeNumerosVazios ***");
        //console.log("count "+this.count);
        num = i+1;
        //console.log("numero teste "+num + "imagem "+ i);
        //console.log("tam "+this.numerosVazios.length);
        for(var it=1; it<this.numerosVazios.length;it++){
            //console.log("num vazio " + this.numerosVazios[it]);
            if((i+1)==this.numerosVazios[it]){
                
                nome=this.numerosVazios[it];
                //console.log("true " + this.numerosVazios[it]);
                this.brilhos[this.count] = this.add.sprite(posicaoBrilho[pos][0],posicaoBrilho[pos][1], 'brilho');
                this.brilhos[this.count].scale.set(0.5,0.5);
                this.brilhos[this.count].alpha = 0;
                this.brilhos[this.count].name = nome;
                this.brilhos[this.count].imagem = i;
                this.groupLevel[this.currentLevel].add(this.brilhos[this.count]); 
                this.count++;   
                return true;
            }
            
        }
        return false;

    },
    
    showImagens:function(){
        // mostrara imagens
        //console.log("***showImagens***");
        this.count = 1;  
        pos= 0;
        for(var i=this.numeroInicial; i<this.totalNumerosLevel;i++){
            resultado = this.testeNumerosVazios(i,pos);
            //console.log("Resultado: "+resultado);
            if(resultado){
                this.imagemsNumeros[i] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'numeros',50);
                this.imagemsNumeros[i].alpha = 0;
                this.imagemsNumeros[i].name = nome;
            }
            else
            {
                this.imagemsNumeros[i] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'numeros',i);
            }
            this.groupLevel[this.currentLevel].add(this.imagemsNumeros[i]);
            pos++;
        }
    },

    randOrd:function() {
        return (Math.round(Math.random())-0.5);
    },
    
    showBotoes:function(){
        //console.log("***showBotoes***");
        x = 315;
        y = 502;
        afastamento = 0;
        botao = [];
        btnImg = [];
        if(!this.tutorial)
        {
            
            for(var i= 1; i<this.numerosVazios.length; i++){
                botao[i] = i;
            }
            botao.sort(this.randOrd);

            for(var i= 0; i<this.numerosVazios.length-1; i++){
                 
                 btnImg[i+1] = botao[i];
            }

        }
        else{
           
            for(var i= 1; i<this.numerosVazios.length; i++){
                btnImg[i] = i;
            }
        }
        
        //console.log("botao "+btnImg);
        
        if(this.nivelsubNivel!=this.subNivel){
            //console.log("---->LIBERAR NIVEL");
            count = 1;
			this.add.tween(this.quadro).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);
            this.createDelayTime(1000, function() {
                for(var i= 1; i<this.numerosVazios.length; i++){
                    //console.log("--> botao "+btnImg[count]);
                    //x = this.addSprite('numeros',100,550,this.numerosVazios[i]);
                    //this.brilhos[0].scale.set(0.5,0.5);
                    //console.log("aqui "+ this.brilhos[btnImg[count]].imagem);
                    this.numerosVaziosImg[i] = this.add.sprite(x+afastamento,y, 'numeros',this.brilhos[btnImg[count]].imagem);
                    this.numerosVaziosImg[i].name = this.brilhos[btnImg[count]].name;
                    //console.log("botoes "+ this.numerosVaziosImg[i].name +" = " +this.brilhos[btnImg[count]].name);
                    afastamento+=100;
                    count++;
                    this.numerosVaziosImg[i].inputEnabled = true;
                    this.numerosVaziosImg[i].input.useHandCursor = true;
                    this.numerosVaziosImg[i].events.onInputDown.add(this.mouseInputDown, this);
                    this.groupLevel[this.currentLevel].add(this.numerosVaziosImg[i]);
                }   

            });

            // teste logico if(ele.name==this.numerosVazios[this.rodada]) no click 
        }    
    },

    blockBotoes:function(){
        for(var i= 1; i<this.numerosVazios.length; i++){
            this.numerosVaziosImg[i].inputEnabled = false;
            this.numerosVaziosImg[i].events.onInputDown.removeAll();
            this.numerosVaziosImg[i].input.reset();
        }

    },

    animClick:function(proximo){
        //console.log("*** animClick ****");
        this.click.alpha = 1;
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.efeitoIntro(proximo);
        }, this);
    },

    brilhoIntro:function(rodada,proximo){
        //console.log("*** brilhoIntro ****");
        this.add.tween(this.imagemsNumeros[this.brilhos[rodada].imagem]).to({alpha:1},300, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[rodada].scale).to({x: 0.5, y: 0.5},800, Phaser.Easing.Linear.None, true)
        .onComplete.add(
            function(){
                this.add.tween(this.brilhos[rodada]).to({alpha:0},800, Phaser.Easing.Linear.None, true)
                .onComplete.add(
                    function(){
                       this.add.tween(this.brilhos[rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoIntro(proximo)},this) 
                    }
                ,this)
            }
        ,this);
    },

    efeitoIntro:function(tipo){
        //console.log("*** efeitoIntro ****");
        switch(tipo)
        {
            case 1:
                this.brilhoIntro(1,2);
            break;
            case 2: 
                x1 = this.numerosVaziosImg[1].x;
                y1 = this.numerosVaziosImg[1].y;
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(3)},this)
               
            break;
            case 3:
                this.efeitoRodadaCorreta(1);
                this.createDelayTime(100, function() {
                    this.efeitoIntro(4);
                });
            break;
            // numero 2
            case 4:
                this.brilhoIntro(2,5);
            break;
            case 5: 
                x1 = this.numerosVaziosImg[2].x;
                y1 = this.numerosVaziosImg[2].y;
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(6)},this)
               
            break;
            case 6:
                this.efeitoRodadaCorreta(2);
                this.createDelayTime(100, function() {
                    this.efeitoIntro(7);
                });
            break;
            // numero 3
            case 7:
                this.brilhoIntro(3,8);
            break;
            case 8: 
                x1 = this.numerosVaziosImg[3].x;
                y1 = this.numerosVaziosImg[3].y;
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(9)},this)
               
            break;
            case 9:
                this.efeitoRodadaCorreta(3);
                this.createDelayTime(1500, function() {
                    if(this.tutorial)
                    {
                        this.showFinishedLiveTutorial();
                    }    
                });
            break;

        }     
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

  //----------------AV2D3OA03--------------------//

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */

    createScene: function() {//finished
        var background = this.add.sprite(-72,-61, 'background');
        background.scale.set(0.8,0.8);
        //this.createAnimation(70,115, 'iara', 1,1);

        this.iara = this.add.sprite( 70, 115, 'iara',1);
        this.iara.animations.add('iara');
        this.iara.animations.play('iara', 15, true);

        this.quadro = this.add.sprite(214,436, 'quadro');
        this.quadro.scale.set(0.8,0.8);
        this.quadro.alpha =0;
    },
    
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
		console.log("showLiveTutorial");
		this.testeTutorial=true;
        //this.add.tween(this.quadro).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);

        this.numeroInicial=0;
        this.totalNumerosLevel = 10; // total de numeros a serem mostrados no jogo 

        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodasdas = 3; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        //this.arrayNumeros = [1,2,3,4,5,6,7,8,9,10]; // numeros para seres sorteados 

        this.numerosVazios[1]= 4;
        this.numerosVazios[2]= 6;
        this.numerosVazios[3]= 9;

        this.nivelsubNivel = -1;
        this.subNivel = 1;

        posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201])
        posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188])
        this.showImagens();

        console.log("-->RODADA "+ this.rodada);
                //this.initRodada();
        this.showBotoes();
        //efeitoIntro
        this.createDelayTime(1500, function() {
            this.arrow = this.add.sprite( 570,420, 'arrow');
            this.click = this.add.sprite(0, 0, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.alpha = 0;

            this.groupLevel[this.currentLevel].add(this.arrow);
            this.groupLevel[this.currentLevel].add(this.click);


            this.efeitoIntro(1);
            
        });
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
		console.log("showFinishedLiveTutorial");
        this.limparSubnivel();
        this.createDelayTime(2000, function() {
			if(this.tutorial){this.initGame();}    
        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.scale.set(0.9, 0.9);
        tutorialText.anchor.set(0.5, 0.5);

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
        
        console.log("*** showNextLevel ***");
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

        var position = 50;
        if(num==22){position=30;}

        console.log("position: "+position);

        console.log(" *** showQuestion ***");
        console.log("num: "+num);
        this.imageQuestion = this.drawText(this.world.centerX, position, this.questionList[num]);
        this.imageQuestion.alpha = 0;
            if(this.showCallToAction) {
                return;
            }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {

        console.log("*** NIVEL 1  *** "+ this.corrects);
        //console.log("NIVEL ANTERIOR "+ this.nivelAnterior);
        
        if(this.nivelAnterior != this.currentLevel)
        {
            this.subNivel = 1; // subnivel do jogo 
            this.totalSubNivel = 2;// total de subniveis no jogo
            
        }
		
		if(this.nivelsubNivel!=this.subNivel)
        {
			this.groupLevel[this.currentLevel] = this.add.group();
			this.acertos = 2;

		}


        //console.log("SUBNIVEL "+ this.subNivel);
        
        
        switch(this.subNivel)
        {
			
            case 1: //subnivel 1
                //this.showQuestion(1); 
                //console.log("SUBNIVEL 1");
				//console.log("SUBNIVEL Anterior "+ this.nivelsubNivel);
				//console.log("SUBNIVEL "+this.subNivel);
				
				

                if(this.nivelsubNivel!=this.subNivel){
					this.numeroInicial=0;
					this.totalNumerosLevel = 10; // total de numeros a serem mostrados no jogo 

                    this.rodada = 1; // rodadas dentro do subnivel 
                    this.totalRodasdas = 2; // numero total de rodadas 
                    this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
                    this.arrayNumeros = [1,2,3,4,5,6,7,8,9,10]; // numeros para seres sorteados 

                    this.temp_array = this.arrayNumeros.slice();
                    num  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    this.temp_array = this.arrayNumeros.slice();
                    num1  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    if(num<num1){
                        this.numerosVazios[1]= num;
                        this.numerosVazios[2]= num1;
                    }else{
                        this.numerosVazios[1]= num1;
                        this.numerosVazios[2]= num;
                    }
        
                    //console.log("-->NUMERO "+num);
                    //console.log("-->NUMERO "+num1);
                    //console.log("-->ARRAY "+this.numerosVazios);

                    posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201])
                    posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188])
                    //this.brilhos[0] = this.addSprite('brilho',100,100);
                    //this.brilhos[0].scale.set(0.5,0.5);
                    // mostrara imagens
                    this.showImagens();
                }
             
                //console.log("-->RODADA "+ this.rodada);
				this.initRodada();
                this.showBotoes();

            break;
            case 2: //subnivel 2 
                //console.log("SUBNIVEL 2"); 
				//console.log("SUBNIVEL Anterior "+ this.nivelsubNivel);
				//console.log("SUBNIVEL "+this.subNivel);
				
				
                if(this.nivelsubNivel!=this.subNivel){
					this.numeroInicial=9;
					this.totalNumerosLevel = 20; // total de numeros a serem mostrados no jogo 
					this.rodada = 1; // rodadas dentro do subnivel 
                    this.totalRodasdas = 2; // numero total de rodadas 
                    this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
                    this.arrayNumeros = [10,11,12,13,14,15,16,17,18,19,20]; // numeros para seres sorteados 

                    this.temp_array = this.arrayNumeros.slice();
                    num  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    this.temp_array = this.arrayNumeros.slice();
                    num1  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    if(num<num1){
                        this.numerosVazios[1]= num;
                        this.numerosVazios[2]= num1;
                    }else{
                        this.numerosVazios[1]= num1;
                        this.numerosVazios[2]= num;
                    }
        
                    //console.log("-->NUMERO "+num);
                    //console.log("-->NUMERO "+num1);
                    //console.log("-->ARRAY "+this.numerosVazios);
					
					posicao = new Array([536,216],[459,247],[372,263],[289,274],[244,318],[330,331],[425,326],[508,346],[588,373],[654,336],[720,303])
					posicaoBrilho = new Array([505,195],[427,223],[344,237],[257,250],[210,297],[301,307],[384,312],[471,334],[554,347],[618,317],[690,282])
					this.showImagens();
					//pos =0;
					//for(var i=9; i<this.totalNumerosLevel;i++){
						//x = this.addSprite('numeros',posicao[pos][0],posicao[pos][1],i);
						//a = this.addSprite('brilho',100,100);
						//a.scale.set(0.5,0.5);
						//pos++
					//}

					
					//this.brilhos[0] = this.addSprite('brilho',100,100);
                    //this.brilhos[0].scale.set(0.5,0.5);
				}
				//console.log("-->RODADA "+ this.rodada);
				this.initRodada();
                this.showBotoes();
            break;
        }
    },
	
	initLevel2: function() {

        console.log("*** NIVEL 2  *** "+ this.corrects);
        //console.log("NIVEL ANTERIOR "+ this.nivelAnterior);
        
        if(this.nivelAnterior != this.currentLevel)
        {
            this.subNivel = 1; // subnivel do jogo 
            this.totalSubNivel = 2;// total de subniveis no jogo 
            this.acertos = 3;
        }
		
		if(this.nivelsubNivel!=this.subNivel)
        {
			this.groupLevel[this.currentLevel] = this.add.group();
			this.acertos = 3;
		}
        //console.log("SUBNIVEL "+ this.subNivel);
        //console.log("-->ACERTOS "+ this.acertos);
        
        
        switch(this.subNivel)
        {
			
            case 1: //subnivel 1
                //this.showQuestion(1); 
                //console.log("SUBNIVEL 1");
				//console.log("SUBNIVEL Anterior "+ this.nivelsubNivel);
				//console.log("SUBNIVEL "+this.subNivel);
				
                if(this.nivelsubNivel!=this.subNivel){
					this.numeroInicial=19;
					this.totalNumerosLevel = 30; // total de numeros a serem mostrados no jogo 

                    this.rodada = 1; // rodadas dentro do subnivel 
                    this.totalRodasdas = 3; // numero total de rodadas 
                    this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
                    this.arrayNumeros = [20,21,22,23,24,25,26,27,28,29,30]; // numeros para seres sorteados 

                    this.temp_array = this.arrayNumeros.slice();
                    num  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    this.temp_array = this.arrayNumeros.slice();
                    num1  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    this.temp_array = this.arrayNumeros.slice();
                    num2  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    array_temp = [];
                    array_temp.push(num);
                    array_temp.push(num1);
                    array_temp.push(num2);

                    array_temp.sort(this.crescente);

                    //console.log("-->ARRAY TEMP "+array_temp);
                    for(var i=0;i<array_temp.length;i++)
                    {
                        this.numerosVazios[i+1] = array_temp[i];
                    }
        
                    //console.log("-->NUMERO "+num);
                    //console.log("-->NUMERO "+num1);
                    //console.log("-->NUMERO "+num2);
                    //console.log("-->ARRAY "+this.numerosVazios);

                    //this.add.tween(this.quadro).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);


                    posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201],[862,201])
                    posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188],[834,177])
                    
                    this.showImagens();
                }
             
                //console.log("-->RODADA "+ this.rodada);
				this.initRodada();
                this.showBotoes();

            break;
            case 2: //subnivel 2 
                //console.log("SUBNIVEL 2"); 
				//console.log("SUBNIVEL Anterior "+ this.nivelsubNivel);
				//console.log("SUBNIVEL "+this.subNivel);
				
				
                if(this.nivelsubNivel!=this.subNivel){
					this.numeroInicial=29;
					this.totalNumerosLevel = 40; // total de numeros a serem mostrados no jogo 
					this.rodada = 1; // rodadas dentro do subnivel 
                    this.totalRodasdas = 3; // numero total de rodadas 
                    this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
                    this.arrayNumeros = [30,31,32,33,34,35,36,37,38,39,40]; // numeros para seres sorteados 

                    this.temp_array = this.arrayNumeros.slice();
                    num  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    this.temp_array = this.arrayNumeros.slice();
                    num1  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    this.temp_array = this.arrayNumeros.slice();
                    num2  = this.sorteio();
                    this.arrayNumeros = this.temp_array.slice();

                    array_temp = [];
                    array_temp.push(num);
                    array_temp.push(num1);
                    array_temp.push(num2);

                    array_temp.sort(this.crescente);

                    //console.log("-->ARRAY TEMP "+array_temp);
                    for(var i=0;i<array_temp.length;i++)
                    {
                        this.numerosVazios[i+1] = array_temp[i];
                    }
        
                    //console.log("-->NUMERO "+num);
                    //console.log("-->NUMERO "+num1);
                    //console.log("-->NUMERO "+num2);
                    //console.log("-->ARRAY "+this.numerosVazios);
					
					posicao = new Array([536,216],[459,247],[372,263],[289,274],[244,318],[330,331],[425,326],[508,346],[588,373],[654,336],[720,303])
					posicaoBrilho = new Array([505,195],[427,223],[344,237],[257,250],[210,297],[301,307],[384,312],[471,334],[554,347],[618,317],[690,282])
					this.showImagens();
					//pos =0;
					//for(var i=9; i<this.totalNumerosLevel;i++){
						//x = this.addSprite('numeros',posicao[pos][0],posicao[pos][1],i);
						//a = this.addSprite('brilho',100,100);
						//a.scale.set(0.5,0.5);
						//pos++
					//}

					
					//this.brilhos[0] = this.addSprite('brilho',100,100);
                    //this.brilhos[0].scale.set(0.5,0.5);
				}
				//console.log("-->RODADA "+ this.rodada);
				this.initRodada();
                this.showBotoes();
            break;
        }
    },

    initLevel3: function() {

        console.log("*** NIVEL 3  *** "+ this.corrects);
        //console.log("NIVEL ANTERIOR "+ this.nivelAnterior);
        
        if(this.nivelAnterior != this.currentLevel)
        {
            this.subNivel = 1; // subnivel do jogo 
            this.totalSubNivel = 1;// total de subniveis no jogo 
            this.acertos = 4;
            this.groupLevel[this.currentLevel] = this.add.group();
            //console.log("-->ACERTOS "+ this.acertos);

            this.numeroInicial=39;
            this.totalNumerosLevel = 50; // total de numeros a serem mostrados no jogo 

            this.rodada = 1; // rodadas dentro do subnivel 
            this.totalRodasdas = 4; // numero total de rodadas 
            this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
            this.arrayNumeros = [40,41,42,43,44,45,46,47,48,49,50]; // numeros para seres sorteados 

            this.temp_array = this.arrayNumeros.slice();
            num  = this.sorteio();
            this.arrayNumeros = this.temp_array.slice();

            this.temp_array = this.arrayNumeros.slice();
            num1  = this.sorteio();
            this.arrayNumeros = this.temp_array.slice();

            this.temp_array = this.arrayNumeros.slice();
            num2  = this.sorteio();
            this.arrayNumeros = this.temp_array.slice();

            this.temp_array = this.arrayNumeros.slice();
            num3  = this.sorteio();
            this.arrayNumeros = this.temp_array.slice();

            array_temp = [];
            array_temp.push(num);
            array_temp.push(num1);
            array_temp.push(num2);
            array_temp.push(num3);

            array_temp.sort(this.crescente);

            //console.log("-->ARRAY TEMP "+array_temp);
            for(var i=0;i<array_temp.length;i++)
            {
                this.numerosVazios[i+1] = array_temp[i];
            }

            //console.log("-->NUMERO "+num);
            //console.log("-->NUMERO "+num1);
            //console.log("-->NUMERO "+num2);
            //console.log("-->NUMERO "+num3);
            //console.log("-->ARRAY "+this.numerosVazios);

            //this.add.tween(this.quadro).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);


            posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201],[862,201])
            posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188],[834,177])
            
            this.showImagens();
        }
        //console.log("-->RODADA "+ this.rodada);
        this.initRodada();
        if(this.nivelAnterior != this.currentLevel){
            this.showBotoes();
        }
    },
	rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        this.qtdErros = 0;
		this.corrects++;
        this.saveCorrect();
		//this.sound.play("hitAcerto");
		//this.showCallToAction = true;
        this.addPoints();
		var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
    },
    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
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
                this.createDelayTime(200, function() {
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); // para o próximo nível
            break;
            case 0: // toca som de resumo
                this.resetLevel(nivel);
                this.lives = 0; 
                this.createDelayTime(200, function() {
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



	}
};
