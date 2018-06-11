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

        this.rightFrase = null;

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
        var t1 = "Quase tudo pronto, gente! Agora para\natrair o ser folclórico misterioso\nprecisamos de três [canções]!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Assim: se eu tenho essas duas opções,\n escutando essa daqui eu tenho…\n[\"papagaio come milho e periquito leva a fama\"],";
        var tutorialText2 = this.drawText(this.world.centerX, 45, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "já se eu escuto essa…\n[\"Se a canoa não virar, olê, olê olá… eu chego lá!\"].\n Qual é uma [canção]? Essa\n daqui, certo? Escolho e pronto!";
        var tutorialText3 = this.drawText(this.world.centerX, 25, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(9000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 9000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 9200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 9700);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 20000);

        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 20200);

        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 36000);

        this.setupLevel(0);
        this.createDelayTime(12000, function(){
            this.showLevel();
        });

        this.createDelayTime(14000, this.showLiveTutorial);

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

        if(this.frases1 == this.rightFrase)
            wrongFrase = this.frases2;
        else
            wrongFrase = this.frases1;

        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: this.rightFrase.x, y: this.rightFrase.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                    this.add.tween(this.arrowGroup).to({x: wrongFrase.x, y: wrongFrase.y}, 1000, Phaser.Easing.Linear.None, true, 3500).onComplete.add(function(){
                            this.createDelayTime(12500, function(){
                                this.click.animations.play('click', 30, false);
                                bezierX = wrongFrase.x + (this.caldeirao.x - wrongFrase.x)/2;
                                bezierY = this.caldeirao.y - 200;
                                this.add.tween(wrongFrase.scale).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true)
                                tween = this.add.tween(wrongFrase).to({x: [wrongFrase.x, bezierX, this.caldeirao.x], y: [wrongFrase.y, bezierY, this.caldeirao.y - 50], alpha: 0}, 1000,Phaser.Easing.Quadratic.Out, true);
                                tween.interpolation(function(v, k){return Phaser.Math.bezierInterpolation(v, k);});
                            });
                        }, this);
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

        this.menina = this.add.sprite(95, 455, 'menina');
        this.menina.anchor.set(0.5, 0.5);
        frames = [];
        for(h = 0; h < 27; h++)
            frames.push(h);
        this.menina.animations.add('idle', frames, 18, true);

        frames = [];
        for(h = 27; h < 45; h++)
            frames.push(h);
        this.menina.animations.add('cheer', frames, 18, false);

        this.menina.animations.play('idle');

        this.caldeirao = this.add.sprite(842, 450, 'caldeirao');
        this.caldeirao.animations.add('idle', null, 18, true);
        this.caldeirao.anchor.set(0.5, 0.5);
        this.caldeirao.scale.set(0.9, 0.9);
        this.caldeirao.animations.play('idle');

        this.frasesX = [325, 620];

        this.frases1 = this.add.sprite(-400, 490, 'frases');
        this.frases1.anchor.set(0.5, 0.5);
        this.frases1.events.onInputDown.add(this.mouseInputDown, this);

        this.frases2 = this.add.sprite(-400, 490, 'frases');
        this.frases2.anchor.set(0.5, 0.5);
        this.frases2.events.onInputDown.add(this.mouseInputDown, this);
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
        var t1 = "As [parlendas] ficam na nossa cabeça\nquase como uma [canção], mas se prestar\natenção elas não são não. Nossa! Rimou! \nVamos recomeçar e não vamos cair na\narmadilha de confundir uma com a outra.";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 19000);

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

        this.menina.play('idle');
        this.menina.play('idle');

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
        this.setupLevel(1);
        this.playQuestion(1, function(){
            this.showLevel();
        }, function(){
            this.toggleInput(true);
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.setupLevel(2);
        this.playQuestion(2, function(){
            this.showLevel();
        }, function(){
            this.toggleInput(true);
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.setupLevel(3);
        this.playQuestion(3, function(){
            this.showLevel();
        }, function(){
            this.toggleInput(true);
        });
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");
        
        switch(level){
            case 0:
                this.question = 9;
                break;
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
            this.frases1.frame = this.question*2;
            this.frases2.frame = this.question*2+1;
            this.rightFrase = this.frases1;
        } else {
            this.frases2.frame = this.question*2;
            this.frases1.frame = this.question*2+1;
            this.rightFrase = this.frases2;
        }
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.frases1.alpha = 1;
        this.frases2.alpha = 1;
        this.add.tween(this.frases1).to({x: this.frasesX[0]}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.frases2).to({x: this.frasesX[1]}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        this.add.tween(this.frases1).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.frases1.x = -400;
            this.frases1.y = 490;
            this.frases1.scale.set(1, 1);
        }, this);
        this.add.tween(this.frases2).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.frases2.x = -400;
            this.frases2.y = 490;
            this.frases2.scale.set(1, 1);
            if(callback != null)
                callback.call(this);
        }, this);
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem == this.rightFrase){
            this.sound.play("hitAcerto");
            this.menina.play('cheer');

            this.add.tween(elem).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true);
            bezierX = elem.x + (this.caldeirao.x - elem.x)/2;
            bezierY = this.caldeirao.y - 200;

            this.add.tween(elem.scale).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true)
            tween = this.add.tween(elem).to({x: [elem.x, bezierX, this.caldeirao.x], y: [elem.y, bezierY, this.caldeirao.y - 50], alpha: 0}, 1000,Phaser.Easing.Quadratic.Out, true);
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
        this.checkGame(elem);        
    },

    toggleInput: function(flag){
        this.frases1.inputEnabled = flag;
        this.frases2.inputEnabled = flag;
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

    playQuestion: function(level, callback1, callback2) {
        soundName1 = "soundP"+level;
        sound1 = this.game.add.audio(soundName1);
        
        if(this.rightFrase == this.frases1){
            soundName2 = "soundP"+level+"_";
            soundName2 += "C_"+(this.question - 3*(level-1) + 1);
            soundName3 = "soundP"+level+"_";
            soundName3 += "P_"+(this.question - 3*(level-1) + 1);
        } else {
            soundName2 = "soundP"+level+"_";
            soundName2 += "P_"+(this.question - 3*(level-1) + 1);
            soundName3 = "soundP"+level+"_";
            soundName3 += "C_"+(this.question - 3*(level-1) + 1);
        }

        
        sound2 = this.game.add.audio(soundName2);
        sound3 = this.game.add.audio(soundName3);

        sound1.onStop.addOnce(function(){
            sound2.play();
            if(callback1 != null)
                callback1.call(this);
        }, this);
        sound2.onStop.addOnce(function(){
            sound3.play();
        }, this);
        sound3.onStop.addOnce(function(){
            if(callback2 != null)
                callback2.call(this);
        }, this);

        sound1.play();
    }
};