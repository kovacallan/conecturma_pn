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

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.wrongAnswers = 0;

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

        this.tigela = this.add.sprite(24, 227, 'tigela');

        this.monstro = this.add.sprite(714, 117, 'monstro');

        this.simpatias = [];
        this.simpatiasPositions = [
            [114, 312],
            [162, 302],
            [205, 167],
            [250, 277],
            [295, 289]
        ];
        for (var i = 0; i < 5; i++) {
            simpatia = this.add.sprite(0, 0, 'simpatia');
            simpatia.anchor.set(0.5, 0.5);
            simpatia.alpha = 0;
            this.simpatias.push(simpatia);
        };

        this.faixa = this.add.sprite(500, 182, 'faixa');
        this.faixa.anchor.set(0.5, 0); 
        this.faixa.alpha = 0;
        this.faixaText =  this.add.bitmapText(500, 330, "lucky-64", "", 64);
        this.faixaText.tint = 0x8E3E3E;
        this.faixaText.anchor.set(0.5,0.5);
        this.faixaText.alpha = 0;

        this.dropAreas = [];
        this.placaDezenas = this.add.sprite(297, 310, 'placa');
        this.placaDezenas.alpha = 0;
        dropArea = {
            x: 307,
            y: 314,
            width: 190,
            height: 62,
            currentObject: null
        };
        this.dropAreas.push(dropArea);

        this.placaUnidades = this.add.sprite(517, 310, 'placa');
        this.placaUnidades.alpha = 0;
        dropArea = {
            x: 527,
            y: 314,
            width: 190,
            height: 62,
            currentObject: null
        };
        this.dropAreas.push(dropArea);

        this.unidades = this.add.sprite(0, 518, 'unidades');
        this.unidades.inputEnabled = true;
        this.unidades.input.enableDrag();
        this.unidades.events.onDragStop.add(this.stopDrag, this);
        this.unidades.events.onDragStart.add(this.startDrag, this);
        this.unidades.alpha = 0;
        this.dezenas = this.add.sprite(0, 518, 'dezenas');
        this.dezenas.inputEnabled = true;
        this.dezenas.input.enableDrag();
        this.dezenas.events.onDragStop.add(this.stopDrag, this);
        this.dezenas.events.onDragStart.add(this.startDrag, this);
        this.dezenas.alpha = 0;

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
        var t1 = "Mapinguari é mágico,então vamos\nlutar com [mágica] também!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Dona Cheirosinha, que é de Belém,\nnos mandou 100 frascos de [simpatias]…\nmas só alguns têm poderes\nde verdade!";
        var tutorialText2 = this.drawText(this.world.centerX, 35, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Para ativá-los, temos que escrever\no [número] deles por [extenso], como fizemos\nantes: Exemplo: [32]. Escolho a fita\ndo [30]… e depois a do [2].\nE tenho [32]! Vamos lá!";
        var tutorialText3 = this.drawText(this.world.centerX, 20, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(4500);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 4500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 4700);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 5200);

        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 15000);

        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 15200);

        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 34000);

        this.setupLevel(0);

        this.createDelayTime(23000, this.showLevel);
        this.createDelayTime(24000, function(){
            this.add.tween(this.faixaText).to({alpha: 1, y: 230}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(26000, this.showLiveTutorial);

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
        this.add.tween(this.arrowGroup).to({x: this.dezenas.x + this.dezenas.width/2, y: this.dezenas.y + this.dezenas.height/2}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
            this.add.tween(this.dezenas).to({x: this.dropAreas[0].x, y: this.dropAreas[0].y}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.arrowGroup).to({x: this.dropAreas[0].x + this.placaDezenas.width/2, y: this.dropAreas[0].y + this.placaDezenas.height/2}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                this.add.tween(this.arrowGroup).to({x: this.unidades.x + this.unidades.width/2, y: this.unidades.y + this.unidades.height/2}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.add.tween(this.unidades).to({x: this.dropAreas[1].x, y: this.dropAreas[1].y}, 500, Phaser.Easing.Linear.None, true,500);
                    this.add.tween(this.arrowGroup).to({x: this.dropAreas[1].x + this.placaUnidades.width/2, y: this.dropAreas[1].y + this.placaDezenas.height/2}, 500, Phaser.Easing.Linear.None, true, 500);
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
        var t1 = "Cada número possui uma forma de ser escrita.\nComo por exemplo, [27] é [VINTE E SETE].\nOu [95] é [NOVENTA E CINCO]\nVamos tentar novamente?";

        var tutorialText1 = this.drawText(this.world.centerX,50, t1, 22, "center");
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
        sound = this.sound.play("soundP");
        sound.onStop.addOnce(function(){
            this.add.tween(this.faixaText).to({alpha: 1, y: 230}, 500, Phaser.Easing.Linear.None, true);
            this.toggleInput(true);
        }, this);
        this.setupLevel();
        this.showLevel();
    },

    initLevel2: function() {
        console.log("***init level 2***");
        sound = this.sound.play("soundP");
        sound.onStop.addOnce(function(){
            this.add.tween(this.faixaText).to({alpha: 1, y: 230}, 500, Phaser.Easing.Linear.None, true);
            this.toggleInput(true);
        }, this);
        this.setupLevel();
        this.showLevel();
    },

    initLevel3: function() {
        console.log("***init level 3***");
        sound = this.sound.play("soundP");
        sound.onStop.addOnce(function(){
            this.add.tween(this.faixaText).to({alpha: 1, y: 230}, 500, Phaser.Easing.Linear.None, true);
            this.toggleInput(true);
        }, this);
        this.setupLevel();
        this.showLevel();
    },

    initLevel4: function() {
        console.log("***init level 4***");
        sound = this.sound.play("soundP");
        sound.onStop.addOnce(function(){
            this.add.tween(this.faixaText).to({alpha: 1, y: 230}, 500, Phaser.Easing.Linear.None, true);
            this.toggleInput(true);
        }, this);
        this.setupLevel();
        this.showLevel();
    },

    initLevel5: function() {
        console.log("***init level 5***");
        sound = this.sound.play("soundP");
        sound.onStop.addOnce(function(){
            this.add.tween(this.faixaText).to({alpha: 1, y: 230}, 500, Phaser.Easing.Linear.None, true);
            this.toggleInput(true);
        }, this);
        this.setupLevel();
        this.showLevel();
    },

    setupLevel: function(level){
        console.log("***setup level***");

        if(level == 0){
            numberUnidades = 2;
            numberDezenas = 3;
        } else {
            numberUnidades = this.game.rnd.integerInRange(1, 9);
            numberDezenas = this.game.rnd.integerInRange(2, 9);
        }       

        this.question = numberDezenas*10 + numberUnidades;

        this.faixaText.setText(this.question.toString());
        this.dezenas.frame = numberDezenas-2;
        this.unidades.frame = numberUnidades-1;

        if(this.game.rnd.integerInRange(0, 1) == 0){
            this.dezenas.x = 306;
            this.unidades.x = 529;
        } else {
            this.dezenas.x = 529;
            this.unidades.x = 306;
        }

        console.log("question "+this.question+", dezenas: "+numberDezenas+", unidades: "+numberUnidades);
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.add.tween(this.faixa).to({alpha: 1, y: 182}, 800, Phaser.Easing.Linear.None, true);

        this.add.tween(this.placaDezenas).to({alpha: 1, y: 310}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placaUnidades).to({alpha: 1, y: 310}, 800, Phaser.Easing.Linear.None, true);

        this.add.tween(this.unidades).to({alpha: 1, y: 518}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.dezenas).to({alpha: 1, y: 518}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        this.add.tween(this.faixa).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.faixaText).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);

        this.add.tween(this.placaDezenas).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.placaUnidades).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);

        for (var i = 0; i < this.simpatias.length; i++)
            this.add.tween(this.simpatias[i]).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);

        this.add.tween(this.unidades).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.dezenas).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.faixa.y = 200;
            this.faixaText.y = 250;
            this.placaUnidades.y = 350;
            this.placaDezenas.y = 350;
            this.unidades.y = 560;
            this.dezenas.y = 560;
            this.tigela.frame = 0;
            this.monstro.frame = 0;
            for (var i = 0; i < this.dropAreas.length; i++)
                this.dropAreas[i].currentObject = null;

            callback.call(this);
        }, this);
    },

    checkGame:function(){
        console.log("***checkGame***");

        ended = true;
        won = true;
        if(this.dropAreas[0].currentObject == null || this.dropAreas[1].currentObject == null)
            ended = false;

        if(this.dropAreas[0].currentObject == this.unidades || this.dropAreas[1].currentObject == this.dezenas)
            won = false;

        if(ended){
            if(won){
                this.sound.play('hitAcerto');
                this.tigela.frame = 1;
                for (var i = 0; i < this.simpatias.length; i++) {
                    simpatia = this.simpatias[i];
                    simpatia.alpha = 1;
                    simpatia.x = this.simpatiasPositions[i][0];
                    simpatia.y = this.simpatiasPositions[i][1];
                    bezierX = this.simpatiasPositions[i][0] + (834 - this.simpatiasPositions[i][0])/2;
                    bezierY = 20;
                    simpatia.angle = this.game.rnd.integerInRange(0, 360);
                    this.add.tween(simpatia).to({angle: '+360'}, 1500,Phaser.Easing.Linear.None, true);
                    tween = this.add.tween(simpatia).to({x: [this.simpatiasPositions[i][0], bezierX, 834], y: [this.simpatiasPositions[i][1], bezierY, 160]}, 1500,Phaser.Easing.Linear.None, true);
                    tween.interpolation(function(v, k){return Phaser.Math.bezierInterpolation(v, k);});
                    if(i == this.simpatias.length -1){
                        tween.onComplete.add(function(sprite, tween){
                            this.monstro.frame = 1;
                            this.clickRightButton();
                        }, this);
                    }
                };
            } else {
                this.sound.play('hitErro');
                this.clickWrongButton();
            }
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

    playAnswer: function(elem){
        soundName = "soundA_";
        if(elem == this.unidades)
            soundName += "E"+(elem.frame+1);
        else if(elem == this.dezenas)
            soundName += (elem.frame+2)*10;

        sound = this.sound.play(soundName);
    },

    toggleInput: function(flag){
        this.unidades.inputEnabled = flag;
        this.dezenas.inputEnabled = flag;
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

    startDrag: function(elem){
        this.game.world.bringToTop(elem);
        this.playAnswer(elem);
        this.startDragPosition = [elem.x, elem.y];
    },

    stopDrag: function(elem){
        
        hit = false;

        for (var i = 0; i < this.dropAreas.length; i++) {
            dropArea = this.dropAreas[i];
            x0 = dropArea.x;
            y0 = dropArea.y;
            x1 = x0 + dropArea.width;
            y1 = y0 + dropArea.height;
            elemX = elem.x + elem.width/2;
            elemY = elem.y + elem.height/2;
            if(elemX > x0 && elemX < x1 && elemY > y0 && elemY < y1 && dropArea.currentObject == null){
                console.log('hitted');
                hit = true;
                elem.inputEnabled = false;
                dropArea.currentObject = elem;
                elem.x = x0;
                elem.y = y0;
            }
        };
        if(hit){
            this.checkGame();
        } else {
            elem.x = this.startDragPosition[0];
            elem.y = this.startDragPosition[1];
        }
    }
};