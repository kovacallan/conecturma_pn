BasicGame.Game = function (game) {
    this.initExtends();
    BasicGame.GameBase.call(game);
};

BasicGame.Game.prototype = Object.create(BasicGame.GameBase.prototype);
BasicGame.Game.prototype.constructor = BasicGame.Game;

BasicGame.Game.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Game.prototype[name] = this.extends[name];
    }
};

BasicGame.Game.prototype.extends = {

    create: function () {

        this.initGlobal();         

        this.TEMPO_INTRO = 34500;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 1;
        this.totalLevel2 = 1;
        this.totalLevel3 = 1;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.remainingQuestions1 = [0, 1, 2];
        this.remainingQuestions2 = [3, 4, 5];
        this.remainingQuestions3 = [6, 7, 8];

        this.rightPlaca = null;

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

    },

    showIntro: function() {
        console.log("***show intro***");
        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro = this.add.group();

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },


    showTextoIntro: function() {
        var t1 = "Gente, o Dudu queria mostrar pro Fred\numa planta muito importante aqui no\nnordeste! Mas ele se esqueceu do\nnome dela - culpa do ser folclórico\nque faz a gente esquecer as coisas!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Mas descobri que se conseguirmos acertar\n que [palavra com G] tem o [som do J]- o [J] que\n escutamos em [Já], [Jujuba], [Janela],\nsabem? - essa planta vai aparecer!";
        var tutorialText2 = this.drawText(this.world.centerX, 30, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(16500);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 16500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 16700);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 17200);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 33000);

        this.setupLevel(1);
        this.createDelayTime(23000, function(){
            this.add.tween(this.placas1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.placas2).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(30000, this.showLiveTutorial);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
        this.soundIntro.onStop.addOnce(function(){
            this.showFinishedLiveTutorial();
        }, this);
    },

    showLiveTutorial: function() {
        console.log("*** tutorial start ***");

        aux = 500;
        auy = 300;
        
        this.arrowGroup = this.game.add.group();
        this.arrowGroup.alpha =0;
        this.arrowGroup.x = aux;
        this.arrowGroup.y = auy;
        this.click = this.add.sprite(0, 0, 'clickAnimation');
        this.arrow = this.add.sprite(0, 0, 'arrow');
        this.click.animations.add('click');
        this.arrowGroup.add(this.arrow);
        this.arrowGroup.add(this.click);

        this.game.world.bringToTop(this.arrowGroup);

        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: this.rightPlaca.x, y: this.rightPlaca.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                    this.game.world.bringToTop(this.arrowGroup);
                    this.click.animations.play('click', 30, false);
            }, this);
        }, this);
    },    

    showFinishedLiveTutorial:function() {
        console.log("***tutorial end***");
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.arrowGroup).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialPlacar).to({y: -300}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    initGame: function() {
        console.log("***init game***");
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        if(this.arrowGroup != null) {
            this.arrowGroup.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.resetLevel(this.showNextLevel);
    },

    createScene: function() {
        console.log("***create scene***");
        this.background = this.add.sprite(0, 0, 'background');

        this.palma = this.add.sprite(875, 400, 'palma');
        this.palma.anchor.set(0.5, 1);
        this.palma.animations.add('idle', null, 18, true);
        this.palma.play('idle');

        this.placas1 = this.add.sprite(385, 450, 'placas');
        this.placas1.anchor.set(0.5, 0.5);
        this.placas1.alpha = 0;
        this.placas1.events.onInputDown.add(this.mouseInputDown, this);

        this.placas2 = this.add.sprite(680, 450, 'placas');
        this.placas2.anchor.set(0.5, 0.5);
        this.placas2.alpha = 0;
        this.placas2.events.onInputDown.add(this.mouseInputDown, this);

        this.menino = this.add.sprite(80, 500, 'menino');
        this.menino.anchor.set(0, 1);
        frames = [];
        for(h = 0; h < 24; h++)
            frames.push(h);
        this.menino.animations.add('idle', frames, 18, true);

        frames = [];
        for(h = 24; h < 49; h++)
            frames.push(h);
        cheer = this.menino.animations.add('cheer', frames, 18, false);
        cheer.onComplete.add(function(){
            this.menino.animations.play('idle');
        }, this);

        this.menino.animations.play('idle');
    },    

    showResumo: function() {
        console.log("***show resumo***");
        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);
        this.groupIntro = this.add.group();
        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);
        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    showTextResumo: function() {
        var t1 = "Devemos clicar somente nas [palavras]\n onde o [G] tenha o mesmo som do [J]! ";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 7000);

        this.soundResumo = this.sound.play("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
            this.hideResumo();
        }, this);
    },

    showNextLevel: function() {
        console.log("***showNextLevel***");

        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
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
    },
           
    initLevel1: function() {
        console.log("***init level 1***");   
        this.level = 1;     
        this.setupLevel(1);
        this.playQuestion(function(){
            this.showLevel();
            this.toggleInput(true);
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.level = 2;
        this.setupLevel(2);
        this.playQuestion(function(){
            this.showLevel();
            this.toggleInput(true);
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.level = 3;
        this.setupLevel(3);
        this.playQuestion(function(){
            this.showLevel();
            this.toggleInput(true);
        });
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");
        
        switch(level){
            case 1:
                this.question = this.remainingQuestions1.splice(this.game.rnd.integerInRange(0, this.remainingQuestions1.length-1), 1)[0];
                break; 
            case 2:
                this.question = this.remainingQuestions2.splice(this.game.rnd.integerInRange(0, this.remainingQuestions2.length-1), 1)[0];
                break; 
            case 3:
                this.question = this.remainingQuestions3.splice(this.game.rnd.integerInRange(0, this.remainingQuestions3.length-1), 1)[0];
                break; 
        }


        if(this.game.rnd.integerInRange(0,1) == 0){
            this.placas1.frame = this.question*2;
            this.placas2.frame = this.question*2+1;
            this.rightPlaca = this.placas1;
        } else {
            this.placas2.frame = this.question*2;
            this.placas1.frame = this.question*2+1;
            this.rightPlaca = this.placas2;
        }
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.add.tween(this.placas1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placas2).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        this.add.tween(this.placas1).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placas2).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem == this.rightPlaca){
            this.sound.play("hitAcerto");
            this.menino.animations.play('cheer');
            this.createDelayTime(1000, this.clickRightButton);
        } else {
            this.sound.play("hitErro");
            this.clickWrongButton();
        }
    },

    clickRightButton: function(target) {
        console.log("***right!***");
        this.onPlayerSuccess();

        this.resetLevel(function(){
            this.gotoNextLevel();
        });
    },

    clickWrongButton: function(target) {
        console.log("***wrong!***");
        if(this.currentLocalErrors > 0) {
            this.currentLocalErrors--;
            return;
        }            
        this.onPlayerError();
        switch(this.lives) {
            case 1: // mostra dica 1
                this.createDelayTime(500, function() {
                    this.sound.play("soundDica").onStop.add(function(){
                        this.resetLevel(this.onCompleteShowDica);
                    }, this);
                }); 
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.createDelayTime(500, function() {
                    this.showResumo(); 
                });
            break;
        }
        this.updateLivesText();
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.toggleInput(false);
        this.playAnswer(elem, function(){
            this.checkGame(elem);
        });
    },

    toggleInput: function(flag){
        this.placas1.inputEnabled = flag;
        this.placas2.inputEnabled = flag;
    },

    playQuestion: function(callback){
        soundName = "soundP"+this.level;
        sound = this.sound.play(soundName);
        sound.onStop.addOnce(function(){
            if(callback != null)
                callback.call(this)
        }, this);
    },

    playAnswer: function(elem, callback){
        soundName = "soundP"+this.level+"_"+(elem.frame);
        sound = this.sound.play(soundName);
        console.log('playing '+soundName);
        if(callback != null)
            sound.onStop.addOnce(function(){
                callback.call(this);
            }, this);
    },

    hideAndShowLevel: function() {
        if(this.currentLevel <= 3) {
            if(this.ENABLE_PLACAR){
                this.createDelayTime(1000, function() {
                    this.showNextLevel();
                });
            }else{
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
            }            
        } else {
            this.gameOverMacaco();
        }
    },

    gotoNextLevel: function() {
        this.currentLocalLevel++;
        if(this.currentLocalLevel >= this["totalLevel" + this.currentLevel]) {
            this.currentLevel++;
            this.currentLocalLevel = 0;
            this.currentLocalErrors = this["totalErro" + this.currentLevel];
        }
        this.hideAndShowLevel();
    },
};