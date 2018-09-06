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

        this.remainingQuestions1 = [15, 10, 5];
        this.remainingQuestions2 = [20, 25, 17];
        this.remainingQuestions3 = [22, 18, 16];

        this.bubblesPositions = [
            [777, 217],
            [900, 310],
            [760, 370]
        ];

        this.bubbles = [];
        this.fadas = [];
        this.fadasPositions = [];
        this.gameTweens = [];
        this.rightBubble = null;

        this.createScene();
        this.showIntro();

        this.relogioTimer = null;

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
        var t1 = "Fábulas também têm tudo a ver com\n [fadas]! E essas fadinhas aqui são as\n menores, são as fadas do futuro…\n elas sempre andam em grupos de\n [30] fadinhas.";
        var tutorialText1 = this.drawText(this.world.centerX+40, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Quando se separam, têm exatos [3 segundos] para se \njuntar de novo, que é o tempo que essas bolhas\n levam para chegar ao chão. Se tenho [30] e [10] \n fadinhas vão ali…quantas ficaram? [20]!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Clico na [bolha 20]\n antes que chegue ao chão e pronto! \nFadinhas juntas outra vez!";
        var tutorialText3 = this.drawText(this.world.centerX, 40, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(14200);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            //sound
            this.soundIntro = this.setDebugAudio("soundIntro");
            this.soundIntro.onStop.addOnce(this.showFinishedLiveTutorial, this);
        },this);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 14200);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -110}, 500, Phaser.Easing.Bounce.Out, true, 14300);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 14300);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 32000);

        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 32200);

        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 40000);

        this.setupLevel(0);
        this.createDelayTime(5000, function(){
            for(i = 0; i < this.fadas.length; i++){
                if(this.fadas[i].alpha != 1){
                    fada = this.fadas[i];
                    this.add.tween(fada).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);    
                }
            } 
        });

        this.createDelayTime(19000, function(){
            for(i = 0; i < this.bubbles.length; i++){
                for(h = 0; h < this.bubbles[i].length; h++){
                    bubble = this.bubbles[i][h];
                    this.add.tween(bubble).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
                }
            } 
        });
        this.createDelayTime(24000, this.showLiveTutorial);

        this.createDelayTime(30000, function(){
            this.showLevel();
        });


        
        
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
        
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: this.rightBubble.x, y: this.rightBubble.y}, 1000, Phaser.Easing.Linear.None, true, 8000).onComplete.add(function(){
                    this.click.animations.play('click', 30, false);
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

    createScene: function() {
        console.log("***create scene***");
        this.background = this.add.sprite(0, 0, 'background');

        xPointer = 90;
        yPointer = 350;
        for(i = 1; i < 31; i++){
            fada = this.add.sprite(xPointer, yPointer, 'fada');
            fada.anchor.set(0.5, 0.5);
            fada.alpha = 0;

            frames = [];
            for(h = 0; h < 19; h++)
                frames.push(h);
            fada.animations.add('idle', frames, 18, true);

            frames = [];
            for(h = 20; h < 44; h++)
                frames.push(h);
            fada.animations.add('fly', frames, 18, true);

            fada.animations.play('idle');

            this.fadas.push(fada);
            this.fadasPositions.push([xPointer, yPointer]);

            xPointer += 60;
            if(i%10 == 0){
                xPointer = 90;
                yPointer += 60;
            }
        }

        for(i = 0; i < 3; i++){
            x = this.bubblesPositions[i][0];
            y = this.bubblesPositions[i][1];
            bubble = [];

            bubbleBase = this.add.sprite(x, y, 'bolha-base');
            bubbleBase.anchor.set(0.5, 0.5);
            bubbleBase.alpha = 0;
            bubble.push(bubbleBase);

            bubbleShadow = this.add.bitmapText(x+1, y+4, "lucky-64", '', 64);
            bubbleShadow.anchor.set(0.5, 0.7);
            bubbleShadow.tint = 0x663333;
            bubbleShadow.alpha = 0;
            bubble.push(bubbleShadow);

            bubbleText = this.add.bitmapText(x, y, "lucky-64", '', 64);
            bubbleText.anchor.set(0.5, 0.7);
            bubbleText.tint = 0xFF9900;
            bubbleText.alpha = 0;
            bubble.push(bubbleText);

            bubbleOverlay = this.add.sprite(x, y, 'bolha-overlay');
            bubbleOverlay.anchor.set(0.5, 0.5);
            bubbleOverlay.alpha = 0;
            bubbleOverlay.events.onInputDown.add(this.mouseInputDown, this);
            bubble.push(bubbleOverlay);

            this.bubbles.push(bubble);
        }
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
        var t1 = "Vamos relembrar, subtrair é o\n mesmo que diminuir, tirar. Se eu \ntenho [10] coisas e tiro [4], me sobram [6],\n não é? É só seguir essa ideia que\n as [fadas] vão nos ajudar também!";

        var tutorialText1 = this.drawText(this.world.centerX, 47, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            this.soundResumo = this.setDebugAudio("soundResumo");
            this.soundResumo.onStop.addOnce(function(){
                this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
                this.hideResumo();
            });
        },this);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 17000);

        
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
        sound = this.setDebugAudio("soundP");
        this.createDelayTime(2000, function(){
            this.showLevel(function(){
                this.toggleInput(true);
                this.startTimer(10);
            });
        }); 
    },

    initLevel2: function() {
        console.log("***init level 2***");        
        this.setupLevel(2);
        this.setDebugAudio("soundP");
        this.createDelayTime(2000, function(){
            this.showLevel(function(){
                this.toggleInput(true);
                this.startTimer(8);
            });
        }); 
    },

    initLevel3: function() {
        console.log("***init level 3***");        
        this.setupLevel(3);
        this.setDebugAudio("soundP");
        this.createDelayTime(2000, function(){
            this.showLevel(function(){
                this.toggleInput(true);
                this.startTimer(6);
            });
        }); 
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");
        
        switch(level){
            case 0:
                this.question = 10;
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

        rightBubbleId = this.game.rnd.integerInRange(0, 2);
        answer = 30 - this.question;
        answerAux = [answer-1, answer-2, answer+1, answer+2];
        
        for(i = 0; i < this.bubbles.length; i++){
            bubble = this.bubbles[i];
            if(i == rightBubbleId){
                this.rightBubble = this.bubbles[i][3];
                bubble[1].text = answer;
                bubble[2].text = answer;
            }else{
                text = answerAux.splice(this.game.rnd.integerInRange(0, answerAux.length-1), 1)[0];
                bubble[1].text = text;
                bubble[2].text = text;
            }
        }
    },

    showLevel: function(callback){
        console.log("***show level***");

        for(i = 0; i < this.gameTweens.length; i++){
            this.gameTweens[i].stop();
        }
        
        for(i = 0; i < this.fadas.length; i++){
            if(this.fadas[i].alpha != 1){
                fada = this.fadas[i];
                this.add.tween(fada).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);    
            }
        } 

        delay = 2000;
        for(i = 0; i < this.question; i++){
            fada = this.fadas[i];
            tween = this.add.tween(fada).to({x: this.fadasPositions[i][0] + 1000, y: this.fadasPositions[i][1] - 300}, 3000, Phaser.Easing.Linear.None, true, delay);
            this.gameTweens.push(tween);
            this.createDelayTime(delay, function(fada){
                return function(){
                    fada.scale.set(1, 1);
                    fada.animations.play('fly');
                }
            }(fada));
            delay += 70;
        }
        for(i = 0; i < this.bubbles.length; i++){
            bubble = this.bubbles[i];
            for(h = 0; h < bubble.length; h++){
                bubble.x = this.bubblesPositions[i][0];
                bubble.y = this.bubblesPositions[i][1];
                tween1 = this.add.tween(bubble[h]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, delay);
                tween2 = this.add.tween(bubble[h]).to({y: this.bubblesPositions[i][1]+167}, 3000, Phaser.Easing.Linear.None, true, delay+500);
                this.gameTweens.push(tween2);
                if(i == this.bubbles.length - 1 && h == bubble.length - 1){
                    tween1.onComplete.add(function(){
                        if(callback!=null)
                            callback.call(this);
                    }, this);
                }
            }
        }
    },

    resetLevel:function(callback){
        console.log("***reset level***");

        if(this.textTimer) {
            this.add.tween(this.textTimer).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.textTimerShadow).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
        }
        
        for(i = 0; i < this.gameTweens.length; i++){
            this.gameTweens[i].stop();
        }
        
        for(i = 0; i < this.fadas.length; i++){
            fada = this.fadas[i];
            if(fada.x != this.fadasPositions[i][0] || fada.y != this.fadasPositions[i][1]){
                fada.scale.set(-1, 1);
                tween = this.add.tween(fada).to({x : this.fadasPositions[i][0], y : this.fadasPositions[i][1]}, 500, Phaser.Easing.Linear.None, true);
                this.gameTweens.push(tween);
                this.createDelayTime(500, function(fada){
                    return function(){
                        fada.scale.set(1, 1);
                        fada.animations.play('idle');
                    }
                }(fada));
            }
        }

        for(i = 0; i < this.bubbles.length; i++){
            bubble = this.bubbles[i];
            for(h = 0; h < bubble.length; h++){
                tween = this.add.tween(bubble[h]).to({alpha: 0, x: this.bubblesPositions[i][0], y: this.bubblesPositions[i][1]}, 1000, Phaser.Easing.Linear.None, true);
                this.gameTweens.push(tween);
                if(i == this.bubbles.length - 1 && h == bubble.length - 1)
                    tween.onComplete.add(function(){
                        if(callback!=null)
                            callback.call(this);
                    }, this);
            }
        }

        this.timedError = false;
    },

    startTimer: function(time) {
        console.log("**********startTimer************");
        this.counter = time;
        this.relogioTimer = this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.textTimerShadow =  this.add.bitmapText(480,  530, "JandaManateeSolid", this.counter.toString(), 48);
        this.textTimerShadow.tint = 0x010101;
        this.textTimer = this.add.bitmapText(this.world.centerX-22,533, "JandaManateeSolid", this.counter.toString(), 48);
        this.textTimer.tint = 0xFfffff;
    },

    updateCounter:function () {
        console.log("**********updateCounter************");
        console.log("counter: " + this.counter);
        this.counter--;
        this.textTimerShadow.text = this.textTimer.text = this.counter;
        if(this.counter <= 0) {
           this.stopTimer();
        }
    },

    stopTimer: function() {
        console.log("**********stoptimer************");
        if(this.relogioTimer != null){
            this.toggleInput(false); // desabilita o click
            this.game.time.events.remove(this.relogioTimer);
            this.relogioTimer = null;
            this.setDebugAudio("hitErro");
            this.timedError = true;
            this.clickWrongButton(true);
        }
    },    

    checkGame:function(elem){
        console.log("***checkGame***");
        if(this.relogioTimer) {
            this.game.time.events.remove(this.relogioTimer);
            this.relogioTimer = null;
        }
        if(elem == this.rightBubble){
            this.setDebugAudio("hitAcerto");
            this.clickRightButton();
        } else {
            this.setDebugAudio("hitErro");
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
        this.resetLevel(function(){
            if(this.currentLocalErrors > 0) {
                this.currentLocalErrors--;
                return;
            }            
            this.onPlayerError();
            switch(this.lives) {
                case 1: // mostra dica 1
                    this.createDelayTime(500, function() {
                        if(!this.timedError){
                            this.soundDica = this.setDebugAudio("soundDica");
                            this.soundDica.onStop.addOnce(function(){
                                this.createDelayTime(1500, this.onCompleteShowDica);
                            }, this);
                        }else{
                            this.createDelayTime(500, this.onCompleteShowDica);
                        }
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

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.toggleInput(false);
        this.checkGame(elem);        
    },

    toggleInput: function(flag){
        for(i = 0; i < this.bubbles.length; i++){
            this.bubbles[i][3].inputEnabled = flag;
        }
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