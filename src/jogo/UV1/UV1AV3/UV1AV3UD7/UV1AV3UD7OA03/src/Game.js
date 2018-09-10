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

        this.remainingQuestions1 = [9, 12, 15];
        this.remainingQuestions2 = [18, 21, 24];
        this.remainingQuestions3 = [27, 30, 33];

        this.paineisX = [290, 505, 705];
        this.paineis = [];

        this.rightPainel = null;

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
        var t1 = "Cada indiozinho tem um pé de\ncafé favorito, mas nem sempre\nconseguem encontrá-los. Poly\nentão deu a ideia de [medir]\n[a distância] entre cada\num deles.";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Poly sabe que a cada [3 passos] que\n ela dá, anda [um metro]. Contando\n direitinho, saberemos a\ndistância certa.";
        var tutorialText2 = this.drawText(this.world.centerX, 35, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Assim: Se um pé de café está a\n[9 passos] de Poly, ele está a\n[3 metros] de distância, entenderam?\nPois [3 passos] é igual a [1 metro].";
        var tutorialText3 = this.drawText(this.world.centerX, 25, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(10000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 10000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 10200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 10700);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 21500);

        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 21700);

        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 39500);

        this.setupLevel(0);
        this.createDelayTime(22000, function(){
            this.showLevel();
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
            this.add.tween(this.arrowGroup).to({x: this.rightPainel.parent.x, y: this.rightPainel.parent.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
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

        this.cafe = this.add.sprite(865, 449, 'cafe');
        this.cafe.anchor.set(0.5, 0.5);
        this.cafe.animations.add('show', null, 18, false);

        this.linha = this.add.sprite(500, 370, 'linha');
        this.linha.anchor.set(0.5, 0.5);
        this.linha.animations.add('show', null, 18, false);
        this.linha.alpha = 0;
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
        var t1 = "Existem diferentes formas de medir um objeto.\nSe eu sei que [três] passos da Poly são igual a\n [um metro], é só [dividir] o número de\npassos que ela deu por [três]: [12 passos] dá\n[4 metros]! E você, quantos passos precisa\ndar pra andar 1 metro?";

        var tutorialText1 = this.drawText(this.world.centerX, 25, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 23500);

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
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(1, function(){
            this.toggleInput(true);   
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(2, function(){
            this.toggleInput(true);   
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(3, function(){
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
                this.question = this.remainingQuestions1.splice(this.game.rnd.integerInRange(0, this.remainingQuestions1.length -1), 1)[0];
                break;
            case 2:
                this.question = this.remainingQuestions2.splice(this.game.rnd.integerInRange(0, this.remainingQuestions1.length -1), 1)[0];
                break;
            case 3:
                this.question = this.remainingQuestions3.splice(this.game.rnd.integerInRange(0, this.remainingQuestions1.length -1), 1)[0];
                break;
        }

        this.answer = this.question/3;

        this.questionText = this.add.bitmapText(500, 330, "lucky-64", this.question+" PASSOS", 64);
        this.questionText.anchor.set(0.5, 0.5);
        this.questionText.alpha = 0;

        answerAux = [this.answer, this.answer - 1, this.answer + 1];
        this.paineis = [];
        while(answerAux.length > 0){
            painelAux = answerAux.splice(this.game.rnd.integerInRange(0, answerAux.length-1), 1)[0];

            painel = this.add.group();
            painel.x = -400;
            painel.y = 470;

            painelSprite = this.add.sprite(0, 0, 'painel');
            painelSprite.anchor.set(0.5, 0.5);
            painel.add(painelSprite);

            painelN = this.add.bitmapText(0, 5, "lucky-64", painelAux.toString(), 64);
            painelN.anchor.set(0.5, 0.5);
            painelN.tint = 0x5c3b2c;
            painel.add(painelN);
            painelText = this.add.bitmapText(0, 50, "lucky-64", 'METROS', 27);
            painelText.anchor.set(0.5, 0.5);
            painelText.tint = 0x5c3b2c;
            painel.add(painelText);

            bmd = this.game.add.bitmapData(170, 170); 
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 170, 170);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            hitArea = this.add.sprite(0, 0, bmd);
            hitArea.anchor.setTo(0.5, 0.5);
            hitArea.alpha = 0;
            hitArea.events.onInputDown.add(this.mouseInputDown, this);
            if(painelAux == this.answer)
                this.rightPainel = hitArea;
            painel.add(hitArea);

            this.paineis.push(painel);
        }


    },

    showLevel: function(callback){
        console.log("***show level***");

        delay = 1000;
        for (var i = 0; i < this.paineis.length; i++) {
            painel = this.paineis[i];
            tween = this.add.tween(painel).to({x: this.paineisX[i]}, 1200, Phaser.Easing.Linear.None, true, delay);
            if(i == this.paineis.length - 1 && callback != null)
                tween.onComplete.add(function(){
                    callback.call(this);
                }, this);
            delay += 500;
        };

        this.linha.alpha = 1;
        this.linha.animations.play('show');

        this.add.tween(this.questionText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.cafe.alpha = 1;
        this.cafe.animations.play('show');
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        
        for (var i = 0; i < this.paineis.length; i++) {
            painel = this.paineis[i];
            this.add.tween(painel).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(sprite){
                sprite.scale.set(1, 1);
            }, this);
        };

        this.add.tween(this.cafe).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.linha).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
        if(this.questionText != null)
            this.add.tween(this.questionText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem == this.rightPainel){
            this.sound.play("hitAcerto");

            this.add.tween(elem.parent.scale).to({x: 1.2, y: 1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
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
        for (var i = 0; i < this.paineis.length; i++) {
            this.paineis[i].children[3].inputEnabled = flag;
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

    playQuestion: function(level, callback) {
        soundName1 = "soundP"+level;
        sound1 = this.game.add.audio(soundName1);

        sound1.onStop.addOnce(function(){
            callback.call(this);
        }, this);
        sound1.play();
    }
};