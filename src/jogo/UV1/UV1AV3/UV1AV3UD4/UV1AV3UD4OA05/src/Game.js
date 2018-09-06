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

        this.ingredients = [];
        this.positionedIngredients = [];
        this.ingredientsStartPos = [
            [340, 410],
            [450, 390],
            [560, 420]
        ];

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


        this.cavalo = this.add.sprite(163, 384, 'cavalo');
        this.cavalo.animations.add('idle', null, 18, true);
        this.cavalo.anchor.set(0.5, 0.5);
        this.cavalo.animations.play('idle');

        this.menino = this.add.sprite(185, 440, 'menino');
        this.menino.anchor.set(0.5, 0.5);
        frames = [];
        for(i = 0; i < 40; i++)
            frames.push(i);
        this.menino.animations.add('idle', frames, 18, true);
        frames = [];
        for(i = 40; i < 45; i++)
            frames.push(i);
        this.menino.animations.add('cheer', frames, 18, false);
        this.menino.animations.play('idle');

        this.balanca = this.add.sprite(800, 480, 'balanca');
        this.balanca.anchor.set(0.5, 0.5);
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
        var t1 = "Galera, precisamos de vários [quilos] de\npé de moleque para a receita que vai\natrair o bicho folclórico! [Quilos]\n[exatos]! Por isso, na balança, temos\num peso de [um quilo] de um lado…";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "do outro temos que combinar elementos\n pra completarmos um quilo e equilibrar\n a balança, sacaram? O açúcar pesa [100 gramas].\nSaco de amendoim pesa, cada um, [200 gramas]\n e o ingrediente mágico [300]!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "[1 quilo] tem [mil gramas], ou seja: \npreciso de [5 sacos] de amendoim para\n completar um quilo, pois [5 vezes]\n [200 gramas]… [mil gramas]: [1 quilo]!";
        var tutorialText3 = this.drawText(this.world.centerX, 30, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(16000);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 16000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 16200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 16700);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 35000);

        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 35500);

        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 53000);

        this.createDelayTime(20000, function(){
            this.setupLevel(3);
            this.showLevel();
        });

        this.createDelayTime(41000, this.showLiveTutorial);

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
        
        cursorAmendoimList = [];
        totalAmendoim = 5;
        for(i = this.ingredients.length - 1; i >= 0 ; i--){
            if(this.ingredients[i].sprite.key == "amendoim" && totalAmendoim > 0){
                cursorAmendoimList.push(this.ingredients[i].sprite);
                totalAmendoim--;
            }
        }

        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);

        this.runTutorialDrag(0, 450, cursorAmendoimList);
    },    

    runTutorialDrag: function(amendoimI, currentBalancaY, cursorAmendoimList){
        console.log(cursorAmendoimList.toString());
        this.add.tween(this.arrowGroup).to({x: cursorAmendoimList[amendoimI].x, y:  cursorAmendoimList[amendoimI].y}, 500, Phaser.Easing.Linear.None, true, 500*0).onComplete.add(function(amendoimI, currentBalancaY, cursorAmendoimList){
             return function(){
                this.add.tween(this.arrowGroup).to({x: cursorAmendoimList[amendoimI].x, y:  cursorAmendoimList[amendoimI].y}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(amendoimI, currentBalancaY, cursorAmendoimList){
                    return function(){
                        this.click.animations.play('click', 30, false);
                         this.add.tween(this.arrowGroup).to({x: 702, y: 346}, 500, Phaser.Easing.Linear.None, true);
                         randomizeX = this.game.rnd.integerInRange(-50, 50);
                         this.add.tween(cursorAmendoimList[amendoimI]).to({x: 702 + randomizeX, y: 346}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(amendoimI, currentBalancaY, cursorAmendoimList){
                                return function(){
                                    for(i = amendoimI; i >= 0; i--)
                                        cursorAmendoimList[i].y = currentBalancaY - cursorAmendoimList[i].height/2;
                                    this.balanca.frame+=2;
                                    if(amendoimI < cursorAmendoimList.length-1){
                                        this.runTutorialDrag(amendoimI+1, currentBalancaY+3, cursorAmendoimList);
                                    }
                                }
                         }(amendoimI, currentBalancaY, cursorAmendoimList), this);
                    }
                }(amendoimI, currentBalancaY, cursorAmendoimList), this);
             }
        }(amendoimI, currentBalancaY, cursorAmendoimList), this);
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
        var t1 = "Já aprendemos sobre litros… com quilos\né o mesmo esquema: [um quilo tem mil gramas].\n[500 gramas] é [meio quilo], pois [mil] dividido\npor [2] é [500] e assim por diante.";

        var tutorialText1 = this.drawText(this.world.centerX,50, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        var t2 = "Vocês já viram uma codorna? Ela pesa uns \n[100 gramas], ou seja, precisaríamos\nde [10] codornas pra termos [um quilo]!";

        var tutorialText2 = this.drawText(this.world.centerX,60, t2, 22, "center");
            tutorialText2.alpha = 0;
            this.groupIntro.add(tutorialText2);

        this.add.tween(this.menino).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.cavalo).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.balanca).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 19000);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 19200);
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 32000);

        this.codorna = this.add.sprite(500, 420, 'codorna');
        this.codorna.anchor.set(0.5, 0.5);
        this.codorna.alpha = 0;        

        this.add.tween(this.codorna).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 27000);


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

        this.menino.animations.play('idle');

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
        this.toggleInput(false);
        this.playQuestion(1, function(){
            this.toggleInput(true);
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");
        this.setupLevel(2);
        this.showLevel();
        this.toggleInput(false);
        this.playQuestion(2, function(){
            this.toggleInput(true);
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");
        this.setupLevel(3);
        this.showLevel();
        this.toggleInput(false);
        this.playQuestion(3, function(){
            this.toggleInput(true);
        });
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");

        switch(level){
            case 1:
                totalAcucar = 6 + this.game.rnd.integerInRange(1, 2);
                totalAmendoim = 5 + this.game.rnd.integerInRange(1, 2);
                totalMagico = 0;
                break;
            case 2:
                totalAcucar = 0;
                totalAmendoim = 5 + this.game.rnd.integerInRange(1, 2);
                totalMagico = 3 + this.game.rnd.integerInRange(1, 2);
                break;
            case 3:
                totalAcucar = 6 + this.game.rnd.integerInRange(1, 2);;
                totalAmendoim = 5 + this.game.rnd.integerInRange(1, 2);
                totalMagico = 3 + this.game.rnd.integerInRange(1, 2);
                break;
        }


        //acucar
        xPointer = this.ingredientsStartPos[0][0];
        yPointer = this.ingredientsStartPos[0][1];
        id = 0;
        for(i = 0; i < totalAcucar; i++){
            acucar = this.add.sprite(xPointer, yPointer, 'acucar');
            acucar.y = yPointer+ acucar.height*0.15*i;
            acucar.anchor.set(0.5, 0.5);
            acucar.inputEnabled = true;
            acucar.input.enableDrag();
            acucar.events.onDragStop.add(this.stopDrag, this);
            acucar.events.onDragStart.add(this.startDrag, this);
            acucar.alpha = 0;
            acucarObject = {
                x: acucar.x,
                y: acucar.y,
                positioned: false,
                sprite: acucar,
                value: 100,
                id: id,
                level: i
            };
            acucar['object'] = acucarObject;
            this.ingredients.push(acucarObject);
            id++;
        }

        //amendoim
        xPointer = this.ingredientsStartPos[1][0];
        yPointer = this.ingredientsStartPos[1][1];
        for(i = 0; i < totalAmendoim; i++){
            amendoim = this.add.sprite(xPointer, yPointer, 'amendoim');
            amendoim.y = yPointer+ amendoim.height*0.15*i;
            amendoim.anchor.set(0.5, 0.5);
            amendoim.inputEnabled = true;
            amendoim.input.enableDrag();
            amendoim.events.onDragStop.add(this.stopDrag, this);
            amendoim.events.onDragStart.add(this.startDrag, this);
            amendoim.alpha = 0;
            amendoimObject = {
                x: amendoim.x,
                y: amendoim.y,
                positioned: false,
                sprite: amendoim,
                value: 200,
                id: id,
                level: i
            };
            amendoim['object'] = amendoimObject;
            this.ingredients.push(amendoimObject);
            id++;
        }

        //ingrediente-magico
        xPointer = this.ingredientsStartPos[2][0];
        yPointer = this.ingredientsStartPos[2][1];
        for(i = 0; i < totalMagico; i++){
            magico = this.add.sprite(xPointer, yPointer, 'ingrediente-magico');
            magico.y = yPointer+magico.height*0.15*i;
            magico.anchor.set(0.5, 0.5);
            magico.inputEnabled = true;
            magico.input.enableDrag();
            magico.events.onDragStop.add(this.stopDrag, this);
            magico.events.onDragStart.add(this.startDrag, this);
            magico.alpha = 0;
            magicoObject = {
                x: magico.x,
                y: magico.y,
                positioned: false,
                sprite: magico,
                value: 300,
                id: id,
                level: i
            };
            magico['object'] = magicoObject;
            this.ingredients.push(magicoObject);
            id++;
        }
    },

    showLevel: function(callback){
        console.log("***show level***");
        delay = 0;
        for(i = 0; i < this.ingredients.length; i++){
            tween = this.add.tween(this.ingredients[i].sprite).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, delay);
            delay += 50;
            if(i == this.ingredients.length - 1 && callback != null)
                tween.onComplete.add(function(){
                    callback.call(this);
                });
        }
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        delay = 0;
        kill = [];
        for(i = 0; i < this.ingredients.length; i++){
            tween = this.add.tween(this.ingredients[i].sprite).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, delay);
            delay += 50;
            kill.push(this.ingredients[i].sprite);
            if(i == this.ingredients.length - 1)
                tween.onComplete.add(function(){
                    this.destroySprites(kill);
                    this.ingredients = [];
                    this.balanca.frame = 0;
                    if(callback != null){
                        callback.call(this);
                    }
                }, this);
        }
        if(this.ingredients.length == 0 && callback != null)
            callback.call(this);
    },

    destroySprites:function(list){
        for(i = 0; i < list.length; i++){
            list[i].destroy();
        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        pesoTotal = 0;
        for(i = 0; i < this.ingredients.length; i++){
            if(this.ingredients[i].positioned)
                pesoTotal += this.ingredients[i].value;
        }

        this.balanca.frame = pesoTotal/1000*10;
        for(i = 0; i < this.ingredients.length; i++){
            if(this.ingredients[i].positioned)
                this.ingredients[i].sprite.y = 440+pesoTotal/1000*22 - this.ingredients[i].sprite.height/2;
        }

        if(pesoTotal == 1000){
            this.sound.play("hitAcerto");
            this.menino.animations.play("cheer");
            this.clickRightButton();
        } else if (pesoTotal > 1000){
            this.sound.play("hitErro");
            this.clickWrongButton();
        } else {
            this.toggleInput(true);
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

    playQuestion: function(level, callback){
        console.log("***play question***");
        soundName = "soundP";
        soundName += level;

        sound = this.sound.play(soundName);
        if(callback != null)
            sound.onStop.addOnce(function(){
                callback.call(this);
            }, this);

        console.log("playing ", soundName);
    },

    toggleInput: function(flag){
        for(i = 0; i < this.ingredients.length; i++){
            this.ingredients[i].sprite.inputEnabled = flag;
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
        this.ingredients[elem.object.id].positioned = false;
    },

    stopDrag: function(elem){
        this.toggleInput(false);
        x0 = 625;
        y0 = 270;
        x1 = 780;
        y1 = 422;
        if(elem.x > x0 && elem.x < x1 && elem.y > y0 && elem.y < y1){
            this.ingredients[elem.object.id].positioned = true;
        } else {
            this.ingredients[elem.object.id].positioned = false;
            elem.x = this.ingredients[elem.object.id].x;
            elem.y = this.ingredients[elem.object.id].y;
            this.reorderIngredients(elem);
            this.toggleInput(true);
        }
        this.checkGame();
    },

    reorderIngredients: function(elem) {
        type = elem.key;
        for(i = 0; i < this.ingredients.length; i++){
            ingredient = this.ingredients[i];
            if(ingredient.sprite.key == type && !ingredient.positioned){
                this.game.world.bringToTop(ingredient.sprite);
            }
        }
    }
};
