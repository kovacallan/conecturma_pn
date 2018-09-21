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

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

        this.remainingQuestions1 = [0, 1, 2];
        this.remainingQuestions2 = [3, 4, 4];
        this.remainingQuestions3 = [6, 7, 8];

        this.answers = [1, 0, 1, 1, 1, 0, 0, 0, 1];
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
        var t1 = "Ah, um animal surpresa vai ajudar\n vocês a encontrar o folclórico danado!\n Mas só vou revelar quem é\n depois que vocês me responderem\n algumas perguntas sobre [fábulas]!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Uma [Fábula], gente, é uma história que pode\n ter qualquer animal agindo como gente, e\n normalmente ensinam uma [lição] bonita. \nSão curtinhas, e podemos inventar as nossas!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(14000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 14000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 14200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 14700);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 30000);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
        this.soundIntro.onStop.addOnce(this.showFinishedLiveTutorial, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** tutorial start ***");

        aux = 370;
        auy = 220;
        
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
        
        nuvem1 = null;
        nuvem2 = null;
        for(i = 0; i < this.nuvensSprites.length; i++){
            if(this.nuvensSprites[i].frame == 0)
                nuvem1 = this.nuvensSprites[i];
            else if (this.nuvensSprites[i].frame == 1)
                nuvem2 = this.nuvensSprites[i];
        }

        //aparece
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true, 10000).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: nuvem1.x , y:  nuvem1.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                this.click.animations.play('click', 30, false);
                this.add.tween(this.arrowGroup).to({x: 420 , y:  this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(nuvem1).to({x: 420 , y:  this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.add.tween(this.arrowGroup).to({x: nuvem2.x , y:  nuvem2.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                                this.click.animations.play('click', 30, false);
                                this.add.tween(this.arrowGroup).to({x: 600 , y: this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true);
                                this.add.tween(nuvem2).to({x: 600 , y:  this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                        for(i = 0; i < this.chuvaSprites.length; i++){
                                            this.chuvaSprites[i].animations.play('rain', 18, true);
                                            this.chuvaSprites[i].alpha = 1;
                                        }
                                }, this);
                        }, this);
                }, this);

            }, this);
        }, this);
    },    

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
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

        groupFabula = this.add.group();

        var sound = this.game.add.audio('soundFabula');
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);
        groupFabula.add(this.placar);
        this.add.tween(this.placar).to({y: -70}, 1000, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            sound.play();
        }, this);
        
        var t1 = "Essa é clássica: [Era uma vez um coelho e uma]\n [tartaruga. Os dois apostaram uma corrida.]\n [O coelho achava que era tão mais rápido]\n [que antes da linha de chegada]\n[parou pra tirar um cochilo…]\n";

        var tutorialText1 = this.drawText(this.world.centerX, 25, t1, 21, "center");
        tutorialText1.alpha = 0;
        groupFabula.add(tutorialText1);

        var t2 = "[devagar e sempre, a tartaruga passou o coelho]\n [e venceu! Moral da história: [Não devemos nos achar] \n[os melhores, devemos sempre dar nosso melhor!]";

        var tutorialText2 = this.drawText(this.world.centerX, 50, t2, 21, "center");
        tutorialText2.alpha = 0;
        groupFabula.add(tutorialText2);
        
        sound.onPlay.add(function(){
            this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
            this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 17000);
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 17200);
            this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 32000).onComplete.add(function(){
                    groupFabula.removeAll(true);
                    this.showNextLevel();
            }, this);

            this.story.frame = 0;
            this.add.tween(this.story).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.story).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 6200).onComplete.add(function(){
                        this.story.frame = 1;
                        this.add.tween(this.story).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                this.add.tween(this.story).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 6200).onComplete.add(function(){
                                    this.story.frame = 2;
                                    this.add.tween(this.story).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                            this.add.tween(this.story).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 6200).onComplete.add(function(){
                                                this.story.frame = 3;
                                                this.add.tween(this.story).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                                        this.add.tween(this.story).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 6200).onComplete.add(function(){
                                                            this.story.frame = 4;
                                                            this.add.tween(this.story).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                                                    this.add.tween(this.story).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 6000);
                                                            }, this);
                                                        }, this);
                                                }, this);
                                            }, this);
                                    }, this);
                                }, this);
                        }, this);
                    }, this);
            }, this);
        }, this);
    },

    createScene: function() {
        console.log("***create scene***");
        this.background = this.add.sprite(0, 0, 'background');

        this.questionsPanel = this.add.sprite(500, 230, 'questions');
        this.questionsPanel.anchor.set(0.5, 0.5);
        this.questionsPanel.alpha = 0;

        this.sim = this.add.sprite(330, 440, 'sim');
        this.sim.anchor.set(0.5, 0.5);
        this.sim.animations.add('idle', null, 18, true);
        this.sim.animations.play('idle');
        this.sim.events.onInputDown.add(this.mouseInputDownSim, this);
        this.sim.alpha = 0;

        this.nao = this.add.sprite(700, 440, 'nao');
        this.nao.anchor.set(0.5, 0.5);
        this.nao.animations.add('idle', null, 18, true);
        this.nao.animations.play('idle');
        this.nao.events.onInputDown.add(this.mouseInputDownNao, this);
        this.nao.alpha = 0;

        this.relogio = this.add.sprite(890, 115, 'relogio');
        this.relogio.anchor.set(0.5, 0.5);
        this.relogio.animations.add('time', null, null, false);
        this.relogio.alpha = 0;

        this.story = this.add.sprite(500, 385, 'story');
        this.story.anchor.set(0.5, 0.5);
        this.story.alpha = 0;
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
        var t1 = "Escutaram direitinho a história do\n [Coelho e da Tartaruga?] Se sim, já sabemos que\n devemos sempre dar nosso melhor! [Fábulas]\n são [mágicas], com [bichos], \n [histórias], [lições…] vamos outra vez!";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 16000);

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
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions1.length-1);
        this.question = this.remainingQuestions1.splice(questionRandom, 1)[0];
        this.playQuestion(this.question, function() {
            this.toggleInput(true);
            this.startTimer(10);
        });
        this.setupLevel(this.question);
        this.showLevel();
    },

    initLevel2: function() {
        console.log("***init level 2***");
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions2.length-1);
        ///questionRandom = 4;
        

        this.question = this.remainingQuestions2.splice(questionRandom, 1)[0];


        this.playQuestion(this.question, function() {
            this.toggleInput(true);
            this.startTimer(8);
        });
        this.setupLevel(this.question);
        this.showLevel();
    },

    initLevel3: function() {
        console.log("***init level 3***");
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions3.length-1);
        this.question = this.remainingQuestions3.splice(questionRandom, 1)[0];
        this.playQuestion(this.question, function() {
            this.toggleInput(true);
            this.startTimer(6);
        });
        this.setupLevel(this.question);
        this.showLevel();
    },

    setupLevel: function(question){
        console.log("***setup question "+question+"***");
        this.questionsPanel.frame = question;
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.add.tween(this.questionsPanel).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.sim).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.relogio).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 1000);
        this.add.tween(this.nao).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        this.add.tween(this.questionsPanel).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.sim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.relogio).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                this.relogio.frame = 0;
        }, this);
        this.add.tween(this.nao).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    checkGame:function(answer){
        console.log("***checkGame***");

        if(answer == this.answers[this.question]){
            this.sound.play("hitAcerto");
            this.clickRightButton();
        } else {
            this.sound.play("hitErro");
            this.clickWrongButton();
        }
    },

    clickRightButton: function() {
        console.log("***right!***");
        this.onPlayerSuccess();

        this.resetLevel(function(){
            this.gotoNextLevel();
        });
    },

    clickWrongButton: function() {
        console.log("***wrong!***");
        this.resetLevel(function(){
            if(this.currentLocalErrors > 0) {
                this.currentLocalErrors--;
                return;
            }            
            this.onPlayerError();
            switch(this.lives) {
                case 1: // mostra dica 1
                    this.createDelayTime(500, function() {
                        this.sound.play("soundDica").onStop.add(function(){
                            this.createDelayTime(1500, this.onCompleteShowDica);
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
        });
    },

    playQuestion: function(question, callback){
        console.log("***play question***");
        soundName = "soundP";
        soundName += Math.ceil((question+1)/3);

        sound = this.sound.play(soundName);
        sound.onStop.addOnce(function(){
            soundName += "_"+(question - (Math.ceil((question+1)/3)-1)*3 + 1);
            sound = this.sound.play(soundName);
            if(callback != null)
                sound.onStop.addOnce(function(){
                    callback.call(this);
                }, this);
        }, this);

        console.log("playing ", soundName);
    },

    mouseInputDownSim: function (elem) {
        this.game.time.events.remove(this.relogioTimer);
        this.relogioTimer = null;
        this.relogio.animations.stop('time');
        this.toggleInput(false);
        this.checkGame(1);
    },

    mouseInputDownNao: function (elem) {
        this.game.time.events.remove(this.relogioTimer);
        this.relogioTimer = null;
        this.relogio.animations.stop('time');
        this.toggleInput(false);
        this.checkGame(0);
    },

    toggleInput: function(flag){
        this.sim.inputEnabled = flag;
        this.nao.inputEnabled = flag;
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

    startTimer: function(time) {
        this.relogioTimer = this.game.time.events.add(time*1000, this.stopTimer, this);
        this.relogio.play('time', 95/time, false);
    },

    stopTimer: function(e) {
        this.toggleInput(false);
        this.game.time.events.remove(this.relogioTimer);
        this.relogioTimer = null;
        this.sound.play("hitErro");
        this.clickWrongButton();
    }
};