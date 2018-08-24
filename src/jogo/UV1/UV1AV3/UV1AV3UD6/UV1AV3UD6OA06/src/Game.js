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

        this.rightFabula = null;
        this.relogioTimer = null;

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
        var t1 = "Será que conseguimos saber quem\nseria um [personagem de fábula] \ne quem não seria?";
        var tutorialText1 = this.drawText(560, 30, t1, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "A cada rodada duas [figuras] vão aparecer,\n mas apenas uma figura com [personagens]\n típicos de [fábulas]. Como esse aqui.\n Agora vamos nós!";
        var tutorialText2 = this.drawText(this.world.centerX, 40, t2, 22, "center");
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
        this.createDelayTime(11000, function(){
            this.add.tween(this.fabulas1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.fabulas2).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(18000, this.showLiveTutorial);

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
            this.add.tween(this.arrowGroup).to({x: this.rightFabula.x, y: this.rightFabula.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
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

        this.fabulas1 = this.add.sprite(330, 285, 'fabulas');
        this.fabulas1.anchor.set(0.5, 0.5);
        this.fabulas1.alpha = 0;
        this.fabulas1.events.onInputDown.add(this.mouseInputDown, this);

        this.fabulas2 = this.add.sprite(690, 285, 'fabulas');
        this.fabulas2.anchor.set(0.5, 0.5);
        this.fabulas2.scale.set(-1, 1);
        this.fabulas2.alpha = 0;
        this.fabulas2.events.onInputDown.add(this.mouseInputDown, this);

        this.relogio = this.add.sprite(900, 100, 'relogio');
        this.relogio.anchor.set(0.5, 0.5);
        this.relogio.animations.add('time', null, null, false);
        this.relogio.alpha = 0;

        this.menino = this.add.sprite(200, 520, 'menino');
        this.menino.anchor.set(1, 1);
        frames = [];
        for(h = 0; h < 20; h++)
            frames.push(h);
        this.menino.animations.add('idle', frames, 18, true);

        frames = [];
        for(h = 20; h < 40; h++)
            frames.push(h);
        this.menino.animations.add('cheer', frames, 18, true);

        this.menino.animations.play('idle');

        this.menina = this.add.sprite(970, 520, 'menina');
        this.menina.anchor.set(1, 1);
        frames = [];
        for(h = 0; h < 20; h++)
            frames.push(h);
        this.menina.animations.add('idle', frames, 18, true);

        frames = [];
        for(h = 20; h < 40; h++)
            frames.push(h);
        this.menina.animations.add('cheer', frames, 18, true);

        this.menina.animations.play('idle');
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
        var t1 = "Os [personagens de fábulas] costumam\n ser animais bem diferentes dos que\n vimos por aí. Eles parecem até gente!\n Será que com essa dica conseguimos\nagora? Vamos!";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 17000);

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
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.showLevel(function(){
                this.toggleInput(true);
                this.startTimer(10);
            });
        }, this);
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.setupLevel(2);
        sound = this.sound.play("soundP2");
        sound.onStop.addOnce(function(){
            this.showLevel(function(){
                this.toggleInput(true);
                this.startTimer(8);
            });
        }, this);
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.setupLevel(3);
        sound = this.sound.play("soundP3");
        sound.onStop.addOnce(function(){
            this.showLevel(function(){
                this.toggleInput(true);
                this.startTimer(6);
            });
        }, this);
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
            this.fabulas1.frame = this.question*2;
            this.fabulas2.frame = this.question*2+1;
            this.rightFabula = this.fabulas1;
        } else {
            this.fabulas2.frame = this.question*2;
            this.fabulas1.frame = this.question*2+1;
            this.rightFabula = this.fabulas2;
        }
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.add.tween(this.relogio).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.fabulas1).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.fabulas2).to({alpha: 1}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        if(this.tintAux != null)
            this.add.tween(this.tintAux).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.relogio).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.fabulas1).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.fabulas2).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(this.tintAux != null){
                this.tintAux.destroy();
                this.tintAux = null;
            }
            if(callback != null)
                callback.call(this);
        }, this);
    },

    startTimer: function(time) {
        this.relogioTimer = this.game.time.events.add(time*1000, this.stopTimer, this);
        this.relogio.play('time', 95/time, false);
    },

    stopTimer: function(e) {
        if(this.relogioTimer != null){
            console.log('times up');
            this.toggleInput(false);
            this.game.time.events.remove(this.relogioTimer);
            this.relogioTimer = null;
            this.sound.play("hitErro");
            this.timedError = true;
            this.clickWrongButton(true);
        }
    },    

    checkGame:function(elem){
        console.log("***checkGame***");
        if(this.relogioTimer != null){
            this.game.time.events.remove(this.relogioTimer);
            this.relogioTimer = null;
        }
        if(elem == this.rightFabula){
            this.sound.play("hitAcerto");
            this.menino.play('cheer');
            this.menina.play('cheer');
            this.generateTintedSprite(elem);
            this.createDelayTime(1000, this.clickRightButton);
        } else {
            this.sound.play("hitErro");
            this.clickWrongButton();
        }
    },

    generateTintedSprite: function(elem) {
        this.tintAux = this.add.sprite(elem.x, elem.y, 'fabulas');          
        this.tintAux.anchor.set(0.5, 0.5);
        this.tintAux.scale.set(elem.scale.x, elem.scale.y);
        this.tintAux.frame = elem.frame;
        this.tintAux.tint = 0xffbb17;
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

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.relogio.animations.stop('time');
        this.toggleInput(false);
        this.checkGame(elem);        
    },

    toggleInput: function(flag){
        this.fabulas1.inputEnabled = flag;
        this.fabulas2.inputEnabled = flag;
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