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
        this.totalErro1 = 1;
        this.totalErro2 = 1;
        this.totalErro3 = 1;

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


        this.lanes = [];
        this.lanesRange = 70;

        lane = {
            sprite: null,
            x: 600,
            y: 185
        };
        this.lanes.push(lane);
        lane = {
            sprite: null,
            x: 600,
            y: 355
        };
        this.lanes.push(lane);
        lane = {
            sprite: null,
            x: 700,
            y: 265
        };
        this.lanes.push(lane);
        lane = {
            sprite: null,
            x: 800,
            y: 185
        };
        this.lanes.push(lane);
        lane = {
            sprite: null,
            x: 800,
            y: 355
        };
        this.lanes.push(lane);

        this.sapos = [];
        this.saposTweens = [];
        this.relogioTimer = null;
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
        var t1 = "O Príncipe Grilo é um folgado! Como\n ganhou uma aposta dos Sapos Manteiga,\n fez com que eles fossem procurar [folhas]\n para ele comer!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Só que ele não avisou que só come [folhas finas],\n bem fininhas, nada de folhas grossas.\n  Os Sapos Manteiga";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "não sabiam e trouxeram de tudo. Vamos separar as \n[folhas finas] para ele? Basta escolher a [folha fina]\n e pronto! Mas bem rapidinho!";
        var tutorialText3 = this.drawText(this.world.centerX, 20, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(11000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 11000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -135}, 500, Phaser.Easing.Bounce.Out, true, 11200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 11700);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 21000);

        //t2in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 21200);

        this.createDelayTime(24000, this.showLiveTutorial);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
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
        
        lanesTutorial = this.lanes.slice(0);
        sapo = this.add.sprite(lanesTutorial[0].x, lanesTutorial[0].y, 'sapo-fina');
        sapo.anchor.set(0.5, 0.5);
        sapo.alpha = 0;
        sapo.frame = this.game.rnd.integerInRange(0, 13);
        lanesTutorial[0].sprite = sapo;
        this.groupIntro.addChildAt(sapo, this.groupIntro.length - 1);

        sapo = this.add.sprite(lanesTutorial[2].x, lanesTutorial[2].y, 'sapo-grossa');
        sapo.anchor.set(0.5, 0.5);
        sapo.alpha = 0;
        sapo.frame = this.game.rnd.integerInRange(0, 13);
        lanesTutorial[2].sprite = sapo;
        this.groupIntro.addChildAt(sapo, this.groupIntro.length - 1);

        sapo = this.add.sprite(lanesTutorial[4].x, lanesTutorial[4].y + this.lanesRange, 'sapo-grossa');
        sapo.anchor.set(0.5, 0.5);
        sapo.rotation = Math.PI;
        sapo.alpha = 0;
        sapo.frame = this.game.rnd.integerInRange(0, 13);
        lanesTutorial[4].sprite = sapo;
        this.groupIntro.addChildAt(sapo, this.groupIntro.length - 1);

        tween = this.add.tween(lanesTutorial[0].sprite).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false);
        tween.to({y: lanesTutorial[0].y + this.lanesRange}, 1000, Phaser.Easing.Linear.None, false, 4000);
        tween.start();

        tween = this.add.tween(lanesTutorial[2].sprite).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false);
        tween.to({y: lanesTutorial[2].y + this.lanesRange}, 1000, Phaser.Easing.Linear.None, false, 4000);
        tween.start();
    
        tween = this.add.tween(lanesTutorial[4].sprite).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false);
        tween.to({y: lanesTutorial[4].y}, 1000, Phaser.Easing.Linear.None, false, 4000);
        tween.start();


        tween = this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, false, 2000);
        tween.to({x: lanesTutorial[0].x, y: lanesTutorial[0].y + this.lanesRange}, 2000, Phaser.Easing.Linear.None, false, 2000).onComplete.add(function(){
                this.click.animations.play('click', 30, false);
                this.add.tween(lanesTutorial[0].sprite.scale).to({ x: 1.3, y: 1.3 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    lanesTutorial[0].sprite.tint = 0xffbb17;
                    this.createDelayTime(2000, this.showFinishedLiveTutorial);
                }, this);
        }, this);
        tween.start();

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

        this.grilo = this.add.sprite(310, 280, 'grilo');
        this.grilo.anchor.set(0.5, 0.5);
        frames = [];
        for(i = 0; i < 20; i++)
            frames.push(i);
        this.grilo.animations.add('idle', frames, 18, true);
        frames = [];
        for(i = 20; i < 41; i++)
            frames.push(i);
        this.grilo.animations.add('cheer', frames, 18, false);
        this.grilo.animations.play('idle');

        this.relogio = this.add.sprite(900, 100, 'relogio');
        this.relogio.anchor.set(0.5, 0.5);
        this.relogio.animations.add('time', null, null, false);
        this.relogio.alpha = 0;
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
        var t1 = "Uma [folha fina] é mais magrinha, como\n essa aqui. Já uma [folha grossa] é larga, como\n essa daqui. Como o Príncipe Grilo só come as\n magrinhas, temos que escolhê-las!";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        fina = this.add.sprite(600, 250, 'fina');
        fina.anchor.set(0,0);
        fina.alpha = 0;
        this.groupIntro.add(fina);

        grossa = this.add.sprite(600, 360, 'grossa');
        grossa.anchor.set(0,0);
        grossa.alpha = 0;
        this.groupIntro.add(grossa);

        this.add.tween(fina).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 3000);
        this.add.tween(grossa).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 8000);

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

        this.grilo.animations.play("idle");

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
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel2: function() {
        console.log("***init level 2***");
        this.setupLevel(1);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel3: function() {
        console.log("***init level 3***");
        this.setupLevel(1);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel4: function() {
        console.log("***init level 4***");
        this.setupLevel(2);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel5: function() {
        console.log("***init level 5***");
        this.setupLevel(2);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel6: function() {
        console.log("***init level 6***");
        this.setupLevel(2);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel7: function() {
        console.log("***init level 7***");
        this.setupLevel(3);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel8: function() {
        console.log("***init level 8***");
        this.setupLevel(3);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },

    initLevel9: function() {
        console.log("***init level 9***");
        this.setupLevel(3);
        this.sound.play('soundP').onStop.addOnce(function(){
            this.showLevel();
            this.toggleInput(true);
        }, this);
    },



    setupLevel: function(level){
        console.log("***setup level "+level+"***");
        totalSapos = 0;
        switch(level){
            case 1:
                totalSapos = 3;
            break;
            case 2:
                totalSapos = 4;
            break;
            case 3:
                totalSapos = 5;
            break;
        }

        lanesAux = [];
        for(i = 0; i < this.lanes.length; i++){
            lanesAux.push(this.lanes[i]);
        }

        rnd = this.game.rnd.integerInRange(0, lanesAux.length-1);
        lane = lanesAux.splice(rnd, 1)[0];
        randomizePosition = this.game.rnd.integerInRange(0, this.lanesRange);
        this.rightSapo = this.add.sprite(lane.x, lane.y + randomizePosition, 'sapo-fina');
        this.rightSapo.alpha = 0;
        this.rightSapo.frame = this.game.rnd.integerInRange(0, 13);
        this.rightSapo.anchor.set(0.5, 0.5);
        this.rightSapo.events.onInputDown.add(this.mouseInputDown, this);
        lane.sprite = this.rightSapo;

        for(i = 0; i < totalSapos-1; i++){
            rnd = this.game.rnd.integerInRange(0, lanesAux.length-1);
            lane = lanesAux.splice(rnd, 1)[0];
            randomizePosition = this.game.rnd.integerInRange(0, this.lanesRange);
            sapo = this.add.sprite(lane.x, lane.y + randomizePosition, 'sapo-grossa');
            sapo.alpha = 0;
            sapo.anchor.set(0.5, 0.5);
            sapo.frame = this.game.rnd.integerInRange(0, 13);
            sapo.events.onInputDown.add(this.mouseInputDown, this);
            lane.sprite = sapo;
        }

        str = "sapos ";
        for(i=0;i<this.lanes.length;i++){
            if(this.lanes[i].sprite != null)
                str += "("+this.lanes[i].sprite.x+", "+this.lanes[i].sprite.y+"),";
        }
        console.log(str);
    },

    showLevel: function(callback){
        console.log("***show level***");

        for(i = 0; i < this.lanes.length; i++){
            loopTime = 1000;
            sapo = this.lanes[i].sprite;
            if(sapo != null){
                console.log(sapo.y);
                initialY = this.lanes[i].y;
                finalY = initialY + this.lanesRange;
                this.add.tween(sapo).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(sapo, initialY, finalY, loopTime){
                    return function () {
                        firstLoopTime = (sapo.y - initialY)/this.lanesRange*loopTime;
                        if(firstLoopTime <= 0)
                            firstLoopTime = 100;
                        tween = this.add.tween(sapo).to({ y: initialY }, firstLoopTime, Phaser.Easing.Linear.None, true).onComplete.add(function( sapo, initialY, finalY, loopTime) {
                            
                            return function(){
                                console.log(initialY+" "+finalY);
                                loopTime = loopTime*0.5 + (loopTime*0.5)*Math.random();
                                tween1 = this.add.tween(sapo).to({angle: "+180"}, 1000, Phaser.Easing.Linear.None, false);
                                this.saposTweens.push(tween1);
                                tween = tween1.to({ y: finalY }, loopTime, Phaser.Easing.Linear.None, false);
                                this.saposTweens.push(tween);
                                tween = tween.to({angle: "+180"}, 1000, Phaser.Easing.Linear.None, false);
                                this.saposTweens.push(tween);
                                tween = tween.to({ y: initialY }, loopTime, Phaser.Easing.Linear.None, false);
                                this.saposTweens.push(tween);
                                tween1.loop(true);
                                tween.start();
                            }
                            
                        }(sapo, initialY, finalY, loopTime), this);
                        this.saposTweens.push(tween);
                    }
                }(sapo, initialY, finalY, loopTime), this);
            }
        }

        this.add.tween(this.relogio).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                this.startTimer(4);
        }, this);
        
    },

    resetLevel:function(callback){
        console.log("***reset level***");

        callbackSent = false;
        delay = 0;
        for(i = 0; i < this.lanes.length; i++){
            sapo = this.lanes[i].sprite;
            if(sapo != null){
                tween = this.add.tween(sapo).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, delay);
                if(i == this.lanes.length - 1 && callback != null){
                    callbackSent = true;
                    tween.onComplete.add(function(sprite, tween){
                        sprite.destroy();
                        callback.call(this);
                        this.saposTweens = [];
                    }, this);
                } else {
                    tween.onComplete.add(function(sprite, tween){
                        sprite.destroy();
                    }, this);
                }
                this.lanes[i].sprite = null;
                delay += 300;
            }
        }

        this.add.tween(this.relogio).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                this.relogio.frame = 0;
        }, this);

        if(!callbackSent)
            callback.call(this);
    },

    mouseInputDown: function(elem) {
        console.log("***mouse click***");
        this.game.time.events.remove(this.relogioTimer);

        this.toggleInput(false);
        for(i = 0; i < this.saposTweens.length; i++){
            if(this.saposTweens[i].target == elem)
                this.saposTweens[i].pause();
        }
        this.add.tween(elem.scale).to({ x: 1.3, y: 1.3 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            elem.tint = 0xffbb17;
            if(elem == this.rightSapo){
                this.relogioTimer = null;
                this.relogio.animations.stop('time');
                this.grilo.animations.play("cheer");
                sound = this.sound.play("hitAcerto");
                this.createDelayTime(1000, function(){this.clickRightButton()});
            } else {
                sound = this.sound.play("hitErro");
                if(this.currentLocalErrors > 0) {
                    this.currentLocalErrors--;
                    this.add.tween(elem.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        elem.tint = 0xffffff;
                        for(i = 0; i < this.saposTweens.length; i++){
                            if(this.saposTweens[i].target == elem)
                                this.saposTweens[i].resume();
                        }
                        this.toggleInput(true);
                    }, this);
                } else {
                    this.relogioTimer = null;
                    this.relogio.animations.stop('time');
                    this.clickWrongButton(false);
                }
            }
        }, this);
        
    },

    clickRightButton: function() {
        console.log("***right!***");
        this.onPlayerSuccess();

        this.resetLevel(function(){
            this.gotoNextLevel();
        });
    },

    clickWrongButton: function(timed) {
        console.log("***wrong!***");      
        this.resetLevel(
            function(){
                this.onPlayerError();
                switch(this.lives) {
                    case 1: // mostra dica 1
                        this.createDelayTime(500, function() {
                            if(!timed)
                                this.sound.play("soundDica").onStop.add(function(){
                                    this.createDelayTime(1500, this.onCompleteShowDica);
                                }, this);
                            else
                                this.createDelayTime(1500, this.onCompleteShowDica);
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
            }
        );
    },

    playQuestion: function(question, callback){
        console.log("***play question***");
        soundName = "soundP";
        soundName += Math.ceil(question/3)+"_";
        soundName += question - (Math.ceil(question/3)-1)*3;

        sound = this.sound.play('soundP');
        sound.onStop.addOnce(function(){
            sound = this.sound.play(soundName);
            if(callback != null)
                sound.onStop.addOnce(function(){
                    callback.call(this);
                }, this);
        }, this);

        console.log("playing ", soundName);
    },

    playAnswer: function(elem){
        console.log("***play answer***");
        soundName = "soundP";
        soundName += Math.ceil(this.question/3)+"_";
        
        silabaFrame0 = 0;
        if(this.question == 0)
            silabaFrame0 += 2;
        else if(this.question >= 1 && this.question <= 6){
            silabaFrame0 += 2;
            silabaFrame0 += 3*(this.question - 1);
        } else if(this.question > 6) {
            silabaFrame0 += 2;
            silabaFrame0 += 18;
            silabaFrame0 += 4*(this.question - 7);
        }

        answerFrame = elem.frame;
        soundName += this.answers[this.question][answerFrame-silabaFrame0];

        sound = this.sound.play(soundName); 

        console.log("playing ", soundName);
    },

    toggleInput: function(flag){
        for(i = 0; i < this.lanes.length; i++){
            if(this.lanes[i].sprite != null)
                this.lanes[i].sprite.inputEnabled = flag;
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

    startTimer: function(time) {
        this.relogioTimer = this.game.time.events.add(time*1000, this.stopTimer, this);
        this.relogio.play('time', 95/time, false);
    },

    stopTimer: function(e) {
        this.toggleInput(false);
        this.game.time.events.remove(this.relogioTimer);
        this.relogioTimer = null;
        this.sound.play("hitErro");
        this.clickWrongButton(true);
    }
};