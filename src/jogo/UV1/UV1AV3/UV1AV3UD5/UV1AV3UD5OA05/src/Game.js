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

        this.answers = [
            [0, 1],
            [2, 3, 4],
            [5, 6, 7],
            [8, 9, 10, 11]
        ];

        this.cellsPositioned = [-1, -1, -1, -1];

        this.setupLevel(0);

    },

    createScene: function() {
        console.log("***create scene***");
        this.background = this.add.sprite(0, 0, 'background');

        this.menino = this.add.sprite(115, 400, 'menino');
        this.menino.anchor.set(0.5, 0.5);
        frames = [];
        for(i = 0; i < 23; i++)
            frames.push(i);
        this.menino.animations.add('idle', frames, 18, true);
        frames = [];
        for(i = 24; i < 45; i++)
            frames.push(i);
        this.menino.animations.add('cheer', frames, 18, false);
        this.menino.animations.play('idle');
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
        var t1 = "Já aprendemos tanto até aqui! E o Fred \nadora organizar o que aprende!\n Por isso, ele fez 3 [tabelas] sobre 3 coisas\nque ele achou bem interessante.";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = " Pra mostrarmos que aprendemos também, eu\n vou falar sobre o tema da [tabela] e depois\n vocês terão que arrastar as [respostas] até o lugar\n certo. Olhem o exemplo: Nome que começa com\n [D]… [Dudu]… nome com [F]… [Fred]! Vamos lá!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(12000);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 12000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 12200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 12700).onComplete.add(function(){
            this.showLevel(null, 12300);
            this.showLiveTutorial(17300);
        }, this);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 35000);

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
        
        placa1 = null;
        placa2 = null;
        for(i = 0; i < this.placas.length; i++){
            if(this.placas[i].frame == 0)
                placa1 = this.placas[i];
            else if (this.placas[i].frame == 1)
                placa2 = this.placas[i];
        }

        td1 = this.cellTds[0];
        td2 = this.cellTds[1];

        //aparece
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true, delay).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: placa1.x + placa1.width/2 , y:  placa1.y + placa1.height/2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.click.animations.play('click', 30, false);
                this.game.world.bringToTop(placa1);
                this.game.world.bringToTop(this.arrowGroup);
                this.add.tween(this.arrowGroup).to({x: td1.x + td1.width/2 , y:  td1.y + td1.height/2}, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(placa1).to({x:  td1.x , y:  td1.y}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.add.tween(this.arrowGroup).to({x: placa2.x + placa2.width/2 , y:  placa2.y + placa2.height/2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                this.click.animations.play('click', 30, false);
                                this.game.world.bringToTop(placa2);
                                this.game.world.bringToTop(this.arrowGroup);
                                this.add.tween(this.arrowGroup).to({x: td2.x + td2.width/2 , y:  td2.y + td2.height/2}, 500, Phaser.Easing.Linear.None, true);
                                this.add.tween(placa2).to({x: td2.x , y:  td2.y}, 500, Phaser.Easing.Linear.None, true);
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
        var t1 = "Uma [tabela] serve para organizarmos\n [informações]. Tabelas têm [linhas] e [colunas] que\n nos ajudam a organizar melhor as [informações]!\nVamos tentar novamente!";

        var tutorialText1 = this.drawText(this.world.centerX,50, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 14000);

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
        this.question = 1;
        this.playQuestion(this.question, function(){
            this.toggleInput(true);
        });
        this.setupLevel(this.question);
        this.showLevel(null, 0);
        this.toggleInput(false);
    },

    initLevel2: function() {
        console.log("***init level 2***");
        this.question = 2;
        this.playQuestion(this.question, function(){
            this.toggleInput(true);
        });
        this.setupLevel(this.question);
        this.showLevel(null, 0);
        this.toggleInput(false);
    },

    initLevel3: function() {
        console.log("***init level 3***");
        this.question = 3;
        this.playQuestion(this.question, function(){
            this.toggleInput(true);
        });
        this.setupLevel(this.question);
        this.showLevel(null, 0);
        this.toggleInput(false);
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");

        cellsTotal = this.answers[level].length;

        placasAux = [];
        for(i = 0; i < cellsTotal; i++)
            placasAux.push(i);

        randomColumns = [];
        if(level > 0 && level < 3)
            randomColumns.push(placasAux.splice(this.game.rnd.integerInRange(0, placasAux.length-1), 1)[0]);
        else if(level >= 3){
            randomColumns.push(placasAux.splice(this.game.rnd.integerInRange(0, placasAux.length-1), 1)[0]);
            randomColumns.push(placasAux.splice(this.game.rnd.integerInRange(0, placasAux.length-1), 1)[0]);
        }

        cellHeight = 74;
        cellWidth = 196;
        xPointer = this.world.centerX - cellsTotal/2*cellWidth;
        yPointer = this.world.centerY;
        xPointerPlaca = this.world.centerX - placasAux.length/2*cellWidth;

        this.cellHeaders = [];
        this.cellTds = [];
        this.placas = [];
        this.placasStatic = [];
        for(i = 0; i < cellsTotal; i++){
            headerSprite = this.add.sprite(xPointer, yPointer, 'td');
            headerSprite.frame = this.answers[level][i]+1;
            headerSprite.anchor.set(0, 0);
            headerSprite.alpha = 0;
            this.cellHeaders.push(headerSprite);


            tdSprite = this.add.sprite(xPointer, yPointer+cellHeight, 'td');
            tdSprite.frame = 0;
            tdSprite.anchor.set(0, 0);
            tdSprite.alpha = 0;
            this.cellTds.push(tdSprite);

            if(placasAux.indexOf(i) != -1){
                randomizePosition = this.game.rnd.integerInRange(0, cellWidth/4) - this.game.rnd.integerInRange(0, cellWidth/4);

                placa = this.add.sprite(xPointerPlaca + randomizePosition, 800, 'placa');
                placa.frame = this.answers[level][i];
                placa.anchor.set(0, 0);
                placa.inputEnabled = true;
                placa.input.enableDrag();
                placa.events.onDragStop.add(this.stopDrag, this);
                placa.events.onDragStart.add(this.startDrag, this);
                this.placas.push(placa);
                xPointerPlaca += cellWidth;
            }

            xPointer += cellWidth;
        }

        for(i = 0; i < randomColumns.length; i++){
            xPointer = this.world.centerX - cellsTotal/2*cellWidth + randomColumns[i]*cellWidth;
            placaStatic = this.add.sprite(xPointer, yPointer+cellHeight, 'placa');
            placaStatic.anchor.set(0, 0);
            placaStatic.alpha = 0;
            placaStatic.frame = this.answers[level][randomColumns[i]];
            this.cellsPositioned[randomColumns[i]] = placaStatic.frame;
            this.placasStatic.push(placaStatic);
        }
        this.printSpriteList("headers", this.cellHeaders);
        this.printSpriteList("tds", this.cellTds);
        this.printSpriteList("placas", this.placas);
        this.printSpriteList("placas static", this.placasStatic);
    },

    printSpriteList: function(name, list){
        str = "";
        for(i = 0; i < list.length; i++){
            str += "( "+list[i].x + ", " + list[i].y + ") frame: "+list[i].frame;
        }
        console.log(name+" "+str);
    },

    showLevel: function(callback, delay){
        console.log("***show level***");
        cellHeight = this.placas[0].height;
        console.log(this.cellHeaders.length+" "+this.placas.length);
        for(i = 0; i < this.cellHeaders.length; i++){
            this.add.tween(this.cellHeaders[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, delay);
            this.add.tween(this.cellTds[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, delay);
        }

        for(i = 0; i < this.placasStatic.length; i++)
            this.add.tween(this.placasStatic[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.placasStartPositions = [];
        for(i = 0; i < this.placas.length; i++){
            randomizePosition = this.game.rnd.integerInRange(0, cellHeight/4) - this.game.rnd.integerInRange(0, cellHeight/4);
            y0 = this.cellHeaders[0].y - cellHeight - 10;
            this.placasStartPositions.push([this.placas[i].x, y0 + randomizePosition]);
            tween = this.add.tween(this.placas[i]).to({y: y0 + randomizePosition}, 1000, Phaser.Easing.Linear.None, true, delay);          
            if(i == this.placas.length - 1 && callback != null)
                tween.onComplete.add(function(){
                    callback.call(this);
                }, this);
        }
    },

    resetLevel:function(callback){
        console.log("***reset level***");

        this.menino.animations.play("idle");

        for(i = 0; i < this.cellHeaders.length; i++){
            this.add.tween(this.cellHeaders[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.cellTds[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }

        for(i = 0; i < this.placasStatic.length; i++)
            this.add.tween(this.placasStatic[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        for(i = 0; i < this.placas.length; i++){
            tween = this.add.tween(this.placas[i]).to({y: 800}, 500, Phaser.Easing.Elastic.In, true);          
            if(i == this.placas.length - 1){
                tween.onComplete.add(function(){
                    this.destroySprites(this.cellHeaders);
                    this.destroySprites(this.cellTds);
                    this.destroySprites(this.placas);
                    this.destroySprites(this.placasStatic);
                    this.cellsPositioned = [-1, -1, -1, -1];
                    if(callback != null)
                        callback.call(this);
                }, this);
            }
        }

        if(callback != null && this.placas.length == 0)
            callback.call(this);
    },

    destroySprites:function(list){
        for(i = 0; i < list.length; i++){
            list[i].destroy();
        }
        list = [];
    },

    checkGame:function(elem){
        console.log("***checkGame***");

        cellsTotal = this.answers[this.question].length;

        won = true;
        ended = true;
        for(i = 0; i < cellsTotal; i++){
            if(this.answers[this.question][i] != this.cellsPositioned[i]){
                won = false;
            }
            if(this.cellsPositioned[i] == -1){
                won = false;
                ended = false;
                break;
            }
        }

        console.log(this.cellsPositioned.toString());

        if(ended) this.toggleInput(false);
        else this.toggleInput(true);

        if(ended && won){
            console.log("CORRETA");
            sound = this.sound.play("hitAcerto");
            this.menino.animations.play("cheer").onComplete.add(function(){
                this.menino.animations.play("idle")
            }, this);
            sound.onStop.addOnce(function(){
                this.createDelayTime(2000, this.clickRightButton);
            }, this);
        } else if(ended && !won) {
            console.log("ERRADA");
            sound = this.sound.play("hitErro");
            sound.onStop.addOnce(function(){
                this.clickWrongButton();
            }, this);
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
        soundName += question;

        sound = this.sound.play(soundName);
        if(callback != null)
            sound.onStop.addOnce(function(){
                callback.call(this);
            }, this);

        console.log("playing ", soundName);
    },

    playAnswer: function(elem){
        console.log("***play answer***");
        soundName = "soundP";
        
        soundName += this.question+"_A";
        soundName += this.answers[this.question].indexOf(elem.frame) + 1;

        sound = this.sound.play(soundName); 

        console.log("playing ", soundName);
    },

    toggleInput: function(flag){
        for(i = 0; i < this.placas.length; i++){
            this.placas[i].inputEnabled = flag;
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

    startDrag: function(elem){
        this.game.world.bringToTop(elem);
        index = this.cellsPositioned.indexOf(elem.frame);
        this.cellsPositioned[index] = -1;
        this.playAnswer(elem);
    },

    stopDrag: function(elem){
        this.toggleInput(false);
        cellsTotal = this.answers[this.question].length;
        cellHeight = 74;
        cellWidth = 196;
        hit = false;
        for(i = 0; i < cellsTotal; i++){
            x0 = this.cellTds[i].x;
            y0 = this.cellTds[i].y;
            x1 = x0 + cellWidth;
            y1 = y0 + cellHeight;
            elemX = elem.x + elem.width/2;
            elemY = elem.y + elem.height/2;
            if(elemX > x0 && elemX < x1 && elemY > y0 && elemY < y1 && this.cellsPositioned[i] == -1){
                hit = true;
                elem.x = x0;
                elem.y = y0;
                this.cellsPositioned[i] = elem.frame;
                this.checkGame(elem);
            }
        }       
        if(!hit){
            placaId = this.placas.indexOf(elem);
            elem.x = this.placasStartPositions[placaId][0];
            elem.y = this.placasStartPositions[placaId][1];
            this.sound.play("hitErro");
            this.toggleInput(true);
        }
    }
};