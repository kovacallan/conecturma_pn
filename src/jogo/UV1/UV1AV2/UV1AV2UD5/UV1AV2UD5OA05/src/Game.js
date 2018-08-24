
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
        this.TEMPO_INTRO = 13500;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 12500;
        this.SOUND_VITORIA = 500;
        this.HAS_CALL_TO_ACTION = false;
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
        

        //-----AV2D5OA05------//
        this.resetRandomLetter();
        //this.gradeGuia();
        this.groupLevel = [];
        this.nivelAnterior = 0;
        this.temp_array = [];
        this.subNivel = 0;
        this.initVars();
        this.tutorial = false;
        //-----AV2D5OA05------//
        this.createScene();

        this.showIntro();

        //this.showResumo();
        // this.gameOverMacaco();


        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

        this.input.onTap.add(function() {
            console.log("Posicao do Mouse:", this.input.x, this.input.y);
        }, this);


	},

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Fred e Curupira acharam um \nformigueiro no alto da copa da \nArvore, cujas formigas são bem \norganizadas.";
        this.texto['initialText2'] ="As folhas que elas carregam são numeradas. Mas \nalgumas formigas fugiram da fila. Vejam só, a \nformiga que vem antes do [número 5] saiu da fila. \nÉ a formiga que tem a folha de [número 4]. Vamos \npegá-la e pronto, ela está de volta na fila. ";
        this.texto['initialText3'] = "Agora vejam a formiga de número 10. Está \nfaltando a que vem depois dela. é a de \nnúmero 11.Vamos levar as formigas de volta \npara a fila?";
        this.texto['imgResumo'] ="O número que vem antes de outro é chamado \n[antecessor], é sempre menor que ele. O número \nque vem logo depois de outro número é chamado \n[sucessor] e é maior que ele.";
        this.texto['imgResumo2'] ="Vejam o número [5]. O número que vem antes \ndele é o [4]. O número [4] é o [antecessor] do [5].";
        this.texto['imgResumo3'] ="Vejam ainda o número [5]. O número que vem \nlogo depois do [5] é o número [6]. [6] é o [sucessor] \ndo número [5].";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = new Array();
        this.questionList[0]  = null;
        this.questionList[1]  = "Levem de volta para a fila a formiga que \nvem antes da formiga com a folha número… ";
        this.questionList[11]  = "Levem de volta para a fila a formiga que \nvem depois daquela que tem a folha número…";
        this.questionList[2]  =  "Levem  de volta para a fila as formigas que \nvem antes e depois da formiga com o número… ";
        this.questionList[3]  =  "Levem  de volta para a fila as formigas que \nvem antes e depois da formiga com o número… ";
       
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
        this.tutorial =false;
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
        console.log("*** showIntro ***");
         this.tutorial =true;
        this.groupIntro = this.add.group();

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
            }, this);
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

        this.createDelayTime(9000, function() {
            this.add.tween(this.kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        console.log("*** showTextoIntro ***");

        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 21, "left");
        this.tutorialText2.alpha = 0;
        //this.tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText2);


        this.tutorialText3 = this.drawText(this.world.centerX, 30, this.texto['initialText3'], 21, "left");
        this.tutorialText3.alpha = 0;
        //this.tutorialText3.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText3);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime(9000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(
                function(){
                if(this.tutorial){
                    this.showLiveTutorial();
                }
            }, this);
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
        return;
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

    completeShowFinal: function() {
        this.soundFinal = this.sound.play("soundFinal");
        
        this.soundFinal.onStop.addOnce(function(){
            this.gameOverMacaco();
        }, this);
    },

    hideAndShowLevel: function(isWrong) {
        console.log("hideAndShowLevel");
        this.hideLevel(function() {
            console.log("currentLevel "+this.currentLevel);
            console.log("corrects "+this.corrects);
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                //if(this.showCallToAction==false)
                //{
                    //console.log("placar ");
                    //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                //}
                //else
                //{
                    //console.log("placar sem");
                    //this.showNextLevel();
                //}
            } else {
                 this.completeShowFinal();
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
    //------- AV2D5OA05--------------//

    

    initVars:function(){
        this.posicaoX = [];
        this.posicaoY = [];
        this.formigas  = [];
        this.marca = [];
        this.temp_array = [];
        this.formigasFora  = [];
        this.levelNumero = null;
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

    animClick:function(prox,img){
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.efeitoMouse(prox);
        }, this);
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

                x = this.formigasFora[1].x+35;
                y = this.formigasFora[1].y+15;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(2);
                     
                },this);

                //this.createDelayTime(4000, function() {
                    //if(this.tutorial){
                        //this.showFinishedLiveTutorial();
                    //}  
               // });
            break;
            case 2:
                x1=526+35;
                y1=256+15;

                x = 526;
                y = 256;

                this.add.tween(this.formigasFora[1]).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true)
                this.add.tween(this.arrow).to({x:x1,y:y1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(3);
                     
                },this);

            break;

            case 3:
            console.log(this.formigas);
                this.createDelayTime(2000, function() {
                    for(i=0; i<this.formigas.length; i++){
                        this.formigas[i].alpha=0;
                    }
                    for(pos=0; pos<3; pos++){
                        this.formigasFora[pos].alpha =0;  
                    }
                    this.arrow.destroy();
                    this.click.destroy();
                });
                this.createDelayTime(2000, function() {
                    if(this.tutorial){
                       this.createTutorial2();
                    }
                    
                });
            break;

            case 4:
                this.arrow = this.add.sprite(510,390, 'arrow');
                this.groupIntro.add(this.arrow);
                this.arrow.alpha =1;

                this.click = this.add.sprite(0, 0, "clickAnimation");
                this.click.animations.add('idle', null, 18, true);
                this.click.alpha = 0;
                this.groupIntro.add(this.click);
                x = this.formigasFora[2].x+35;
                y = this.formigasFora[2].y+15;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(5);
                     
                },this);
            break;

            case 5:
                x1=526+35;
                y1=256+15;

                x = 526;
                y = 256;

                this.add.tween(this.formigasFora[2]).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true)
                this.add.tween(this.arrow).to({x:x1,y:y1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(6);
                     
                },this);

            break;
            case 6:
                this.createDelayTime(5000, function() {
                    if(this.tutorial){
                      this.showFinishedLiveTutorial();
                    } 
                });  
            break;
        
        }
    },


    createTutorial1:function(){

        this.posicaoX  = [223,325,429,526,624,725];
        this.posicaoY  = [251,262,263,256,235,209];

        this.posFora = new Array([504,440],[641,439],[777,439]);
        this.formigas  = [];
        this.formigasFora  = [];
        this.item = [];
        afastamento = 0;


        this.item[0] =4;
        this.item[1] =-1;

        pos=0;
        it =0;
        num = 0;

        this.numInicial = 1;
        this.numFinal =5;

        for(i=this.numInicial; i<=this.numFinal; i++){
            
            x = this.posicaoX[it]+20;
            y = this.posicaoY[it]+115;

            x1 = this.posicaoX[it];
            y1 = this.posicaoY[it];
            
            if(i<10){afastamento=30;}else{afastamento=20;}

            if(i==this.item[0] || i==this.item[1]){
                this.marca[pos] = this.add.sprite(x, y, 'marca'); 
                this.groupIntro.add(this.marca[pos]);
                this.marca[pos].name = i;
                this.marca[pos].alpha =0;
                pos++;

            }else{
                this.formigas[num] = this.createAnimation(x1,y1, 'formiga', 1,1);   
                this.formigas[num].addChild(this.game.make.sprite(afastamento, 30, 'num_formigas',i));
                this.formigas[num].children[0].scale.set(0.8,0.8);
                this.formigas[num].name = i;
                this.groupIntro.add(this.formigas[num]);
                num++;
            }

             it++;

            
        }

        botoes = [8,4,6];

        for(pos=0; pos<3; pos++){
            this.formigasFora[pos] = this.createAnimation(this.posFora[pos][0],this.posFora[pos][1], 'formiga', 1,1);
            this.formigasFora[pos].name = i;
            this.formigasFora[pos].id = pos;
            this.formigasFora[pos].addChild(this.game.make.sprite(afastamento, 30, 'num_formigas',botoes[pos]));
            this.formigasFora[pos].children[0].scale.set(0.8,0.8);
            this.formigasFora[pos].posicao = pos;
            this.formigasFora[pos].posicaoFora = pos;
            this.groupIntro.add(this.formigasFora[pos]);
        }

        this.createDelayTime(18000, function() {
            this.efeitoMouse(1);
        });
    },

    createTutorial2:function(){

        
       
        this.add.tween(this.tutorialText2).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
             this.add.tween(this.tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        }, this);
        
        this.posicaoX  = [223,325,429,526,624,725];
        this.posicaoY  = [251,262,263,256,235,209];

        this.posFora = new Array([504,440],[641,439],[777,439]);
        this.formigas  = [];
        this.formigasFora  = [];
        this.item = [];
        afastamento = 0;


        this.item[0] =4;
        this.item[1] =-1;

        pos=0;
        it =0;

        this.numInicial = 8;
        this.numFinal =10;

        for(i=this.numInicial; i<=this.numFinal; i++){
            
            x = this.posicaoX[it]+20;
            y = this.posicaoY[it]+115;

            x1 = this.posicaoX[it];
            y1 = this.posicaoY[it];
            
            if(i<10){afastamento=30;}else{afastamento=20;}

            if(i==this.item[0] || i==this.item[1]){
                this.marca[pos] = this.add.sprite(x, y, 'marca'); 
                this.groupIntro.add(this.marca[pos]);
                this.marca[pos].name = i;
                this.marca[pos].alpha =0;
                pos++;

            }else{
                this.formigas[i] = this.createAnimation(x1,y1, 'formiga', 1,1);   
                this.formigas[i].addChild(this.game.make.sprite(afastamento, 30, 'num_formigas',i));
                this.formigas[i].children[0].scale.set(0.8,0.8);
                this.formigas[i].name = i;
                this.groupIntro.add(this.formigas[i]);
            }

            it++;
        }

        botoes = [13,12,11];

        for(pos=0; pos<3; pos++){
            this.formigasFora[pos] = this.createAnimation(this.posFora[pos][0],this.posFora[pos][1], 'formiga', 1,1);
            this.formigasFora[pos].name = i;
            this.formigasFora[pos].id = pos;
            this.formigasFora[pos].addChild(this.game.make.sprite(afastamento, 30, 'num_formigas',botoes[pos]));
            this.formigasFora[pos].children[0].scale.set(0.8,0.8);
            this.formigasFora[pos].posicao = pos;
            this.formigasFora[pos].posicaoFora = pos;
            this.groupIntro.add(this.formigasFora[pos]);
        }

        this.createDelayTime(6000, function() {
            this.efeitoMouse(4);
        });
    },

    inputMovableNumbers:function(tipo,img){// habilita o drag em drop
        console.log("***inputMovableNumbers***")
        console.log("tipo: "+tipo)
        if(tipo==1)
        {  
            for(var i=0; i<this.formigasFora.length; i++)
            {
                this.game.physics.enable(this.formigasFora[i], Phaser.Physics.ARCADE);
                this.formigasFora[i].inputEnabled = true;
                this.formigasFora[i].input.enableDrag(false, true);
                this.formigasFora[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.formigasFora[i].events.onDragStop.add(this.onStopDragNumber, this);
            }
        }
        if(tipo==2) // desabilitar todas 
        {
            console.log("*** desabilitar todas ****");
            for(var i=0; i<this.formigasFora.length; i++)
            {
                this.formigasFora[i].inputEnabled = false;
                this.formigasFora[i].input.useHandCursor = false;
              
            }
        }
        if(tipo==3) // desabilitar uma
        {
            this.formigasFora[img].inputEnabled = false;
        }
    },    

    onStartDragNumber: function(elem) {
        console.log("***onStartDragNumber***");
        this.initialPos = {x:elem.x, y:elem.y};
        //console.log(elem);
    },
    onStopDragNumber: function(elem){

        this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        resultado = 0;// reposiciona 
        pos = -1;
        //elem.anchor.set(0.5,0.5);
        if(this.initialPos.x!=elem.x){
            for(var i=0;i<this.marca.length;i++){
                //console.log(this.marca[i]);
                this.game.physics.enable(this.marca[i], Phaser.Physics.ARCADE);
                if(this.game.physics.arcade.overlap(elem,this.marca[i])){
                    console.log("elem: "+elem.name+" marca: "+this.marca[i].name);
                    if(elem.name==this.marca[i].name){
                        resultado = 1;// acertou 
                        pos = i;
                    }
                    else{
                        resultado = 2; //errou
                        pos = i;
                    }
                    break;
                }else{

                    var yMarca = 100;
                    var yMarca1= 445;

                    var margemY = elem.y+(elem.height);
                    console.log("--> "+elem.y+" + "+elem.height+" == "+margemY);
                    console.log("--> "+margemY+" > "+yMarca+" && "+margemY+" < "+yMarca1);
                    if(margemY>yMarca && margemY<yMarca1){
                        resultado = 2; //errou
                        pos = i;
                    }
                }
            }
            //elem.anchor.set(0,0);
        }

        switch(resultado){
            case 0://reposiciona 

                console.log("reposiciona");
                if(this.initialPos.x!=elem.x){
                    this.sound.play("hitErro");
                }

                x = this.posFora[elem.id][0];
                y = this.posFora[elem.id][1];
                console.log(x);
                console.log(y);
                elem.x = x;
                elem.y = y;

            break;
            case 1:// acertou 
                console.log("CORRETO");
                x = this.marca[pos].x-20;
                y = this.marca[pos].y-115;

                console.log(x);
                console.log(y);
                elem.x = x;
                elem.y = y;
                this.inputMovableNumbers(3,elem.id);  
                this.sound.play("hitAcerto");
                
                if(this.acertos>0){this.acertos--;  }   
                if(this.acertos==0){
                    this.inputMovableNumbers(2);//desabilitar o drag todos
                    this.createDelayTime(3000, function() {
                        if(this.currentLevel==1 && this.subNivel==0){
                            console.log("CORRETO l1");
                            this.subNivel++;
                            this.saveCorrect(50, false);
                            this.resetLevel(this.currentLevel);
                            this.createDelayTime(1500, function() {
                                    this.hideAndShowLevel(false);
                        });
                        }else{
                            console.log("CORRETO rightAnswer");
                            
                            this.createDelayTime(1500, function() {
                                    this.rightAnswer();
                            });
                        }
                    });
                }
            break;
            case 2:// errou 
                console.log("ERRADO");
                x = this.posFora[elem.id][0];
                y = this.posFora[elem.id][1];

                console.log(x);
                console.log(y);

                elem.x = x;
                elem.y = y;

                this.inputMovableNumbers(2);//desabilitar o drag todos
                this.sound.play("hitErro");
                this.createDelayTime(1500, function() {
                    this.wrongAnswer();
                });
            break;
        }
    },
    shuffle:function(array,tam) {
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

    createFormigas:function(){

        //this.drawPoint(11,100);
        //this.drawPoint(11,425);
        //this.drawPoint(995,100);
        //this.drawPoint(995,425);

        //this.drawLine(11,100,995,121);



        this.posFora = new Array([504,440],[641,439],[777,439]);
        this.formigas  = [];
        this.formigasFora  = [];
        this.marca = [];
        afastamento = 0;

        pos=0;
        it =0;
        guardaPos = [];

        for(i=this.numInicial; i<=this.numFinal; i++){
            
            x = this.posicaoX[it]+20;
            y = this.posicaoY[it]+115;

            x1 = this.posicaoX[it];
            y1 = this.posicaoY[it];
            
            if(i<10){afastamento=30;}else{afastamento=20;}

            if(i==this.item[0] || i==this.item[1]){
                this.marca[pos] = this.add.sprite(x, y, 'marca'); 
                this.groupLevel[this.currentLevel].add(this.marca[pos]); 
                this.marca[pos].name = i;
                this.marca[pos].alpha = 1;
                guardaPos.push(it);
                pos++;
            }else{
                this.formigas[i] = this.createAnimation(x1,y1, 'formiga', 1,1);   
                this.formigas[i].addChild(this.game.make.sprite(afastamento, 30, 'num_formigas',i));
                this.formigas[i].children[0].scale.set(0.8,0.8);
                this.formigas[i].name = i;
                this.groupLevel[this.currentLevel].add(this.formigas[i]);
            }

            it++;
        }

        console.log("-- botoes --");
        
        opcao  = [];

        this.temp_array = this.botoes.slice();
        this.retirarArrayElemento(this.item[0]);
        this.botoes = this.temp_array.slice();
        opcao.push(this.item[0]);
        count = 1;

        if(this.item[1]!=-1){
            this.temp_array = this.botoes.slice();
            this.retirarArrayElemento(this.item[0]);
            this.botoes = this.temp_array.slice();
            opcao.push(this.item[1]);
             count = 2;
        }

        rest = 3 - count;

        for(i=0; i<rest; i++){
            this.temp_array = this.botoes.slice();
            aux = this.sorteio();
            this.botoes = this.temp_array.slice();
            opcao.push(aux);
        }

        //console.log(opcao);
        btn = this.shuffle(opcao,3);
        //console.log(btn);

        for(pos=0; pos<btn.length; pos++){

            this.formigasFora[pos] = this.createAnimation(this.posFora[pos][0],this.posFora[pos][1], 'formiga', 1,1);
            this.formigasFora[pos].name = btn[pos];
            this.formigasFora[pos].id = pos;
            this.formigasFora[pos].addChild(this.game.make.sprite(afastamento, 30, 'num_formigas',btn[pos]));
            this.formigasFora[pos].children[0].scale.set(0.8,0.8);
            //this.formigasFora[pos].posicao = 
            this.formigasFora[pos].posicaoFora = pos;
            this.groupLevel[this.currentLevel].add(this.formigasFora[pos]);

        }
      
        this.createDelayTime(1000, function() {
            this.inputMovableNumbers(1);
        });
    },

    drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
    },

    drawLine:function(x,y,x1,y1){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.drawRect(x, y, 984, 340);
        graphics.endFill();
    },
    







    //------- AV2D5OA05--------------//
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        console.log("*** createScene ***");
        this.add.sprite(-698, -576, 'background');
        //this.currentLevel=2;
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        console.log("*** showLiveTutorial ***");

        
        this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        if(this.tutorial){
            this.createTutorial1();
        }
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        console.log("*** showFinishedLiveTutorial ***");
        if(this.tutorial){
             this.skipIntro();
        }
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 50, this.texto['imgResumo'], 22, "left");//this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        var tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['imgResumo2'], 22, "left");//this.add.sprite( this.world.centerX, 60, 'imgResumo2');
        tutorialText2.alpha = 0;
        //tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        var tutorialText3 = this.drawText(this.world.centerX, 20, this.texto['imgResumo3'], 22, "left");//this.add.sprite( this.world.centerX, 60, 'imgResumo3');
        tutorialText3.alpha = 0;
        //tutorialText3.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText3);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");


        var n1 = this.add.sprite(this.world.centerX-100, 160, "resumo4", 0, this.groupIntro);
        var n2 = this.add.sprite(this.world.centerX+100, 160, "resumo5", 0, this.groupIntro);

        var n3 = this.add.sprite(this.world.centerX-100, 160, "resumo5", 0, this.groupIntro);
        var n4 = this.add.sprite(this.world.centerX+100, 160, "resumo6", 0, this.groupIntro);


        n1.anchor.set(0.5,0.5); n1.scale.set(0.7,0.7); n1.alpha = 0;
        n2.anchor.set(0.5,0.5); n2.scale.set(0.7,0.7); n2.alpha = 0;
        n3.anchor.set(0.5,0.5); n3.scale.set(0.7,0.7); n3.alpha = 0;
        n4.anchor.set(0.5,0.5); n4.scale.set(0.7,0.7); n4.alpha = 0;

        

        // tempo para mostrar o tutorial das letras
        this.createDelayTime(16000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 100);

            this.add.tween(n1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 100);
            this.add.tween(n2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 100);
        });

        this.createDelayTime(18000, function() {
            this.add.tween(n2.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
        });
        this.createDelayTime(22000, function() {
            this.add.tween(n1.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
        });
        this.createDelayTime(29000, function() {
            this.add.tween(n3.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
        });
        this.createDelayTime(34000, function() {
            this.add.tween(n4.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true, 500, 0, true);
        });

         this.createDelayTime(28000, function() {
            this.add.tween(n1).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.add.tween(n2).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);

            this.add.tween(tutorialText2).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 100);

            this.add.tween(n3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 100);
            this.add.tween(n4).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 100);
        });

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(n3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(n4).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText3).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
    },

    /*
    Timer Audio: 18600 ms 815 386
    Timer Audio: 22100 ms 815 386
    Timer Audio: 29700 ms 818 386
    Timer Audio: 34600 ms 818 386
    */

    showNextLevel: function() {

        this.openLevel();

        //1-verifica level de 1 a maximo
       // modificada para este jogo 
        switch(this.currentLevel) {
            case 1:
                if(this.subNivel==0){
                     this.showQuestion(1);
                     som =  "soundP1"; 
                }else{
                     this.showQuestion(11);
                     som =  "soundP2"; 
                }
               
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play(som).onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundP3").onStop.add(this.initLevel2, this);
                    
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

    subNivel0:function(){
        console.log("*** subNivel0 **** ");
        this.posicaoX  = [223,325,429,526,624,725];
        this.posicaoY  = [251,262,263,256,235,209];

        this.acertos =1;

        this.numInicial = 1;
        this.numFinal = 5;
        
        

        if(this.nivelAnterior!=this.currentLevel){
            this.itens = [2,3,4];
        }

        this.itens.sort(function() {
          return .5 - Math.random();
        });

        this.botoes = [6,7,8,9,10,11,12,13,14,15];

        //console.log("*** itens **** ");
        //console.log(this.itens);

        this.item = [];
        this.temp_array = this.itens.slice();
        this.item[0] = this.sorteio();
        this.item = this.temp_array.slice();
        this.item[1] = -1;
        // antes
        antes = this.item[0]+1;
        this.levelNumero = antes.toString();
        //console.log(this.levelNumero);

    },

    subNivel1:function(){
        console.log("*** subNivel1 **** ");
        this.posicaoX  = [002,118,223,325,429,526,624,725,815,897];
        this.posicaoY  = [232,232,251,262,263,256,235,209,166,104];
        this.acertos =1;

        this.numInicial = 1;
        this.numFinal = 10;
        
        //if(this.nivelAnterior!=this.currentLevel){
            this.itens = [4,5,6,7,8,9];
        //}

        this.itens.sort(function() {
          return .5 - Math.random();
        });

        this.botoes = [11,12,13,14,15];

        //console.log("*** itens **** ");
        //console.log(this.itens);

        this.item = [];
        this.temp_array = this.itens.slice();
        this.item[0] = this.sorteio();
        this.item = this.temp_array.slice();
        this.item[1] = -1;
        //depois
        depois =this.item[0]-1
        this.levelNumero = depois.toString();
        //console.log(this.levelNumero);

    },


    initLevel1: function() {

        console.log("***Nivel 1**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();
        console.log("***Subnivel**** " + this.subNivel);

        if(this.subNivel==0){this.subNivel0();}
        if(this.subNivel==1){this.subNivel1();}
        this.sound.play(this.levelNumero);
        this.createFormigas();

    },

    

    initLevel2: function() {

        console.log("***Nivel 2**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();

        this.posicaoX  = [223,325,429,526,624,725];
        this.posicaoY  = [251,262,263,256,235,209];

        this.acertos =2;

        this.numInicial = 10;
        this.numFinal = 15;
        
        if(this.nivelAnterior!=this.currentLevel){
            this.itens = [11,12,13,14];
        }
        this.itens.sort(function() {
          return .5 - Math.random();
        });

        this.botoes = [16,17,18,19,20];

        //console.log("*** itens **** ");
        //console.log(this.itens);

        this.item = [];
        this.temp_array = this.itens.slice();
        aux = this.sorteio();
        this.item = this.temp_array.slice();
        
       
        //antes 
        antes =aux-1;
        this.item[0] = antes;
        //depois 
        depois =aux+1;
        this.item[1] = depois;
        
        this.levelNumero = aux.toString();
        //console.log(this.itens);
        //console.log(antes);
        //console.log(depois);
        //console.log(this.levelNumero);

        this.sound.play(this.levelNumero);
        this.createFormigas();
    },

    initLevel3: function() {

        console.log("***Nivel 3**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();

        this.posicaoX  = [002,118,223,325,429,526,624,725,815,897];
        this.posicaoY  = [232,232,251,262,263,256,235,209,166,104];

        this.acertos =2;

        this.numInicial = 11;
        this.numFinal = 20;
        
        if(this.nivelAnterior!=this.currentLevel){
            this.itens = [12,13,14,15,16,17,18];
        }
        this.itens.sort(function() {
          return .5 - Math.random();
        });

        this.botoes = [6,7,8,9,10];

        //console.log("*** itens **** ");
        //console.log(this.itens);

        this.item = [];
        this.temp_array = this.itens.slice();
        aux = this.sorteio();
        this.item = this.temp_array.slice();

        //aux = 19;
        
       
        //antes 
        antes =aux-1;
        this.item[0] = antes;
        //depois 
        depois =aux+1;
        this.item[1] = depois;
        
        this.levelNumero = aux.toString();
        //console.log(this.itens);
        //console.log(antes);
        //console.log(depois);
        //console.log(this.levelNumero);

        this.sound.play(this.levelNumero);
        this.createFormigas();

        
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
        //this.sound.play("hitAcerto");
        //this.showCallToAction = true;
        //this.addPoints();
        this.nivelAnterior = this.currentLevel;
        var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, this.gotoNextLevel); // para o próximo nível
        
        
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        var nivel=this.currentLevel;
        this.nivelAnterior = this.currentLevel;
        this.nivelAnterior = this.currentLevel;
        this.showCallToAction =false;
        
        if(this.currentLevel > 1) 
        {
            this.currentLevel--;
        }

        if(this.currentLevel==1 && this.subNivel==1) {
            this.subNivel =0;
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
            //this.showCallToAction = true;
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
