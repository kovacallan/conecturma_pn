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

        this.wrongAnswers = 0;

        this.answers = [
            'blefe',
            'blitz',
            'bloco',
            'clarão',
            'cloro',
            'clube',
            'flecha',
            'flor',
            'flúor',
            'glacial',
            'globo',
            'glóbulo'
        ];

        this.acaisPositions = [
            [142, 395],
            [512, 415],
            [322, 495]
        ];

        this.rightAcai = null;

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

        this.menina = this.add.sprite(679, 135, 'menina');

        this.acais = [];
        for (var i = 0; i < 3; i++) {
            acaiSprite = this.add.sprite(500, 300, 'acai');
            acaiSprite.anchor.set(0.5, 0.5);
            acaiSprite.animations.add('glow', null, 18, false);

            acaiText = this.add.bitmapText(0, -10, "lucky-64", '', 32);
            acaiText.anchor.set(0.5, 0.5);
            acaiText.tint = 0xffffff;
            acaiSprite.addChild(acaiText);

            acaiSprite.inputEnabled = true;
            acaiSprite.events.onInputDown.add(this.mouseInputDown, this);
            acaiSprite.alpha = 0;
            this.acais.push(acaiSprite);
        };
        this.toggleInput(false);
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
        var t1 = "A Ana fala uma coisa muito\nengraçada, tipo assim: \"Pode vir\nforte que sou do Norte!\",\n então pra ficarmos todos\nbem fortes, ela vai fazer\num [açaí]!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Só que Mapinguari, pra variar, estragou\nalguns! Pra ajudar a separar o bom\ndo ruim, vamos fazer assim:";
        var tutorialText2 = this.drawText(this.world.centerX, 40, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Eu vou fazer um som, tipo: [\"BL\"].\nQue [açaí] tem uma palavra com o\nsom de [\"BL\"]? [BLusa]!\nVamos em frente!";
        var tutorialText3 = this.drawText(this.world.centerX, 30, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(12500);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 12500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 12700);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 13200);

        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 23000);

        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 23200);

        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 35000);

        this.setupLevel(0);

        this.createDelayTime(30000, this.showLevel);

        this.createDelayTime(32000, this.showLiveTutorial);

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
        
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.arrowGroup).to({x: this.rightAcai.x, y: this.rightAcai.y}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
            this.click.animations.play('click', 30, false);
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
        var t1 = "Repararam como todos os sons que\neu fiz têm um [L]? [B] com [L]: [BL], [C] com [L], [CL]! Quando\no [L] se encontra com outras consoantes temos\nsons diferentes e palavras únicas\nna nossa Língua Portuguesa!";

        var tutorialText1 = this.drawText(this.world.centerX,35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 20000);

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
            case 4:
                this.initLevel4();
            break;
        }
    },
           
    initLevel1: function() {
        console.log("***init level 1***");
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(1, function(){
            this.toggleInput(true);
        })
    },

    initLevel2: function() {
        console.log("***init level 2***");
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(2, function(){
            this.toggleInput(true);
        })
    },

    initLevel3: function() {
        console.log("***init level 3***");
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(3, function(){
            this.toggleInput(true);
        })
    },

    initLevel4: function() {
        console.log("***init level 4***");
        this.setupLevel(4);
        this.showLevel();
        this.playQuestion(4, function(){
            this.toggleInput(true);
        })
    },

    setupLevel: function(level){
        console.log("***setup level"+level+"***");
        levelsAux = [1, 2, 3, 4];
        if(level > 0){
            levelsAux.splice(level-1, 1);
        } else {
            levelsAux.splice(1, 1);
        }

        buttonsAux = [0, 1, 2];
        randomButtonI = buttonsAux.splice(this.game.rnd.integerInRange(0, buttonsAux.length-1), 1)[0];

        if(level == 0){
            rightWord = "blusa";
        } else {
            rightAnswer = (level-1)*3 + this.game.rnd.integerInRange(0, 2);
            rightWord = this.answers[rightAnswer];
        }

        this.acais[randomButtonI].children[0].setText(rightWord);
        this.rightAcai = this.acais[randomButtonI];

        while(buttonsAux.length > 0){
            randomButtonI = buttonsAux.splice(this.game.rnd.integerInRange(0, buttonsAux.length-1), 1)[0];
            randomLevel = levelsAux.splice(this.game.rnd.integerInRange(0, levelsAux.length-1), 1)[0];
            randomAnswer = (randomLevel-1)*3 + this.game.rnd.integerInRange(0, 2);
            randomWord = this.answers[randomAnswer];
            this.acais[randomButtonI].children[0].setText(randomWord);
        }
    },

    showLevel: function(callback){
        console.log("***show level***");

        delay = 0;
        for (var i = 0; i < this.acais.length; i++) {
            this.acais[i].x = this.acaisPositions[i][0] - 700;
            this.acais[i].y = this.acaisPositions[i][1];
            this.acais[i].alpha = 1;
            this.acais[i].frame = 0;
            this.menina.frame = 0;
            tween = this.add.tween(this.acais[i]).to({x: this.acaisPositions[i][0]}, 1200, Phaser.Easing.Elastic.Out, true, delay);
            if(i == this.acais.length - 1 && callback != null){
                tween.onComplete.add(function(){
                    callback.call(this);
                }, this);
            }
            delay += 700;
        }
    },

    resetLevel:function(callback){
        console.log("***reset level***");

        for (var i = 0; i < this.acais.length; i++) {
            tween = this.add.tween(this.acais[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            if(i == this.acais.length - 1 && callback != null){
                tween.onComplete.add(function(){
                    callback.call(this);
                }, this);
            }
        }
    },

    mouseInputDown:function(elem){
        console.log("mouseInputDown");
        this.toggleInput(false);
        this.playAnswer(this.answers.indexOf(elem.children[0].text), function(){
            this.checkGame(elem);
        });
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(this.rightAcai == elem){
            this.sound.play('hitAcerto');
            this.rightAcai.animations.play('glow');
            this.menina.frame = 1;
            this.createDelayTime(1500, this.clickRightButton);
        } else {
            this.sound.play('hitErro');
            this.clickWrongButton();
        }
    },

    clickRightButton: function(target) {
        console.log("***right!***");

        this.resetLevel(this.gotoNextLevel);
    },

    clickWrongButton: function(target) {
        console.log("***wrong!***");
        if(this.currentLocalErrors > 0) {
            this.currentLocalErrors--;
            return;
        }    
        this.wrongAnswers++;
        this.lives--;
        this.updateLivesText();
        if(this.lives <= 0){
            this.createDelayTime(500, function() {
                this.showResumo(); 
            });
        } else {
            this.createDelayTime(500, function() {
                this.sound.play("soundDica").onStop.add(function(){
                    this.resetLevel(this.gotoNextLevel);
                }, this);
            });
        }
    },

    playQuestion: function(question, callback){
        console.log("***play question***");
        soundName = "soundP";
        soundName += question;

        sound = this.sound.play(soundName);
        if(callback != null)
            sound.onStop.addOnce(function(){
                callback.call(this);
            }, this);

        console.log("playing ", soundName);
    },

    playAnswer: function(i, callback){
        soundName = "soundA"+i;

        sound = this.sound.play(soundName);
        if(callback != null)
            sound.onStop.addOnce(function(){
                callback.call(this);
            }, this);

        console.log("playing ", soundName);
    },

    toggleInput: function(flag){
        for (var i = 0; i < this.acais.length; i++) {
            this.acais[i].inputEnabled = flag;
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
            this.currentLevel++;
            this.currentLocalLevel = 0;
            this.currentLocalErrors = this["totalErro" + this.currentLevel];
        }
        this.hideAndShowLevel();
    },
};