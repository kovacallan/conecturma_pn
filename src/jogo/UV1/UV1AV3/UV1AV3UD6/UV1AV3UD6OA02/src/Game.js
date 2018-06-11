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

        this.answers = [6, 6, 8, 11, 14, 12, 3, 3, 4];

        this.answerNumber = -1;

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
        var t1 = "Para entender de fábulas\nprecisamos testar nosso\nconhecimento na hora de\nler uma frase.";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "A cada rodada teremos que responder uma\npergunta, como essa: [Quantas palavras]\n[existem nessa frase?] Simples, [5]!\nÉ com a gente!";
        var tutorialText2 = this.drawText(this.world.centerX, 40, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(6500);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 6500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 6700);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 7200);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 21000);

        this.setupLevel(0);

        this.createDelayTime(11000, this.showLevel);        

        this.createDelayTime(16000, this.showLiveTutorial);

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
            this.add.tween(this.arrowGroup).to({x: this.teclas[5].x, y: this.teclas[5].y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                    this.game.world.bringToTop(this.arrowGroup);
                    this.click.animations.play('click', 30, false);
                    this.telaText.setText("5");
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

        this.menino = this.add.sprite(185, 520, 'menino');
        this.menino.anchor.set(0.5, 1);
        frames = [];
        for(h = 0; h < 16; h++)
            frames.push(h);
        this.menino.animations.add('idle', frames, 18, true);

        frames = [];
        for(h = 16; h < 33; h++)
            frames.push(h);
        this.menino.animations.add('cheer', frames, 18, true);

        this.menino.animations.play('idle');

        this.frases = this.add.sprite(280, 650, 'frases');
        this.frases.anchor.set(0, 0);

        this.teclas = [];

        x = 737;
        y = 253;
        for (var i = 0; i <= 9; i++) {
            tecla = this.add.group();
            tecla.alpha = 0;
            if(i == 0){
                tecla.x = 822;
                tecla.y = 508;
            } else {
                tecla.x = x;
                tecla.y = y;
                x += 85;
                if((i)%3 == 0){
                    y += 85;
                    x = 737;
                }
            }
            teclaSprite = this.add.sprite(0, 0, 'tecla');
            teclaSprite.anchor.set(0, 0);
            tecla.add(teclaSprite);

            teclaText = this.add.bitmapText(42, 30, "lucky-64", (i).toString(), 64);
            teclaText.anchor.set(0.5, 0.5);
            teclaText.tint = 0x333333;
            tecla.add(teclaText);

            hitArea = this.add.sprite(0, 0, 'tecla');
            hitArea.anchor.setTo(0, 0);
            hitArea.width = 84;
            hitArea.height = 84;
            hitArea.alpha = 0;
            hitArea.events.onInputDown.add(this.mouseInputDown, this);
            tecla.add(hitArea);

            this.teclas.push(tecla);
        }

        //this.tela = this.add.sprite(60, 650, 'tela');
        //this.tela.anchor.set(0, 0);

        this.telaText = this.add.bitmapText(180, 475, "lucky-64", '', 100);
        this.telaText.anchor.set(0.5, 0.5);
        this.telaText.tint = 0x000000;
        
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
        var t1 = "Para responder corretamente temos que\nentender o que é o que na frase.\nSaber o que é uma [pontuação], uma\n[palavra] e um [espaço]. Depois é\nsó contar o que foi pedido. Vamos lá?";

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
        }
    },
           
    initLevel1: function() {
        console.log("***init level 1***");        
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(function(){
            this.toggleInput(true);
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(function(){
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


        this.frases.frame = this.question;
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.frases.alpha = 1;
        this.add.tween(this.frases).to({y: 209}, 1000, Phaser.Easing.Linear.None, true);
        //this.add.tween(this.tela).to({y: 418}, 1200, Phaser.Easing.Linear.None, true, 1000);
        this.add.tween(this.telaText).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true, 1500);
        delay = 1000;
        for (var i = 0; i < this.teclas.length; i++) {
            tecla = this.teclas[i];
            tween = this.add.tween(tecla).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true, delay);
            if(i == this.teclas.length - 1)
                tween.onComplete.add(function(){
                    if(callback != null)
                        callback.call(this);
                }, this);
            delay += 100;
        };

        console.log("----->>resposa correta "+ this.answers[this.question])
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        this.answerNumber = -1;
        this.telaText.setText("");
        this.add.tween(this.frases).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.frases.y = 650;
        }, this);
        //this.add.tween(this.tela).to({y: 650}, 1000, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(this.telaText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        delay = 100;
        for (var i = 0; i < this.teclas.length; i++) {
            tecla = this.teclas[i];
            tween = this.add.tween(tecla).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, delay);
            if(i == this.teclas.length - 1)
                tween.onComplete.add(function(){
                    if(callback != null)
                        callback.call(this);
                }, this);
            delay += 50;
        };
    }, 

    checkGame:function(elem){
        console.log("***checkGame***");
        console.log(this.answerNumber + " == " + this.answers[this.question]);
        if(this.answerNumber == this.answers[this.question]){
            this.sound.play("hitAcerto");
            this.menino.play('cheer');
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
                    if(!this.timedError)
                        this.sound.play("soundDica").onStop.add(function(){
                            this.resetLevel(this.onCompleteShowDica);
                        }, this);
                    else
                        this.createDelayTime(500, this.onCompleteShowDica);
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

    mouseInputDown:function(elem){
        console.log("***mouseInputDown***");
        number = this.teclas.indexOf(elem.parent);
        if(this.answerNumber >= 0){
            this.answerNumber*= 10;
            this.answerNumber += number;
            this.telaText.setText(this.answerNumber+"");
            this.stopTime();
        } else {
            this.answerNumber = number;
            this.telaText.setText(this.answerNumber+"");
            this.relogioTimer = this.game.time.events.add(4000, this.stopTime, this);
        }
    },

    stopTime: function(){
        console.log("***time's up!***");
        this.toggleInput(false);
        this.game.time.events.remove(this.relogioTimer);
        this.relogioTimer = null;
        this.checkGame();
    },

    toggleInput: function(flag){
        for (var i = 0; i < this.teclas.length; i++) {
            this.teclas[i].children[2].inputEnabled = flag;
        };
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

    playQuestion: function(callback){
        soundName1 = "soundP";
        soundName1 += Math.ceil((this.question+1)/3);
        sound1 = this.game.add.audio(soundName1);

        soundName2 = "soundP";
        soundName2 += Math.ceil((this.question+1)/3)+"_";
        soundName2 += this.question;
        sound2 = this.game.add.audio(soundName2);

        sound1.onStop.addOnce(function(){
            this.createDelayTime(800, function(){
                sound2.play();
            });
        }, this);

        sound2.onStop.addOnce(function(){
            if(callback != null)
                callback.call(this);
        }, this);

        sound1.play();
    }
};