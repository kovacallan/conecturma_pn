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

        this.items = [];
        this.wrongAnswers = 0;
        this.lives = 3;

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

        para = this.add.sprite(0, 0, 'para');
        para.alpha = 0;
        item = {
            rightSprite: para,
            currentSprite: null,
            dropX: 497,
            dropY: 214,
            startX: 35,
            startY: 316,
            attachment: false,
            positioned: false
        };
        item.rightSprite.x = item.startX;
        item.rightSprite.y = item.startY;
        item.rightSprite.itemObject = item;
        item.rightSprite.inputEnabled = true;
        item.rightSprite.input.enableDrag();
        item.rightSprite.events.onDragStart.add(this.startDrag, this);
        item.rightSprite.events.onDragStop.add(this.stopDrag, this);
        this.items.push(item);

        de = this.add.sprite(0, 0, 'de');
        de.alpha = 0;
        item = {
            rightSprite: de,
            currentSprite: null,
            dropX: 460,
            dropY: 267,
            startX: 29,
            startY: 370,
            attachment: false,
            positioned: false
        };
        item.rightSprite.x = item.startX;
        item.rightSprite.y = item.startY;
        item.rightSprite.itemObject = item;
        item.rightSprite.inputEnabled = true;
        item.rightSprite.input.enableDrag();
        item.rightSprite.events.onDragStart.add(this.startDrag, this);
        item.rightSprite.events.onDragStop.add(this.stopDrag, this);
        this.items.push(item);

        assunto = this.add.sprite(0, 0, 'assunto');
        assunto.alpha = 0;
        item = {
            rightSprite: assunto,
            currentSprite: null,
            dropX: 520,
            dropY: 324,
            startX: 48,
            startY: 253,
            attachment: false,
            positioned: false
        };
        item.rightSprite.x = item.startX;
        item.rightSprite.y = item.startY;
        item.rightSprite.itemObject = item;
        item.rightSprite.inputEnabled = true;
        item.rightSprite.input.enableDrag();
        item.rightSprite.events.onDragStart.add(this.startDrag, this);
        item.rightSprite.events.onDragStop.add(this.stopDrag, this);
        this.items.push(item);

        texto = this.add.sprite(0, 0, 'texto');
        texto.alpha = 0;
        item = {
            rightSprite: texto,
            currentSprite: null,
            dropX: 496,
            dropY: 379,
            startX: 105,
            startY: 137,
            attachment: false,
            positioned: false
        };
        item.rightSprite.x = item.startX;
        item.rightSprite.y = item.startY;
        item.rightSprite.itemObject = item;
        item.rightSprite.inputEnabled = true;
        item.rightSprite.input.enableDrag();
        item.rightSprite.events.onDragStart.add(this.startDrag, this);
        item.rightSprite.events.onDragStop.add(this.stopDrag, this);
        this.items.push(item);
        
        anexo = this.add.sprite(0, 0, 'anexo');
        anexo.alpha = 0;
        item = {
            rightSprite: anexo,
            currentSprite: null,
            dropX: 427,
            dropY: 508,
            startX: 169,
            startY: 457,
            attachment: true,
            positioned: false
        };
        item.rightSprite.x = item.startX;
        item.rightSprite.y = item.startY;
        item.rightSprite.itemObject = item;
        item.rightSprite.inputEnabled = true;
        item.rightSprite.input.enableDrag();
        item.rightSprite.events.onDragStart.add(this.startDrag, this);
        item.rightSprite.events.onDragStop.add(this.stopDrag, this);
        this.items.push(item);

        assinatura = this.add.sprite(0, 0, 'assinatura');
        assinatura.alpha = 0;
        item = {
            rightSprite: assinatura,
            currentSprite: null,
            dropX: 678,
            dropY: 456,
            startX: 41,
            startY: 420,
            attachment: false,
            positioned: false
        };
        item.rightSprite.x = item.startX;
        item.rightSprite.y = item.startY;
        item.rightSprite.itemObject = item;
        item.rightSprite.inputEnabled = true;
        item.rightSprite.input.enableDrag();
        item.rightSprite.events.onDragStart.add(this.startDrag, this);
        item.rightSprite.events.onDragStop.add(this.stopDrag, this);
        this.items.push(item);

        this.toggleInput(false);
        this.printList();
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
        var t1 = "Animada com os novos amigos\ne descobertas, Poly decidiu\nmandar um [e-mail] para\na Kim contando novidades\ne mandando uma [selfie]!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Vamos ajudá-la a mandar o [e-mail]? É fácil,\nbasta colocar as coisas em seu devido lugar!\nPrimeiro colocamos o [e-mail]\nde quem vai receber,";
        var tutorialText2 = this.drawText(this.world.centerX, 35, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "depois o de [quem está mandando], o [assunto],\n[texto], colocamos a [foto] e a [assinatura],\nviram só? Agora é com vocês, 1 minuto\npra montar!";
        var tutorialText3 = this.drawText(this.world.centerX, 35, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(9500);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 9500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 9700);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 10200);

        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 22000);

        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 22200);

        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 38000);

        this.setupLevel(0);

        this.createDelayTime(11000, this.showLevel);

        this.createDelayTime(19500, this.showLiveTutorial);

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
            this.runTutorialDrag(0);
        }, this);
    },   

    runTutorialDrag: function(listaI){
        fromX = this.items[listaI].rightSprite.x;
        fromY = this.items[listaI].rightSprite.y;
        this.add.tween(this.arrowGroup).to({x: fromX, y: fromY}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(listaI){
            return function(){
                toX = this.items[listaI].dropX;
                toY = this.items[listaI].dropY;
                tween = this.add.tween(this.arrowGroup).to({x: toX, y: toY}, 1000, Phaser.Easing.Linear.None, true);
                if(this.items[listaI].attachment)
                    tween.onComplete.add(function(listaI){
                        return function(){
                            this.add.tween(this.items[listaI].rightSprite.scale).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true);
                            this.add.tween(this.items[listaI].rightSprite).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
                        }
                    }(listaI), this);
                this.add.tween(this.items[listaI].rightSprite).to({x: toX, y: toY}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(listaI){
                    return function(){
                        if(listaI < this.items.length -1){
                            listaI++;
                            this.runTutorialDrag(listaI);
                        }
                    }
                }(listaI), this);
            }
        }(listaI), this);
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
        var t1 = "Mandar um [e-mail] é fácil, só precisamos\ndas [informações] mais importantes para que\nele chegue até a pessoa certa:";

        var tutorialText1 = this.drawText(this.world.centerX,60, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        var t2 = "Temos que ter o [e-mail] da pessoa que vai\nreceber, preencher o campo de [assunto], escrever\no que quisermos e dá até pra incluir [arquivos]…\ncomo [fotos],por exemplo! Ah, e não podemos\nnos esquecer de [assinar]!";

        var tutorialText2 = this.drawText(this.world.centerX,40, t2, 22, "center");
            tutorialText2.alpha = 0;
            this.groupIntro.add(tutorialText2);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 9000);

        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 9200);
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 27000);

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
        }
    },
    initLevel1: function() {
        console.log("***init level 1***");
        this.setupLevel(1);
        this.showLevel(function(){
            this.toggleInput(true);
        });
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");
        
        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            item.rightSprite.frame = level;
        };
        
    },

    showLevel: function(callback){
        console.log("***show level***");
        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            this.add.tween(item.rightSprite).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        }
        if(callback != null)
            this.createDelayTime(1000, callback);
    },

    resetLevel:function(callback){
        console.log("***reset level***");

        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            tween = this.add.tween(item.rightSprite).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function(item){
                return function(){
                    item.rightSprite.scale.set(1, 1);
                    item.rightSprite.x = item.startX;
                    item.rightSprite.y = item.startY;
                }
            }(item), this);
        };

        if(callback != null)
            this.createDelayTime(1000, callback);
    },

    checkGame:function(){
        console.log("***checkGame***");

        ended = true;
        for (var i = 0; i < this.items.length; i++) {
            if(this.items[i].currentSprite == null)
                ended = false;
        };

        if(ended){
            if(this.wrongAnswers < 2){
                this.listCorrects = [100, 100, 100];
                this.listCompleted = [true, true, true];
            } else if(this.wrongAnswers == 2){
                this.listCorrects = [100, 100, 0];
                this.listCompleted = [true, true, false];
            } else if(this.wrongAnswers > 2){
                this.listCorrects = [100, 0, 0];
                this.listCompleted = [true, false, false];
            }
            this.gameOverMacaco();
        }
    },

    printList:function(){
        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            str = "";
            str += "("+item.dropX+", "+item.dropY+") ";
            if(item.rightSprite != null)
                str += "right "+item.rightSprite.key+" ("+item.rightSprite.x+", "+item.rightSprite.y+") ";;
            if(item.currentSprite != null)
                str += "current "+item.currentSprite.key+" ("+item.currentSprite.x+", "+item.currentSprite.y+") ";

            console.log(str);
        };
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
                case 1:
                    this.createDelayTime(1500, this.onCompleteShowDica);
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

    toggleInput: function(flag){
        console.log("toggling inputs "+flag);
        for(i = 0; i < this.items.length; i++){
            this.items[i].rightSprite.inputEnabled = flag;
            console.log(this.items[i].rightSprite.inputEnabled);
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
        /*for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if(item.currentSprite == elem)
                item.currentSprite = null;
        };*/
    },

    stopDrag: function(elem){
        dropped = false;
        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];

            x0 = item.dropX - elem.width/2;
            y0 = item.dropY - elem.height/2;
            x1 = x0 + elem.width;
            y1 = y0 + elem.height;
            if(elem.x > x0 && elem.x < x1 && elem.y > y0 && elem.y < y1){
                if(item.rightSprite == elem){
                    if(elem.itemObject.attachment && this.items[i].attachment){
                        this.add.tween(elem.scale).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true);
                        this.add.tween(elem).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
                        elem.inputEnabled = false;
                    }
                    console.log("CORRETA");
                    sound = this.sound.play("hitAcerto");
                    item.currentSprite = elem;
                    dropped = true;
                    elem.x = item.dropX;
                    elem.y = item.dropY;
                    elem.inputEnabled = false;
                } else {
                    console.log("ERRO");
                    sound = this.sound.play("hitErro");
                    this.wrongAnswers++;
                    this.lives--;
                    this.updateLivesText();
                    if(this.lives == 0){
                        this.toggleInput(false);
                        this.createDelayTime(500, function() {
                            this.showResumo(); 
                        });
                    }
                }
            }
        }
        if(!dropped){
            elem.x = elem.itemObject.startX;
            elem.y = elem.itemObject.startY;
        }
        this.checkGame();
    }
};