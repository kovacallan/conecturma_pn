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
        this.totalLevel1 = 2;
        this.totalLevel2 = 2;
        this.totalLevel3 = 1;

        this.lives = 3;
        this.wrongAnswers = 0;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.remainingQuestions = [0, 1, 2, 3, 4, 5, 6];

        this.rightCafe = null;

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
        var t1 = "Gente, o Cairu deu a ideia de fazer\num cafezinho, já que estamos num…\ncafezal!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Mas vejam só: o ser folclórico estragou\nalguns grãos de café que temos\nque separar pro nosso café\nnão ficar ruim!";
        var tutorialText2 = this.drawText(this.world.centerX, 35, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Ouvidos bem atentos, porque este\njogo depende de atenção, concentração\ne audição apurada!";
        var tutorialText3 = this.drawText(this.world.centerX, 45, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(7000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 7000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 7200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 7700);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 17000);

        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 17200);

        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 27000);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
        this.soundIntro.onStop.addOnce(function(){
            this.showFinishedLiveTutorial();
        }, this);
    },

    showFinishedLiveTutorial:function() {
        console.log("***tutorial end***");
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
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

        this.menino = this.add.sprite(885, 450, 'menino');
        this.menino.anchor.set(0.5, 0.5);
        frames = [];
        for(h = 0; h < 26; h++)
            frames.push(h);
        this.menino.animations.add('idle', frames, 18, true);

        frames = [];
        for(h = 26; h < 38; h++)
            frames.push(h);
        this.menino.animations.add('cheer', frames, 18, false);

        this.menino.animations.play('idle');


        this.cafeX = [320, 565];
        this.cafe1 = this.add.sprite(-400, 440, 'cafe');
        this.cafe1.anchor.set(0.5, 0.5);
        this.cafe1.events.onInputDown.add(this.mouseInputDown, this);

        this.cafe2 = this.add.sprite(-400, 440, 'cafe');
        this.cafe2.anchor.set(0.5, 0.5);
        this.cafe2.events.onInputDown.add(this.mouseInputDown, this);
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
        var t1 = "Repararam como todos os sons que eu fiz têm\num [R]? [B] com [R]: [BR], [C] com [R], [CR]! Quando o [R]\nse encontra com outras consoantes temos\n[sons diferentes] e que vão, pouco a pouco,\nconstruindo algumas de nossas [palavras],\nnosso [vocabulário]...";

        var tutorialText1 = this.drawText(this.world.centerX, 25, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 25000);

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

        this.menino.play('idle');

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
            case 4:
                this.initLevel4();
            break;
            case 5:
                this.initLevel5();
            break;
        }
    },
           
    initLevel1: function() {
        console.log("***init level 1***");        
        this.setupLevel();
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.setupLevel();
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.setupLevel();
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    initLevel4: function() {
        console.log("***init level 4***");        
        this.setupLevel();
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    initLevel5: function() {
        console.log("***init level 5***");        
        this.setupLevel();
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    setupLevel: function(level){        
        this.question = this.remainingQuestions.splice(this.game.rnd.integerInRange(0, this.remainingQuestions.length-1), 1)[0];
        console.log("***setup level "+this.question+"***");
        questionsAux = [0, 1, 2, 3, 4, 5, 6];
        questionsAux.splice(this.question, 1);

        rightFrame = this.question*3 + this.game.rnd.integerInRange(0,2);
        wrongFrame = questionsAux[this.game.rnd.integerInRange(0, questionsAux.length-1)]*3 + this.game.rnd.integerInRange(0,2);

        if(this.game.rnd.integerInRange(0,1) == 0){
            this.cafe1.frame = rightFrame;
            this.cafe2.frame = wrongFrame;
            this.rightCafe = this.cafe1;
        } else {
            this.cafe2.frame = rightFrame;
            this.cafe1.frame = wrongFrame;
            this.rightCafe = this.cafe2;
        }
        console.log("frames " +this.cafe1.frame+" "+this.cafe2.frame);
        console.log("rightCafe "+this.rightCafe.frame)
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.cafe1.alpha = 1;
        this.cafe2.alpha = 1;
        this.add.tween(this.cafe1).to({x: this.cafeX[0]}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.cafe2).to({x: this.cafeX[1]}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        this.add.tween(this.cafe1).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.cafe1.x = -400;
            this.cafe1.y = 440;
            this.cafe1.scale.set(1, 1);
        }, this);
        this.add.tween(this.cafe2).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.cafe2.x = -400;
            this.cafe2.y = 440;
            this.cafe2.scale.set(1, 1);
            if(callback != null)
                callback.call(this);
        }, this);
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem == this.rightCafe){
            this.sound.play("hitAcerto");
            this.menino.play('cheer');

            this.add.tween(elem).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true);
            bezierX = elem.x + (this.menino.x - elem.x)/2;
            bezierY = this.menino.y - 200;

            this.add.tween(elem.scale).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true)
            tween = this.add.tween(elem).to({x: [elem.x, bezierX, 800], y: [elem.y, bezierY, 495], alpha: 0}, 1000,Phaser.Easing.Quadratic.Out, true);
            tween.interpolation(function(v, k){return Phaser.Math.bezierInterpolation(v, k);});
            tween.onComplete.add(function(){
                this.clickRightButton();
            }, this);
        } else {
            this.sound.play("hitErro");
            this.clickWrongButton();
        }
    },

    clickRightButton: function(target) {
        console.log("***right!***");
        //this.onPlayerSuccess();

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
        this.wrongAnswers++;
        console.log("wrong answers "+this.wrongAnswers);
        this.lives--;
        switch(this.lives) {
            case 2: // mostra dica 1
                this.createDelayTime(500, function() {
                    this.sound.play("soundDica").onStop.add(function(){
                        this.resetLevel(this.gotoNextLevel);
                    }, this);
                });
            break;
            case 1: // mostra dica 1
                this.createDelayTime(500, function() {
                    this.sound.play("soundDica").onStop.add(function(){
                        this.resetLevel(this.gotoNextLevel);
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
        this.playAnswer(elem.frame, function(){
            this.checkGame(elem);
        });
    },

    toggleInput: function(flag){
        this.cafe1.inputEnabled = flag;
        this.cafe2.inputEnabled = flag;
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
            if(this.wrongAnswers < 2){
                this.listCorrects = [100, 100, 100];
                this.listCompleted = [true, true, true];
            } else if(this.wrongAnswers == 2){
                this.listCorrects = [100, 100, 0];
                this.listCompleted = [true, true, false];
            } else if(this.wrongAnswers > 2){
                this.listCorrects = [100, 0, 0];
                this.listCompleted = [true, false, false];
            }
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

    playQuestion: function(callback) {
        soundName1 = "soundP";
        sound1 = this.game.add.audio(soundName1);

        soundName2 = "soundP"+(this.question + 1);
        sound2 = this.game.add.audio(soundName2);

        sound1.onStop.addOnce(function(){
            sound2.play();
        }, this);
        sound2.onStop.addOnce(function(){
            callback.call(this);
        }, this);

        sound1.play();
    },

    playAnswer: function(frame, callback) {
        soundName1 = "soundA"+frame;
        sound1 = this.game.add.audio(soundName1);

        sound1.onStop.addOnce(function(){
            callback.call(this);
        }, this);

        sound1.play();
    }
};