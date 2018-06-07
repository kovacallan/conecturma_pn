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
        this.totalLevel1 = 3;
        this.totalLevel2 = 3;
        this.totalLevel3 = 3;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.wrongAnswers = 0;


        this.guaranasPositions = [
            [878, 380],
            [507, 403],
            [705, 428]
        ];

        this.remainingQuestions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        this.rightguarana = null;

        this.relogioTimer = null;

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

    },
    
    createScene: function() {
        console.log("***create scene***");
        this.background = this.add.sprite(0, 0, 'background');

        this.guaranas = [];
        for (var i = 0; i < 3; i++) {
            guaranaSprite = this.add.sprite(500, 300, 'guarana');
            guaranaSprite.anchor.set(0.5, 0.5);
            guaranaSprite.animations.add('glow', null, 18, false);

            guaranaText = this.add.bitmapText(0, 10, "lucky-numbers", '', 96);
            guaranaText.anchor.set(0.5, 0.5);
            guaranaText.tint = 0xffffff;
            guaranaSprite.addChild(guaranaText);

            guaranaSprite.inputEnabled = true;
            guaranaSprite.events.onInputDown.add(this.mouseInputDown, this);
            guaranaSprite.alpha = 0;
            this.guaranas.push(guaranaSprite);
        };
        this.toggleInput(false);

        this.numberTypeText = this.add.bitmapText(200, 290, "lucky-32-shadow", '', 32);
        this.numberTypeText.angle = '+5';
        this.numberTypeText.anchor.set(0.5, 0.5);
        this.numberTypeText.tint = 0xffffff;
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
        var t1 = "A Ana juntou um montão de guaranás\npra acertarmos no Mapinguari, quem\nsabe assim ele não cai do cubo de gelo\ne podemos resgatar nossos amigos? \nPara arremessarmos é fácil:";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Existem números [naturais], como\nestes… ou [decimais], como estes aqui,\ncom vírgulas… e os [ordinais], como\nprimeiro, segundo, terceiro… ";
        var tutorialText2 = this.drawText(this.world.centerX, 40, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Olhem o que a placa da Ana tá pedindo,\nescolham o número correto e, bum!\nAcertamos guaranás no Mapinguari!";
        var tutorialText3 = this.drawText(this.world.centerX, 30, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(15000);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 15000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 15200);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 15700);

        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 29000);

        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 29200);

        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 41000);

        this.createDelayTime(16000, this.showLevel);

        this.createDelayTime(16500, this.showLiveTutorial);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
        this.soundIntro.onStop.addOnce(function(){
            this.showFinishedLiveTutorial();
        }, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function(delay) {
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

        this.guaranas[0].children[0].setText('5');
        this.guaranas[1].children[0].setText('5,0');
        this.guaranas[2].children[0].setText('5º');
        this.numberTypeText.setText('NÚMERO\nNATURAL');
        
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.arrowGroup).to({x: this.guaranas[0].x, y: this.guaranas[0].y}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: this.guaranas[1].x, y: this.guaranas[1].y}, 1000, Phaser.Easing.Linear.None, true, 3000).onComplete.add(function(){
                this.add.tween(this.arrowGroup).to({x: this.guaranas[2].x, y: this.guaranas[2].y}, 1000, Phaser.Easing.Linear.None, true, 4000).onComplete.add(function(){
                    this.add.tween(this.arrowGroup).to({x: this.guaranas[0].x, y: this.guaranas[0].y}, 1000, Phaser.Easing.Linear.None, true, 8000).onComplete.add(function(){
                        this.click.animations.play('click', 30, false);
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

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.resetLevel(this.showNextLevel);
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
        var t1 = "Todo tipo de número pode ser encontrado\npor aí. Os [naturais] estão em todo lugar,\nplacas de carro, telefones… os [decimais] estão\nnos preços dos supermercados, por exemplo…\ne os [ordinais]… hmmm… nos pódios e medalhas!\nAtenção e vamos lá!";

        var tutorialText1 = this.drawText(this.world.centerX,25, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 22000);

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

        this.timedError = false;

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
            case 6:
                this.initLevel6();
            break;
            case 7:
                this.initLevel7();
            break;
            case 8:
                this.initLevel8();
            break;
            case 9:
                this.initLevel9();
            break;
        }
    },
           
    initLevel1: function() {
        console.log("***init level 1***");
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(1, function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel2: function() {
        console.log("***init level 2***");
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(1, function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel3: function() {
        console.log("***init level 3***");
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(1, function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel4: function() {
        console.log("***init level 4***");
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(2, function(){
            this.relogioTimer = this.game.time.events.add(4000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel5: function() {
        console.log("***init level 5***");
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(2, function(){
            this.relogioTimer = this.game.time.events.add(4000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel6: function() {
        console.log("***init level 6***");
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(2, function(){
            this.relogioTimer = this.game.time.events.add(4000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel7: function() {
        console.log("***init level 7***");
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(3, function(){
            this.relogioTimer = this.game.time.events.add(3000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel8: function() {
        console.log("***init level 8***");
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(3, function(){
            this.relogioTimer = this.game.time.events.add(3000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    initLevel9: function() {
        console.log("***init level 9***");
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(3, function(){
            this.relogioTimer = this.game.time.events.add(3000, this.stopTime, this);
            this.toggleInput(true);
        })
    },

    setupLevel: function(level){
        console.log("***setup level"+level+"***");
        this.level = level;
        switch(level){
            case 1:
                this.numberTypeText.setText("NÚMERO\nNATURAL")
                break;
            case 2:
                this.numberTypeText.setText("NÚMERO\nORDINAL")
                break;
            case 3:
                this.numberTypeText.setText("NÚMERO\nDECIMAL")
                break;
        }
        
        number = this.remainingQuestions.splice(this.game.rnd.integerInRange(0, this.remainingQuestions.length-1), 1)[0];

        buttonsAux = [0, 1, 2];
        randomButtonI = buttonsAux.splice(this.game.rnd.integerInRange(0, buttonsAux.length-1), 1)[0];


        wordAux = ['', 'º', ',0'];

        rightWord = number+wordAux.splice(level-1, 1)[0];

        this.guaranas[randomButtonI].children[0].setText(rightWord);
        this.rightguarana = this.guaranas[randomButtonI];

        while(buttonsAux.length > 0){
            randomButtonI = buttonsAux.splice(this.game.rnd.integerInRange(0, buttonsAux.length-1), 1)[0];

            randomWord = number+wordAux.splice(this.game.rnd.integerInRange(0, wordAux.length-1), 1)[0];

            this.guaranas[randomButtonI].children[0].setText(randomWord);
        }
    },

    showLevel: function(callback){
        console.log("***show level***");

        delay = 0;
        for (var i = 0; i < this.guaranas.length; i++) {
            this.guaranas[i].x = this.guaranasPositions[i][0] - 900;
            this.guaranas[i].y = this.guaranasPositions[i][1];
            this.guaranas[i].alpha = 1;
            this.guaranas[i].frame = 0;
            tween = this.add.tween(this.guaranas[i]).to({x: this.guaranasPositions[i][0]}, 1200, Phaser.Easing.Elastic.Out, true, delay);
            if(i == this.guaranas.length - 1 && callback != null){
                tween.onComplete.add(function(){
                    callback.call(this);
                }, this);
            }
            delay += 700;
        }
    },

    resetLevel:function(callback){
        console.log("***reset level***");

        for (var i = 0; i < this.guaranas.length; i++) {
            tween = this.add.tween(this.guaranas[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            if(i == this.guaranas.length - 1 && callback != null){
                tween.onComplete.add(function(){
                    callback.call(this);
                }, this);
            }
        }
    },

    mouseInputDown:function(elem){
        console.log("mouseInputDown");
        this.toggleInput(false);
        this.checkGame(elem);
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(this.relogioTimer != null){
            this.game.time.events.remove(this.relogioTimer);
            this.relogioTimer = null;
            if(this.rightguarana == elem){
                this.sound.play('hitAcerto');
                this.rightguarana.animations.play('glow');
                this.createDelayTime(1500, this.clickRightButton);
            } else {
                this.sound.play('hitErro');
                this.clickWrongButton();
            }
        }
    },

    stopTime: function(){
        console.log("***time's up!***");
        this.relogioTimer = null;
        this.game.time.events.remove(this.relogioTimer);
        this.sound.play('hitErro');
        this.timedError = true;
        this.clickWrongButton();
    },


    clickRightButton: function(target) {
        console.log("***right!***");

        this.resetLevel(this.gotoNextLevel);
    },

    clickWrongButton: function() {
        console.log("***wrong!***");   
        this.wrongAnswers++;
        this.lives--;
        this.updateLivesText();
        if(this.lives <= 0){
            this.createDelayTime(500, function() {
                this.showResumo(); 
            });
        } else {
            if(!this.timedError){
                this.timedError = false;
                this.createDelayTime(500, function() {
                    this.sound.play("soundDica").onStop.add(function(){
                        this.resetLevel(this.gotoNextLevel);
                    }, this);
                });
            } else {
                this.resetLevel(this.gotoNextLevel);
            }
        }
    },

    playQuestion: function(question, callback){
        console.log("***play question***");
        soundName = "soundP";
        sound = this.sound.play(soundName);

        soundName = "soundP"+question;
        sound2 = this.sound.add(soundName);

        sound.onStop.addOnce(function(){
            sound2.play();
        }, this);

        if(callback != null)
            sound2.onStop.addOnce(function(){
                callback.call(this);
            }, this);
    },

    toggleInput: function(flag){
        for (var i = 0; i < this.guaranas.length; i++) {
            this.guaranas[i].inputEnabled = flag;
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
            this.saveCorrectArrays();
            this.gameOverMacaco();
        }
    },

    saveCorrectArrays: function(){
        if(this.wrongAnswers < 1){
            this.listCorrects = [100, 100, 100];
            this.listCompleted = [true, true, true];
        } else if(this.wrongAnswers == 1){
            this.listCorrects = [100, 100, 0];
            this.listCompleted = [true, true, false];
        } else if(this.wrongAnswers >= 2){
            this.listCorrects = [100, 0, 0];
            this.listCompleted = [true, false, false];
        }
        console.log("list corrects "+this.listCorrects.toString());
        console.log("list completed "+this.listCompleted.toString());
    },

    gotoNextLevel: function() {
        this.currentLocalLevel++;
        if(this.currentLocalLevel >= this["totalLevel" + this.currentLevel]) {
            this.lives = 2;
            this.updateLivesText();
            this.currentLevel++;
            this.currentLocalLevel = 0;
            this.currentLocalErrors = this["totalErro" + this.currentLevel];
        }
        this.hideAndShowLevel();
    },
};